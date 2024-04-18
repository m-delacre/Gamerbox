import Header from "../../components/header/Header";
import LoginForm from "../../components/login_form/LoginForm";
import "./LoginPage.css";

function LoginPage() {
    return (
        <div>
            <Header />
            <main className="loginpage">
                <LoginForm />
            </main>
        </div>
    );
}

export default LoginPage;
