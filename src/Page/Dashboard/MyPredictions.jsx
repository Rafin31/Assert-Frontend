import React, { useEffect, useState } from "react";
import ServerApi from '../../api/ServerAPI';
import { useAuth } from "../../Context/AuthContext.jsx";
import { PollCard } from '../../components/PollPrediction/PollCard';
import OutcomePoll from '../../components/PollPrediction/OutcomePoll';
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

export default function MyPredictions() {
    const [predictions, setPredictions] = useState([]);
    const [filteredPredictions, setFilteredPredictions] = useState([]);
    const [polls, setPolls] = useState([]);
    const [filteredPolls, setFilteredPolls] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("approved"); // default filter
    const { user } = useAuth();
    

    useEffect(() => {
        const fetchUserContent = async () => {
            try {
                const [predRes, pollRes] = await Promise.all([
                    ServerApi.get('/userPrediction/participatedPredictions'),
                    ServerApi.get('/userPoll/participatedPolls')
                ]);

                const userEmail = user?.email;

                if (predRes.data.success) {
                    const userPredictions = predRes.data.data
                        .filter(pred => pred.email === userEmail)
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    setPredictions(userPredictions);
                }

                if (pollRes.data.success) {
                    const userPolls = pollRes.data.data
                        .filter(poll => poll.email === userEmail)
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    setPolls(userPolls);
                }

            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        if (user?.email) {
            fetchUserContent();
        }
    }, [user]);

    useEffect(() => {
        setFilteredPredictions(predictions.filter(pred => pred.status === selectedStatus));
        setFilteredPolls(polls.filter(poll => poll.status === selectedStatus));
    }, [selectedStatus, predictions, polls]);

    const buttonStyles = (status) =>
        `btn ${selectedStatus === status ? 'btn-success' : 'btn-outline'} transition-all`;

    return (
        <div className='bg-base-150 px-4 pb-10'>
            <h2 className='text-left text-xl font-bold mt-5'>My Predictions</h2>

            {/* Filter Buttons */}
            <div className="flex justify-center gap-4 my-4">
                <button className={buttonStyles("approved")} onClick={() => setSelectedStatus("approved")}>
                    Approved
                </button>
                <button className={buttonStyles("pending")} onClick={() => setSelectedStatus("pending")}>
                    Pending
                </button>
                <button className={buttonStyles("rejected")} onClick={() => setSelectedStatus("rejected")}>
                    Rejected
                </button>
            </div>

            {/* Predictions */}
            <div className={`p-2 sm:p-5 mx-auto flex flex-wrap justify-center gap-3 ${selectedStatus !== "approved" ? "opacity-50 cursor-not-allowed" : ""}`}>
                {filteredPredictions.length > 0 ? (
                    filteredPredictions.map((prediction, index) => (
                        <PollCard key={index} data={prediction} />
                    ))
                ) : (
                    <p className="text-center text-gray-500">No {selectedStatus} predictions found.</p>
                )}
            </div>

            {/* Polls */}
            <h2 className="mt-10 font-bold text-lg">My Polls</h2>
            <OutcomePoll data={filteredPolls} from="myPolls" />

            {/* Thread Placeholder */}
            <h2 className="mt-10 font-bold text-lg">Thread</h2>
        </div>
    );
}
