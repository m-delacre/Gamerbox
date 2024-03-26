import Header from "../../components/header/Header";
import "./Home.css";
import { useSelector, useDispatch } from "react-redux";
import {
    setId,
    setEmail,
    setPseudonym,
    setToken,
    selectEmail,
    selectPseudonym,
    selectToken,
    selectUserId,
} from "../../redux/userSlice";
import { useState } from "react";

type TypePayload = {
    id: number,
    email: string,
    pseudo: string,
    token: string
}

function Home() {
    const userId = useSelector(selectUserId);
    const email = useSelector(selectEmail);
    const pseudo = useSelector(selectPseudonym);
    const token = useSelector(selectToken);

    const [inputId, setInputId] = useState<number>(0);
    const [inputEmail, setInputEmail] = useState("");
    const [inputPseudo, setInputPseudo] = useState("");
    const [inputToken, setInputToken] = useState("");

    const dispatch = useDispatch();

    function changeMail(input: string) {
        dispatch(setEmail(input));
    }

    function changeData({id, email, pseudo, token}: TypePayload) {
        dispatch(setId(id));
        dispatch(setEmail(email));
        dispatch(setPseudonym(pseudo));
        dispatch(setToken(token));
    }

    return (
        <div className="homepage">
            <Header />
            <main>
                <section className="home-banner">
                    <p>Welcome to Gamerbox👾</p>
                </section>
                <p>le id: {userId}</p>
                <p>le mail: {email}</p>
                <p>le pseudo: {pseudo}</p>
                <p>le token: {token}</p>

                <input
                    type="text"
                    onChange={(e) => setInputId(parseInt(e.target.value))}
                    placeholder="id"
                />

                <input
                    type="text"
                    onChange={(e) => setInputEmail(e.target.value)}
                    placeholder="email"
                />

                <input
                    type="text"
                    onChange={(e) => setInputPseudo(e.target.value)}
                    placeholder="pseudo"
                />

                <input
                    type="text"
                    onChange={(e) => setInputToken(e.target.value)}
                    placeholder="token"
                />

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        changeMail(inputEmail);
                    }}
                >
                    Click mail
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        changeData({id: inputId, email: inputEmail, pseudo: inputPseudo, token: inputToken});
                    }}
                >
                    CHANGE INFO
                </button>
                <section className="home-explain">
                    <p>explain how the site works</p>
                </section>
            </main>
        </div>
    );
}

export default Home;
