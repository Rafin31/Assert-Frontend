import React, { useState, useEffect } from "react";

// Utility function to calculate time left or check if match started
const getMatchTimeStatus = (match) => {
  if (!match) return { countdown: null, hasStarted: false };

  const matchDateTime = new Date(`${match.date}T${match.time}:00`);
  const now = new Date();
  const timeDiff = matchDateTime - now;

  if (timeDiff > 0) {
    return { countdown: timeDiff, hasStarted: false };
  }

  return { countdown: null, hasStarted: true };
};

const ScorePrediction = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="w-full h-48 flex justify-center items-center">No Matches Available</div>;
  }

  return (
    <div className="flex flex-wrap gap-6 justify-center p-6">
      {data.map((match, index) => (
        <MatchCardItem key={index} match={match} />
      ))}
    </div>
  );
};

const MatchCardItem = ({ match }) => {
  const [timeStatus, setTimeStatus] = useState(getMatchTimeStatus(match));

  useEffect(() => {
    const updateTimeStatus = () => {
      setTimeStatus(getMatchTimeStatus(match));
    };

    updateTimeStatus();

    // Update every second
    const interval = setInterval(() => {
      updateTimeStatus();
    }, 1000);

    return () => clearInterval(interval);
  }, [match]);

  // Format countdown in a visually appealing way
  const formatCountdown = (time) => {
    const days = Math.floor(time / (24 * 60 * 60 * 1000));
    const hours = Math.floor((time % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((time % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((time % (60 * 1000)) / 1000);

    return (
      <div className="flex justify-center gap-2 mt-2 text-base font-bold">
        <div className="border border-gray-600 px-2 py-2 rounded-md text-center">
          <span className="text-sm">{days}</span>
          <div className="text-xs">Days</div>
        </div>
        <div className="border border-gray-600 px-2 py-2 rounded-md text-center">
          <span className="text-sm">{hours.toString().padStart(2, "0")}</span>
          <div className="text-xs">Hours</div>
        </div>
        <div className="border border-gray-600 px-2 py-2 rounded-md text-center">
          <span className="text-sm">{minutes.toString().padStart(2, "0")}</span>
          <div className="text-xs">Minutes</div>
        </div>
        <div className="border border-gray-600 px-2 py-2 rounded-md text-center">
          <span className="text-sm">{seconds.toString().padStart(2, "0")}</span>
          <div className="text-xs">Seconds</div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-base-100 p-6 rounded-lg shadow-lg sm:w-80 hover:scale-105 transition-all" style={{ width: '400px' }}>
      <span className="text-left text-sm font-bold text-gray-600">{match.category} &gt; {match.subcategory}</span>
      <span className="block text-left text-xs font-semibold text-gray-700 mb-2 mt-2">
        Date: {match.date} | Time: {match.time} (AEDT)
      </span>
      <h3 className="text-xl font-bold text-gray-700 mb-4 flex justify-center">{match.teams[0]} vs {match.teams[1]}</h3>

      <div className="flex gap-4 mb-4 justify-center">
        <input
          type="number"
          placeholder={match.teams[0]}
          disabled={timeStatus.hasStarted}
          min="0"
          className="p-2 border border-gray-300 rounded-md w-25"
        />
        <input
          type="number"
          placeholder={match.teams[1]}
          disabled={timeStatus.hasStarted}
          min="0"
          className="p-2 border border-gray-300 rounded-md w-25"
        />
      </div>

      <button
        className={`w-full py-2 text-base font-semibold rounded-md ${timeStatus.hasStarted ? 'bg-[#e6e3e1] cursor-not-allowed text-gray-400' : 'bg-[#afd89e] hover:bg-[#9ec28e]'}`}
        disabled={timeStatus.hasStarted}
      >
        Submit Prediction
      </button>

      <p className="text-sm font-semibold mt-4 text-gray-600 flex justify-center">
        {timeStatus.hasStarted ? "Match Started" : formatCountdown(timeStatus.countdown)}
      </p>
    </div>
  );
};

export default ScorePrediction;
