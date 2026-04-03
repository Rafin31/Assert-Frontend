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

    if (isLoading) return (
        <div className="max-w-3xl mx-auto space-y-5 mt-4">
            <div className="skeleton h-44 w-full rounded-2xl" />
            <div className="skeleton h-64 w-full rounded-2xl" />
        </div>
    );

    if (isError) return <p className="text-center text-red-500 py-10">Failed to load wallet data.</p>;

    const balance = data?.tokenBalance ?? 0;
    const lastReward = data?.lastLoginReward;
    const nextClaimTime = lastReward ? dayjs(lastReward).add(24, 'hour') : null;
    const canClaim = !nextClaimTime || dayjs().isAfter(nextClaimTime);
    const transactions = data?.tokenHistory ?? [];

    return (
        <div className="max-w-3xl mx-auto space-y-6 py-2">
            <div>
                <h1 className="text-2xl font-black text-slate-900">Token Wallet</h1>
                <p className="text-slate-500 text-sm mt-0.5">Your AT token balance and transaction history.</p>
            </div>

            {/* Balance card */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #5B21B6, #7C3AED, #6366F1)' }}>
                <div className="px-8 py-10 text-white text-center">
                    <p className="text-sm uppercase tracking-widest text-violet-200 mb-2">Token Balance</p>
                    <p className="text-7xl font-extrabold mb-1">{balance}</p>
                    <p className="text-violet-300 text-sm">AT Tokens</p>
                    <div className="mt-6">
                        {canClaim ? (
                            <span className="inline-flex items-center gap-1.5 bg-white/20 border border-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                Daily reward available — claim from the header
                            </span>
                        ) : (
                            <span className="text-violet-300 text-xs">
                                Next daily reward: {nextClaimTime?.format('D MMM YYYY · h:mm A')}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* How tokens work */}
            <div className="assert-card p-6">
                <h2 className="text-base font-bold text-slate-800 mb-4">How Tokens Work</h2>
                <div className="space-y-3">
                    {[
                        { sign: "+", color: "text-emerald-600 bg-emerald-50 border-emerald-200", title: "Daily Login Reward", desc: "Claim tokens once every 24 hours from the header." },
                        { sign: "+10", color: "text-emerald-600 bg-emerald-50 border-emerald-200", title: "Correct Match Prediction", desc: "Win 10 tokens when your voted team wins." },
                        { sign: "−5", color: "text-red-500 bg-red-50 border-red-200", title: "Cast a Vote", desc: "5 tokens are deducted when you vote on a match." },
                        { sign: "−5", color: "text-red-500 bg-red-50 border-red-200", title: "Create a Debate / Query", desc: "5 tokens are deducted when you create a thread post." },
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg border shrink-0 ${item.color}`}>{item.sign}</span>
                            <div>
                                <p className="text-sm font-semibold text-slate-700">{item.title}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transaction history */}
            <div className="assert-card p-6">
                <h2 className="text-base font-bold text-slate-800 mb-4">Transaction History</h2>
                {transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="assert-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th className="text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx, i) => (
                                    <tr key={i}>
                                        <td className="whitespace-nowrap">{dayjs(tx.date).format('D MMM YYYY')}</td>
                                        <td>{tx.description || 'Transaction'}</td>
                                        <td className={`text-right font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                            {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">No transactions yet</p>
                        <p className="text-slate-400 text-xs mt-1">Start predicting to earn tokens.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
