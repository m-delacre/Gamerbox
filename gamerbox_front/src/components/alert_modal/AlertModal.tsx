import "./AlertModal.css";

type AlertModalType = {
    message: string;
    visible: boolean;
    onClose: () => void;
};

export default function AlertModal({
    message,
    visible,
    onClose,
}: AlertModalType) {
    if (!visible) {
        return null;
    }

    return (
        <div className="modalScreen">
            <div className="alertModal">
                <div id="modalCross">
                    <button onClick={onClose}>X</button>
                </div>
                <p>{message}</p>
            </div>
        </div>
    );
}
