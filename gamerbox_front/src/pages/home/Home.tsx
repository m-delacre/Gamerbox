import Header from "../../components/header/Header";
import "./Home.css";
import wallpaper from "../../assets/limbowallpaper.jpg";
import explainProfile from "../../../public/haveyourownprofile.png";
import explainReviews from "../../../public/gamereview_example.png";
import explainAddReview from "../../../public/addreview_example.png";
import explainGameInfo from "../../../public/gameinfo_example.png";
import explainWishlist from "../../../public/ownrwihslist_explain.png";
import explainFollow from "../../../public/follow_explain.png";

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
                    <div className="home-explain-case">
                        <h3>FIND GAME INFORMATION</h3>
                        <img src={explainGameInfo} alt="game infos" />
                    </div>
                    <div className="home-explain-case home-explain-case-midimg">
                        <h3>READ OTHER PLAYER REVIEW</h3>
                        <img src={explainReviews} alt="add game review" />
                    </div>
                    <div className="home-explain-case">
                        <h3>
                            CREATE YOUR OWN PROFILE WITH YOUR WISHLIST AND YOUR
                            REVIEWS
                        </h3>
                        <img
                            src={explainProfile}
                            alt="create your own profile"
                        />
                    </div>
                    <div className="home-explain-case home-explain-case-midimg">
                        <h3>ADD YOUR NEXT GAMES TO YOUR WISHLIST</h3>
                        <img src={explainWishlist} alt="have a game wishlist" />
                    </div>
                    <div
                        id=""
                        className="home-explain-case home-explain-case-smallimg"
                    >
                        <h3>GIVE YOUR OPINION ON THE GAME YOU JUST PLAYED</h3>
                        <img src={explainAddReview} alt="add game review" />
                    </div>
                    <div
                        id=""
                        className="home-explain-case home-explain-case-horizon"
                    >
                        <h3>FOLLOW OR MAKE FRIENDS</h3>
                        <img src={explainFollow} alt="add game review" />
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Home;
