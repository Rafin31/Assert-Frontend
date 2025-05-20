import { PollCard } from '../../components/PollPrediction/PollCard';
import OutcomePoll from '../../components/PollPrediction/OutcomePoll';
import React, { useEffect, useState } from "react";
import ServerApi from '../../api/ServerAPI';
import Skeleton from '../../utils/skeleton';
import { motion } from 'framer-motion';

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
  const [predictions, setPredictions] = useState([]);
  const [polls, setPolls] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [visiblePollCount, setVisiblePollCount] = useState(4);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest'); // Default to Newest First

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await ServerApi.get('/userPrediction/predictions', {
          params: {
            realm: 'technology',
            status: 'approved'
          }
        });

        if (response.data.success) {
          setPredictions(response.data.data);
        } else {
          console.error('Error fetching predictions:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching predictions:', error.message);
      }
      setLoading(false);
    };

    const fetchPolls = async () => {
      try {
        const response = await ServerApi.get('/userPoll/poll', {
          params: {
            realm: 'technology',
            status: 'approved'
          }
        });

        if (response.data.success) {
          setPolls(response.data.data);
        } else {
          console.error('Error fetching polls:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching polls:', error.message);
      }
      setLoading(false);
    };

    fetchPredictions();
    fetchPolls();
  }, []);

  const handleSearch = () => {
    // This function will be used to filter both polls and predictions
    return {
      filteredPredictions: predictions.filter((prediction) =>
        prediction.question.toLowerCase().includes(searchTerm.toLowerCase())
      ),
      filteredPolls: polls.filter((poll) =>
        poll.question.toLowerCase().includes(searchTerm.toLowerCase())
      )
    };
  };

  const handleSort = (type) => {
    // Sorting logic for polls and predictions
    setSortOption(type);
    const { filteredPredictions, filteredPolls } = handleSearch();

    const sortedPredictions = filteredPredictions.sort((a, b) => {
      if (type === 'newest') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else if (type === 'closingSoon') {
        const aClosingDate = a.rule?.[0]?.closingDate ? new Date(a.rule[0].closingDate) : 0;
        const bClosingDate = b.rule?.[0]?.closingDate ? new Date(b.rule[0].closingDate) : 0;
        return aClosingDate - bClosingDate;
      }
      return 0;
    });

    const sortedPolls = filteredPolls.sort((a, b) => {
      if (type === 'newest') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else if (type === 'closingSoon') {
        const aClosingDate = a.rule?.[0]?.closingDate ? new Date(a.rule[0].closingDate) : 0;
        const bClosingDate = b.rule?.[0]?.closingDate ? new Date(b.rule[0].closingDate) : 0;
        return aClosingDate - bClosingDate;
      }
      return 0;
    });

    setPredictions(sortedPredictions);
    setPolls(sortedPolls);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const handleLoadMorePolls = () => {
    setVisiblePollCount((prev) => prev + 3);
  };

  if (loading) {
    return (
      <div className="max-w-[1450px] mx-auto px-5 min-h-[80vh]">
        <Skeleton />
      </div>
    );
  }

  const { filteredPredictions, filteredPolls } = handleSearch();

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
            onClick={() => handleSort('newest')}
            className={`px-3 py-2 rounded-md text-sm ${sortOption === 'newest' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Newest
          </button>
          <button
            onClick={() => handleSort('closingSoon')}
            className={`px-3 py-2 rounded-md text-sm ${sortOption === 'closingSoon' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Closing Soon
          </button>
        </div>
      </div>


      {

        filteredPredictions.length === 0 ? (
          <p className="text-center col-span-full text-gray-500 min-h-[40vh]">
            No predictions found.
          </p>
        ) :
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
            {filteredPredictions.slice(0, visibleCount).map((prediction, index) => (


              <motion.div
                key={prediction._id || index}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={fadeUpVariants}
              >

                <PollCard key={index} data={prediction} />
              </motion.div>


            ))}
          </div>

      }

      {visibleCount < filteredPredictions.length && (
        <div className="flex justify-center mt-4">
          <div
            onClick={handleLoadMore}
            className="link-primary cursor-pointer hover:link-primary/90 transition"
          >
            Load More..
          </div>
        </div>
      )}


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
        <OutcomePoll data={filteredPolls.slice(0, visiblePollCount)} />
      </div>

      {visiblePollCount < filteredPolls.length && (
        <div className="flex justify-center mt-4">
          <div
            onClick={handleLoadMorePolls}
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
