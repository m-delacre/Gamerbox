/// <reference types="node" />

import { useEffect, useState } from "react";
import "./SearchBar.css";
import GamerboxApi from "../../services/gamerbox_api";
import Thumbnail from "../thumbnail/Thumbnail";
import DateFormater from "../../services/dateFormater";
import ImageModifier from "../../services/imageModifier";
import noCover from "../../assets/chatpote.jpg";
import { Link } from "react-router-dom";

type searchResults = {
    visible: boolean;
    data: Array<object> | null | undefined;
    input: string;
};

type ThumbnailType = {
    igdbId: number;
    name: string;
    cover: string;
    releaseDate: string;
};

function SearchBar() {
    const [input, setInput] = useState<string>("");
    // const [offset, setOffset] = useState<number>(0);
    // const [limit, setLimit] = useState<number>(5);
    const offset: number = 0;
    const limit: number = 5;
    const [data, setData] = useState<ThumbnailType[] | null>();
    const [visible, setVisible] = useState<boolean>(false);

    function changeInputValue(value: string) {
        if (value.length > 3) {
            setInput(value);
            setVisible(true);
        } else {
            setVisible(false);
        }
    }

    useEffect(() => {
        let timeoutId: NodeJS.Timeout | undefined;

        const fetchData = async () => {
            try {
                const thumbnails = await GamerboxApi.searchGames(
                    input,
                    offset,
                    limit
                );
                setData(thumbnails);
                console.log(thumbnails);
            } catch (error) {
                console.error(error);
            }
        };

        if (input && input.length >= 3) {
            // Annuler le timeout existant s'il y en a un
            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
                fetchData();
            }, 500);
        }

        // Nettoyer le timeout lorsqu'un nouveau rendu se produit ou lorsque le composant est démonté
        return () => {
            clearTimeout(timeoutId);
        };
    }, [input]);

    return (
        <div className="searchBar">
            <input
                type="text"
                id="searchBar"
                name="searchBar"
                placeholder="Search a game..."
                onChange={(e) => changeInputValue(e.target.value)}
            />
            <SearchResults visible={visible} data={data} input={input} />
        </div>
    );
}

function SearchResults({ visible, data, input }: searchResults) {
    if (visible === false) {
        return <div className="searchResults noDisplay"></div>;
    } else {
        return (
            <div className="searchResults display">
                <div>
                    <p>Results :</p>
                </div>
                {data?.map((thumbnail: any) => (
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
                ))}
                <div>
                    <Link to={`/search/${input}`}>
                        <p>See more</p>
                    </Link>
                </div>
            </div>
        );
    }
}

export default SearchBar;
