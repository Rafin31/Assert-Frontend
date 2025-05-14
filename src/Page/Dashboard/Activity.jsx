import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext.jsx";
import ServerApi from "../../api/ServerAPI";

export default function Activity() {
    const { user } = useAuth();

    const [predictions, setPredictions] = useState([]);
    const [polls, setPolls] = useState([]);
    const [posts, setPosts] = useState([]);

    // Pagination states
    const ITEMS_PER_PAGE = 5;
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

    useEffect(() => {
        if (!user?.email) return;

        // Fetch predictions
        (async () => {
            try {
                const { data } = await ServerApi.get("/userPrediction/participatedPredictions");
                if (data.success) {
                    const mine = data.data.filter((p) => p.email === user.email);
                    const sorted = mine.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    setPredictions(sorted);
                }
            } catch (err) {
                console.error(err);
            }
        })();

        // Fetch polls
        (async () => {
            try {
                const { data } = await ServerApi.get("/userPoll/participatedPolls");
                if (data.success) {
                    const mine = data.data.filter((p) => p.email === user.email);
                    const sorted = mine.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    setPolls(sorted);
                }
            } catch (err) {
                console.error(err);
            }
        })();

        // Fetch posts
        (async () => {
            try {
                const { data } = await ServerApi.get("/form/participatedPosts");
                if (data.success) {
                    const mine = data.data.filter((p) => p.email === user.email);
                    const sorted = mine.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    setPosts(sorted);
                }
            } catch (err) {
                console.error(err);
            }
        })();

    }, [user]);

    const paginate = (data, page) =>
        data.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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

    const renderPagination = (currentPage, totalItems, setPage) => {
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        if (totalPages <= 1) return null;

        return (
            <div className="flex items-center justify-center text-xs text-gray-600 m-2">
                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="btn btn-sm "
                >
                    Prev
                </button>
                <span className="m-2">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="btn btn-sm"
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <div className="space-y-10">
            {/* -------- Predictions -------- */}
            <section className="px-4">
                <h2 className="text-lg font-bold mb-4">My Predictions</h2>
                {predictions.length ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="table table-md w-full bg-base-100">
                                <thead>
                                    <tr>
                                        <th>Question</th>
                                        <th className="w-32">Category</th>
                                        <th className="w-20">Yes&nbsp;%</th>
                                        <th className="w-20">No&nbsp;%</th>
                                        <th className="w-24">Total</th>
                                        <th className="w-56">Rules</th>
                                        <th className="w-24">Status</th>
                                        <th className="w-40">Created</th>
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
                                            <tr key={p._id}>
                                                <td>{p.question}</td>
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
                    </>
                ) : (
                    <p className="text-gray-500">You haven't created any predictions.</p>
                )}
            </section>

            {/* -------- Polls -------- */}
            <section className="px-4">
                <h2 className="text-lg font-bold mb-4">My Polls</h2>
                {polls.length ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="table table-md w-full bg-base-100">
                                <thead>
                                    <tr>
                                        <th>Poll Question</th>
                                        <th className="w-32">Category</th>
                                        <th>Options&nbsp;(%)</th>
                                        <th className="w-24">Total Votes</th>
                                        <th className="w-56">Rules</th>
                                        <th className="w-24">Status</th>
                                        <th className="w-40">Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginate(polls, pollPage).map((poll) => {
                                        const totalVotes = poll.outcome.reduce((s, o) => s + (o.votes || 0), 0);
                                        return (
                                            <tr key={poll._id}>
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
                    </>
                ) : (
                    <p className="text-gray-500">You haven't created any polls.</p>
                )}
            </section>

            {/* -------- Posts -------- */}
            <section className="px-4">
                <h2 className="text-lg font-bold mb-4">My Posts</h2>
                {posts.length ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="table table-md w-full bg-base-100">
                                <thead>
                                    <tr>
                                        <th>Question</th>
                                        <th className="w-32">Realm</th>
                                        <th className="w-24">Type</th>
                                        <th className="w-20">Likes</th>
                                        <th className="w-20">Replies</th>
                                        <th className="w-24">Status</th>
                                        <th className="w-40">Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginate(posts, postPage).map((post) => (
                                        <tr key={post._id}>
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
                    </>
                ) : (
                    <p className="text-gray-500">You haven't created any posts.</p>
                )}
            </section>
        </div>
    );
}
