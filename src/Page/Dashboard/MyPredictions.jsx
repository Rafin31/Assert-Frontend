import { PollCard } from '../../components/PollPrediction/PollCard';
import React, { useEffect, useState } from "react";
import ServerApi from '../../api/ServerAPI';
import { useAuth } from "../../Context/AuthContext.jsx";

export default function MyPredictions() {
    const [predictions, setPredictions] = useState([]);
    const [filteredPredictions, setFilteredPredictions] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("approved"); // default filter
    const { user } = useAuth();

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                const response = await ServerApi.get('/userPrediction/participatedPredictions');

                if (response.data.success) {
                    const allPredictions = response.data.data;
                    const userEmail = user?.email;

                    const userPredictions = allPredictions
                        .filter(pred => pred.email === userEmail)
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                    setPredictions(userPredictions);
                } else {
                    console.error('Error fetching predictions:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching predictions:', error.message);
            }
        };

        if (user?.email) {
            fetchPredictions();
        }
    }, [user]);

    useEffect(() => {
        if (selectedStatus) {
            const filtered = predictions.filter(pred => pred.status === selectedStatus);
            setFilteredPredictions(filtered);
        }
    }, [selectedStatus, predictions]);

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
            <div className={`p-2 sm:p-5 mx-auto flex flex-wrap justify-center gap-3 ${
            selectedStatus !== "approved" ? "opacity-50 cursor-not-allowed " : ""
            }`}>
                {filteredPredictions.length > 0 ? (
                    filteredPredictions.map((prediction, index) => (
                        <PollCard key={index} data={prediction} />
                    ))
                ) : (
                    <p className="text-center text-gray-500">No {selectedStatus} predictions found.</p>
                )}
            </div>

            <h2 className="mt-10 font-bold text-lg">Poll</h2>
            <h2 className="font-bold text-lg">Thread</h2>
        </div>
    );
}
