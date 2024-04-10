import { API_URL } from '../../config.ts';

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

type ReviewData = {
    id: number;
    user: { id: number; pseudonym: string; profilePicture: string };
    content: string;
    liked: boolean | null;
    mitigate: boolean | null;
    game: { igdbId: number; name: string };
};

type reviewDataForm = {
    content: string,
    liked: boolean | null,
    mitigate: boolean | null
}

const baseURL = API_URL;
class GamerboxApi {
    static async getGame(id: string | undefined) {
        const url = `${baseURL}game/${id}`;

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
        const url = `${baseURL}search`;
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
        const url = `${baseURL}login_check`;
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
        const url = `${baseURL}register`;
    
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
        const url = `${baseURL}user/logged`;
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
        const url = `${baseURL}user/${id}`;

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
        const url = `${baseURL}game/whishlist/${igdbId}`;

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
        const url = `${baseURL}game/whishlist/remove/${igdbId}`;

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
        const url = `${baseURL}user/wishlist/${userId}`;

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
        const url = `${baseURL}user/follow/${userId}`;

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
        const url = `${baseURL}user/follower/${userId}`;

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
        const url = `${baseURL}follow/add/${userToAddId}`;

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
        const url = `${baseURL}follow/remove/${userToRemoveId}`;

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

    static async getGameReview(offset: number, igdbId: number) {
        const url = `${baseURL}game/review/${igdbId}`;
    
        let data = {
           "offset": offset,
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

            const result: ReviewData[] = await response.json();

            return result;
        } catch (error) {
            console.error("Error :", error);
            return null;
        }
    }

    static async addReview(gameId: number, userToken: string, reaction: 'like' | 'dislike' | 'mitigate', content: string ) {
        const url = `${baseURL}review/add/${gameId}`;

        let data: reviewDataForm = {
            "content":content,
            "liked": false,
            "mitigate": false
        }
        switch (reaction) {
            case 'like':
                data = {
                    "content":content,
                    "liked": true,
                    "mitigate": false
                }
              break;
            case 'dislike':
                data = {
                    "content":content,
                    "liked": false,
                    "mitigate": false
                }
                break;
            case 'mitigate':
                data = {
                    "content":content,
                    "liked": null,
                    "mitigate": true
                }
              break;
            default:
              console.log(`Error in form`);
          }

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify(data),
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

    static async removeReview(reviewId: number, userToken: string) {
        const url = `${baseURL}review/delete/${reviewId}`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                }
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
