import { useState, useEffect } from "react";
import PredictionCard from "../predictionCard/predictionCard";
import { getFixturesForNext14Days } from '../../Services/FootballService.jsx'

export default function SportsPredictions() {

    const ITEMS_PER_PAGE = 6;
    const [fixtures, setFixtures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(fixtures?.data?.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;



    useEffect(() => {
        const fetchFixtures = async () => {
            try {
                setLoading(true);
                const data = await getFixturesForNext14Days();
                setFixtures(data);
            } catch (err) {
                console.error('Error loading fixtures:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFixtures();
    }, []);


    if (loading) {
        return 'Loading'
    }

    const paginatedFixtures = fixtures.data?.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="mx-auto max-w-[1450px] mt-[50px]">
            <div className="searchBar">
                <label class="input w-full">
                    <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
                    <input type="search" required placeholder="Search" />
                </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
                {
                    !loading ?

                        paginatedFixtures.map((match, index) => (
                            <PredictionCard key={index} match={match} index={index} />
                        ))

                        :
                        <p className="text-center">Loading fixtures...</p>
                }
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
        </div>

    );
}