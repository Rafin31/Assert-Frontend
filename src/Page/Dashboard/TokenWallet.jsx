import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../Context/AuthContext';
import { userData } from '../../Services/userService';
import dayjs from 'dayjs';

export default function TokenWallet() {
    const { user } = useAuth();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['walletData', user?.id],
        queryFn: async () => {
            const res = await userData(user.id);
            return res.data.user;
        },
        enabled: !!user?.id,
    });

    if (isLoading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
                <div className="skeleton h-32 w-full rounded-xl" />
                <div className="skeleton h-64 w-full rounded-xl" />
            </div>
        );
    }

    if (isError) {
        return <p className="text-center text-red-500 py-10">Failed to load wallet data.</p>;
    }

    const balance = data?.tokenBalance ?? 0;
    const lastReward = data?.lastLoginReward;
    const nextClaimTime = lastReward ? dayjs(lastReward).add(24, 'hour') : null;
    const canClaim = !nextClaimTime || dayjs().isAfter(nextClaimTime);

    const transactions = data?.tokenHistory ?? [];

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
            {/* Balance Card */}
            <div className="bg-[#13242a] text-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-2">
                <p className="text-sm uppercase tracking-widest text-gray-400">Token Balance</p>
                <p className="text-6xl font-extrabold">{balance}</p>
                <p className="text-sm text-gray-400 mt-1">AT Tokens</p>

                <div className="mt-4 flex flex-col items-center text-sm">
                    {canClaim ? (
                        <span className="badge badge-success badge-lg">Daily reward available</span>
                    ) : (
                        <span className="text-gray-400">
                            Next daily reward: {nextClaimTime?.format('D MMM YYYY h:mm A')}
                        </span>
                    )}
                </div>
            </div>

            {/* How Tokens Work */}
            <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-[#264653] mb-4">How Tokens Work</h2>
                <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold mt-0.5">+</span>
                        <span><strong>Daily Login Reward</strong> — Claim tokens once every 24 hours from the header.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold mt-0.5">+10</span>
                        <span><strong>Correct Match Prediction</strong> — Win 10 tokens when your voted team wins.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold mt-0.5">-5</span>
                        <span><strong>Cast a Vote</strong> — 5 tokens are deducted when you vote on a match prediction.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold mt-0.5">-5</span>
                        <span><strong>Create a Debate / Query</strong> — 5 tokens are deducted when you create a thread post.</span>
                    </li>
                </ul>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-[#264653] mb-4">Transaction History</h2>
                {transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table w-full text-sm">
                            <thead className="bg-gray-100 text-gray-600">
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th className="text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="whitespace-nowrap">
                                            {dayjs(tx.date).format('D MMM YYYY')}
                                        </td>
                                        <td>{tx.description || 'Transaction'}</td>
                                        <td className={`text-right font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm">No transaction history available yet.</p>
                )}
            </div>
        </div>
    );
}
