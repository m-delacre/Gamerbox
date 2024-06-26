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
import GameReviewProfile from "../../components/game_review_profile/GameReviewProfile";
import { API_URL, API_IMG_URL } from "../../../config.ts";

const baseURL = API_URL;
const imgURL = API_IMG_URL;

type UserInfo = {
    id: number;
    email: string;
    pseudonym: string;
    token: string;
    profilePicture: string;
};

type WishlistGame = {
    Game: { igdbId: number; name: string; slug: string; cover: string | null };
    User: { id: number; pseudonym: string };
    addedDate: Date;
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
    const navigate = useNavigate();
    const { data, loading, error } = useFetch<UserInfo>(
        `${baseURL}user/${userId}`,
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
                setProfilePicture(`${imgURL}${data.profilePicture}`);
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
        navigate(-1);
    }

    if (data === null) {
        return (
            <div>
                <Header />
                <main className="profile-page-notfound">
                    <h1>User not found 🥲</h1>
                    <button className="btn-return" onClick={goBack}>
                        Return
                    </button>
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
                                    <ReviewsData userId={userId} />
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
                <section className="profile-bottom">
                    <h4>Reviews:</h4>
                    {userId ? (
                        <ReviewList userId={parseInt(userId)} />
                    ) : (
                        <p>No reviews 😕</p>
                    )}
                </section>
            </main>
        </div>
    );
}

type ReviewData = {
    id: number;
    user: { id: number; pseudonym: string; profilePicture: string };
    content: string;
    reaction: string;
    game: { igdbId: number; name: string; cover: string };
};

type ReviewListProsp = {
    userId: number | undefined;
};

function ReviewList({ userId }: ReviewListProsp) {
    const [reviewList, setReviewList] = useState<ReviewData[] | null>(null);
    const [offset, setOffset] = useState<number>(0);
    const [showBtn, setShowBtn] = useState<boolean>(false);
    const {
        data: reviewData,
        loading: reviewLoading,
        error: reviewError,
    } = useFetch<ReviewData[]>(
        `${baseURL}review/get/${userId}?offset=${offset}`,
        "GET"
    );

    useEffect(() => {
        if (reviewData) {
            setReviewList((prevList) => {
                const filteredData = reviewData.filter(
                    (newReview) =>
                        !prevList?.some(
                            (oldReview) => oldReview.id === newReview.id
                        )
                );
                return prevList ? [...prevList, ...filteredData] : filteredData;
            });
            if (reviewList && reviewList.length >= 3) {
                setShowBtn(true);
            }
            if (reviewData.length === 0) {
                setShowBtn(false);
            }
        }
    }, [reviewData, offset]);

    const loadMoreReview = () => {
        setOffset(offset + 3);
    };

    if (reviewError) {
        console.log(reviewError);
    }

    if (reviewLoading) {
        return <div className="loader"></div>;
    }

    if (reviewList) {
        return (
            <div className="game-bottom-reviews">
                {reviewList?.map((review: ReviewData, index: number) => (
                    <GameReviewProfile
                        key={`$${review.id}-${index}`}
                        pseudonym={review.user.pseudonym}
                        content={review.content}
                        profilPicture={review.user.profilePicture}
                        reaction={review.reaction}
                        userId={review.user.id}
                        gameCover={review.game.cover}
                        gameId={review.game.igdbId}
                        gameName={review.game.name}
                    />
                ))}

                {showBtn ? (
                    <button className="btn-viewmore" onClick={loadMoreReview}>
                        more review
                    </button>
                ) : (
                    <></>
                )}
            </div>
        );
    } else {
        <p>No review yet 😅</p>;
    }
}

function BtnFollow({ pageUserId }: BtnFollowProps) {
    const checkConnection = useSelector(selectIsConnected);
    let connectedUserId: number | null = useSelector(selectUserId);
    const [connectedUserFollowList, setConnectedUserFollowList] =
        useState<Array<FollowUser> | null>();
    const { data, loading, error } = useFetch<FollowUser[]>(
        `${baseURL}user/follow/${connectedUserId}`,
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
        `${baseURL}user/follow/${userId}`,
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
        `${baseURL}user/follower/${userId}`,
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

function ReviewsData({ userId }: UserDataProps) {
    const [reviewNum, setReviewNum] = useState<number>(0);
    const { data, loading, error } = useFetch<FollowUser[]>(
        `${baseURL}review/get/${userId}`,
        "GET"
    );

    useEffect(() => {
        if (data) {
            setReviewNum(data.length);
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

    return (
        <div className="profile-top-info-data-numbers">
            <p>{reviewNum}</p>
            <p>Reviews</p>
        </div>
    );
}

function WishlistSection({ userId }: UserDataProps) {
    const [wishlist, setWishlist] = useState<Array<WishlistGame>>();
    const { data, loading, error } = useFetch<WishlistGame[]>(
        `${baseURL}user/wishlist/${userId}`,
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
                {wishlist.map((element: WishlistGame) => (
                    <Link
                        to={`/game/${element.Game.igdbId}`}
                        className="wishlistGame"
                        key={`${element.Game.name}-${element.Game.igdbId}`}
                    >
                        {element.Game.cover != null ? (
                            <img
                                src={ImageModifier.replaceThumbWith1080p(
                                    element.Game.cover
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
