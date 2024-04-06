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
    id: number;
    email: string;
    pseudonym: string;
    token: string;
};

type Token = {
    token: string;
};

type WishlistGame = {
    igdbId: number;
    name: string;
    slug: string;
    cover: string;
};

type FollowUser = {
    id: number,
    pseudonyme: string
}

type RegisterInfo = {
    id: number,
    email: string,
    pseudonym: string,
    profilePicture: string
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

    static async searchGames(
        value: string | undefined,
        offset: number | undefined,
        limit: number | undefined
    ) {
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
            console.error("Error :", error);
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
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result: Token = await response.json();

            return result;
        } catch (error) {
            console.error("Error :", error);
            return null;
        }
    }

    static async register(email: string, password: string, pseudonym: string, picture: File | null) {
        const url = `https://127.0.0.1:8000/api/register`;
    
        let data = JSON.stringify({
           "email": email,
           "pseudonym": pseudonym,
           "password": password
        });
        
        const formData = new FormData();
        formData.append("data", data);
        if (picture) {
            formData.append('profilePicture', picture);
        }
    
        try {
            const response = await fetch(url, {
                method: "POST",
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const result: RegisterInfo = await response.json();
    
            return result;
        } catch (error) {
            console.error("Error :", error);
            return null;
        }
    }

    static async getLoggedUserInfo(token: string) {
        const url = `https://127.0.0.1:8000/api/user/logged`;
        const userToken = token;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data: UserInfo = await response.json();

            return data;
        } catch (error) {
            console.error("Error :", error);
            return null;
        }
    }

    static async getUserInfo(id: number) {
        const url = `https://127.0.0.1:8000/api/user/${id}`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data: UserInfo = await response.json();

            return data;
        } catch (error) {
            console.error("Error :", error);
            return null;
        }
    }

    static async addToWishlist(igdbId: number, userToken: string) {
        const url = `https://127.0.0.1:8000/api/game/whishlist/${igdbId}`;

        try {
            const response = await fetch(url, {
                method: "POST",
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
            console.error("Error :", error);
            return null;
        }
    }

    static async removeFromWishlist(igdbId: number, userToken: string) {
        const url = `https://127.0.0.1:8000/api/game/whishlist/remove/${igdbId}`;

        try {
            const response = await fetch(url, {
                method: "POST",
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
            console.error("Error :", error);
            return null;
        }
    }

    static async getUserWishlist(userId: number) {
        const url = `https://127.0.0.1:8000/api/user/wishlist/${userId}`;

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

            const data: Array<WishlistGame> = await response.json();

            return data;
        } catch (error) {
            console.error("Error :", error);
            return null;
        }
    }

    static async getUserFollowing(userId: number) {
        const url = `https://127.0.0.1:8000/api/user/follow/${userId}`;

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

            const data: Array<FollowUser> = await response.json();

            return data;
        } catch (error) {
            console.error("Error :", error);
            return null;
        }
    }

    static async getUserFollowers(userId: number) {
        const url = `https://127.0.0.1:8000/api/user/follower/${userId}`;

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

            const data: Array<FollowUser> = await response.json();

            return data;
        } catch (error) {
            console.error("Error :", error);
            return null;
        }
    }

    static async addFollow(userToAddId: number, userToken: string) {
        const url = `https://127.0.0.1:8000/api/follow/add/${userToAddId}`;

        try {
            const response = await fetch(url, {
                method: "POST",
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
            console.error("Error :", error);
            return null;
        }
    }

    static async removeFollow(userToRemoveId: number, userToken: string) {
        const url = `https://127.0.0.1:8000/api/follow/remove/${userToRemoveId}`;

        try {
            const response = await fetch(url, {
                method: "POST",
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
            console.error("Error :", error);
            return null;
        }
    }
}

export default GamerboxApi;
