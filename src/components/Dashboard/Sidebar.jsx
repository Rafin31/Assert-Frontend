import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const links = [
    { name: "Overview", path: "/dashboard/overview", icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    )},
    { name: "My Results", path: "/dashboard/results", icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    )},
    { name: "My Predictions", path: "/dashboard/predictions", icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
    )},
    { name: "Token Wallet", path: "/dashboard/wallet", icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
    )},
    { name: "Activity", path: "/dashboard/activity", icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    )},
];

export default function Sidebar() {
    const navigate = useNavigate();
    const { logout } = useAuth();

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
        <div className="flex flex-col h-full p-5">
            {/* Logo */}
            <div className="mb-8 pt-2">
                <Link to="/" onClick={closeDrawer} className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-md shadow-violet-200">
                        <span className="text-white font-black text-sm">A</span>
                    </div>
                    <span className="font-black text-xl tracking-tight gradient-text">ASSERT</span>
                </Link>
            </div>

            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Menu</p>

            {/* Nav links */}
            <nav className="flex flex-col gap-1 flex-1">
                {links.map((l) => (
                    <NavLink
                        key={l.name}
                        to={l.path}
                        onClick={closeDrawer}
                        className={({ isActive }) =>
                            `sidebar-link${isActive ? " active" : ""}`
                        }
                    >
                        {l.icon}
                        {l.name}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>
        </div>
    );
}
