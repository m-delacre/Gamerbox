import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home/Home.tsx";
import "./index.css";
import ErrorPage from "./pages/error_page/error_page.tsx";
import GamePage from "./pages/game_page/GamePage.tsx";
import Footer from "./components/footer/Footer.tsx";
import SearchPage from "./pages/search_page/SearchPage.tsx";

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
        path: "/error",
        element: <ErrorPage />,
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
        <Footer />
    </React.StrictMode>
);
