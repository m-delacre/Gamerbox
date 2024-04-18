import { useState } from "react";
import GamerboxApi from "../../services/gamerbox_api";
import logo from '../../../public/gamerbox_logo.png';
import { useNavigate } from "react-router-dom";
import "./registerFrom.css"

type RegisterInfo = {
    id: number,
    email: string,
    pseudonym: string,
    profilePicture: string
}

function RegisterForm() {
    const [email, setFormEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pseudonym, setPseudonym] = useState("");
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [pseudonymError, setPseudonymError] = useState("");
    const navigate = useNavigate();

    const register = async () => {
        try {
            const res: RegisterInfo | null = await GamerboxApi.register(email, password, pseudonym, profilePicture)
            console.log(res);
        } catch (error) {
            console.error(error);
        }
    };

    const onButtonClick = () => {
        setEmailError("");
        setPasswordError("");
        setPseudonymError("");

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

        if ("" === pseudonym ||pseudonym.length < 3) {
            setPasswordError("Please enter a pseudonym of 3 or more characters");
            return;
        }

        if (password.length < 5) {
            setPasswordError("The password must be 8 characters or longer");
            return;
        }

        register();
        navigate('/login');
    };

    const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const files = ev.target.files;
        if (files && files.length > 0) {
            setProfilePicture(files[0]);
        }
    };

    return (
        <div className={"mainContainer"}>
            <div className={"titleContainer"}>
                <img src={logo} alt="gamerbox logo"/>
                <div>Register</div>
                <img src={logo} alt="gamerbox logo"/>
            </div>
            <br />
            <div className={"inputContainer"}>
                <input
                    value={email}
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
                <input
                    value={pseudonym}
                    placeholder="Enter your pseudonym here"
                    onChange={(ev) => setPseudonym(ev.target.value)}
                    className={"inputBox"}
                />
                <label className="errorLabel">{pseudonymError}</label>
            </div>
            <br />
            <div className={"inputContainer register-fileUpload"}>
                <label>You can chose a profile picture 😎 :</label>
                <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                />
            </div>
            <br />
            <div className={"inputContainer"}>
                <button className="inputButton" onClick={onButtonClick}>
                    Register
                </button>
            </div>
        </div>
    );
}

export default RegisterForm;
