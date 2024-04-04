import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import GamerboxApi from "../../services/gamerbox_api";
import Header from "../../components/header/Header";
import ImageModifier from "../../services/imageModifier";
import noPicture from "../../assets/img_not_available.jpg";
import "./Wishlistpage.css";
import useFetch from "../../services/useFetch";

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

export default function WishlistPage() {
    const { userId } = useParams();
    const [userInfo, setUserInfo] = useState<UserInfo | null>();

    useEffect(() => {
        const fetchUserData = async () => {
            if (userId) {
                const userData: UserInfo | null = await GamerboxApi.getUserInfo(
                    parseInt(userId)
                );
                setUserInfo(userData);
            }
        };

        fetchUserData().catch(console.error);
    }, [userId]);

    return (
        <div className="wishlistpage">
            <Header />
            <div className="wishlistpage-section">
                <h1>
                    <em>{userInfo?.pseudonym}</em> wishlist <em>:</em>
                </h1>
                {userId ? <Wishlist pageUserId={parseInt(userId)} /> : <></>}
            </div>
        </div>
    );
}

interface WishlistDataProps {
    pageUserId: number | undefined;
}

function Wishlist({ pageUserId }: WishlistDataProps) {
    const [wishlist, setWishlist] = useState<Array<WishlistGame>>();
    const { data, loading, error } = useFetch<WishlistGame[]>(
        `https://127.0.0.1:8000/api/user/wishlist/${pageUserId}`,
        "GET"
    );

    useEffect(() => {
        if (data) {
            setWishlist(data);
        }
    }, [pageUserId, data]);

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

    if(!data) {
        return (
            <div className="wishlistpage-section-nogames">
                <p>No wishlist available... 😞</p>
            </div>
        );
    }

    return (
        <div className="wishlistpage-section-games">
            {wishlist?.map((game: WishlistGame) => (
                <Link
                    to={`/game/${game.igdbId}`}
                    className="wishlistpage-section-games-game"
                    key={`${game.name}-${game.igdbId}`}
                >
                    <div className="wishlistpage-section-games-game-top">
                        {game.cover != null ? (
                            <img
                                src={ImageModifier.replaceThumbWith1080p(
                                    game.cover
                                )}
                            />
                        ) : (
                            <img src={noPicture} />
                        )}
                    </div>
                    <p className="wishlistpage-section-games-game-title">
                        {game.name}
                    </p>
                </Link>
            ))}
        </div>
    );
}
