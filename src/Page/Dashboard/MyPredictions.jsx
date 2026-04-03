import React, { useEffect, useState } from "react";
import ServerApi from '../../api/ServerAPI';
import { useAuth } from "../../Context/AuthContext.jsx";
import { PollCard } from '../../components/PollPrediction/PollCard';
import OutcomePoll from '../../components/PollPrediction/OutcomePoll';

export default function MyPredictions() {
    const [predictions, setPredictions] = useState([]);
    const [filteredPredictions, setFilteredPredictions] = useState([]);
    const [polls, setPolls] = useState([]);
    const [filteredPolls, setFilteredPolls] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("approved");
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
                    setPredictions(predRes.data.data.filter(p => p.email === userEmail).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
                }
                if (pollRes.data.success) {
                    setPolls(pollRes.data.data.filter(p => p.email === userEmail).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
                }
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };
        if (user?.email) fetchUserContent();
    }, [user]);

    useEffect(() => {
        setFilteredPredictions(predictions.filter(p => p.status === selectedStatus));
        setFilteredPolls(polls.filter(p => p.status === selectedStatus));
    }, [selectedStatus, predictions, polls]);

    const statusOptions = [
        { key: "approved", label: "Approved" },
        { key: "pending", label: "Pending" },
        { key: "rejected", label: "Rejected" },
    ];

    return (
        <div className="w-full py-2">
            <div className="mb-6">
                <h1 className="text-2xl font-black text-slate-900">My Predictions</h1>
                <p className="text-slate-500 text-sm mt-0.5">Your submitted predictions and polls.</p>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 mb-6">
                {statusOptions.map(opt => (
                    <button
                        key={opt.key}
                        onClick={() => setSelectedStatus(opt.key)}
                        className={`filter-pill ${selectedStatus === opt.key ? "active" : ""}`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Predictions */}
            <section className="mb-8">
                <h2 className="text-base font-bold text-slate-700 mb-4">Predictions</h2>
                {filteredPredictions.length > 0 ? (
                    <div className={`flex flex-wrap gap-4 ${selectedStatus !== "approved" ? "opacity-60 pointer-events-none" : ""}`}>
                        {filteredPredictions.map((prediction, index) => (
                            <PollCard key={index} data={prediction} />
                        ))}
                    </div>
                ) : (
                    <div className="assert-card p-8 text-center">
                        <p className="text-slate-500 text-sm">No {selectedStatus} predictions found.</p>
                    </div>
                )}
            </section>

            {/* Polls */}
            <section className="mb-8">
                <h2 className="text-base font-bold text-slate-700 mb-4">Polls</h2>
                {filteredPolls.length > 0 ? (
                    <OutcomePoll data={filteredPolls} from="myPolls" />
                ) : (
                    <div className="assert-card p-8 text-center">
                        <p className="text-slate-500 text-sm">No {selectedStatus} polls found.</p>
                    </div>
                )}
            </section>

            {/* Thread placeholder */}
            <section>
                <h2 className="text-base font-bold text-slate-700 mb-4">Thread</h2>
                <div className="assert-card p-8 text-center">
                    <p className="text-slate-400 text-sm">Thread posts will appear here.</p>
                </div>
            </section>
        </div>
    );
}
