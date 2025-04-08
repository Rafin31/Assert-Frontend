import React from 'react'
import Hero from '../../components/hero/hero'
import SportsPredictions from '../../components/sportsPrediction/sportsPrediction'



export default function LandingPage({ refreshBalance, refreshKey }) {


    return (
        <div className=''>
            <Hero />
            <div className="predictionCards max-w-[1450px] my-[50px] mx-auto px-10">
                <SportsPredictions refreshBalance={refreshBalance} refreshKey={refreshKey} />
            </div>
        </div>

    )
}
