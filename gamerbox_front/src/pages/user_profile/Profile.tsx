import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import "./Profile.css";
import GamerboxApi from "../../services/gamerbox_api";
import { useParams } from "react-router-dom";
import ImageModifier from "../../services/imageModifier";
import noBanner from "../../assets/limbowallpaper.jpg";
import noProfilePic from "../../assets/user_divers.png";

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

export default function Profile() {
    const { userId } = useParams();
    const [userInfo, setUserInfo] = useState<UserInfo | null>();
    const [username, setUsername] = useState<string | null>();
    const [userNum, setUserNum] = useState<number | null>();
    const [userMail, setUserMail] = useState<string | null>();
    const [wishlist, setWishlist] = useState<Array<WishlistGame> | null>();
    const [gamesNumber, setGamesNumber] = useState<number>(0);

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
                    setGamesNumber(wishlistData.length);
                }
                setWishlist(lastWishedGame);
            }
        };

        fetchUserData().catch(console.error);
        fetchWishlist().catch(console.error);
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
                                <div className="profile-top-info-data-numbers">
                                    <p>{gamesNumber}</p>
                                    <p>Game</p>
                                </div>
                                <div className="profile-top-info-data-numbers">
                                    <p>{gamesNumber}</p>
                                    <p>Follow</p>
                                </div>
                                <div className="profile-top-info-data-numbers">
                                    <p>{gamesNumber}</p>
                                    <p>Followers</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="profile-bottom">
                    <h4>Wishlist:</h4>
                    <div className="wishlist">
                        {wishlist?.map((game: WishlistGame) => (
                            <div
                                key={`${game.name}-${game.igdbId}`}
                                className="wishlistGame"
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
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
