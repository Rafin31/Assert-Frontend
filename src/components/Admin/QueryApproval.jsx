import { PollCard } from '../../components/PollPrediction/PollCard';
import React, { useEffect, useState } from "react";
import ServerApi from '../../api/ServerAPI';
import { useAuth } from "../../Context/AuthContext.jsx";

const QueryApproval = () => {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchPredictions = async () => {
            // If user not available, or not an admin, stop loading
            if (!user || user.userType !== "admin") {
                setLoading(false);
                return;
            }

            try {
                const response = await ServerApi.get('/userPrediction/adminApproval');
                if (response.data.success) {
                    console.log(response.data.data)
                    const pending = response.data.data
                        .filter(pred => pred.status === "pending")
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    setPredictions(pending);
                }
            } catch (error) {
                console.error('Error fetching predictions:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPredictions();
    }, [user]);


    const handleDecision = async (id, action, condition, closingDate) => {
        try {
            const response = await ServerApi.put(`/userPrediction/updateStatus/${id}`, {
                status: action,
                rule: {
                    condition,
                    closingDate
                }
            });

            if (response.data.success) {
                setPredictions(prev => prev.filter(p => p._id !== id));
            }
        } catch (error) {
            console.error('Update failed:', error.message);
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
            <h2 className='text-lg text-center'>Pending Predictions for Approval</h2>
            <div className='bg-base-50 p-10 mx-auto flex flex-wrap justify-center gap-6'>
                {predictions.length > 0 ? (
                    predictions.map((prediction) => (
                        <div key={prediction._id} className="border rounded-xl p-4 w-full max-w-md shadow-md">
                            <PollCard data={prediction} />
                            <div className="mt-4 space-y-2">
                                <input
                                    type="text"
                                    placeholder="Result condition"
                                    className="input input-bordered w-full"
                                    onChange={(e) => prediction.ruleCondition = e.target.value}
                                    required
                                />
                                <input
                                    type="datetime-local"
                                    className="input input-bordered w-full"
                                    onChange={(e) => {
                                        const localDate = new Date(e.target.value);
                                        prediction.ruleDate = localDate;
                                    }}
                                    required
                                />
                                <div className="flex justify-between mt-2">
                                    <button
                                        className="btn btn-success"
                                        onClick={() => handleDecision(
                                            prediction._id,
                                            "approved",
                                            prediction.ruleCondition,
                                            prediction.ruleDate
                                        )}
                                    >Approve</button>
                                    <button
                                        className="btn btn-error"
                                        onClick={() => handleDecision(prediction._id, "rejected", "", null)}
                                    >Reject</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No pending predictions found.</p>
                )}
            </div>
        </div>
    );
};

export default QueryApproval;
