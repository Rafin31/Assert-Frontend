import React from "react";
import { useAuth } from "../../Context/AuthContext.jsx";
import { userData } from "../../Services/userService.jsx";
import ServerApi from "../../api/ServerAPI";
import Skeleton from "../../utils/skeleton.jsx";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

const statCards = (tokenData, predictionData) => [
    {
        label: "AT Token Balance",
        value: tokenData ?? "—",
        sub: "Blockchain wallet",
        color: "from-violet-500 to-purple-600",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
        ),
    },
    {
        label: "Total Predictions",
        value: predictionData?.predictionCount ?? "—",
        sub: "All time",
        color: "from-blue-500 to-indigo-600",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
        ),
    },
    {
        label: "Win / Loss",
        value: `${predictionData?.predictionWinCount ?? 0} / ${predictionData?.predictionLoseCount ?? 0}`,
        sub: `${predictionData?.predictionPendingCount ?? 0} pending`,
        color: "from-emerald-500 to-teal-600",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
    },
    {
        label: "Interactions",
        value: "25",
        sub: "Likes & comments",
        color: "from-orange-500 to-amber-500",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
    },
    {
        label: "Tasks Completed",
        value: "15",
        sub: "This month",
        color: "from-pink-500 to-rose-500",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
];

export default function Overview() {
    const { user } = useAuth();

    const { data: tokenData, isLoading: tokenLoading, isError: tokenError } = useQuery({
        queryKey: ["tokenBalance", user?.id],
        queryFn: async () => {
            if (!user?.id) return null;
            const res = await userData(user.id);
            return res.data.user.tokenBalance;
        },
        enabled: !!user?.id,
    });

    const { data: predictionData, isLoading: predictionLoading, isError: predictionError } = useQuery({
        queryKey: ["predictionStats", user?.id],
        queryFn: async () => {
            const res = await ServerApi.get(`/prediction/getPredictionCount/${user.id}`);
            return res.data;
        },
        enabled: !!user?.id,
    });

    if (tokenLoading || predictionLoading) return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mt-4">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-36 w-full rounded-2xl" />)}
        </div>
    );

    if (tokenError || predictionError) return (
        <p className="text-center text-red-500 py-8">Failed to load data.</p>
    );

    const cards = statCards(tokenData, predictionData);

    return (
        <div className="w-full py-2">
            <div className="mb-6">
                <h1 className="text-2xl font-black text-slate-900">Overview</h1>
                <p className="text-slate-500 text-sm mt-0.5">Welcome back, <span className="font-semibold text-violet-600">{user?.userName}</span></p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
                        className="assert-card p-5 flex flex-col gap-3"
                    >
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-sm`}>
                            {card.icon}
                        </div>
                        <div>
                            <p className="text-2xl font-black text-slate-900">{card.value}</p>
                            <p className="text-xs font-semibold text-slate-600 mt-0.5">{card.label}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
