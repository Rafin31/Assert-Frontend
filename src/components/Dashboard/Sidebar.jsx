// src/components/Dashboard/Sidebar.jsx – fixed/ sticky sidebar that works in and out of drawer

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const links = [
    { name: "Overview", path: "/dashboard/overview" },
    { name: "My Results", path: "/dashboard/results" },
    { name: "Activity", path: "/dashboard/activity" },
    // { name: "My Predictions", path: "/dashboard/predictions" },
    // { name: "Token Wallet", path: "/dashboard/wallet" },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Close DaisyUI drawer on mobile
    const closeDrawer = () => {
        const cb = document.getElementById("dash-drawer");
        if (cb) cb.checked = false;
    };

    const handleLogout = () => {
        logout();
        closeDrawer();
        navigate("/login");
    };

    return (
        <div className="w-50 bg-[#13242a] text-white p-4">
            <h2 className="text-xl font-bold mb-6">
                <Link to="/" onClick={closeDrawer}>
                    ASSERT
                </Link>
            </h2>

            <nav className="flex flex-col space-y-4">
                {links.map((l) => (
                    <NavLink
                        key={l.name}
                        to={l.path}
                        onClick={closeDrawer}
                        className={({ isActive }) =>
                            `px-4 py-2 rounded hover:bg-accent/80 ${isActive ? "bg-accent" : ""}`
                        }
                    >
                        {l.name}
                    </NavLink>
                ))}

                <button
                    onClick={handleLogout}
                    className="text-left px-4 py-2 rounded hover:bg-accent text-white mt-4"
                >
                    Logout
                </button>
            </nav>
        </div>
    );
}
