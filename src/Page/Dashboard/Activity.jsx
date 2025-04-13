import { PollCard } from '../../components/PollPrediction/PollCard';
import React, { useEffect, useState } from "react";
import ServerApi from '../../api/ServerAPI';
import { useAuth } from "../../Context/AuthContext.jsx"; // Import auth context


export default function Activity() {
    const [predictions, setPredictions] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                const response = await ServerApi.get('/userPrediction/participatedPredictions');

                if (response.data.success) {
                    const allPredictions = response.data.data;
                    const userEmail = user?.email;

                    // Step 1: Filter predictions where user has voted (yes or no)
                    const userVotedPredictions = allPredictions.filter(pred => {
                        const votedYes = pred.outcome?.yesVotes?.some(v => v.email === userEmail);
                        const votedNo = pred.outcome?.noVotes?.some(v => v.email === userEmail);
                        return votedYes || votedNo;
                    });

                    // Step 2: Sort filtered predictions by prediction post timestamp (newest first)
                    const sortedPredictions = userVotedPredictions.sort((a, b) => {
                        const timeA = new Date(a.timestamp);
                        const timeB = new Date(b.timestamp);
                        return timeB - timeA; // Newest first
                    });

                    setPredictions(sortedPredictions);
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

    return (
        <div className='bg-base-150'>
            <h2 className='text-left text-lg font-bold'>Activities</h2>
            <div className='p-6 mx-auto flex flex-wrap justify-center gap-3'>
                {predictions.length > 0 ? (
                predictions.map((prediction, index) => (
                    <PollCard key={index} data={prediction} />
                ))
                ) : (
                <p className="text-center text-gray-500">No predictions found.</p>
                )}
            </div>
            <h2>Poll</h2>
            <h2>Thread</h2>

        </div>
    )
}
