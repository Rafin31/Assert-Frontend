import { PollCard } from '../../components/PollPrediction/PollCard';
import OutcomePoll from '../../components/PollPrediction/OutcomePoll';
import React, { useState } from "react";
import ServerApi from '../../api/ServerAPI';
import Skeleton from '../../utils/skeleton';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut"
    }
  })
};

const TechnologyPage = () => {
  const [visibleCount, setVisibleCount] = useState(4);
  const [visiblePollCount, setVisiblePollCount] = useState(4);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  const { data: predictions = [], isLoading: loadingPredictions } = useQuery({
    queryKey: ['techPredictions'],
    queryFn: async () => {
      const res = await ServerApi.get('/userPrediction/predictions', {
        params: { realm: 'technology', status: 'approved' }
      });
      return res.data.data || [];
    }
  });

  const { data: polls = [], isLoading: loadingPolls } = useQuery({
    queryKey: ['techPolls'],
    queryFn: async () => {
      const res = await ServerApi.get('/userPoll/poll', {
        params: { realm: 'technology', status: 'approved' }
      });
      return res.data.data || [];
    }
  });

  const filteredPredictions = predictions.filter((p) =>
    p.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPolls = polls.filter((p) =>
    p.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortItems = (items) => {
    if (sortOption === 'newest') {
      return [...items].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    if (sortOption === 'closingSoon') {
      return [...items].sort((a, b) => {
        const aDate = new Date(a.rule?.[0]?.closingDate || 0);
        const bDate = new Date(b.rule?.[0]?.closingDate || 0);
        return aDate - bDate;
      });
    }
    return items;
  };

  const sortedPredictions = sortItems(filteredPredictions);
  const sortedPolls = sortItems(filteredPolls);

  if (loadingPredictions || loadingPolls) {
    return (
      <div className="max-w-[1450px] mx-auto px-5 min-h-[80vh]">
        <Skeleton />
      </div>
    );
  }

  return (
    <div className="max-w-[1450px] mx-auto px-5 py-10">
      {/* Search bar and sorting buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search predictions or polls"
          className="px-4 py-2 border rounded-md w-full md:w-[300px]"
        />
        <div className="flex space-x-2">
          <button
            onClick={() => setSortOption('newest')}
            className={`px-3 py-2 rounded-md text-sm ${sortOption === 'newest' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Newest
          </button>
          <button
            onClick={() => setSortOption('closingSoon')}
            className={`px-3 py-2 rounded-md text-sm ${sortOption === 'closingSoon' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Closing Soon
          </button>
        </div>
      </div>

      {sortedPredictions.length === 0 ? (
        <p className="text-center col-span-full text-gray-500 min-h-[40vh]">
          No predictions found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
          {sortedPredictions.slice(0, visibleCount).map((prediction, index) => (
            <motion.div
              key={prediction._id || index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
            >
              <PollCard data={prediction} />
            </motion.div>
          ))}
        </div>
      )}

      {visibleCount < sortedPredictions.length && (
        <div className="flex justify-center mt-4">
          <div
            onClick={() => setVisibleCount((prev) => prev + 3)}
            className="link-primary cursor-pointer hover:link-primary/90 transition"
          >
            Load More..
          </div>
        </div>
      )}

      <div className="outcomePollContainer mt-6">
        <OutcomePoll data={sortedPolls.slice(0, visiblePollCount)} />
      </div>

      {visiblePollCount < sortedPolls.length && (
        <div className="flex justify-center mt-4">
          <div
            onClick={() => setVisiblePollCount((prev) => prev + 3)}
            className="link-primary cursor-pointer hover:link-primary/90 transition"
          >
            Load More..
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnologyPage;
