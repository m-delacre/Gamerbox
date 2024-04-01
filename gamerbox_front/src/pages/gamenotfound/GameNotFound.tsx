import React from "react";
import Header from "../../components/header/Header";
import './GameNotFound.css';
import { Link } from "react-router-dom";

export default function GameNotFound() {
    return (
        <div className="gamenotfound-page">
            <Header />
            <div className="gamenotfound">
                <p>Sorry, we don't have this game 😥</p>
                <Link to='/'><button>back home</button></Link>
            </div>
        </div>
    );
}
