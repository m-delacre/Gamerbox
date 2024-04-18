import { useState } from "react";
import './reviewForm.css';
import GamerboxApi from "../../services/gamerbox_api";
import { useNavigate } from "react-router-dom";

type ReviewFormProps = {
    gameId: number,
    token: string
};
export default function ReviewForm({token, gameId}: ReviewFormProps) {
    const [content, setContent] = useState("");
    const [reaction, setReaction] = useState<"like" | "dislike" | "mitigate">(
        "mitigate"
    );
    const navigate = useNavigate();

    const handleContentChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setContent(event.target.value);
    };

    const handleReactionChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setReaction(event.target.value as "like" | "dislike" | "mitigate");
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        sendReview();
        setContent("");
        setReaction("mitigate");
    };

    const sendReview = async () => {
        try {
            const res = await GamerboxApi.addReview(gameId, token, reaction, content);

            if (res) {
                navigate(0)
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="reviewForm">
            <form>
                <div className="form-row">
                    <p>Your opinion on the game:</p>
                    <textarea
                        id="content"
                        value={content}
                        onChange={handleContentChange}
                        placeholder="Write here..."
                        rows={5}
                        cols={50}
                        required
                    />
                </div>
                <div className="form-row">
                    <p>Did you like the game :</p>
                    <div className="radio-item">
                        <input
                            type="radio"
                            id="like"
                            name="reaction"
                            value="like"
                            checked={reaction === "like"}
                            onChange={handleReactionChange}
                        />
                        <label htmlFor="like">Like👍</label>
                    </div>
                    <div className="radio-item">
                        <input
                            type="radio"
                            id="dislike"
                            name="reaction"
                            value="dislike"
                            checked={reaction === "dislike"}
                            onChange={handleReactionChange}
                        />
                        <label htmlFor="dislike">Dislike👎</label>
                    </div>
                    <div className="radio-item">
                        <input
                            type="radio"
                            id="mitigate"
                            name="reaction"
                            value="mitigate"
                            checked={reaction === "mitigate"}
                            onChange={handleReactionChange}
                        />
                        <label htmlFor="mitigate">Mitigate👊</label>
                    </div>
                </div>
                <button className="wishListBtn" type="submit" onClick={handleSubmit}>Review</button>
            </form>
        </div>
    );
}
