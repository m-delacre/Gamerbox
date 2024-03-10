import './Thumbnail.css';

type ThumbnailProps = {
    name: string;
    releaseDate: string | undefined;
    cover: string;
};

function Thumbnail({ name, releaseDate, cover }: ThumbnailProps) {
    return (
        <article className="thumbnail">
            <div className="thumbnail-cover">
                <img src={cover} alt="result cover" />
            </div>
            <div className="thumbnail-info">
                <h2>{name} - {releaseDate}</h2>
                {/* <h3>{releaseDate}</h3> */}
            </div>
        </article>
    );
}

export default Thumbnail;
