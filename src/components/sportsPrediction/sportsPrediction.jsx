import { useState } from "react";
import PredictionCard from "../predictionCard/predictionCard";

export default function SportsPredictions() {


    const predictions = [
        {
            question: 'Who will win the Barcelona vs Real Madrid match in La Liga?',
            teamA: 'Barcelona',
            teamB: 'Real Madrid',
            votesA: 60,
            votesB: 40,
        },
        {
            question: 'Who will win between Manchester City vs Liverpool in Premier League?',
            teamA: 'Manchester City',
            teamB: 'Liverpool',
            votesA: 45,
            votesB: 55,
        },
        {
            question: 'Who will win in PSG vs Bayern Munich in Champions League?',
            teamA: 'PSG',
            teamB: 'Bayern Munich',
            votesA: 50,
            votesB: 50,
        },
        {
            question: 'Who will win between Manchester City vs Liverpool in Premier League?',
            teamA: 'Manchester City',
            teamB: 'Liverpool',
            votesA: 45,
            votesB: 55,
        },
        {
            question: 'Who will win in PSG vs Bayern Munich in Champions League?',
            teamA: 'PSG',
            teamB: 'Bayern Munich',
            votesA: 50,
            votesB: 50,
        },
        {
            question: 'Who will win between Manchester City vs Liverpool in Premier League?',
            teamA: 'Manchester City',
            teamB: 'Liverpool',
            votesA: 45,
            votesB: 55,
        },
        {
            question: 'Who will win in PSG vs Bayern Munich in Champions League?',
            teamA: 'PSG',
            teamB: 'Bayern Munich',
            votesA: 50,
            votesB: 50,
        },
        {
            question: 'Who will win between Manchester City vs Liverpool in Premier League?',
            teamA: 'Manchester City',
            teamB: 'Liverpool',
            votesA: 45,
            votesB: 55,
        },
        {
            question: 'Who will win in PSG vs Bayern Munich in Champions League?',
            teamA: 'PSG',
            teamB: 'Bayern Munich',
            votesA: 50,
            votesB: 50,
        }
    ];

    const [votes, setVotes] = useState(predictions);

    const handleVote = (index, team) => {
        setVotes((prevVotes) =>
            prevVotes.map((match, i) => {
                if (i === index) {
                    return {
                        ...match,
                        votesA: team === "A" ? match.votesA + 1 : match.votesA,
                        votesB: team === "B" ? match.votesB + 1 : match.votesB,
                    };
                }
                return match;
            })
        );
    };

    return (
        <div className="mx-5">
            <div className="searchBar">
                <label class="input w-full">
                    <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
                    <input type="search" required placeholder="Search" />
                </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
                {votes.map((match, index) => (
                    <PredictionCard key={index} match={match} index={index} handleVote={handleVote} />
                ))}
            </div>
        </div>

    );
}