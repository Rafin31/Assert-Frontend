import React from 'react'
import Hero from '../../components/hero/hero'
import SportsPredictions from '../../components/sportsPrediction/sportsPrediction'
import OutcomePoll from '../../components/PollPrediction/OutcomePoll';
import MatchPrediction from '../../components/PollPrediction/MatchPrediction';
import ScorePrediction from '../../components/PollPrediction/ScorePrediction';



export default function LandingPage({ refreshBalance, refreshKey }) {

    const pollData = [
        {
            realm: "Sports",
            category: "Football",
            subcategory: "La Liga",
            question: "La Liga Winner 2024-25",
            outcome: [
                { name: "Barcelona", votes: 0 },
                { name: "Real Madrid", votes: 0 },
                { name: "Atletico Madrid", votes: 0 },
                { name: "Athletic Club", votes: 0 },
                { name: "Villareal", votes: 0 },
            ],
        },
        {
            realm: "Sports",
            category: "Football",
            subcategory: "Premier League",
            question: "English Premier League Winner 2024-25",
            outcome: [
                { name: "Liverpool", votes: 0 },
                { name: "Arsenal", votes: 0 },
                { name: "Nottingham Forest", votes: 0 },
                { name: "Manchester City", votes: 0 },
                { name: "Bournemouth", votes: 0 },
            ],
        },
        {
            realm: "Sports",
            category: "Football",
            subcategory: "UCL",
            question: "UEFA Champions League Winner 2024-25",
            outcome: [
                { name: "Liverpool", votes: 0 },
                { name: "Real Madrid", votes: 0 },
                { name: "Barcelona", votes: 0 },
                { name: "Inter Milan", votes: 0 },
                { name: "Atletico Madrid", votes: 0 },
            ],
        },
        {
            realm: "Sports",
            category: "Football",
            subcategory: "UCL",
            question: "UEFA Champions League Winner 2024-25",
            outcome: [
                { name: "Liverpool", votes: 0 },
                { name: "Real Madrid", votes: 0 },
                { name: "Barcelona", votes: 0 },
                { name: "Inter Milan", votes: 0 },
                { name: "Atletico Madrid", votes: 0 },
            ],
        },
    ];


    const matchesData = [

        {
            league: "NBA",
            date: "2025-03-16",
            time: "15:00",
            teams: ["Los Angeles Lakers", "Chicago Bulls"],
            category: "Basketball",
            subcategory: "NBA",
        },
        {
            league: "MLB",
            date: "2025-04-10",
            time: "18:30",
            teams: ["New York Yankees", "Boston Red Sox"],
            category: "Baseball",
            subcategory: "MLB",
        }
    ];


    return (
        <div className='max-w-[1450px] mx-auto'>
            {/* <Hero /> */}
            <div className="predictionCards max-w-[1450px] my-[50px] mx-auto px-10">
                <SportsPredictions refreshBalance={refreshBalance} refreshKey={refreshKey} />
            </div>

            <OutcomePoll data={pollData} />

            <div className="my-15">
                <ScorePrediction data={matchesData} />
            </div>

            {/* <div className="my-15">
                <h1 className="text-center text-3xl font-bold my-15">Upcoming Match Predictions</h1>
                <div className="flex flex-wrap justify-center items-center gap-10 md:justify-center">
                    {matchesData?.map((match, index) => (
                        <MatchPrediction key={index} matchPredictionData={match} />
                    ))}
                </div>
            </div> */}
        </div>

    )
}
