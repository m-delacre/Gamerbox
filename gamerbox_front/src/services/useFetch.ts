import { useEffect, useState } from "react";

type GameInfo = {
    igdbId: number;
    name: string;
    slug: string;
    summary: string;
    releaseDate: string;
    banner: string;
    developers: string;
    cover: string;
    modes: Array<string>;
    theme: Array<string>;
    genre: Array<string>;
};

type MethodType = "GET" | "POST";

function useFetch( url: string, method: MethodType) {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState<any | null>(null);
    const [error, setError] = useState<any | null>(null);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        Accept: "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const game: GameInfo = await response.json();
                setLoading(false);
                setData(game);
            } catch (error) {
                setLoading(false);
                setError(`Error fetching game: ${error}`)
            }
        };
        fetchData().catch(console.error);
    }, [url]);

    return { data, loading, error };
}

export default useFetch;
