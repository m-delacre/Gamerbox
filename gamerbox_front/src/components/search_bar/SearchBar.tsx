/// <reference types="node" />

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./SearchBar.css";
import GamerboxApi from "../../services/gamerbox_api";
import Thumbnail from "../thumbnail/Thumbnail";
import DateFormater from "../../services/dateFormater";
import ImageModifier from "../../services/imageModifier";
import noCoverA from "../../assets/chatpote.jpg";

type ThumbnailType = {
    igdbId: number;
    name: string;
    cover: string;
    releaseDate: string;
};

type SearchResultsProps = {
    visible: boolean;
    data: ThumbnailType[] | null | undefined;
    input: string;
    setSearchBarVisible: (isVisible: boolean) => void;
};

const SearchResults = (props: SearchResultsProps) => {
    const noCover: string = noCoverA;

    if (!props.visible || !props.data) {
        return <div className="searchResults noDisplay"></div>;
    }

    return (
        <div className="searchResults display">
            <div>
                <p>Results :</p>
            </div>
            {props.data.map((thumbnail: ThumbnailType) => (
                <button
                    key={`${thumbnail.name}-${thumbnail.igdbId}`}
                    className="nostyle"
                    onClick={(e) => {
                        e.preventDefault();
                        props.setSearchBarVisible(false);
                    }}
                >
                    <Link to={`/game/${thumbnail.igdbId}`}>
                        <Thumbnail
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
                </button>
            ))}
            <div>
                <Link to={`/search/${props.input}`}>
                    <p>See more</p>
                </Link>
            </div>
        </div>
    );
};

const SearchBar = () => {
    const [input, setInput] = useState<string>("");
    const [data, setData] = useState<ThumbnailType[] | null>();
    const [visible, setVisible] = useState<boolean>(false);
    const searchBarRef = useRef<HTMLDivElement>(null);

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
                    0, // offset
                    5 // limit
                );
                setData(thumbnails);
            } catch (error) {
                console.error(error);
            }
        };

        if (input && input.length >= 3) {
            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
                fetchData();
            }, 500);
        }

        return () => {
            clearTimeout(timeoutId);
        };
    }, [input]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchBarRef.current &&
                !searchBarRef.current.contains(event.target as Node)
            ) {
                setVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="searchBar" ref={searchBarRef}>
            <input
                type="text"
                id="searchBar"
                name="searchBar"
                placeholder="Search a game..."
                onChange={(e) => changeInputValue(e.target.value)}
            />
            <SearchResults
                visible={visible}
                data={data}
                input={input}
                setSearchBarVisible={setVisible}
            />
        </div>
    );
};

export default SearchBar;
