import { PollCard } from '../../components/PollPrediction/PollCard';
import React, { useEffect, useState } from "react";
import ServerApi from '../../api/ServerAPI';
import { useAuth } from "../../Context/AuthContext.jsx";
import OutcomePoll from '../../components/PollPrediction/OutcomePoll.jsx';

export default function Activity() {
    const [predictions, setPredictions] = useState([]);
    const [polls, setPolls] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                const response = await ServerApi.get('/userPrediction/participatedPredictions');
                if (response.data.success) {
                    const allPredictions = response.data.data;
                    const userEmail = user?.email;

                    const userVotedPredictions = allPredictions.filter(pred => {
                        const votedYes = pred.outcome?.yesVotes?.some(v => v.email === userEmail);
                        const votedNo = pred.outcome?.noVotes?.some(v => v.email === userEmail);
                        return votedYes || votedNo;
                    });

                    const sortedPredictions = userVotedPredictions.sort((a, b) => {
                        const timeA = new Date(a.timestamp);
                        const timeB = new Date(b.timestamp);
                        return timeB - timeA;
                    });

                    setPredictions(sortedPredictions);
                } else {
                    console.error('Error fetching predictions:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching predictions:', error.message);
            }
        };

        const fetchPolls = async () => {
            try {
                const response = await ServerApi.get('/userPoll/participatedPolls');
                if (response.data.success) {
                    const allPolls = response.data.data;
                    const userEmail = user?.email;

                    const userVotedPolls = allPolls.filter(poll =>
                        poll.outcome?.some(opt =>
                            opt.voters?.some(voter => voter.email === userEmail)
                        )
                    );

                    const sortedPolls = userVotedPolls.sort((a, b) => {
                        const timeA = new Date(a.timestamp);
                        const timeB = new Date(b.timestamp);
                        return timeB - timeA;
                    });

                    setPolls(sortedPolls);
                } else {
                    console.error('Error fetching polls:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching polls:', error.message);
            }
        };

        if (user?.email) {
            fetchPredictions();
            fetchPolls();
        }
    }, [user]);

    return (
        <div className='bg-base-150'>
            <h2 className='text-left text-lg font-bold'>Activities</h2>

            {/* Predictions Section */}
            <div className='p-6 mx-auto flex flex-wrap justify-center gap-3'>
                {predictions.length > 0 ? (
                    predictions.map((prediction, index) => (
                        <PollCard key={index} data={prediction} />
                    ))
                ) : (
                    <p className="text-center text-gray-500">No predictions found.</p>
                )}
            </div>

            {/* Polls Section */}
            <h2 className='text-left text-lg font-bold px-6 mt-8'>Poll</h2>
            <div className='p-6 mx-auto flex flex-wrap justify-center gap-3 '>
                {polls.length > 0 ? (
                    <OutcomePoll className="bg-base-100" data={polls} />
                ) : (
                    <p className="text-center text-gray-500">No polls found.</p>
                )}
            </div>

            {/* Thread Section Placeholder */}
            <h2 className='text-left text-lg font-bold px-6 mt-8'>Thread</h2>
        </div>
    );
}
