import { useEffect, useState } from "react";

type MethodType = "GET" | "POST";

function useSendData( url: string, method: MethodType, userToken: string) {
    const [valide, setValide] = useState<boolean>();
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
    
                setValide(true);
            } catch (error) {
                setValide(false);
                console.error("Error fetching user:", error);
                return null;
            }
        };
        sentData().catch(console.error);
    }, [url]);
    
    return {valide};
}


export default useSendData;
