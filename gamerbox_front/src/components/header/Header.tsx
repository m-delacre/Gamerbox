import logo from "/gamerbox_logo.png";
import NavLink from "../nav_link/NavLink";
import "./Header.css";
import SearchBar from "../search_bar/SearchBar";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsConnected, selectUserId, setId, setEmail, setPseudonym, setToken, setNotConnected } from "../../redux/userSlice";

function Header() {
    const [userId, setUserId] = useState<number>(
        useSelector(selectUserId)
    );
    const [connexion, setConnexion] = useState<boolean>(
        useSelector(selectIsConnected)
    );

    const dispatch = useDispatch();
    const navigate = useNavigate();

    function disconnect() {
        dispatch(setNotConnected());
        dispatch(setId(null));
        dispatch(setEmail(''));
        dispatch(setPseudonym(''));
        dispatch(setToken(''));
        setConnexion(false);
        navigate(0);
    }

    if (connexion) {
        return (
            <header>
                <Link to="/">
                    <img src={logo} alt="gamerbox logo" />
                </Link>
                <Link to="/">Home</ Link>
                <Link to={`/wishlist/${userId}`}>Wishlist</ Link>
                <div className="searchBar">
                    <SearchBar />
                </div>
                <Link to={`/profile/${userId}`}>Profile</Link>
                {/* <button onClick={goToProfile}>Profile</button> */}
                <Link to='' onClick={disconnect}>Disconnect</Link>
            </header>
        );
    }

    return (
        <header>
            <Link to="/">
                <img src={logo} alt="gamerbox logo" />
            </Link>
            <NavLink route="/" text="Home" />
            <div className="searchBar">
                <SearchBar />
            </div>
            <NavLink route="/login" text="Connexion" />
        </header>
    );
}

export default Header;
