import { useEffect } from "react";

type MethodType = "GET" | "POST";

function useSendData( url: string, method: MethodType, userToken: string) {
    useEffect(() => {
        const sentData = async () => {
            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userToken}`,
                    },
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                return true;
            } catch (error) {
                console.error("Error fetching user:", error);
                return null;
            }
        };
        sentData().catch(console.error);
    }, [url]);
}

export default useSendData;
