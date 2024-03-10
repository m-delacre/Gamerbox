import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import GamerboxApi from "../../services/gamerbox_api";
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
import WatchListButton from "../../components/watchlist_button/WatchListButton";

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

    useEffect(() => {
        const fetchData = async () => {
            const gameData = await GamerboxApi.getGame(gameId);
            setGame(gameData);
            setName(gameData?.name);
            if (gameData?.banner != null) {
                setBanner(ImageModifier.replaceThumbWithScreenshotHuge(gameData?.banner));
            } else {
                setBanner(pictureChat);
            }
            setCover(ImageModifier.replaceThumbWith1080p(gameData?.cover));
            setReleaseDate(DateFormater.formatFrenchDate(gameData?.releaseDate));
            setDevelopers(gameData?.developers);
        };
        fetchData().catch(console.error);
    }, []);

    if (game === null) {
        return <></>;
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
                            <WatchListButton />
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

export default GamePage;
