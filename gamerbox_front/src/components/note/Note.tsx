import './Note.css';

function Note({ note }: any) {
    return(
        <div className="note">
            <p>{note}/5</p>
        </div>
    );
}

export default Note;
