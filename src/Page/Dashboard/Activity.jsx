import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext.jsx";
import ServerApi from "../../api/ServerAPI";
import { useQuery } from "@tanstack/react-query";

const ITEMS_PER_PAGE = 5;
const visibleCount = 90;

export default function Activity() {
    const { user } = useAuth();

    const [predPage, setPredPage] = useState(1);
    const [pollPage, setPollPage] = useState(1);
    const [postPage, setPostPage] = useState(1);
    const [expanded, setExpanded] = useState({});

    const spliceLongText = (text, rowKey) => {
        const isExpanded = !!expanded[rowKey];
        if (isExpanded || text.length <= visibleCount) {
            return (
                <>
                    {text}
                    {text.length > visibleCount && (
                        <span className="text-violet-600 cursor-pointer ml-1 text-xs" onClick={() => setExpanded(p => ({ ...p, [rowKey]: false }))}>
                            See less
                        </span>
                    )}
                </>
            );
        }
        return (
            <>
                {text.slice(0, visibleCount)}...
                <span className="text-violet-600 cursor-pointer ml-1 text-xs" onClick={() => setExpanded(p => ({ ...p, [rowKey]: true }))}>
                    See more
                </span>
            </>
        );
    };

    const fmt = (ts) => new Date(ts).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });

    const ruleString = (rules = []) =>
        rules.length ? rules.map(r => `${r.condition} (closes ${new Date(r.closingDate).toLocaleDateString()})`).join("; ") : "—";

    const optionPercentStr = (outcome = []) => {
        const total = outcome.reduce((s, o) => s + (o.votes || 0), 0) || 0;
        return outcome.map(o => `${o.name} (${total ? Math.round((o.votes / total) * 100) : 0}%)`).join(" · ");
    };

    const paginate = (data, page) => data.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const renderPagination = (currentPage, totalItems, setPage) => {
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        if (totalPages <= 1) return null;
        return (
            <div className="flex items-center justify-center gap-3 py-4">
                <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="btn-assert-ghost text-xs px-3 py-1.5">Prev</button>
                <span className="text-xs text-slate-500">Page {currentPage} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="btn-assert-ghost text-xs px-3 py-1.5">Next</button>
            </div>
        );
    };

    const { data: predictions = [], isLoading: loadingPred } = useQuery({
        queryKey: ["userPredictions", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const { data } = await ServerApi.get("/userPrediction/participatedPredictions");
            return data.data.filter(p => p.email === user.email).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        },
    });

    const { data: polls = [], isLoading: loadingPolls } = useQuery({
        queryKey: ["userPolls", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const { data } = await ServerApi.get("/userPoll/participatedPolls");
            return data.data.filter(p => p.email === user.email).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        },
    });

    const { data: posts = [], isLoading: loadingPosts } = useQuery({
        queryKey: ["userPosts", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const { data } = await ServerApi.get("/form/participatedPosts");
            return data.data.filter(p => p.email === user.email).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        },
    });

    if (loadingPred || loadingPolls || loadingPosts) return (
        <div className="space-y-4 mt-4">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 w-full rounded-2xl" />)}
        </div>
    );

    const Section = ({ title, children }) => (
        <section>
            <h2 className="text-base font-bold text-slate-800 mb-3">{title}</h2>
            {children}
        </section>
    );

    return (
        <div className="w-full space-y-8 py-2">
            <div>
                <h1 className="text-2xl font-black text-slate-900">Activity</h1>
                <p className="text-slate-500 text-sm mt-0.5">Your predictions, polls, and posts.</p>
            </div>

            {/* Predictions */}
            <Section title="My Predictions">
                {predictions.length ? (
                    <div className="assert-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="assert-table">
                                <thead><tr>
                                    <th>Question</th><th>Category</th><th>Yes %</th><th>No %</th><th>Total</th><th>Rules</th><th>Status</th><th>Created</th>
                                </tr></thead>
                                <tbody>
                                    {paginate(predictions, predPage).map(p => {
                                        const yesCnt = p.outcome?.yesVotes?.length || 0;
                                        const noCnt = p.outcome?.noVotes?.length || 0;
                                        const total = yesCnt + noCnt;
                                        return (
                                            <tr key={p._id}>
                                                <td className="max-w-[200px]">{spliceLongText(p.question, p._id)}</td>
                                                <td>{p.category || p.realm}</td>
                                                <td>{total ? Math.round((yesCnt / total) * 100) : 0}%</td>
                                                <td>{total ? Math.round((noCnt / total) * 100) : 0}%</td>
                                                <td>{total}</td>
                                                <td className="max-w-[160px] text-xs text-slate-400">{ruleString(p.rule)}</td>
                                                <td><span className={p.status === "approved" ? "badge-win" : p.status === "rejected" ? "badge-lose" : "badge-pending"}>{p.status}</span></td>
                                                <td className="whitespace-nowrap text-xs text-slate-400">{fmt(p.timestamp)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {renderPagination(predPage, predictions.length, setPredPage)}
                    </div>
                ) : <p className="text-slate-400 text-sm">You haven't created any predictions.</p>}
            </Section>

            {/* Polls */}
            <Section title="My Polls">
                {polls.length ? (
                    <div className="assert-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="assert-table">
                                <thead><tr>
                                    <th>Question</th><th>Category</th><th>Options</th><th>Total</th><th>Rules</th><th>Status</th><th>Created</th>
                                </tr></thead>
                                <tbody>
                                    {paginate(polls, pollPage).map(poll => {
                                        const totalVotes = poll.outcome.reduce((s, o) => s + (o.votes || 0), 0);
                                        return (
                                            <tr key={poll._id}>
                                                <td className="max-w-[200px]">{poll.question}</td>
                                                <td>{poll.category || poll.realm}</td>
                                                <td className="text-xs text-slate-400">{optionPercentStr(poll.outcome)}</td>
                                                <td>{totalVotes}</td>
                                                <td className="max-w-[160px] text-xs text-slate-400">{ruleString(poll.rule)}</td>
                                                <td><span className={poll.status === "approved" ? "badge-win" : poll.status === "rejected" ? "badge-lose" : "badge-pending"}>{poll.status}</span></td>
                                                <td className="whitespace-nowrap text-xs text-slate-400">{fmt(poll.timestamp)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {renderPagination(pollPage, polls.length, setPollPage)}
                    </div>
                ) : <p className="text-slate-400 text-sm">You haven't created any polls.</p>}
            </Section>

            {/* Posts */}
            <Section title="My Posts">
                {posts.length ? (
                    <div className="assert-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="assert-table">
                                <thead><tr>
                                    <th>Question</th><th>Realm</th><th>Type</th><th>Likes</th><th>Replies</th><th>Status</th><th>Created</th>
                                </tr></thead>
                                <tbody>
                                    {paginate(posts, postPage).map(post => (
                                        <tr key={post._id}>
                                            <td className="max-w-[200px]">{post.question}</td>
                                            <td>{post.realm}</td>
                                            <td className="capitalize">{post.type}</td>
                                            <td>{post.likedBy?.length || 0}</td>
                                            <td>{post.replies?.length || 0}</td>
                                            <td><span className={post.status === "approved" ? "badge-win" : post.status === "rejected" ? "badge-lose" : "badge-pending"}>{post.status}</span></td>
                                            <td className="whitespace-nowrap text-xs text-slate-400">{fmt(post.timestamp)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {renderPagination(postPage, posts.length, setPostPage)}
                    </div>
                ) : <p className="text-slate-400 text-sm">You haven't created any posts.</p>}
            </Section>
        </div>
    );
}
