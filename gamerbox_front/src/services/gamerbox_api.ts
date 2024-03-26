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

type Thumbnails = {
    igdbId: number;
    name: string;
    cover: string;
    releaseDate: string;
};


type UserInfo = {
    id: number,
    email: string,
    pseudonym: string,
    token: string
}

type Token = {
    token: string
}
class GamerboxApi {
    static async getGame(id: string | undefined) {
        const url = `https://127.0.0.1:8000/api/game/${id}`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const game: GameInfo = await response.json();

            return game;
        } catch (error) {
            console.error("Error fetching game:", error);
            return null;
        }
    }

    static async searchGames(value: string | undefined, offset: number | undefined, limit: number | undefined) {
        const url = `https://127.0.0.1:8000/api/search`;
        const data = {
            search: value,
            offset: offset,
            limit: limit,
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const thumbnails: Thumbnails[] = await response.json();

            return thumbnails;
        } catch (error) {
            console.error("Error fetching game:", error);
            return null;
        }
    }

    static async login(email: string, password: string) {
        const url = `https://127.0.0.1:8000/api/login_check`;
        const data = {
            username: email,
            password: password,
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result: Token = await response.json();

            return result;
        } catch (error) {
            console.error("Error fetching user:", error);
            return null;
        }
    }

    static async getUserInfo(token: string) {
        const url = `https://127.0.0.1:8000/api/user`;
        const userToken = token;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                    Authorization: `Bearer ${userToken}`,
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data: UserInfo = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error("Error fetching user:", error);
            return null;
        }
    }
}

export default GamerboxApi;
