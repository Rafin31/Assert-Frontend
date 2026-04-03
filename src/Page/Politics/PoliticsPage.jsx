import React, { useState } from "react";
import { PollCard } from '../../components/PollPrediction/PollCard';
import OutcomePoll from '../../components/PollPrediction/OutcomePoll';
import ServerApi from '../../api/ServerAPI';
import Skeleton from '../../utils/skeleton';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35, ease: "easeOut" } })
};

export default function PoliticsPage() {
  const [visibleCount, setVisibleCount] = useState(4);
  const [visiblePollCount, setVisiblePollCount] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  const { data: predictionData, isLoading: loadingPredictions } = useQuery({
    queryKey: ['politicsPredictions'],
    queryFn: async () => {
      const res = await ServerApi.get('/userPrediction/predictions', { params: { realm: 'politics', status: 'approved' } });
      return res.data.data || [];
    }
  });

  const { data: pollData, isLoading: loadingPolls } = useQuery({
    queryKey: ['politicsPolls'],
    queryFn: async () => {
      const res = await ServerApi.get('/userPoll/poll', { params: { realm: 'politics', status: 'approved' } });
      return res.data.data || [];
    }
  });

  const sortItems = (items) => {
    if (sortOption === 'newest') return [...items].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    if (sortOption === 'closingSoon') return [...items].sort((a, b) => new Date(a.rule?.[0]?.closingDate || 0) - new Date(b.rule?.[0]?.closingDate || 0));
    return items;
  };

  const sortedPredictions = sortItems((predictionData || []).filter(p => p.question.toLowerCase().includes(searchTerm.toLowerCase())));
  const sortedPolls = sortItems((pollData || []).filter(p => p.question.toLowerCase().includes(searchTerm.toLowerCase())));

  if (loadingPredictions || loadingPolls) return <div className="max-w-[1450px] mx-auto px-5 min-h-[80vh]"><Skeleton /></div>;

  return (
    <div className="max-w-[1450px] mx-auto px-5 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Politics</h1>
          <p className="text-slate-500 text-sm mt-1">Predictions and polls on political topics.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="assert-input pl-9 w-full sm:w-56"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setSortOption('newest')} className={`filter-pill ${sortOption === 'newest' ? 'active' : ''}`}>Newest</button>
            <button onClick={() => setSortOption('closingSoon')} className={`filter-pill ${sortOption === 'closingSoon' ? 'active' : ''}`}>Closing Soon</button>
          </div>
        </div>
      </div>

      {/* Predictions */}
      {sortedPredictions.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] mb-8">
          <p className="text-slate-400 text-sm">No predictions found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mb-4">
            {sortedPredictions.slice(0, visibleCount).map((prediction, i) => (
              <motion.div key={prediction._id || i} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
                <PollCard data={prediction} />
              </motion.div>
            ))}
          </div>
          {visibleCount < sortedPredictions.length && (
            <div className="flex justify-center mb-8">
              <button onClick={() => setVisibleCount(p => p + 4)} className="btn-assert-ghost px-6">
                Load More Predictions
              </button>
            </div>
          )}
        </>
      )}

      {/* Polls section */}
      {sortedPolls.length > 0 && (
        <>
          <h2 className="text-lg font-bold text-slate-700 mb-4 mt-4">Polls</h2>
          <OutcomePoll data={sortedPolls.slice(0, visiblePollCount)} />
          {visiblePollCount < sortedPolls.length && (
            <div className="flex justify-center mt-4">
              <button onClick={() => setVisiblePollCount(p => p + 3)} className="btn-assert-ghost px-6">
                Load More Polls
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
