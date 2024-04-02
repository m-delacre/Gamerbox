import Header from "../../components/header/Header";
import "./Home.css";
import wallpaper from "../../assets/limbowallpaper.jpg";
import useFetch from "../../services/useFetch";

function Home() {
    const { data, loading, error } = useFetch(
        "https://127.0.0.1:8000/api/game/1904",
        "GET"
    );
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
                        {data && <p>"{data.name}"</p>}
                        {data && <p>"{data.igdbId}"</p>}
                        {error && <p>{error}</p>}
                </section>
            </main>
        </div>
    );
}

export default Home;
