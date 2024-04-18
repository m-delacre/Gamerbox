import { useEffect, useState, useCallback } from "react";

type MethodType = "GET" | "POST";

function useFetch<T>(url: string, method: MethodType, requestData?: any, token?: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const options: RequestInit = {
                method: method,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: method === "POST" ? JSON.stringify(requestData) : undefined,
            };

            if (token) {
                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${token}`,
                };
            }

            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData: T = await response.json();
            setData(responseData);
            setLoading(false);
        } catch (error) {
            setError(`Error fetching data: ${error}`);
            setLoading(false);
        }
    }, [url, method, requestData, token]);

    useEffect(() => {
        fetchData();

        return () => {
            // Clean up function
        };
    }, [fetchData]);

    return { data, loading, error };
}

export default useFetch;
