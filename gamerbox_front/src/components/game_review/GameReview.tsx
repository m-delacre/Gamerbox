import './GameReview.css';

interface GameReviewProps {
    name: string;
    content: string;
    profilPicture: string;
    note: number;
}

function GameReview({ name, content, profilPicture, note }: GameReviewProps) {
    return (
        <article>
            <section className="review-part review-part-one">
                <img src={profilPicture} alt="profilPicture" />
            </section>
            <section className="review-part review-part-two">
                <h3>{name}</h3>
                <p>{content}</p>
                <button className="btn-viewmore">Voir plus</button>
            </section>
            <section className="review-part review-part-three">
                <p>{note}/5</p>
            </section>
        </article>
    );
}

export default GameReview;
