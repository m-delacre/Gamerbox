import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import "./Profile.css";
import GamerboxApi from "../../services/gamerbox_api";
import { useParams } from "react-router-dom";
import ImageModifier from "../../services/imageModifier";

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
    cover: string;
};

export default function Profile() {
    const { userId } = useParams();
    const [userInfo, setUserInfo] = useState<UserInfo | null>();
    const [username, setUsername] = useState<string | null>();
    const [userNum, setUserNum] = useState<number | null>();
    const [userMail, setUserMail] = useState<string | null>();
    const [wishlist, setWishlist] = useState<Array<WishlistGame> | null>();

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
                console.log(wishlistData);
                setWishlist(wishlistData);
            }
        };

        fetchUserData().catch(console.error);
        fetchWishlist().catch(console.error);
    }, [userId]);

    return (
        <div className="profile-page">
            <Header />
            <main>
                <h1>{username}</h1>
                <section className="game-bottom-category">
                    <p>
                        #{userNum} - @: {userMail}
                    </p>
                </section>
                <section className="game-bottom-category">
                    <h4>Wishlist:</h4>
                    <div className="game-bottom-category-pills">
                        {wishlist?.map((game: WishlistGame) => (
                            <div key={`${game.name}-${game.igdbId}`}>
                                <p>IGDBID: {game.igdbId}</p>
                                <p>NAME: {game.name}</p>
                                <p>SLUG: {game.slug}</p>
                                <img
                                    src={ImageModifier.replaceThumbWith1080p(
                                        game.cover
                                    )}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
