import Header from "../../components/header/Header";
import "./Home.css";
import { useSelector, useDispatch } from "react-redux";
import { setEmail, selectEmail  } from "../../redux/userSlice";
import { useState } from "react";

function Home() {
    const email = useSelector(selectEmail);
    const [input, setInput] = useState("");
    const dispatch = useDispatch();

    function changeMail(input: string) {
        dispatch(setEmail(input))
    }

    return (
        <div className="homepage">
            <Header />
            <main>
                <section className="home-banner">
                    <p>Welcome to Gamerbox👾</p>
                </section>
                <p>le mail: {email}</p>
                <input
                    type="text"
                    onChange={(e) => setInput(e.target.value)}
                />
                <button onClick={(e)=>{e.preventDefault(); changeMail(input)}}>Click</button>
                <section className="home-explain">
                    <p>explain how the site works</p>
                </section>
            </main>
        </div>
    );
}

export default Home;
