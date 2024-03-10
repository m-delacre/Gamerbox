import { useRouteError } from "react-router-dom";
import "./error_page.css";
import Header from "../../components/header/Header";

function ErrorPage() {
    const error: any = useRouteError();

    return (
        <div id="error-page">
            <Header />
            <div className="errorPage">
                <h1>Oops!</h1>
                <p>Sorry, an unexpected error has occurred.</p>
                <p>
                    <i>{error.statusText || error.message}</i>
                </p>
            </div>
        </div>
    );
}

export default ErrorPage;
