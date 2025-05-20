import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext.jsx";
import ServerApi from "../../api/ServerAPI";
import { useQuery } from "@tanstack/react-query";

const ITEMS_PER_PAGE = 5;

export default function Activity() {
    const { user } = useAuth();

    const [predPage, setPredPage] = useState(1);
    const [pollPage, setPollPage] = useState(1);
    const [postPage, setPostPage] = useState(1);

    const fmt = (ts) =>
        new Date(ts).toLocaleString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

    const ruleString = (rules = []) =>
        rules.length
            ? rules.map((r) => `${r.condition} (closes ${new Date(r.closingDate).toLocaleDateString()})`).join("; ")
            : "-";

    const optionPercentStr = (outcome = []) => {
        const total = outcome.reduce((s, o) => s + (o.votes || 0), 0) || 0;
        return outcome
            .map((o) => {
                const pct = total ? Math.round((o.votes / total) * 100) : 0;
                return `${o.name} (${pct}%)`;
            })
            .join(" | ");
    };

    const paginate = (data, page) =>
        data.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const renderPagination = (currentPage, totalItems, setPage) => {
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        if (totalPages <= 1) return null;

        return (
            <div className="flex items-center justify-center text-xs text-gray-600 my-4">
                <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="btn btn-sm">
                    Prev
                </button>
                <span className="mx-2">Page {currentPage} of {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="btn btn-sm">
                    Next
                </button>
            </div>
        );
    };

    const { data: predictions = [], isLoading: loadingPred } = useQuery({
        queryKey: ["userPredictions", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const { data } = await ServerApi.get("/userPrediction/participatedPredictions");
            return data.data.filter((p) => p.email === user.email).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        },
    });

    const { data: polls = [], isLoading: loadingPolls } = useQuery({
        queryKey: ["userPolls", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const { data } = await ServerApi.get("/userPoll/participatedPolls");
            return data.data.filter((p) => p.email === user.email).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        },
    });

    const { data: posts = [], isLoading: loadingPosts } = useQuery({
        queryKey: ["userPosts", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const { data } = await ServerApi.get("/form/participatedPosts");
            return data.data.filter((p) => p.email === user.email).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        },
    });

    if (loadingPred || loadingPolls || loadingPosts) {
        return (
            <div className="mt-10 max-w-6xl min-h-[50vh] mx-auto grid grid-cols-1 gap-6">
                {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="skeleton h-32 w-full rounded-lg" />
                ))}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-10">

            {/* Predictions */}
            <section>
                <h2 className="text-xl font-semibold text-[#264653] mb-4">📈 My Predictions</h2>
                {predictions.length ? (
                    <div className="bg-white shadow-md rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="table w-full text-sm">
                                <thead className="bg-gray-100 text-gray-600 font-medium">
                                    <tr>
                                        <th>Question</th>
                                        <th>Category</th>
                                        <th>Yes %</th>
                                        <th>No %</th>
                                        <th>Total</th>
                                        <th>Rules</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginate(predictions, predPage).map((p) => {
                                        const yesCnt = p.outcome?.yesVotes?.length || 0;
                                        const noCnt = p.outcome?.noVotes?.length || 0;
                                        const total = yesCnt + noCnt;
                                        const yesPct = total ? Math.round((yesCnt / total) * 100) : 0;
                                        const noPct = total ? Math.round((noCnt / total) * 100) : 0;

                                        return (
                                            <tr key={p._id} className="hover:bg-gray-50 transition">
                                                <td>{

                                                }</td>
                                                <td>{p.category || p.realm}</td>
                                                <td>{yesPct}%</td>
                                                <td>{noPct}%</td>
                                                <td>{total}</td>
                                                <td>{ruleString(p.rule)}</td>
                                                <td className="capitalize">{p.status}</td>
                                                <td>{fmt(p.timestamp)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {renderPagination(predPage, predictions.length, setPredPage)}
                    </div>
                ) : (
                    <p className="text-gray-400">You haven't created any predictions.</p>
                )}
            </section>

            {/* Polls */}
            <section>
                <h2 className="text-xl font-semibold text-[#264653] mb-4">📊 My Polls</h2>
                {polls.length ? (
                    <div className="bg-white shadow-md rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="table w-full text-sm">
                                <thead className="bg-gray-100 text-gray-600 font-medium">
                                    <tr>
                                        <th>Question</th>
                                        <th>Category</th>
                                        <th>Options (%)</th>
                                        <th>Total</th>
                                        <th>Rules</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginate(polls, pollPage).map((poll) => {
                                        const totalVotes = poll.outcome.reduce((s, o) => s + (o.votes || 0), 0);
                                        return (
                                            <tr key={poll._id} className="hover:bg-gray-50 transition">
                                                <td>{poll.question}</td>
                                                <td>{poll.category || poll.realm}</td>
                                                <td>{optionPercentStr(poll.outcome)}</td>
                                                <td>{totalVotes}</td>
                                                <td>{ruleString(poll.rule)}</td>
                                                <td className="capitalize">{poll.status}</td>
                                                <td>{fmt(poll.timestamp)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {renderPagination(pollPage, polls.length, setPollPage)}
                    </div>
                ) : (
                    <p className="text-gray-400">You haven't created any polls.</p>
                )}
            </section>

            {/* Posts */}
            <section>
                <h2 className="text-xl font-semibold text-[#264653] mb-4">🗨️ My Posts</h2>
                {posts.length ? (
                    <div className="bg-white shadow-md rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="table w-full text-sm">
                                <thead className="bg-gray-100 text-gray-600 font-medium">
                                    <tr>
                                        <th>Question</th>
                                        <th>Realm</th>
                                        <th>Type</th>
                                        <th>Likes</th>
                                        <th>Replies</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginate(posts, postPage).map((post) => (
                                        <tr key={post._id} className="hover:bg-gray-50 transition">
                                            <td>{post.question}</td>
                                            <td>{post.realm}</td>
                                            <td>{post.type}</td>
                                            <td>{post.likedBy?.length || 0}</td>
                                            <td>{post.replies?.length || 0}</td>
                                            <td className="capitalize">{post.status}</td>
                                            <td>{fmt(post.timestamp)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {renderPagination(postPage, posts.length, setPostPage)}
                    </div>
                ) : (
                    <p className="text-gray-400">You haven't created any posts.</p>
                )}
            </section>
        </div>
    );
}
