import React, { useState } from "react";
import { PollCard } from '../../components/PollPrediction/PollCard';
import OutcomePoll from "../../components/PollPrediction/OutcomePoll";

// Define PollsList as a separate component
const PollsList = () => {
  const polls = [
    { 
      question: "Will Bitcoin reach $100K by 2025?", 
      yesVotes: 20, 
      noVotes: 30, 
      realm: "Politics",
      category: "Crypto", 
      subcategory: "Bitcoin"
    },
    { 
      question: "Will Ethereum surpass $10K by 2025?", 
      yesVotes: 15, 
      noVotes: 18, 
      realm: "Politics",
      category: "Crypto", 
      subcategory: "Ethereum"
    },
    { 
      question: "Will Dogecoin hit $1 again?", 
      yesVotes: 9, 
      noVotes: 11, 
      realm: "Politics",
      category: "Crypto", 
      subcategory: "Dogecoin"
    },
    { 
      question: "Will Tesla stock hit $2000 by 2025?", 
      yesVotes: 21, 
      noVotes: 13, 
      realm: "Politics",
      category: "Stock Market", 
      subcategory: "Tesla"
    },
  ];

  return (
    <div className="flex flex-wrap gap-5 justify-center mt-5">
      {polls.map((poll, index) => (
        <PollCard
          key={index}
          question={poll.question}
          yesVotes={poll.yesVotes}
          noVotes={poll.noVotes}
          realm={poll.realm}
          category={poll.category}       
          subcategory={poll.subcategory} 
        />
      ))}
    </div>
  );
};

// PoliticsPage component
export const PoliticsPage = () => {
  const pollData = [
    {
      realm: "Politics",
      category: "Politics",
      subcategory: "Global Elections",
      title: "Australia Parliamentary Election Winner Prediction",
      outcome: [
        { name: "Liberal-National", votes: 0 },
        { name: "Labour", votes: 0 },
        { name: "Greens", votes: 0 },
        { name: "Others", votes: 0 },
      ],
    },
    {
      realm: "Politics",
      category: "Politics",
      subcategory: "Global Elections",
      title: "Next Prime Minister of Australia Prediction",
      outcome: [
        { name: "Peter Dutton", votes: 0},
        { name: "Anthony Albanese", votes: 0 },
        { name: "Jim Chalmers", votes: 0 },
        { name: "Tanya Plibersek", votes: 0 },
      ],
    },
    {
      realm: "Politics",
      category: "Politics",
      subcategory: "Global Elections",
      title: "Germany Parliamentary Election Winner Prediction",
      outcome: [
        { name: "CDU/CSU", votes: 0 },
        { name: "AfD", votes: 0 },
        { name: "SPD", votes: 0 },
        { name: "Greens", votes: 0 },
        { name: "Others", votes: 0 },
      ],
    },
  ];


  return (
    <div>
      <PollsList />
      <div className="flex flex-col items-center bg-base-100 mt-10">
        <OutcomePoll data={pollData} />
      </div>
    </div>
  );
};