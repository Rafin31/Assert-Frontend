import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext.jsx";
import ServerApi from "../../api/ServerAPI";

export default function Activity() {
    const { user } = useAuth();

    const [predictions, setPredictions] = useState([]);
    const [polls, setPolls] = useState([]);

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


        (async () => {
            try {
                const { data } = await ServerApi.get("/userPrediction/participatedPredictions"); // adjust route
                if (data.success) {
                    const mine = data.data.filter((p) => p.email === user.email);
                    const predictionSorted = mine.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    setPredictions(predictionSorted);
                }
            } catch (err) {
                console.error(err);
            }
        })();

        // Polls you created
        (async () => {
            try {
                const { data } = await ServerApi.get("/userPoll/participatedPolls"); // adjust route
                if (data.success) {
                    const mine = data.data.filter((p) => p.email === user.email);
                    const pollSorted = mine.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    setPolls(pollSorted);
                }
            } catch (err) {
                console.error(err);
            }
        })();
    }, [user]);


    const ruleString = (rules = []) =>
        rules.length
            ? rules
                .map(
                    (r) =>
                        `${r.condition} (closes ${new Date(r.closingDate).toLocaleDateString()})`
                )
                .join("; ")
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


    return (
        <div className="space-y-10">
            {/* -------- Predictions -------- */}
            <section className="px-4">
                <h2 className="text-lg font-bold mb-4">My Predictions</h2>

                {predictions.length ? (
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
                                {predictions.map((p) => {
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
                ) : (
                    <p className="text-gray-500">You haven't created any predictions.</p>
                )}
            </section>

            {/* -------- Polls -------- */}
            <section className="px-4">
                <h2 className="text-lg font-bold mb-4">My Polls</h2>

                {polls.length ? (
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
                                {polls.map((poll) => {
                                    const totalVotes = poll.outcome.reduce(
                                        (s, o) => s + (o.votes || 0),
                                        0
                                    );

                                    return (
                                        <tr key={poll._id}>
                                            <td className="">{poll.question}</td>
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
                ) : (
                    <p className="text-gray-500">You haven't created any polls.</p>
                )}
            </section>
        </div>
    );
}
