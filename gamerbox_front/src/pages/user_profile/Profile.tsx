import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import "./Profile.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import ImageModifier from "../../services/imageModifier";
import noBanner from "../../assets/limbowallpaper.jpg";
import noProfilePic from "../../assets/user_divers.png";
import { useSelector } from "react-redux";
import {
    selectIsConnected,
    selectToken,
    selectUserId,
} from "../../redux/userSlice";
import useFetch from "../../services/useFetch";
import GamerboxApi from "../../services/gamerbox_api";

type UserInfo = {
    id: number;
    email: string;
    pseudonym: string;
    token: string;
    profilePicture: string;
};

type WishlistGame = {
    igdbId: number;
    name: string;
    slug: string;
    cover: string | null;
};

type BtnFollowProps = {
    pageUserId: number | undefined;
};
type FollowUser = {
    id: number;
    pseudonym: string;
};

export default function Profile() {
    const { userId } = useParams();
    const [userInfo, setUserInfo] = useState<UserInfo | null>();
    const [username, setUsername] = useState<string | null>();
    const [profilePicture, setProfilePicture] = useState<string | null>();
    const reviewNumber = 10;
    const navigate = useNavigate();
    const { data, loading, error } = useFetch<UserInfo>(
        `https://127.0.0.1:8000/api/user/${userId}`,
        "GET"
    );

    if (error) {
        console.log(error);
    }

    useEffect(() => {
        if (data) {
            setUserInfo(data);
            setUsername(data.pseudonym);
            if (data.profilePicture) {
                setProfilePicture(
                    `https://127.0.0.1:8000/${data.profilePicture}`
                );
            }
        }
    }, [userId, data]);

    if (loading) {
        return (
            <div className="loading-page">
                <div className="loader2"></div>
            </div>
        );
    }

    function goBack() {
        navigate(-1)
    }

    if (data === null) {
        return (
            <div>
                <Header />
                <main className="profile-page-notfound">
                    <h1>User not found 🥲</h1>
                    <button className="btn-return" onClick={goBack}>Return</button>
                </main>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <main className="profile-page">
                <section className="profile-top">
                    <img className="profilBanner" src={noBanner} />
                    <div className="profile-top-info">
                        <div className="profile-top-info-sizing">
                            <div className="profile-top-info-picture">
                                {profilePicture ? (
                                    <img src={profilePicture} />
                                ) : (
                                    <img src={noProfilePic} />
                                )}
                                <h2>{username}</h2>
                            </div>
                            <div className="profile-top-info-data">
                                <div className="profile-top-info-data-top">
                                    <div className="profile-top-info-data-numbers">
                                        <p>{reviewNumber}</p>
                                        <p>Reviews</p>
                                    </div>
                                    <FollowData userId={userId} />
                                    <FollowerData userId={userId} />
                                </div>
                                {userId ? (
                                    <BtnFollow pageUserId={parseInt(userId)} />
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
                <section className="profile-bottom">
                    <h4>Wishlist:</h4>
                    <Link
                        to={`/wishlist/${userInfo?.id}`}
                        id="profile-bottom-wishlistbtn"
                    >
                        See more
                    </Link>
                    <WishlistSection userId={userId} />
                </section>
            </main>
        </div>
    );
}

function BtnFollow({ pageUserId }: BtnFollowProps) {
    const checkConnection = useSelector(selectIsConnected);
    let connectedUserId: number | null = useSelector(selectUserId);
    const [connectedUserFollowList, setConnectedUserFollowList] =
        useState<Array<FollowUser> | null>();
    const { data, loading, error } = useFetch<FollowUser[]>(
        `https://127.0.0.1:8000/api/user/follow/${connectedUserId}`,
        "GET"
    );
    const token = useSelector(selectToken);
    const navigate = useNavigate();

    if (error) {
        console.error(error);
    }

    useEffect(() => {
        if (data && checkConnection === true) {
            setConnectedUserFollowList(data);
        }
    }, [pageUserId, data]);

    const addFollow = async (userToAddId: number) => {
        try {
            const res = await GamerboxApi.addFollow(userToAddId, token);
            if (res) {
                navigate(0);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const follow = () => {
        if (token && pageUserId) {
            addFollow(pageUserId);
        }
    };

    const removeFollow = async (userToAddId: number) => {
        try {
            const res = await GamerboxApi.removeFollow(userToAddId, token);
            if (res) {
                navigate(0);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const unfollow = () => {
        if (token && pageUserId) {
            removeFollow(pageUserId);
        }
    };

    if (loading) {
        return (
            <div className="profile-top-info-data-numbers">
                <div className="loader2"></div>
            </div>
        );
    }

    if (pageUserId && checkConnection === true && connectedUserFollowList) {
        if (pageUserId !== connectedUserId) {
            const finder = connectedUserFollowList.find(
                (user) => user.id === pageUserId
            );
            if (finder) {
                return <button onClick={unfollow}>Unfollow</button>;
            } else {
                return <button onClick={follow}>Follow</button>;
            }
        }
    } else {
        return <></>;
    }
}

interface UserDataProps {
    userId: string | undefined;
}
function FollowData({ userId }: UserDataProps) {
    const [follow, setFollow] = useState<Array<FollowUser>>([]);
    const { data, loading, error } = useFetch<FollowUser[]>(
        `https://127.0.0.1:8000/api/user/follow/${userId}`,
        "GET"
    );

    useEffect(() => {
        if (data) {
            setFollow(data);
        }
    }, [userId, data]);

    if (error) {
        console.error(error);
    }

    if (loading) {
        return (
            <div className="profile-top-info-data-numbers">
                <div className="loader"></div>
            </div>
        );
    }

    if (data) {
        return (
            <div className="profile-top-info-data-numbers">
                <p>{follow.length}</p>
                <p>Follow</p>
            </div>
        );
    }
}

function FollowerData({ userId }: UserDataProps) {
    const [follower, setFollower] = useState<Array<FollowUser>>([]);
    const { data, loading, error } = useFetch<FollowUser[]>(
        `https://127.0.0.1:8000/api/user/follower/${userId}`,
        "GET"
    );

    useEffect(() => {
        if (data) {
            setFollower(data);
        }
    }, [userId, data]);

    if (error) {
        console.error(error);
    }

    if (loading) {
        return (
            <div className="profile-top-info-data-numbers">
                <div className="loader"></div>
            </div>
        );
    }

    if (follower) {
        return (
            <div className="profile-top-info-data-numbers">
                <p>{follower.length}</p>
                <p>Followers</p>
            </div>
        );
    }
}

function WishlistSection({ userId }: UserDataProps) {
    const [wishlist, setWishlist] = useState<Array<WishlistGame>>();
    const { data, loading, error } = useFetch<WishlistGame[]>(
        `https://127.0.0.1:8000/api/user/wishlist/${userId}`,
        "GET"
    );

    useEffect(() => {
        if (data) {
            let lastWishedGame = [];
            for (let i = 0; i < 4; i++) {
                if (data[i]) {
                    lastWishedGame.push(data[i]);
                }
            }
            setWishlist(lastWishedGame);
        }
    }, [userId, data]);

    if (error) {
        console.log(error);
    }

    if (loading) {
        return (
            <div className="profile-top-info-data-numbers">
                <div className="loader"></div>
            </div>
        );
    }

    if (wishlist) {
        return (
            <div className="wishlist">
                {wishlist.map((game: WishlistGame) => (
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
        );
    }
}
