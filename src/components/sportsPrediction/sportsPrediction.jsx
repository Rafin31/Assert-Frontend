import { useState, useEffect } from "react";
import PredictionCard from "../predictionCard/predictionCard";
import { getFixturesForNext14Days } from '../../Services/FootballService.jsx'

import OutcomePoll from "../PollPrediction/OutcomePoll.jsx";
import ScorePrediction from '../PollPrediction/ScorePrediction.jsx'
import MatchPrediction from '../PollPrediction/MatchPrediction.jsx';
import Skeleton from "../../utils/skeleton.jsx";

export default function SportsPredictions({ refreshBalance, refreshKey }) {




    const pollData = [
        {
            realm: "Sports",
            category: "Football",
            subcategory: "La Liga",
            title: "La Liga Winner 2024-25",
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
            title: "English Premier League Winner 2024-25",
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
            title: "UEFA Champions League Winner 2024-25",
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
            league: "La Liga",
            date: "2025-02-27",
            time: "20:00",
            teams: ["Real Madrid", "Barcelona"],
            category: "Football",
            subcategory: "La Liga",
        },
        {
            league: "Premier League",
            date: "2025-03-16",
            time: "01:30",
            teams: ["Manchester United", "Chelsea"],
            category: "Football",
            subcategory: "Premier League",
        },
        {
            league: "Ligue 1",
            date: "2025-04-03",
            time: "19:45",
            teams: ["Bayern Munich", "PSG"],
            category: "Football",
            subcategory: "Ligue 1",
        },
        {
            league: "Serie A",
            date: "2025-04-05",
            time: "21:00",
            teams: ["Juventus", "AC Milan"],
            category: "Football",
            subcategory: "Serie A",
        },
        {
            league: "Premier League",
            date: "2025-03-16",
            time: "05:30",
            teams: ["Man City", "Liverpool"],
            category: "Football",
            subcategory: "Premier League",
        },
        {
            league: "Premier League",
            date: "2025-03-11",
            time: "18:00",
            teams: ["Arsenal", "Tottenham"],
            category: "Football",
            subcategory: "Premier League",
        },
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
        return <Skeleton />
    }

    const paginatedFixtures = fixtures.data?.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="mx-auto max-w-[1450px]">
            {/* <div className="searchBar">
                <label className="input w-full">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
                    <input type="search" required placeholder="Search" />
                </label>
            </div> */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
                {
                    !loading &&

                    paginatedFixtures.map((match, index) => (
                        <PredictionCard key={index} match={match} index={index} refreshBalance={refreshBalance} refreshKey={refreshKey} />
                    ))


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


            <OutcomePoll data={pollData} />


            <div className="">
                <h1 className="text-center text-3xl font-bold my-8">Upcoming Match Predictions</h1>
                <ScorePrediction data={matchesData} /> {/* Pass the matchesData to the ScorePrediction component */}
            </div>

            <div className="flex flex-wrap gap-5 p-5 justify-center items-center">
                {matchesData.map((match, index) => (
                    <MatchPrediction key={index} matchPredictionData={match} />
                ))}
            </div>
        </div>



    );
}