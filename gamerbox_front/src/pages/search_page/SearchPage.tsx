import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GamerboxApi from "../../services/gamerbox_api";
import { Link } from "react-router-dom";
import Thumbnail from "../../components/thumbnail/Thumbnail";
import noCover from "../../assets/img_not_available.jpg";
import ImageModifier from "../../services/imageModifier";
import DateFormater from "../../services/dateFormater";
import Header from "../../components/header/Header";
import "./SearchPage.css";

type ThumbnailType = {
    igdbId: number;
    name: string;
    cover: string;
    releaseDate: string;
};

function SearchPage() {
    const { gameName } = useParams();
    const [input, setInput] = useState<string>(gameName ? gameName : "");
    let [offset, setOffset] = useState<number>(0);
    let [limit, setLimit] = useState<number>(5);
    let [data, setData] = useState<ThumbnailType[]>([]);
    const [noMore, setNomore] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const thumbnails = await GamerboxApi.searchGames(
                    input,
                    offset,
                    limit
                );
                console.log(thumbnails);
                if (thumbnails && thumbnails.length === 0) {
                    setNomore(true);
                }
                // explication needed
                let newValues: Array<any> = [];
                if (data && data.length > 0) {
                    newValues.push(...data);
                }
                if (thumbnails) {
                    newValues.push(...thumbnails);
                }
                setData(newValues);
                // setData(() => {
                //     let newValues: Array<any> = [];
                //     if (data && data.length > 0) {
                //         newValues.push(...data);
                //     }
                //     if (thumbnails) {
                //         newValues.push(...thumbnails);
                //     }
                //     return newValues;
                //     // const newData = data ? [...data] : [];
                //     // if (Array.isArray(thumbnails)) {
                //     //     newData.push(...thumbnails);
                //     // } else if (thumbnails) {
                //     //     newData.push(thumbnails);
                //     // }
                //     // return newData;
                // });
                console.log(thumbnails);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [offset]);

    function loadMore() {
        setOffset(offset + 5);
    }

    return (
        <div>
            <Header />
            <div className="searchPage">
                <div className="searchPage-resultsSection">
                    {data?.map((thumbnail: any) => (
                        <div className="searchPage-resultsSection-result">
                            <Link to={`/game/${thumbnail.igdbId}`}>
                                <Thumbnail
                                    key={`${thumbnail.name}-${thumbnail.igdbId}`}
                                    name={thumbnail.name}
                                    cover={
                                        thumbnail.cover
                                            ? ImageModifier.replaceThumbWith1080p(
                                                  thumbnail.cover
                                              )
                                            : noCover
                                    }
                                    releaseDate={DateFormater.formatFrenchDate(
                                        thumbnail.releaseDate
                                    )}
                                />
                            </Link>
                        </div>
                    ))}
                </div>
                {noMore ? (
                    <p>No more results...</p>
                ) : (
                    <button className="loadMoreBtn" onClick={loadMore}>
                        Load more
                    </button>
                )}
            </div>
        </div>
    );
}

export default SearchPage;
