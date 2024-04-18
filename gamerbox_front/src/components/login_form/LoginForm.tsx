import { useState } from "react";
import "./Loginform.css";
import GamerboxApi from "../../services/gamerbox_api";
import logo from '../../../public/gamerbox_logo.png';
import { useDispatch } from "react-redux";
import {
    setId,
    setEmail,
    setPseudonym,
    setToken,
    setConnected,
} from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";

type Token = {
    token: string
}

type UserInfo = {
    id: number,
    email: string,
    pseudonym: string,
    token: string
}

function LoginForm() {
    const [formEmail, setFormEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getUserInfo = async (tokenJWT: string) => {
        try {
            const res: UserInfo | null = await GamerboxApi.getLoggedUserInfo(tokenJWT);

            if (res) {
                dispatch(setEmail(res.email));
                dispatch(setId(res.id));
                dispatch(setPseudonym(res.pseudonym));
                dispatch(setConnected());
                navigate('/');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const login = async () => {
        try {
            const res: Token | null = await GamerboxApi.login(formEmail, password);

            if (res) {
                const newToken: string = res.token;
                setToken(newToken);
                dispatch(setToken(newToken));
                getUserInfo(res.token);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const onButtonClick = () => {
        setEmailError("");
        setPasswordError("");

        if ("" === formEmail) {
            setEmailError("Please enter your email");
            return;
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formEmail)) {
            setEmailError("Please enter a valid email");
            return;
        }

        if ("" === password) {
            setPasswordError("Please enter a password");
            return;
        }

        if (password.length < 5) {
            setPasswordError("The password must be 8 characters or longer");
            return;
        }

        login();
    };

    return (
        <div className={"mainContainer"}>
            <div className={"titleContainer"}>
                <img src={logo} alt="gamerbox logo"/>
                <div>Login</div>
                <img src={logo} alt="gamerbox logo"/>
            </div>
            <br />
            <div className={"inputContainer"}>
                <input
                    value={formEmail}
                    placeholder="Enter your email here"
                    onChange={(ev) => setFormEmail(ev.target.value)}
                    className={"inputBox"}
                />
                <label className="errorLabel">{emailError}</label>
            </div>
            <br />
            <div className={"inputContainer"}>
                <input
                    value={password}
                    placeholder="Enter your password here"
                    onChange={(ev) => setPassword(ev.target.value)}
                    className={"inputBox"}
                    type="password"
                />
                <label className="errorLabel">{passwordError}</label>
            </div>
            <br />
            <div className={"inputContainer"}>
                <button className="inputButton" onClick={onButtonClick}>
                    Login
                </button>
            </div>
        </div>
    );
}

export default LoginForm;
