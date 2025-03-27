import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext.jsx"; // Import auth context
import { claimDailyReward, userData } from "../../Services/userService.jsx"; // Import API function
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { toast } from "react-toastify";

import coin from "../../assets/coin.png";

dayjs.extend(duration);

const navLinks = [
    { name: "Social", path: "/market" },
    { name: "Sports", path: "/sports" },
    { name: "Reward", path: "/reward" },
];

export default function Header({ refreshBalance }) {
    const { user, logout } = useAuth();
    const [tokenBalance, setTokenBalance] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const [countdown, setCountdown] = useState(null);
    const [isClaimable, setIsClaimable] = useState(false);

    // Extract user's initials
    const userInitials = user?.userName?.slice(0, 2).toUpperCase() || "U";

    // Fetch User's Token Balance & Last Claim Time
    const fetchUserData = async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await userData(user.id);
            setTokenBalance(response.data.user.totalToken);
            refreshBalance()

            // Check last claim time
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
            toast.error("Failed to fetch user data.");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUserData();
    }, [user]); // Fetch on login

    // Countdown Timer
    useEffect(() => {
        if (countdown === null || countdown <= 0) return;

        const interval = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [countdown]);

    // Handle Claim Daily Reward
    const handleClaimReward = async () => {
        try {
            setLoading(true);
            const response = await claimDailyReward({ walletAddress: user.walletAddress });

            // **Update Token Balance Immediately**
            setTokenBalance(response.newBalance);

            // **Re-fetch user data to ensure frontend state is correct**
            fetchUserData();

            setCountdown(86400); // Set 24-hour timer
            setIsClaimable(false);
            toast.success(response.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to claim reward.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[1450px] mx-auto">
            <div className="navbar bg-base-100 sticky top-0 z-[999]">
                <div className="navbar-start">
                    <Link to="/" className="text-xl px-[10px] font-bold">
                        Assert
                    </Link>
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

                <div className="navbar-end flex items-center gap-4">
                    {/* Show Loading State Before User Data is Fetched */}
                    {loading ? (
                        <span className="loading loading-spinner loading-lg"></span>
                    ) : (
                        user && (
                            <div className="flex items-center gap-3">
                                {/* Token Balance Display */}
                                <div className="badge badge-lg badge-success">
                                    <img src={coin} alt="coin" className="w-[20px]" />
                                    {tokenBalance} AT Tokens
                                </div>

                                {/* Claim Daily Reward Button */}
                                {isClaimable ? (
                                    <button
                                        className="btn btn-accent btn-sm"
                                        onClick={handleClaimReward}
                                        disabled={loading}
                                    >
                                        Claim Daily Reward
                                    </button>
                                ) : countdown > 0 ? (
                                    <span className="text-sm text-gray-500">
                                        Next Claim: {dayjs.duration(countdown * 1000).format("HH:mm:ss")}
                                    </span>
                                ) : null}

                                {/* Profile Dropdown */}
                                <div className="dropdown dropdown-end">
                                    <div tabIndex={0} role="button" className="btn btn-accent btn-circle avatar avatar-placeholder">
                                        <div className="bg-neutral text-neutral-content w-10 h-10 rounded-full flex items-center justify-center">
                                            <span className="text-lg font-bold">{userInitials}</span>
                                        </div>
                                    </div>
                                    <ul tabIndex={0} className="menu menu-lg dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                                        <li>
                                            <Link to="/dashboard">Dashboard</Link>
                                        </li>
                                        <li>
                                            <button onClick={logout}>Logout</button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )
                    )}

                    {!user && <Link to="/login" className="btn btn-accent w-[150px]">Login</Link>}
                </div>
            </div>
        </div>
    );
}
