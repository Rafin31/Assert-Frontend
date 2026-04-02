import React from 'react';
import { useQuery } from '@tanstack/react-query';
import ServerApi from '../../api/ServerAPI';
import { useAuth } from '../../Context/AuthContext';
import { userData } from '../../Services/userService';

export default function Reward() {
    const { user } = useAuth();

    const { data: leaderboard = [], isLoading: loadingLeaderboard } = useQuery({
        queryKey: ['leaderboard'],
        queryFn: async () => {
            const res = await ServerApi.get('/users/leaderboard');
            return res.data.data || [];
        },
    });

    const { data: myData, isLoading: loadingMe } = useQuery({
        queryKey: ['myRewardData', user?.id],
        queryFn: async () => {
            const res = await userData(user.id);
            return res.data.user;
        },
        enabled: !!user?.id,
    });

    const myRank = leaderboard.findIndex((u) => u._id === user?.id) + 1;

    const medalColor = (rank) => {
        if (rank === 1) return 'text-yellow-500';
        if (rank === 2) return 'text-gray-400';
        if (rank === 3) return 'text-amber-600';
        return 'text-gray-500';
    };

    return (
        <div className="max-w-[1450px] mx-auto px-5 py-10">
            <h1 className="text-3xl font-bold text-center mb-2">Leaderboard</h1>
            <p className="text-center text-gray-500 mb-10 text-sm">Top predictors ranked by token balance</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* My Stats Card */}
                {user && (
                    <div className="lg:col-span-1">
                        <div className="bg-[#13242a] text-white rounded-2xl shadow-lg p-6 flex flex-col gap-3">
                            <p className="text-sm uppercase tracking-widest text-gray-400">My Stats</p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-bold text-lg">
                                    {user.userName?.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">{user.userName}</p>
                                    <p className="text-gray-400 text-sm">{user.email}</p>
                                </div>
                            </div>
                            {loadingMe ? (
                                <div className="skeleton h-8 w-full rounded" />
                            ) : (
                                <div className="flex justify-between mt-2">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">{myData?.tokenBalance ?? 0}</p>
                                        <p className="text-xs text-gray-400">AT Tokens</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">#{myRank || '—'}</p>
                                        <p className="text-xs text-gray-400">Rank</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* How to earn */}
                        <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
                            <h2 className="text-lg font-semibold text-[#264653] mb-3">How to Earn Tokens</h2>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex gap-2">
                                    <span className="text-green-500 font-bold">+</span>
                                    <span>Claim your daily login reward</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-green-500 font-bold">+10</span>
                                    <span>Correctly predict a match winner</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-green-500 font-bold">+</span>
                                    <span>Win a prediction poll</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Leaderboard Table */}
                <div className={user ? 'lg:col-span-2' : 'lg:col-span-3'}>
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                        {loadingLeaderboard ? (
                            <div className="p-6 space-y-3">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="skeleton h-12 w-full rounded-lg" />
                                ))}
                            </div>
                        ) : leaderboard.length > 0 ? (
                            <table className="table w-full text-sm">
                                <thead className="bg-[#13242a] text-white">
                                    <tr>
                                        <th className="w-16">Rank</th>
                                        <th>User</th>
                                        <th className="text-right">Tokens</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((u, i) => {
                                        const rank = i + 1;
                                        const isMe = u._id === user?.id;
                                        return (
                                            <tr key={u._id} className={`hover:bg-gray-50 ${isMe ? 'bg-accent/10 font-semibold' : ''}`}>
                                                <td>
                                                    <span className={`font-bold text-base ${medalColor(rank)}`}>
                                                        {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : `#${rank}`}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                            {u.userName?.slice(0, 2).toUpperCase()}
                                                        </div>
                                                        <span>{u.userName} {isMe && <span className="badge badge-xs badge-accent ml-1">You</span>}</span>
                                                    </div>
                                                </td>
                                                <td className="text-right font-bold text-[#264653]">{u.tokenBalance}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center text-gray-400 py-10">No leaderboard data available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
