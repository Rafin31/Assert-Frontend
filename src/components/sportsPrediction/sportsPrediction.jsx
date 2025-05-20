import { useState, useEffect } from "react";
import PredictionCard from "../predictionCard/predictionCard";
import { getFixturesForDateRange } from '../../Services/FootballService.jsx';
import OutcomePoll from "../PollPrediction/OutcomePoll.jsx";
import Skeleton from "../../utils/skeleton.jsx";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import { PollCard } from '../PollPrediction/PollCard.jsx';
import { motion } from "framer-motion";


export default function SportsPredictions({ refreshBalance, refreshKey }) {

    const location = useLocation();
    const isSportsPage = location.pathname.startsWith('/sports');

    const [fixtures, setFixtures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRange, setFilterRange] = useState("next30");

    const ITEMS_PER_PAGE = 8;
    const today = dayjs().format('YYYY-MM-DD');
    const dateRanges = {
        next30: { from: today, to: dayjs().add(30, 'day').format('YYYY-MM-DD') },
        next7: { from: today, to: dayjs().add(7, 'day').format('YYYY-MM-DD') },
        past7: { from: dayjs().subtract(7, 'day').format('YYYY-MM-DD'), to: today },
    };

    useEffect(() => {
        const fetchFixtures = async () => {
            try {
                setLoading(true);
                const range = dateRanges[filterRange];
                const data = await getFixturesForDateRange(range.from, range.to);
                setFixtures(data);
            } catch (err) {
                console.error('Error loading fixtures:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFixtures();
    }, [refreshKey, filterRange]);

    const filteredFixtures = fixtures?.data?.filter(fixture =>
        fixture.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredFixtures?.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedFixtures = filteredFixtures?.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className={`mx-auto max-w-[1450px] ${isSportsPage && "px-10"}`}>
            <div className="flex flex-wrap gap-4 items-center py-4 justify-between">
                <div className="flex flex-wrap gap-2">
                    <button className={`btn btn-sm ${filterRange === 'past7' ? 'bg-[#E64800] text-white' : 'btn-outline'}`} onClick={() => setFilterRange('past7')}>Past 7 Days</button>
                    <button className={`btn btn-sm ${filterRange === 'next30' ? 'bg-[#E64800] text-white' : 'btn-outline'}`} onClick={() => setFilterRange('next30')}>Next 30 Days</button>
                    <button className={`btn btn-sm ${filterRange === 'next7' ? 'bg-[#E64800] text-white' : 'btn-outline'}`} onClick={() => setFilterRange('next7')}>Next 7 Days</button>

                </div>
            </div>

            <div className="searchBar w-full">
                <label className="input input-bordered flex items-center gap-2 w-full">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
                    <input type="text" className="grow" placeholder="Search by team name..." onChange={(e) => setSearchTerm(e.target.value)} />
                </label>
            </div>

            {loading ? (
                <Skeleton />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4">
                        {paginatedFixtures.map((match, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
                            >
                                <PredictionCard
                                    match={match}
                                    index={index}
                                    refreshBalance={refreshBalance}
                                    refreshKey={refreshKey}
                                />
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-6 gap-2">
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        <span className="btn btn-ghost btn-sm cursor-default">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
