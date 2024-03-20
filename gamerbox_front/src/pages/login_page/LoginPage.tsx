import Header from "../../components/header/Header";
import LoginForm from "../../components/login_form/LoginForm";
import "./LoginPage.css";
import { useSelector } from "react-redux";
import { selectEmail  } from "../../redux/userSlice";

function LoginPage() {
    const email = useSelector(selectEmail);
    return (
        <div>
            <Header />
            <main className="loginpage">
                <LoginForm />
                <p>{email}</p>
            </main>
        </div>
    );
}

export default LoginPage;
