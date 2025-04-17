import { PollCard } from '../../components/PollPrediction/PollCard';
import OutcomePoll from '../../components/PollPrediction/OutcomePoll';
import React, { useEffect, useState } from "react";
import ServerApi from '../../api/ServerAPI';
import { useAuth } from "../../Context/AuthContext.jsx";

const QueryApproval = () => {
    const [predictions, setPredictions] = useState([]);
    const [polls, setPolls] = useState([]);
    const [pollRuleData, setPollRuleData] = useState({}); // store per-poll rule info
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchApprovals = async () => {
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
                    const pendingPredictions = predRes.data.data
                        .filter(pred => pred.status === "pending")
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    setPredictions(pendingPredictions);
                }

                if (pollRes.data.success) {
                    const pendingPolls = pollRes.data.data
                        .filter(poll => poll.status === "pending")
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    setPolls(pendingPolls);
                }

            } catch (error) {
                console.error('Error fetching approvals:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApprovals();
    }, [user]);

    const handlePredictionDecision = async (id, action, condition, closingDate) => {
        try {
            const response = await ServerApi.put(`/userPrediction/updateStatus/${id}`, {
                status: action,
                rule: { condition, closingDate }
            });

            if (response.data.success) {
                setPredictions(prev => prev.filter(p => p._id !== id));
            }
        } catch (error) {
            console.error('Prediction update failed:', error.message);
        }
    };

    const handlePollDecision = async (id, action) => {
        const ruleData = pollRuleData[id];
        try {
            const response = await ServerApi.put(`/userPoll/updateStatus/${id}`, {
                status: action,
                rule: {
                    condition: ruleData?.condition || "",
                    closingDate: ruleData?.closingDate || null
                }
            });

            if (response.data.success) {
                setPolls(prev => prev.filter(p => p._id !== id));
                setPollRuleData(prev => {
                    const copy = { ...prev };
                    delete copy[id];
                    return copy;
                });
            }
        } catch (error) {
            console.error('Poll update failed:', error.message);
        }
    };

    if (loading) {
        return <div className='text-center p-10'>Loading...</div>;
    }

    if (!user || user.userType !== "admin") {
        return (
            <div className='bg-base-50 p-10 text-center'>
                <h2 className='text-xl font-semibold text-red-600'>
                    You must be an admin to perform this action.
                </h2>
            </div>
        );
    }

    return (
        <div className='bg-base-50'>
            {/* Predictions */}
            <h2 className='text-lg text-center my-4'>Pending Predictions for Approval</h2>
            <div className='p-6 mx-auto flex flex-wrap justify-center gap-6'>
                {predictions.length > 0 ? (
                    predictions.map(prediction => (
                        <div key={prediction._id} className="border rounded-xl p-4 w-full max-w-md shadow-md">
                            
                            <PollCard data={prediction} />
                            <div className="mt-4 space-y-2">
                                <input
                                    type="text"
                                    placeholder="Result condition"
                                    className="input input-bordered w-full"
                                    onChange={(e) => prediction.ruleCondition = e.target.value}
                                />
                                <input
                                    type="datetime-local"
                                    className="input input-bordered w-full"
                                    onChange={(e) => {
                                        prediction.ruleDate = new Date(e.target.value);
                                    }}
                                />
                                <div className="flex justify-between mt-2">
                                    <button
                                        className="btn btn-success"
                                        onClick={() =>
                                            handlePredictionDecision(
                                                prediction._id,
                                                "approved",
                                                prediction.ruleCondition,
                                                prediction.ruleDate
                                            )}
                                    >Approve</button>
                                    <button
                                        className="btn btn-error"
                                        onClick={() =>
                                            handlePredictionDecision(prediction._id, "rejected", "", null)}
                                    >Reject</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 w-full">No pending predictions found.</p>
                )}
            </div>

            <h2 className='text-lg text-center my-4'>Pending Polls for Approval</h2>
            <div className='p-6 mx-auto flex flex-wrap justify-center gap-6 '>
                {polls.length > 0 ? (
                    <>
                        {polls.map((poll) => (
                            <div key={poll._id} className="border rounded-xl p-4 shadow-md ">
                                                {/* Fix: Ensure OutcomePoll takes full width */}
                                <div className="w-full">
                                    <OutcomePoll data={[poll]} />
                                </div>
                                

                                {/* Rule Condition and Closing Date inputs */}
                                <div className=" flex flex-wrap flex-col space-y-2 mt-2 ">
                                    <input
                                        type="text"
                                        placeholder="Result condition"
                                        className="input input-bordered"
                                        onChange={(e) =>
                                            setPollRuleData(prev => ({
                                                ...prev,
                                                [poll._id]: {
                                                    ...prev[poll._id],
                                                    condition: e.target.value
                                                }
                                            }))
                                        }
                                    />
                                    <input
                                        type="datetime-local"
                                        className="input input-bordered"
                                        onChange={(e) =>
                                            setPollRuleData(prev => ({
                                                ...prev,
                                                [poll._id]: {
                                                    ...prev[poll._id],
                                                    closingDate: new Date(e.target.value)
                                                }
                                            }))
                                        }
                                    />
                                </div>

                                {/* Approve and Reject buttons */}
                                <div className="flex flex-wrap mt-3 justify-between">
                                    <button
                                        className="btn btn-success"
                                        onClick={() => handlePollDecision(poll._id, "approved")}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="btn btn-error"
                                        onClick={() => handlePollDecision(poll._id, "rejected")}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <p className="text-center text-gray-500">No polls found.</p>
                )}
            </div>

        </div>
    );
};

export default QueryApproval;
