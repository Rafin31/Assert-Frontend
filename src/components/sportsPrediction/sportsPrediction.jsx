import { useState, useEffect } from "react";
import PredictionCard from "../predictionCard/predictionCard";
import { getFixturesForDateRange } from '../../Services/FootballService.jsx';
import Skeleton from "../../utils/skeleton.jsx";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function SportsPredictions({ refreshBalance, refreshKey }) {
    const location = useLocation();
    const isSportsPage = location.pathname.startsWith('/sports');

    const [fixtures, setFixtures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRange, setFilterRange] = useState("next7");

    const ITEMS_PER_PAGE = 8;

    const getDateRanges = () => {
        const today = dayjs();
        return {
            next7: { from: today.format('YYYY-MM-DD'), to: today.add(7, 'day').format('YYYY-MM-DD') },
            past7: { from: today.subtract(7, 'day').format('YYYY-MM-DD'), to: today.format('YYYY-MM-DD') },
            pastMonth: { from: today.subtract(1, 'month').format('YYYY-MM-DD'), to: today.format('YYYY-MM-DD') },
        };
    };

    useEffect(() => {
        const fetchFixtures = async () => {
            try {
                setLoading(true);
                const range = getDateRanges()[filterRange];
                const data = await getFixturesForDateRange(range.from, range.to);
                setFixtures(data);
                setCurrentPage(1);
            } catch (err) {
                console.error('Error loading fixtures:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFixtures();
    }, [refreshKey, filterRange]);

    const filteredFixtures = fixtures?.data?.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const totalPages = Math.ceil(filteredFixtures.length / ITEMS_PER_PAGE);
    const paginatedFixtures = filteredFixtures.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const filterOptions = [
        { key: "past7", label: "Past 7 Days" },
        { key: "pastMonth", label: "Past Month" },
        { key: "next7", label: "Next 7 Days" },
    ];

    return (
        <div className={`mx-auto max-w-[1450px] ${isSportsPage && "px-6"}`}>
            {isSportsPage && (
                <div className="mb-6">
                    <h1 className="text-3xl font-black text-slate-900">Sports Predictions</h1>
                    <p className="text-slate-500 text-sm mt-1">Vote on upcoming matches and earn AT tokens for correct picks.</p>
                </div>
            )}

            {/* Filters + search */}
            <div className="flex flex-wrap gap-3 items-center justify-between mb-5">
                <div className="flex gap-2 flex-wrap">
                    {filterOptions.map(opt => (
                        <button
                            key={opt.key}
                            className={`filter-pill ${filterRange === opt.key ? "active" : ""}`}
                            onClick={() => { setFilterRange(opt.key); setCurrentPage(1); }}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                    </svg>
                    <input
                        type="text"
                        className="assert-input pl-9 w-64"
                        placeholder="Search teams..."
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>
            </div>

            {loading ? (
                <Skeleton />
            ) : filteredFixtures.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                    <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mb-4">
                        <svg className="w-7 h-7 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-slate-600 font-semibold">No fixtures found</p>
                    <p className="text-slate-400 text-sm mt-1">Try a different date range or search term.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {paginatedFixtures.map((match, i) => (
                            <motion.div
                                key={match.id || i}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.35, ease: "easeOut" }}
                            >
                                <PredictionCard match={match} index={i} refreshBalance={refreshBalance} refreshKey={refreshKey} />
                            </motion.div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center mt-8 gap-3">
                            <button
                                className="btn-assert-ghost"
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span className="text-sm text-slate-500 font-medium">Page {currentPage} of {totalPages}</span>
                            <button
                                className="btn-assert-ghost"
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
