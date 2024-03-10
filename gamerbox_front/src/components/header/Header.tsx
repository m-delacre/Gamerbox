import logo from "/gamerbox_logo.png";
import NavLink from "../nav_link/NavLink";
import "./Header.css";
import SearchBar from "../search_bar/SearchBar";
import { Link } from "react-router-dom";

function Header() {
    return (
        <header>
            <Link to="/">
                <img src={logo} alt="gamerbox logo" />
            </Link>
            <NavLink route="/" text="Home" />
            <NavLink route="/game/1942" text="Witcher" />
            <div className="searchBar">
                <SearchBar />
            </div>
            <NavLink route="" text="Review" />
            <NavLink route="" text="Connexion" />
        </header>
    );
}

export default Header;
