import React from 'react'
import { Link } from 'react-router-dom'

export default function Hero() {
    return (
        <div className="hero bg-base-200 min-h-[50vh]">
            <div className="hero-content text-center">
                <div className="">
                    <h1 className="text-2xl font-bold">Welcome to ASSERT world</h1>
                    <p className="py-6 text-sm">
                        ASSERT is a blockchain-powered prediction platform where users can participate in market and sports predictions, earn rewards, and engage in decentralized decision-making.
                        Join the revolution and make informed predictions with transparency and security.
                    </p>
                    <Link to="/login" className="text-[black] font-bold btn btn-md btn-outline btn-success w-[150px]">Start Winning</Link>
                </div>
            </div>
        </div>
    )
}
