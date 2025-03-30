import React, { useState } from "react";
import { PollCard } from '../../components/PollPrediction/PollCard';
import OutcomePoll from "../../components/PollPrediction/OutcomePoll";

// Define PollsList as a separate component
const PollsList = () => {
  const polls = [
    { 
      question: "Will OpenAI release an open source model before July?", 
      yesVotes: 20, 
      noVotes: 30, 
      realm: "Technology",
      category: "AI", 
      subcategory: ""
    },
    { 
      question: "DeepSeek V4 released before May?", 
      yesVotes: 15, 
      noVotes: 18, 
      realm: "Technology",
      category: "AI", 
      subcategory: ""
    },
    { 
      question: "Will Elon Musk buy OpenAI before May?", 
      yesVotes: 9, 
      noVotes: 11, 
      realm: "Technology",
      category: "AI", 
      subcategory: ""
    },
    { 
      question: "Will DeepSeek be #1 model before July?", 
      yesVotes: 21, 
      noVotes: 13, 
      realm: "Technology",
      category: "AI", 
      subcategory: ""
    },
  ];

  return (
    <div className="flex flex-wrap gap-5 justify-center mt-5">
      {polls.map((poll) => (
        <PollCard
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
export const TechnologyPage = () => {
  const pollData = [
    {
      realm: "Technology",
      category: "Technology",
      subcategory: "Global Elections",
      title: "Which company has best AI model end of 2025?",
      outcome: [
        { name: "Google", votes: 0 },
        { name: "OpenAI", votes: 0 },
        { name: "xAI", votes: 0 },
        { name: "Anthropic", votes: 0 },
        { name: "DeepSeek", votes: 0 },
        { name: "Alibaba", votes: 0 },
        { name: "Meta", votes: 0 },
      ],
    },
    {
      realm: "Technology",
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
      realm: "Technology",
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