import { Link } from "react-router-dom";

interface NavLinkProps {
    route: string;
    text: string;
}

function NavLink( {route, text}:NavLinkProps ) {
    return (
        <div>
            <Link to={route}>
                <p>{text}</p>
            </Link>
        </div>
    );
}

export default NavLink;