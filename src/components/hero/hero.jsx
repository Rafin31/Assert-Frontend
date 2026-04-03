import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const stats = [
    { label: "Active Predictions", value: "2.4K+" },
    { label: "AT Tokens Distributed", value: "180K+" },
    { label: "Registered Users", value: "5K+" },
];

export default function Hero() {
    return (
        <div className="hero-gradient rounded-3xl mx-4 mt-6 mb-0 overflow-hidden">
            <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center gap-2 bg-white border border-violet-200 rounded-full px-4 py-1.5 mb-6 shadow-sm"
                >
                    <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-violet-700 uppercase tracking-wider">Blockchain-Powered Predictions</span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-5"
                >
                    Predict. Win.{" "}
                    <span className="gradient-text">Earn AT Tokens.</span>
                </motion.h1>

                {/* Sub */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg text-slate-500 max-w-2xl mx-auto mb-10"
                >
                    ASSERT is a decentralised prediction market where your knowledge pays off.
                    Vote on sports, politics and technology outcomes — and get rewarded when you're right.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-wrap items-center justify-center gap-3"
                >
                    <Link to="/sports" className="btn-assert text-base px-6 py-2.5">
                        Start Predicting
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                    <Link to="/reward" className="btn-assert-ghost text-base px-6 py-2.5">
                        View Leaderboard
                    </Link>
                </motion.div>

                {/* Stats row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.45 }}
                    className="flex flex-wrap justify-center gap-8 md:gap-16 mt-14 pt-10 border-t border-violet-100"
                >
                    {stats.map((s, i) => (
                        <div key={i} className="text-center">
                            <div className="text-2xl md:text-3xl font-black text-slate-900">{s.value}</div>
                            <div className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">{s.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
