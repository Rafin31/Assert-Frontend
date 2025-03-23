import React from 'react'

export default function Hero() {
    return (
        <div className="hero bg-base-200 min-h-[50vh]">
            <div className="hero-content text-center">
                <div className="">
                    <h1 className="text-5xl font-bold">Welcome to ASSERT world</h1>
                    <p className="py-6">
                        ASSERT is a blockchain-powered prediction platform where users can participate in market and sports predictions, earn rewards, and engage in decentralized decision-making.
                        Join the revolution and make informed predictions with transparency and security.
                    </p>
                    <button className="btn btn-lg btn-outline btn-accent w-[250px]">Start Winning</button>
                </div>
            </div>
        </div>
    )
}
