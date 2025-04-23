import { PollCard } from '../../components/PollPrediction/PollCard';
import OutcomePoll from '../../components/PollPrediction/OutcomePoll';
import React, { useEffect, useState } from "react";
import ServerApi from '../../api/ServerAPI';
import { useAuth } from "../../Context/AuthContext.jsx";

const ResultApproval = () => {
    const [predictions, setPredictions] = useState([]);
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOutcome, setSelectedOutcome] = useState({});
    const { user } = useAuth();

    useEffect(() => {
        const fetchPendingResults = async () => {
            if (!user || user.userType !== "admin") {
                setLoading(false);
                return;
            }

            try {
                const [predRes, pollRes] = await Promise.all([
                    ServerApi.get('/userPrediction/adminApproval'),
                    ServerApi.get('/userPoll/adminApprovalPoll')
                ]);

                if (predRes.data.success) {
                    const pendingPredictions = predRes.data.data.filter(p => p.status === "pending_result");
                    setPredictions(pendingPredictions);
                }

                if (pollRes.data.success) {
                    const pendingPolls = pollRes.data.data.filter(p => p.status === "pending_result");
                    setPolls(pendingPolls);
                }

            } catch (error) {
                console.error('Error fetching pending results:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingResults();
    }, [user]);

    const handleSelectOutcome = (id, outcome) => {
        setSelectedOutcome(prev => ({ ...prev, [id]: outcome }));
    };

    const handleRewardPrediction = async (predictionId) => {
        const outcome = selectedOutcome[predictionId];
        if (!outcome) {
            alert("Please select a winning outcome before rewarding.");
            return;
        }

        try {
            const res = await ServerApi.post('/userPrediction/resolvePrediction', {
                predictionId,
                winningOutcome: outcome
            });

            if (res.data.success) {
                alert("Prediction winners rewarded!");
                setPredictions(prev => prev.filter(p => p._id !== predictionId));
            } else {
                alert("Failed to reward prediction.");
            }
        } catch (err) {
            console.error("Error rewarding prediction winners:", err.message);
        }
    };

    const handleRewardPoll = async (pollId) => {
        const outcome = selectedOutcome[pollId];
        if (!outcome) {
            alert("Please select a winning outcome before rewarding.");
            return;
        }

        try {
            const res = await ServerApi.post('/userPoll/resolvePoll', {
                pollId,
                winningOutcome: outcome
            });

            if (res.data.success) {
                alert("Poll winners rewarded!");
                setPolls(prev => prev.filter(p => p._id !== pollId));
            } else {
                alert("Failed to reward poll.");
            }
        } catch (err) {
            console.error("Error rewarding poll winners:", err.message);
        }
    };

    if (loading) {
        return <div className="text-center p-10">Loading...</div>;
    }

    if (!user || user.userType !== "admin") {
        return (
            <div className="bg-base-50 p-10 text-center">
                <h2 className="text-xl font-semibold text-red-600">
                    You must be an admin to view this page.
                </h2>
            </div>
        );
    }

    return (
        <div className="bg-base-50">
            <h2 className="text-lg text-center my-4">Pending Result - Predictions</h2>
            <div className="p-6 mx-auto flex flex-wrap justify-center gap-6">
                {predictions.length > 0 ? (
                    predictions.map(prediction => (
                        <div key={prediction._id} className="border rounded-xl p-2 w-full max-w-md shadow-md space-y-4">
                            <PollCard data={prediction} />
                            <div className="space-y-2">
                                <p className="font-medium text-center">Select Winning Outcome</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {["Yes", "No", "Undecided"].map(option => (
                                        <button
                                            key={option}
                                            onClick={() => handleSelectOutcome(prediction._id, option)}
                                            className={`px-3 py-2 rounded border text-sm flex ${
                                                selectedOutcome[prediction._id] === option
                                                    ? "btn btn-primary"
                                                    : "bg-gray-100"
                                            }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-4 flex justify-center">
                                    <button
                                        onClick={() => handleRewardPrediction(prediction._id)}
                                        className="px-4 py-2 btn btn-success rounded"
                                    >
                                        Reward Winner(s)
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 w-full">No pending result predictions.</p>
                )}
            </div>

            <h2 className="text-lg text-center my-4">Pending Result - Polls</h2>
            <div className="p-6 mx-auto flex flex-wrap justify-center gap-6">
                {polls.length > 0 ? (
                    polls.map(poll => (
                        <div key={poll._id} className="border rounded-xl p-4 shadow-md w-full max-w-md space-y-4">
                            <OutcomePoll data={[poll]} from="QueryApproval" />

                            <div className="flex flex-col items-center gap-2">
                                <p className="font-medium text-center">Select Winning Outcome</p>
                                <select
                                    className="select select-bordered w-full max-w-xs"
                                    value={selectedOutcome[poll._id] || ""}
                                    onChange={(e) => handleSelectOutcome(poll._id, e.target.value)}
                                >
                                    <option value="" disabled>Select outcome</option>
                                    {(poll.outcome || []).map((opt, idx) => (
                                        <option key={idx} value={opt.name}>{opt.name}</option>
                                    ))}
                                    <option value="No Result">No Result</option>
                                </select>

                                <button
                                    onClick={() => handleRewardPoll(poll._id)}
                                    className="px-4 py-2 btn btn-success rounded"
                                >
                                    Reward Winner(s)
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No pending result polls.</p>
                )}
            </div>
        </div>
    );
};

export default ResultApproval;
