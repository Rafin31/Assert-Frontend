import React from 'react'
import Hero from '../../components/hero/hero'
import SportsPredictions from '../../components/sportsPrediction/sportsPrediction'
import Footer from '../../components/footer/footer'

export default function LandingPage() {
    return (
        <div className=''>
            <Hero />
            <div className="predictionCards max-w-[1450px] mx-auto mt-[50px] max-xl:px-5">
                <SportsPredictions />
            </div>
            <Footer />
        </div>

    )
}
