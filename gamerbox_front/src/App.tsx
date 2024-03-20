import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/error_page/error_page.tsx";
import GamePage from "./pages/game_page/GamePage.tsx";
import Footer from "./components/footer/Footer.tsx";
import SearchPage from "./pages/search_page/SearchPage.tsx";
import LoginPage from "./pages/login_page/LoginPage.tsx";
import Home from "./pages/home/Home.tsx";
import Header from "./components/header/Header.tsx";

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
        path: "/error",
        element: <ErrorPage />,
    },
]);

function App() {
    return (
        <>
            <RouterProvider router={router} /> 
            <Footer />
        </>
    );
}

export default App;
