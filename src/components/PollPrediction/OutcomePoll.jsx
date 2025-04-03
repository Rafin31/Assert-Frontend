import React, { useState } from "react";

const OutcomePoll = ({ data }) => {
  const [votes, setVotes] = useState({});

  const handleVote = (pollId, teamName) => {
    setVotes((prevVotes) => {
      const newVotes = { ...prevVotes };
      if (!newVotes[pollId]) {
        newVotes[pollId] = {};
      }
      if (!newVotes[pollId][teamName]) {
        newVotes[pollId][teamName] = 0;
      }
      newVotes[pollId][teamName] += 1; // Increment vote count by 1
      return newVotes;
    });
  };

  return (
    <div className="flex flex-wrap gap-5 justify-center p-5">
      {data.map((poll, index) => {
        // Calculate the total votes for this poll from state and initial votes
        const totalVotes = poll.outcome.reduce((total, team) => {
          const teamVotes = (votes[poll.title]?.[team.name] || 0); // Only include votes from state, no initial votes
          return total + teamVotes + team.votes; // Add teamVotes from state and initial team.votes
        }, 0);

        return (
          <div key={index} className="bg-base-100 rounded-xl shadow-lg p-5 w-full sm:w-[400px]">
            
            <div className="text-sm text-gray-500 mb-2">{poll.realm} - {poll.category}</div>
            <div className="text-sm text-gray-500 mb-2">{poll.subcategory}</div>
            <div className="text-2xl font-bold mb-4">{poll.title}</div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between font-bold text-lg text-base">
                <span className="flex-2">Outcome</span>
                <span className="flex-1">Votes</span>
                <span className="flex-1">Chance</span>
                <span className="flex-1"></span>
              </div>
              {poll.outcome.map((team, i) => {
                // Calculate the current teamVotes (state votes only)
                const teamVotes = (votes[poll.title]?.[team.name] || 0) + team.votes;
                const chancePercent = totalVotes ? (teamVotes / totalVotes) * 100 : 0;

                return (
                  <div key={i} className="flex justify-between items-center">
                    <span className="flex-2 font-bold">{team.name}</span>
                    <span className="flex-1 text-center font-semibold">{teamVotes}</span>
                    <span className="flex-1 text-center">{chancePercent.toFixed(2)}%</span>
                    <span className="flex-1 flex gap-2 justify-end">
                      <button
                        onClick={() => handleVote(poll.title, team.name)}
                        className="px-4 py-2 text-sm rounded-md bg-[#afd89e] text-custom font-semibold hover:bg-[#9ec28e]"
                      >
                        Vote
                      </button>
                    </span>
                  </div>
                );
              })}
              <div className="mt-4 text-sm font-semibold">
                Total Votes: {totalVotes}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OutcomePoll;
