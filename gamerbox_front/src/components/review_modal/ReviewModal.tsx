import { useEffect } from "react";
import ReviewForm from "../review_form/ReviewForm";
import './review_modal.css';

type ReviewModalProps = {
    visible: boolean;
    gameId: number,
    token: string,
    onClose: () => void;
};
export default function ReviewModal({ token, gameId, visible, onClose }: ReviewModalProps) {
    useEffect(() => {}, [visible]);
    if (visible) {
        return (
            <div className="reviewModalPage">
                <div className="reviewModal">
                    <h2>Write your review :</h2>
                    <div id='closeReviewModal'>
                        <button onClick={onClose}>X</button>
                    </div>
                    <ReviewForm token={token} gameId={gameId} />
                </div>
            </div>
        );
    } else {
        return <></>;
    }
}
