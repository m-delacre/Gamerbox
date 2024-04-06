import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ImageModifier from "../../services/imageModifier";
import DateFormater from "../../services/dateFormater";
import TagPills from "../../components/tag_pills/TagPills";
import Header from "../../components/header/Header";
import "./GamePage.css";
import Note from "../../components/note/Note";
import GameReview from "../../components/game_review/GameReview";
import pictureOrc from "../../assets/user_orc.png";
import pictureRobot from "../../assets/user_robot.png";
import pictureDivers from "../../assets/user_divers.png";
import pictureChat from "../../assets/chatpote.jpg";
import noCover from "../../assets/img_not_available.jpg";
import noBanner from "../../assets/gamerbox_img.png";
import { selectToken, selectUserId } from "../../redux/userSlice";
import { useSelector } from "react-redux";
import useFetch from "../../services/useFetch";
import GamerboxApi from "../../services/gamerbox_api";

type GameInfo = {
    igdbId: number;
    name: string;
    slug: string;
    summary: string;
    releaseDate: string;
    banner: string;
    developers: string;
    cover: string;
    modes: Array<any>;
    theme: Array<any>;
    genre: Array<any>;
};

type Tag = {
    name: string;
};

function GamePage() {
    const { gameId } = useParams();
    const [game, setGame] = useState<GameInfo | null>();
    const [banner, setBanner] = useState<string>();
    const [cover, setCover] = useState<string>();
    const [releaseDate, setReleaseDate] = useState<string>();
    const [developers, setDevelopers] = useState<string>();
    const [name, setName] = useState<string>();
    const userId = useSelector(selectUserId);
    const navigate = useNavigate();

    const { data, loading, error } = useFetch<GameInfo>(
        `https://127.0.0.1:8000/api/game/${gameId}`,
        "GET"
    );

    if (error) {
        console.error(error);
    }

    useEffect(() => {
        if (data) {
            setGame(data);
            if (data.banner) {
                setBanner(data.banner);
            } else {
                setBanner(noBanner);
            }
            if (data.cover) {
                setCover(ImageModifier.replaceThumbWith1080p(data.cover));
            } else {
                setCover(noCover);
            }
            setName(data.name);
            setDevelopers(data.developers);
            setReleaseDate(DateFormater.formatFrenchDate(data.releaseDate));
        }
    }, [gameId, data]);

    if (game === null) {
        navigate("/gamenotfound");
    }

    if (loading) {
        return (
            <div className="loading-page">
                <div className="loader2"></div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <main>
                <section className="game-top">
                    <section className="game-top-banner">
                        <img src={banner} alt="game banner"></img>
                    </section>
                    <section className="game-top-info">
                        <section className="game-top-info-cover">
                            <img src={cover} alt="game cover" />
                        </section>
                        <section className="game-top-info-data">
                            <h2>{name}</h2>
                            <h3>
                                {developers} - {releaseDate}
                            </h3>
                            {gameId && userId ? (
                                <WishlistBtn gameId={parseInt(gameId)} />
                            ) : (
                                <></>
                            )}
                        </section>
                        <section className="game-top-info-note">
                            <Note note={5} />
                        </section>
                    </section>
                </section>
                <section className="game-bottom">
                    <section className="game-bottom-category">
                        <h4>Summary :</h4>
                        <p className="summary">{game?.summary}</p>
                    </section>
                    <section className="game-bottom-category">
                        <h4>Genres:</h4>
                        <div className="game-bottom-category-pills">
                            {game?.genre.map((gameMode: Tag) => (
                                <TagPills
                                    key={`${gameMode.name}-${game.igdbId}`}
                                    name={gameMode.name}
                                />
                            ))}
                        </div>
                    </section>
                    <section className="game-bottom-category">
                        <h4>Themes:</h4>
                        <div className="game-bottom-category-pills">
                            {game?.theme.map((gameMode: Tag) => (
                                <TagPills
                                    key={`${gameMode.name}-${game.igdbId}`}
                                    name={gameMode.name}
                                />
                            ))}
                        </div>
                    </section>
                    <section className="game-bottom-category">
                        <h4>Modes:</h4>
                        <div className="game-bottom-category-pills">
                            {game?.modes.map((gameMode: Tag) => (
                                <TagPills
                                    key={`${gameMode.name}-${game.igdbId}`}
                                    name={gameMode.name}
                                />
                            ))}
                        </div>
                    </section>
                    <section className="game-bottom-category">
                        <h4>Last reviews :</h4>
                        <div className="game-bottom-reviews">
                            <GameReview
                                name="John_Doe"
                                content="super jeu !"
                                profilPicture={pictureRobot}
                                note={4}
                            />
                            <GameReview
                                name="HellDivers"
                                content="Pour la démocratie!💀🦅👽"
                                profilPicture={pictureDivers}
                                note={5}
                            />
                            <GameReview
                                name="PotiChat_poT"
                                content="Y'a pas de chat dans le jeu?🐱"
                                profilPicture={pictureChat}
                                note={5}
                            />
                            <GameReview
                                name="Rageux_du_77"
                                content="trop nul 😠"
                                profilPicture={pictureOrc}
                                note={2.5}
                            />
                        </div>
                    </section>
                </section>
            </main>
        </div>
    );
}

type WishlistBtnProsp = {
    gameId: number | undefined;
};

type WishlistGame = {
    igdbId: number;
    name: string;
    slug: string;
    cover: string | null;
};
function WishlistBtn({ gameId }: WishlistBtnProsp) {
    const token = useSelector(selectToken);
    const userId = useSelector(selectUserId);
    const [visible, setVisible] = useState<number | undefined>();
    const navigate = useNavigate();

    const { data: wishlistData, loading: wishlistLoading, error: wishlistError } = useFetch<WishlistGame[]>(
        `https://127.0.0.1:8000/api/user/wishlist/${userId}`,
        "GET"
    );

    useEffect(() => {
        if (wishlistData) {
            const finder = wishlistData.find(
                (game: WishlistGame) => game.igdbId === gameId
            );
            if (finder) {
                setVisible(3);
            } else {
                setVisible(2);
            }
        } else {
            setVisible(2);
        }
    }, [userId, wishlistData, gameId]);

    const callAPIaddToWishlist = async (gameId:number, tokenJWT: string) => {
        try {
            const res = await GamerboxApi.addToWishlist(gameId, tokenJWT);
            if(res) {
                navigate(0)
            }
        } catch (error) {
            console.error(error);
        }
    };

    const addWishlist = () => {
        if (token && userId && gameId) {
            callAPIaddToWishlist(gameId, token);
        }
    };

    const callAPIremoveFromWishlist = async (gameId:number, tokenJWT: string) => {
        try {
            const res = await GamerboxApi.removeFromWishlist(gameId, tokenJWT);
            if(res) {
                navigate(0)
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteGame = () => {
        if (token && userId && gameId) {
            callAPIremoveFromWishlist(gameId, token);
        }
    };

    if (wishlistError) {
        console.log(wishlistError);
    }

    if (wishlistLoading) {
        return (
            <div className="profile-top-info-data-numbers">
                <div className="loader"></div>
            </div>
        );
    }

    if (visible === 2) {
        return (
            <button className="wishListBtn" onClick={addWishlist}>
                Add Wishlist
            </button>
        );
    }

    if (visible === 3) {
        return (
            <button className="wishListBtn" onClick={deleteGame}>
                delete from wishlist
            </button>
        );
    }
}

export default GamePage;
