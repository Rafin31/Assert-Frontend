import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext.jsx";
import { claimDailyReward, userData } from "../../Services/userService.jsx";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { toast } from "react-toastify";
import NotificationModal from "../../utils/NotificationModal.jsx";
import { clearNotifications } from "../../redux/notification/notificationSlice.js";

dayjs.extend(duration);

const navLinks = [
    { name: "Technology", path: "/technology" },
    { name: "Politics", path: "/politics" },
    { name: "Sports", path: "/sports" },
    { name: "Thread", path: "/thread" },
];

export default function Header({ refreshBalance, refreshKey }) {
    const dispatch = useDispatch();
    const unreadCount = useSelector((state) => state.notifications.unreadCount);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [tokenBalance, setTokenBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState(null);
    const [isClaimable, setIsClaimable] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const userInitials = user?.userName?.slice(0, 2).toUpperCase() || "U";

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!user) {
            setTokenBalance(null); setCountdown(null); setIsClaimable(false); setLoading(false);
            return;
        }
        let isMounted = true;
        const fetchUserData = async () => {
            try {
                if (isMounted) setLoading(true);
                const response = await userData(user.id);
                if (!isMounted) return;
                setTokenBalance(response.data.user.tokenBalance);
                if (response.data.user?.lastLoginReward) {
                    const nextClaimTime = dayjs(response.data.user.lastLoginReward).add(24, "hour");
                    const now = dayjs();
                    if (now.isAfter(nextClaimTime)) { setIsClaimable(true); setCountdown(0); }
                    else { setCountdown(nextClaimTime.diff(now, "second")); setIsClaimable(false); }
                } else { setIsClaimable(true); setCountdown(0); }
            } catch { /* silent */ }
            finally { if (isMounted) setLoading(false); }
        };
        fetchUserData();
        return () => { isMounted = false; };
    }, [user, refreshKey]);

    useEffect(() => {
        if (countdown === null || countdown <= 0) return;
        const interval = setInterval(() => setCountdown(p => p > 0 ? p - 1 : 0), 1000);
        return () => clearInterval(interval);
    }, [countdown]);

    const handleClaimReward = async () => {
        try {
            setLoading(true);
            const response = await claimDailyReward({ email: user.email });
            setTokenBalance(response.data.newBalance);
            refreshBalance();
            setCountdown(86400);
            setIsClaimable(false);
            toast.success(response?.data?.message || "Daily reward claimed!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to claim reward.");
        } finally { setLoading(false); }
    };

    const handleLogout = () => { logout(); navigate("/"); };

    const handleOpenNotifications = () => {
        const dialog = document.getElementById("notification_modal");
        if (!dialog) return;
        dialog.showModal();
        dialog.addEventListener("close", () => dispatch(clearNotifications(user?.id)), { once: true });
    };

    return (
        <>
            <header className={`sticky top-0 z-[999] bg-white transition-all duration-300 ${scrolled ? 'shadow-[0_2px_20px_rgba(0,0,0,0.08)]' : 'border-b border-gray-100'}`}>
                <div className="max-w-[1450px] mx-auto px-4 h-16 flex items-center justify-between gap-4">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 shrink-0">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-md shadow-violet-200">
                            <span className="text-white font-black text-sm">A</span>
                        </div>
                        <span className="font-black text-xl tracking-tight gradient-text">ASSERT</span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden lg:flex items-center gap-0.5">
                        {navLinks.map(link => (
                            <Link key={link.path} to={link.path}
                                className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-500 hover:text-violet-700 hover:bg-violet-50 transition-all">
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        {loading && user ? (
                            <div className="h-8 w-28 bg-gray-100 rounded-lg animate-pulse" />
                        ) : user ? (
                            <>
                                {/* Token + claim */}
                                <div className="hidden md:flex items-center gap-2">
                                    <div className="token-chip">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {tokenBalance ?? 0} AT
                                    </div>
                                    {isClaimable ? (
                                        <button onClick={handleClaimReward} disabled={loading} className="btn-assert-orange text-xs">
                                            Claim Reward
                                        </button>
                                    ) : countdown > 0 ? (
                                        <div className="text-center hidden xl:block">
                                            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Next claim</div>
                                            <div className="text-xs text-violet-600 font-mono font-bold tabular-nums">
                                                {dayjs.duration(countdown * 1000).format("HH:mm:ss")}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>

                                {/* Create dropdown */}
                                <div className="dropdown dropdown-end hidden sm:block">
                                    <button tabIndex={0} className="btn-assert text-sm">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                        Create
                                    </button>
                                    <ul tabIndex={0} className="dropdown-content z-50 menu p-1.5 mt-2 w-44 rounded-2xl bg-white shadow-xl shadow-slate-200/80 border border-gray-100">
                                        {[
                                            { name: "Query", path: "/createquery" },
                                            { name: "Debate", path: "/createdebate" },
                                            { name: "Prediction", path: "/createprediction" },
                                            { name: "Poll", path: "/createpoll" },
                                        ].map(l => (
                                            <li key={l.path}>
                                                <Link to={l.path} className="text-sm text-slate-600 hover:text-violet-700 hover:bg-violet-50 rounded-xl">{l.name}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Profile avatar dropdown */}
                                <div className="dropdown dropdown-end">
                                    <button tabIndex={0} className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-violet-200 hover:shadow-lg transition-shadow">
                                        {userInitials}
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center text-white font-black">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </button>
                                    <div tabIndex={0} className="dropdown-content z-50 mt-2 w-56 rounded-2xl bg-white shadow-xl shadow-slate-200/80 border border-gray-100 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50">
                                            <div className="font-semibold text-slate-800 text-sm">{user.userName}</div>
                                            <div className="text-xs text-slate-500 truncate">{user.email}</div>
                                        </div>

                                        {/* Mobile claim section */}
                                        <div className="px-3 py-2 md:hidden border-b border-gray-100">
                                            <div className="token-chip w-full justify-center mb-2">{tokenBalance ?? 0} AT</div>
                                            {isClaimable ? (
                                                <button onClick={handleClaimReward} className="btn-assert-orange w-full text-xs">Claim Daily Reward</button>
                                            ) : countdown > 0 ? (
                                                <div className="text-center text-xs text-slate-500">Next in <span className="font-mono text-violet-600 font-bold">{dayjs.duration(countdown * 1000).format("HH:mm:ss")}</span></div>
                                            ) : null}
                                        </div>

                                        <div className="p-1.5 space-y-0.5">
                                            <Link to="/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-600 hover:text-violet-700 hover:bg-violet-50 transition-colors">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                                                Dashboard
                                            </Link>
                                            <button onClick={handleOpenNotifications} className="flex items-center justify-between gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-slate-600 hover:text-violet-700 hover:bg-violet-50 transition-colors">
                                                <span className="flex items-center gap-2.5">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 01-6 0m6 0H9" /></svg>
                                                    Notifications
                                                </span>
                                                {unreadCount > 0 && <span className="text-xs bg-red-100 text-red-600 rounded-full px-1.5 py-0.5 font-semibold">{unreadCount}</span>}
                                            </button>
                                        </div>

                                        <div className="p-1.5 border-t border-gray-100">
                                            <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-violet-700 transition-colors px-3 py-1.5">Login</Link>
                                <Link to="/signup" className="btn-assert text-sm">Sign Up</Link>
                            </div>
                        )}

                        {/* Mobile hamburger */}
                        <button className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-gray-100" onClick={() => setMobileOpen(p => !p)}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                {mobileOpen
                                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 shadow-lg">
                        {navLinks.map(l => (
                            <Link key={l.path} to={l.path} onClick={() => setMobileOpen(false)}
                                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-violet-700 hover:bg-violet-50">
                                {l.name}
                            </Link>
                        ))}
                        {user && (
                            <>
                                <div className="h-px bg-gray-100 my-2" />
                                {["/createquery", "/createdebate", "/createprediction", "/createpoll"].map((path, i) => (
                                    <Link key={path} to={path} onClick={() => setMobileOpen(false)}
                                        className="block px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-violet-700 hover:bg-violet-50">
                                        Create {["Query", "Debate", "Prediction", "Poll"][i]}
                                    </Link>
                                ))}
                            </>
                        )}
                    </div>
                )}
            </header>
            <NotificationModal id="notification_modal" unreadCount={unreadCount} />
        </>
    );
}
