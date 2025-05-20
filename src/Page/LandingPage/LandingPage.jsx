import React from 'react'
import Hero from '../../components/hero/hero'
import SportsPredictions from '../../components/sportsPrediction/sportsPrediction'
import OutcomePoll from '../../components/PollPrediction/OutcomePoll';
import MatchPrediction from '../../components/PollPrediction/MatchPrediction';
import ScorePrediction from '../../components/PollPrediction/ScorePrediction';



export default function LandingPage({ refreshBalance, refreshKey }) {



    return (
        <div className='max-w-[1450px] mx-auto'>
            {/* <Hero /> */}
            <div className="predictionCards max-w-[1450px] my-[50px] mx-auto px-10">
                <SportsPredictions refreshBalance={refreshBalance} refreshKey={refreshKey} />
            </div>

            <div className="my-15">
                <ScorePrediction />
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
