import { Link } from "react-router-dom";

const navLinks = [
    { name: "Market", path: "/market" },
    { name: "Sports", path: "/sports" },
    { name: "Reward", path: "/reward" },
];

export default function Header() {
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <Link to={'/'} className="text-xl px-[10px] font-bold">Assert</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {
                        navLinks.map((link) => {
                            return <li>
                                <Link to={link.path}>{link.name}</Link>
                            </li>
                        })
                    }
                </ul>
            </div>
            <div className="navbar-end">
                <Link to={'/login'} className="btn">Login</Link>
            </div>
        </div>
    );
}