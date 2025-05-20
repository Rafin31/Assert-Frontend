import React from "react";
import { useAuth } from "../../Context/AuthContext.jsx";
import { userData } from "../../Services/userService.jsx";
import ServerApi from "../../api/ServerAPI";
import Skeleton from "../../utils/skeleton.jsx";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

export default function Overview() {
    const { user } = useAuth();

    const { data: tokenData, isLoading: tokenLoading, isError: tokenError } = useQuery({
        queryKey: ["tokenBalance", user?.id],
        queryFn: async () => {
            if (!user?.id) return null;
            const res = await userData(user.id);
            return res.data.user.tokenBalance;
        },
        enabled: !!user?.id, //run when user id exist 
    });

    const { data: predictionData, isLoading: predictionLoading, isError: predictionError } = useQuery({
        queryKey: ["predictionStats", user?.id],
        queryFn: async () => {
            const res = await ServerApi.get(`/prediction/getPredictionCount/${user.id}`);
            return res.data;
        },
        enabled: !!user?.id,
    });

    if (tokenLoading || predictionLoading) return <div className="mt-10 max-w-[1450px] min-h-[50vh] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, idx) => (
            <div key={idx} className="skeleton h-[260px] w-full rounded-sm" />
        ))}
    </div>

    if (tokenError || predictionError) return <p className="text-center text-red-500">Failed to load data.</p>;

    return (
        <div className="w-full px-6 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full">

                {/* Tokens */}
                <motion.div
                    key={1}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 * 0.1, duration: 0.4, ease: "easeOut" }}
                >
                    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between h-full">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Tokens</h3>
                        <p className="text-4xl font-bold text-[#264653]">{tokenData}</p>
                    </div>
                </motion.div>
                <motion.div
                    key={2}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2 * 0.1, duration: 0.4, ease: "easeOut" }}
                >

                    {/* Total Predictions */}
                    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between h-full">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Total Predictions</h3>
                        <p className="text-4xl font-bold text-[#264653]">{predictionData?.predictionCount}</p>
                    </div>
                </motion.div>



                <motion.div
                    key={3}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3 * 0.1, duration: 0.4, ease: "easeOut" }}
                >
                    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between h-full">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Win/Loss Record</h3>
                        <p className="text-4xl font-bold text-[#2A9D8F]">
                            {predictionData?.predictionWinCount}/{predictionData?.predictionLoseCount}
                        </p>
                        <span className="text-xs text-gray-400 mt-1">Pending: {predictionData?.predictionPendingCount}</span>
                    </div>
                </motion.div>


                <motion.div
                    key={4}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 4 * 0.1, duration: 0.4, ease: "easeOut" }}
                >

                    {/* Interactions */}
                    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between h-full">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Interactions</h3>
                        <p className="text-4xl font-bold text-[#E76F51]">25</p>
                        <span className="text-xs text-gray-400 mt-1">Like: Comment:</span>
                    </div>
                </motion.div>

                <motion.div
                    key={5}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 5 * 0.1, duration: 0.4, ease: "easeOut" }}
                >
                    {/* Tasks Completed */}
                    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between h-full">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Tasks Completed</h3>
                        <p className="text-4xl font-bold text-[#E9C46A]">15</p>
                    </div>
                </motion.div>

            </div>
        </div>


    );
}
