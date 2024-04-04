import Header from "../../components/header/Header";
import "./Home.css";
import wallpaper from "../../assets/limbowallpaper.jpg";
import useSendData from "../../services/useSendFetch";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, setNotConnected, setId, setEmail, setToken, setPseudonym } from "../../redux/userSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const loading = true;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    function disconnect() {
        dispatch(setNotConnected());
        dispatch(setId(null));
        dispatch(setEmail(''));
        dispatch(setPseudonym(''));
        dispatch(setToken(''));
        navigate(0);
    }

    return (
        <div className="homepage">
            <Header />
            <main>
                <section className="home-banner">
                    <img src={wallpaper} alt="wallpaper" />
                    {/* <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/LhHrHMkTw34?controls=1&mute=1&loop=1&autoplay=1"
                        frameBorder="0"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    ></iframe> */}
                    <p>Welcome to Gamerbox👾</p>
                </section>
                <section className="home-explain">
                        {loading && <div className="loader2"></div>}
                </section>
            </main>
        </div>
    );
}

export default Home;
