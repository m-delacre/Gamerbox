import { useState } from "react";
import "./Loginform.css";
import GamerboxApi from "../../services/gamerbox_api";
import logo from '../../../public/gamerbox_logo.png'

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const login = async () => {
        try {
            const token = await GamerboxApi.login(email, password);

            if (token) {
                console.log("We have a token! : ", token);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const onButtonClick = () => {
        setEmailError("");
        setPasswordError("");

        if ("" === email) {
            setEmailError("Please enter your email");
            return;
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
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

        // Authentication calls will be made here...
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
                    value={email}
                    placeholder="Enter your email here"
                    onChange={(ev) => setEmail(ev.target.value)}
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
