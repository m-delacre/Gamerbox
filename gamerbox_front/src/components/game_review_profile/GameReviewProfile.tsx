import noPicture from "../../assets/img_not_available.jpg";
import { NavLink } from "react-router-dom";
import "./GameReviewProfile.css";
import ImageModifier from "../../services/imageModifier";
import { API_IMG_URL } from '../../../config.ts';

const imgURL =  API_IMG_URL;

type GameReviewProps = {
    pseudonym: string;
    content: string;
    profilPicture: string;
    liked: boolean | null;
    mitigate: boolean | null;
    userId: number;
    gameId: number;
    gameCover: string;
    gameName: string;
};

function GameReviewProfile({
    pseudonym,
    content,
    profilPicture,
    liked,
    mitigate,
    gameId,
    gameCover,
    gameName,
}: GameReviewProps) {
    return (
        <div className="reviewProfile">
            <div className="reviewProfile-left">
                {!profilPicture ? (
                    <img src={noPicture} alt="" />
                ) : (
                    <img
                        src={`${imgURL}/${profilPicture}`}
                        alt=""
                    />
                )}
                <h3>{pseudonym}</h3>
                {mitigate === true ? <p>👊mitigate👊</p> : <></>}
                {liked === false ? <p>👎dislike👎</p> : <></>}
                {liked === true ? <p>👍like👍</p> : <></>}
            </div>
            <section className="reviewProfile-middle">
                <p>{content}</p>
            </section>
            <section className="reviewProfile-right">
                <NavLink to={`http://localhost:5173/game/${gameId}`}>
                    {!gameCover ? (
                        <img src={noPicture} alt="" />
                    ) : (
                        <img
                            src={ImageModifier.replaceThumbWith1080p(gameCover)}
                            alt=""
                        />
                    )}
                    <h3>{gameName}</h3>
                </NavLink>
            </section>
        </div>
    );
}

export default GameReviewProfile;
