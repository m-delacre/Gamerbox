import Header from "../../components/header/Header";
import "./Home.css";

function Home() {
    return (
        <div className="homepage">
            <Header />
            <main>
                <section className="home-banner">
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
