import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext.jsx"; // Import auth context

const navLinks = [
    { name: "Social", path: "/market" },
    { name: "Sports", path: "/sports" },
    { name: "Reward", path: "/reward" },
];

export default function Header() {
    const { user, logout } = useAuth(); // Get user info & logout function

    // Extract the first two letters of the user's name (default to "U" if no name found)
    const userInitials = user?.userName?.slice(0, 2).toUpperCase() || "U";

    return (
        <div className="max-w-[1450px] mx-auto">
            <div className="navbar bg-base-100 sticky top-0 z-[999]">
                <div className="navbar-start">
                    <Link to={'/'} className="text-xl px-[10px] font-bold">Assert</Link>
                </div>

                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {navLinks.map((link, index) => (
                            <li key={index}>
                                <Link to={link.path}>{link.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="navbar-end">
                    {/* If user is NOT logged in, show login button */}
                    {!user ? (
                        <Link to={'/login'} className="btn btn-accent w-[150px]">Login</Link>
                    ) : (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-accent btn-circle avatar avatar-placeholder">
                                <div className="bg-neutral text-neutral-content w-10 h-10 rounded-full flex items-center justify-center">
                                    <span className="text-lg font-bold">{userInitials}</span>
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-lg dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                                <li>
                                    <Link to="/dashboard">Dashboard</Link>
                                </li>
                                <li>
                                    <button onClick={logout}>Logout</button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
