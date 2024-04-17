import "./App.css";
import { createBrowserRouter, RouterProvider, useNavigate } from "react-router-dom";
import ErrorPage from "./pages/error_page/error_page.tsx";
import GamePage from "./pages/game_page/GamePage.tsx";
import Footer from "./components/footer/Footer.tsx";
import SearchPage from "./pages/search_page/SearchPage.tsx";
import LoginPage from "./pages/login_page/LoginPage.tsx";
import Home from "./pages/home/Home.tsx";
import Profile from "./pages/user_profile/Profile.tsx";
import WishlistPage from "./pages/wishlist_page/WishlistPage.tsx";
import GameNotFound from "./pages/gamenotfound/GameNotFound.tsx";
import Register from "./pages/register/Register.tsx";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, setEmail, setId, setNotConnected, setPseudonym, setToken } from "./redux/userSlice.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/game/:gameId",
        element: <GamePage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/search/:gameName",
        element: <SearchPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/profile/:userId",
        element: <Profile />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/wishlist/:userId",
        element: <WishlistPage />,
    },
    {
        path: "/gamenotfound",
        element: <GameNotFound />,
    },
    {
        path: "/error",
        element: <ErrorPage />,
    },
]);

function App() {
    const isTokenValid = (token: string): boolean => {
        try {
            const decodedToken: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decodedToken.exp > currentTime;
        } catch (error) {
            return false;
        }
    };

    const dispatch = useDispatch();
    // const navigate = useNavigate();

    function disconnect() {
        dispatch(setNotConnected());
        dispatch(setId(null));
        dispatch(setEmail(null));
        dispatch(setPseudonym(null));
        dispatch(setToken(null));
        // navigate('/login');
    }
    
    const token = useSelector(selectToken);
    
    if (token) {
        const isTokenStillValid = isTokenValid(token);
    
        if (isTokenStillValid) {
            console.log("token valide");
        } else {
            disconnect();
        }
    } else {
        // Aucun token trouvé, peut-être que l'utilisateur n'est pas connecté
    }

    return (
        <>
            <RouterProvider router={router} />
            <Footer />
        </>
    );
}

export default App;
