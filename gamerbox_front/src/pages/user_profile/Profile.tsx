import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import "./Profile.css";
import GamerboxApi from "../../services/gamerbox_api";
import { Link, useParams } from "react-router-dom";
import ImageModifier from "../../services/imageModifier";
import noBanner from "../../assets/limbowallpaper.jpg";
import noProfilePic from "../../assets/user_divers.png";
import { useSelector } from "react-redux";
import { selectIsConnected, selectUserId } from "../../redux/userSlice";

type UserInfo = {
    id: number;
    email: string;
    pseudonym: string;
    token: string;
};

type WishlistGame = {
    igdbId: number;
    name: string;
    slug: string;
    cover: string | null;
};

type FollowUser = {
    id: number;
    pseudonyme: string;
};

type BtnVisibility = 0 | 1 | 2;

interface BtnFollowProps {
    visibility: BtnVisibility;
}

function BtnFollow({visibility}: BtnFollowProps) {
    if (visibility === 0) {
        return <button>Follow</button>;
    } else if (visibility === 1) {
        return <p className="profile-top-info-no-btn">Followed ✅</p>;
    } else {
        return <></>
    }
}

export default function Profile() {
    const { userId } = useParams();
    const [userInfo, setUserInfo] = useState<UserInfo | null>();
    const [username, setUsername] = useState<string | null>();
    const [userNum, setUserNum] = useState<number | null>();
    const [userMail, setUserMail] = useState<string | null>();
    const [wishlist, setWishlist] = useState<Array<WishlistGame> | null>();
    const [reviewNumber, setReviewNumber] = useState<number>(10);
    const [followNumber, setFollowNumber] = useState<number>(0);
    const [followerNumber, setFollowerNumber] = useState<number>(0);
    const [followerList, setFollowerList] =
        useState<Array<FollowUser | null>>();
    const [btnFollowVisible, setBtnFollowVisible] = useState<BtnVisibility>(0);
    const connectedUserId = useSelector(selectUserId);
    const userIsConnected = useSelector<boolean>(selectIsConnected);

    useEffect(() => {
        const fetchUserData = async () => {
            if (userId) {
                const userData: UserInfo | null = await GamerboxApi.getUserInfo(
                    parseInt(userId)
                );
                setUserInfo(userData);
                setUsername(userData?.pseudonym);
                setUserNum(userData?.id);
                setUserMail(userData?.email);
            }
        };

        const fetchWishlist = async () => {
            if (userId) {
                const wishlistData: Array<WishlistGame> | null =
                    await GamerboxApi.getUserWishlist(parseInt(userId));
                let lastWishedGame = [];
                if (wishlistData) {
                    for (let i = 0; i < 4; i++) {
                        if (wishlistData[i]) {
                            lastWishedGame.push(wishlistData[i]);
                        }
                    }
                }
                setWishlist(lastWishedGame);
            }
        };

        const fetchFollowData = async () => {
            if (userId) {
                const userFollowList: Array<FollowUser> | null =
                    await GamerboxApi.getUserFollowing(parseInt(userId));
                if (userFollowList) {
                    setFollowNumber(userFollowList.length);
                }
            }
        };

        const fetchFollowerData = async () => {
            if (userId) {
                const userFollowerList: Array<FollowUser> | null =
                    await GamerboxApi.getUserFollowers(parseInt(userId));
                if (userIsConnected) {
                    if (parseInt(userId) === connectedUserId) {
                        setBtnFollowVisible(2);
                    } else {
                        const connectedUserFollowerList: Array<FollowUser> | null =
                            await GamerboxApi.getUserFollowing(connectedUserId);
                        if (connectedUserFollowerList) {
                            const userIsFollowed =
                                connectedUserFollowerList.find(
                                    (user) => user.id === parseInt(userId)
                                );
                            if (userIsFollowed === undefined) {
                                setBtnFollowVisible(0);
                            } else {
                                setBtnFollowVisible(1);
                            }
                        }
                    }
                }
                if (userFollowerList) {
                    setFollowerList(userFollowerList);
                    setFollowerNumber(userFollowerList.length);
                }
            }
        };

        fetchUserData().catch(console.error);
        fetchWishlist().catch(console.error);
        fetchFollowData().catch(console.error);
        fetchFollowerData().catch(console.error);
    }, [userId]);

    return (
        <div>
            <Header />
            <main className="profile-page">
                <section className="profile-top">
                    <img className="profilBanner" src={noBanner} />
                    <div className="profile-top-info">
                        <div className="profile-top-info-sizing">
                            <div className="profile-top-info-picture">
                                <img src={noProfilePic} />
                                <h2>{username}</h2>
                            </div>
                            <div className="profile-top-info-data">
                                <div className="profile-top-info-data-top">
                                    <div className="profile-top-info-data-numbers">
                                        <p>{reviewNumber}</p>
                                        <p>Reviews</p>
                                    </div>
                                    <div className="profile-top-info-data-numbers">
                                        <p>{followNumber}</p>
                                        <p>Follow</p>
                                    </div>
                                    <div className="profile-top-info-data-numbers">
                                        <p>{followerNumber}</p>
                                        <p>Followers</p>
                                    </div>
                                </div>
                                <BtnFollow visibility={btnFollowVisible} />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="profile-bottom">
                    <h4>Wishlist:</h4>
                    <Link to={`/wishlist/${userInfo?.id}`} id="profile-bottom-wishlistbtn">See more</Link>
                    <div className="wishlist">
                        {wishlist?.map((game: WishlistGame) => (
                            <Link
                                to={`/game/${game.igdbId}`}
                                className="wishlistGame"
                                key={`${game.name}-${game.igdbId}`}
                            >
                                {game.cover != null ? (
                                    <img
                                        src={ImageModifier.replaceThumbWith1080p(
                                            game.cover
                                        )}
                                    />
                                ) : (
                                    <img src={noProfilePic} />
                                )}
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
