import "./GameReview.css";
import noPicture from '../../assets/img_not_available.jpg';
import { NavLink } from "react-router-dom";
import { API_IMG_URL } from '../../../config.ts';

const imgURL =  API_IMG_URL;

type GameReviewProps = {
    pseudonym: string;
    content: string;
    profilPicture: string;
    liked: boolean | null;
    mitigate: boolean | null;
    userId: number
};

function GameReview({
    pseudonym,
    content,
    profilPicture,
    liked,
    mitigate,
    userId
}: GameReviewProps) {
    return (
        <article>
            <NavLink to={`http://localhost:5173/profile/${userId}`} className="review-part-one">
                {!profilPicture ? (
                    <img
                        src={noPicture}
                        alt=""
                    />
                ) : (
                    <img
                        src={`${imgURL}${profilPicture}`}
                        alt=""
                    />
                )}
                <h3>{pseudonym}</h3>
            </NavLink>
            <section className="review-part-two">
                <p>{content}</p>
            </section>
            <section className="review-part-three">
                {mitigate === true ? <p>👊</p> : <></>}
                {liked === false ? <p>👎</p> : <></>}
                {liked === true ? <p>👍</p> : <></>}
            </section>
        </article>
    );
}

export default GameReview;
