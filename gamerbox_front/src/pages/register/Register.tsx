import Header from "../../components/header/Header";
import RegisterForm from "../../components/register_form/RegisterForm";

export default function Register() {
    return (
        <div>
            <Header />
            <main className="loginpage">
                <RegisterForm />
            </main>
        </div>
    );
}
