import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const MatchPrediction = ({ matchPredictionData }) => {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [prediction, setPrediction] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isMatchStarted, setIsMatchStarted] = useState(false);

  // Countdown State
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const matchStartTime = dayjs(`${matchPredictionData.date} ${matchPredictionData.time}`);

  useEffect(() => {
    const updateTimer = () => {
      const now = dayjs();
      const timeDiff = matchStartTime.diff(now);

      if (timeDiff <= 0) {
        setIsMatchStarted(true);
      } else {
        const durationTime = dayjs.duration(timeDiff);
        setDays(durationTime.days());
        setHours(durationTime.hours());
        setMinutes(durationTime.minutes());
        setSeconds(durationTime.seconds());
        setIsMatchStarted(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [matchPredictionData]);

  const handleTeamSelect = (team) => {
    if (!isMatchStarted) {
      setSelectedTeam((prevTeam) => (prevTeam === team ? "" : team));
      setSubmitted(false);
    }
  };

  const handlePredictionSelect = (outcome) => {
    if (!isMatchStarted) {
      setPrediction((prevOutcome) => (prevOutcome === outcome ? "" : outcome));
      setSubmitted(false);
    }
  };

  const handleSubmit = () => {
    if (!isMatchStarted && (prediction === "Draw" || (selectedTeam && prediction))) {
      setSubmitted(true);
      console.log("Submitted Prediction:", {
        team: selectedTeam,
        outcome: prediction,
        match: matchPredictionData,
      });
    } else {
      alert("Please select a team and prediction outcome before submitting.");
    }
  };

  return (
    <div className="p-1 hover:scale-105 transition-all gap-2 w-full md:w-[40%]">
      <div className="min-h-[320px] flex flex-col gap-2 justify-center p-5 w-full shadow-lg rounded-lg transition-transform duration-200 ease-in-out mx-auto">
        <div>
          <span className="text-sm font-bold">
            {matchPredictionData.category} - {matchPredictionData.subcategory}
          </span>
          <br />
          <span className="text-xs pr-2 font-semibold">Date: {matchPredictionData.date}</span>
          <span className="text-xs font-semibold">Time: {matchPredictionData.time}</span>



          {/* Team Selection */}
          <div className="mt-6 mb-2 flex justify-center items-center gap-4">
            <button
              className={`px-3 py-2 border-2 rounded-md text-sm font-bold cursor-pointer transition-colors duration-200 ${selectedTeam === matchPredictionData.teams[0]
                ? "bg-[#f08159] text-white border-none"
                : "text-[#34495e] border-[#bdc3c7]"
                } ${isMatchStarted ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => handleTeamSelect(matchPredictionData.teams[0])}
              disabled={isMatchStarted}
            >
              {matchPredictionData.teams[0]}
            </button>
            <span>vs</span>
            <button
              className={`px-3 py-2 border-2 rounded-md text-sm font-bold cursor-pointer transition-colors duration-200 ${selectedTeam === matchPredictionData.teams[1]
                ? "bg-[#f08159] text-white border-none"
                : "text-[#34495e] border-[#bdc3c7]"
                } ${isMatchStarted ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => handleTeamSelect(matchPredictionData.teams[1])}
              disabled={isMatchStarted}
            >
              {matchPredictionData.teams[1]}
            </button>
          </div>

          {/* Prediction Outcome */}
          <div className="mt-4 flex justify-center gap-4">
            <button
              className={`px-3 py-2 rounded-md text-sm font-semibold cursor-pointer transition-all duration-200 ${prediction === "Win" ? "bg-[#4CAF50] text-white scale-105" : "opacity-80"
                } ${isMatchStarted ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => handlePredictionSelect("Win")}
              disabled={isMatchStarted}
            >
              Win
            </button>
            <button
              className={`px-3 py-2 rounded-md text-sm font-semibold cursor-pointer transition-all duration-200 ${prediction === "Draw" ? "bg-[#bdc3c7] text-white scale-105" : "opacity-80"
                } ${isMatchStarted ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => handlePredictionSelect("Draw")}
              disabled={isMatchStarted}
            >
              Draw
            </button>
            <button
              className={`px-3 py-2 rounded-md text-sm font-semibold cursor-pointer transition-all duration-200 ${prediction === "Lose" ? "bg-[#e74c3c] text-white scale-105" : "opacity-80"
                } ${isMatchStarted ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => handlePredictionSelect("Lose")}
              disabled={isMatchStarted}
            >
              Lose
            </button>
          </div>

          {/* Submit Button */}
          <button
            className={`flex justify-center mt-3 w-full max-w-[300px] mx-auto px-4 py-2 bg-[#afd89e] text-base rounded-md text-sm font-semibold transition-colors duration-200 hover:bg-[#9ec28e] ${isMatchStarted ? "opacity-50 cursor-not-allowed" : ""
              }`}
            onClick={handleSubmit}
            disabled={isMatchStarted}
          >
            Submit Prediction
          </button>

          {/* Show Submitted Result */}
          {submitted && (
            <p className="mt-2 text-sm text-center">
              <strong>Your Prediction:</strong> {selectedTeam || "Match"} will {prediction}
            </p>
          )}

          {/* Countdown Timer */}
          <div className="flex justify-center mt-3 text-lg font-bold">
            {isMatchStarted ? (
              <span className="text-base">Match Started</span>
            ) : (
              <div className="flex justify-center gap-1 text-base">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchPrediction;
