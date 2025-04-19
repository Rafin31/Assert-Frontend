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
    { name: "Reward", path: "/reward" },
];

export default function Header({ refreshBalance, refreshKey }) {

    const dispatch = useDispatch();

    const unreadCount = useSelector(
        (state) => state.notifications.unreadCount
    );


    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [tokenBalance, setTokenBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState(null);
    const [isClaimable, setIsClaimable] = useState(false);
    const [scrolled, setScrolled] = useState(false);


    const userInitials = user?.userName?.slice(0, 2).toUpperCase() || "U";

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 0);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!user) {
            setTokenBalance(null);
            setCountdown(null);
            setIsClaimable(false);
            setLoading(false);
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
                    const lastClaim = dayjs(response.data.user.lastLoginReward);
                    const nextClaimTime = lastClaim.add(24, "hour");
                    const now = dayjs();
                    if (now.isAfter(nextClaimTime)) {
                        setIsClaimable(true);
                        setCountdown(0);
                    } else {
                        setCountdown(nextClaimTime.diff(now, "second"));
                        setIsClaimable(false);
                    }
                } else {
                    setIsClaimable(true);
                    setCountdown(0);
                }
            } catch (error) {
                if (isMounted) toast.error("Failed to fetch user data." + error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchUserData();
        return () => (isMounted = false);
    }, [user, refreshKey]);

    useEffect(() => {
        if (countdown === null || countdown <= 0) return;
        const interval = setInterval(() => setCountdown(prev => prev > 0 ? prev - 1 : 0), 1000);
        return () => clearInterval(interval);
    }, [countdown]);

    const handleClaimReward = async () => {
        try {
            setLoading(true);
            const response = await claimDailyReward({ email: user.email });
            setTokenBalance(response.newBalance);
            refreshBalance();
            setCountdown(86400);
            setIsClaimable(false);
            toast.success(response?.data?.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to claim reward.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleOpenNotifications = () => {
        const dialog = document.getElementById("notification_modal");
        if (!dialog) return;
        dialog.showModal();
        dialog.addEventListener(
            "close",
            () => {
                dispatch(clearNotifications());
            },
            { once: true }
        );
    };

    return (
        <div className={`navbar bg-base-100 sticky top-0 z-[999] transition-shadow duration-300 ${scrolled ? 'shadow-lg' : ''}`}>
            <div className="navbar max-w-[1450px] mx-auto">
                <div className="navbar-start">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </label>
                        <ul tabIndex={0} className="menu menu-md dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            {navLinks.map((link, index) => (
                                <li key={index}><Link to={link.path}>{link.name}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <Link to="/" className="text-2xl px-[10px] font-bold">Assert</Link>
                </div>

                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {navLinks.map((link, index) => (
                            <li key={index}><Link to={link.path}>{link.name}</Link></li>
                        ))}
                    </ul>
                </div>

                <div className="navbar-end flex items-center gap-1">
                    {loading ? (
                        <div className="skeleton h-5 w-[40%]"></div>
                    ) : user && (
                        <div className="flex items-center gap-3">
                            {/* Create Dropdown */}
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button">
                                    <div className="text-black border-none cursor-pointer">
                                        <span className="text-sm font-bold text-[#e66c6c] tooltip tooltip-bottom" data-tip="ASSERTIFY">CREATE</span>
                                    </div>
                                </div>
                                <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow lg:menu-md">
                                    <li><Link to="/createquery">Query</Link></li>
                                    <li><Link to="/createdebate">Debate</Link></li>
                                    <li><Link to="/createprediction">Prediction</Link></li>
                                    <li><Link to="/createpoll">Poll</Link></li>
                                </ul>
                            </div>

                            {/* Token */}
                            <div className="items-center gap-2 lg:flex hidden">
                                <div className="flex items-center bg-base-200 px-3 py-1 rounded-lg shadow-sm">
                                    <span className="text-sm font-medium text-gray-700 mr-2">AT</span>
                                    <span className="badge badge-neutral text-sm px-2">{tokenBalance}</span>
                                </div>
                                <div className="text-right">
                                    {isClaimable ? (
                                        <button className="btn-grad-orange text-xs cursor-pointer" onClick={handleClaimReward} disabled={loading}>Claim Reward</button>
                                    ) : countdown > 0 ? (
                                        <div>
                                            <span className="text-[12px] font-extrabold text-gray-600">Next claim</span>
                                            <div className="text-[13px] text-gray-500 font-mono leading-tight">
                                                {dayjs.duration(countdown * 1000).format("HH:mm:ss")}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            <div className="divider divider-horizontal m-0 p-0"></div>

                            {/* Profile Dropdown */}
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-accent btn-circle avatar avatar-placeholder indicator">
                                    {unreadCount > 0 && (
                                        <span className="indicator-item badge badge-sm badge-error text-xs text-white">{unreadCount}</span>
                                    )}
                                    <div className="bg-neutral text-neutral-content w-10 h-10 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold">{userInitials}</span>
                                    </div>
                                </div>
                                <ul className="menu menu-lg dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                                    <li><Link to="/dashboard">Dashboard</Link></li>
                                    <li>
                                        <button onClick={handleOpenNotifications}>
                                            Notifications
                                            {unreadCount > 0 && (
                                                <span className="badge badge-xs badge-primary text-xs">{unreadCount}</span>
                                            )}
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={handleLogout}>Logout</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                    {!user && <Link to="/login" className="font-bold">Login</Link>}
                    {!user && <div className="divider divider-horizontal m-0 p-0"></div>}
                    {!user && <Link to="/signUp" className="btn-grad-blue lg:btn-md">Sign Up</Link>}
                </div>
            </div>
            <NotificationModal id="notification_modal" unreadCount={unreadCount} />
        </div>
    );
}
