import Header from "../../components/header/Header";
import "./Home.css";
import wallpaper from "../../assets/limbowallpaper.jpg";

function Home() {
    return (
        <div className="homepage">
            <Header />
            <main>
                <section className="home-banner">
                    {/* <img src={wallpaper} alt="wallpaper" /> */}
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/LhHrHMkTw34?controls=1&mute=1&loop=1&autoplay=1"
                        frameBorder="0"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    ></iframe>
                    <p>Welcome to Gamerbox👾</p>
                </section>
                <section className="home-explain">
                    <p>explain how the site works</p>
                </section>
            </main>
        </div>
    );
}

export default Home;
