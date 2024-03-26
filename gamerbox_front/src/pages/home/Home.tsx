import Header from "../../components/header/Header";
import "./Home.css";
import wallpaper from '../../assets/limbowallpaper.jpg';

function Home() {
    return (
        <div className="homepage">
            <Header />
            <main>
                <section className="home-banner">
                    <img src={wallpaper} alt="wallpaper" />
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
