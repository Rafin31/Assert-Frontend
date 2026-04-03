import { useEffect, useState } from "react";
import { getFixturesForDateRange } from "../../Services/FootballService";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Skeleton from "../../utils/skeleton.jsx";

export default function ScorePrediction() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRange, setFilterRange] = useState("next7");
  const [currentPage, setCurrentPage] = useState(1);
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
        console.error("Error loading fixtures:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFixtures();
  }, [filterRange]);

  const filterOptions = [
    { key: "past7", label: "Past 7 Days" },
    { key: "pastMonth", label: "Past Month" },
    { key: "next7", label: "Next 7 Days" },
  ];

  const filteredFixtures = fixtures?.data || [];
  const totalPages = Math.ceil(filteredFixtures.length / ITEMS_PER_PAGE);
  const paginatedFixtures = filteredFixtures.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="mx-auto max-w-[1450px] px-6 py-4">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900">Score Predictions</h1>
        <p className="text-slate-500 text-sm mt-1">Predict exact scores for upcoming matches.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-5">
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
          <p className="text-slate-400 text-sm mt-1">Try a different date range.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginatedFixtures.map((match, i) => {
              const teamA = match.name.split("vs")[0]?.trim();
              const teamB = match.name.split("vs")[1]?.trim();
              const matchStart = dayjs(match.starting_at);
              const hasStarted = dayjs().isAfter(matchStart);
              const resultPublished = dayjs().isAfter(matchStart.add(3, "hour"));

              return (
                <motion.div
                  key={match.id || i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.35, ease: "easeOut" }}
                >
                  <div className="assert-card flex flex-col p-5 min-h-[260px]">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{match?.league?.name || "Football"}</p>
                        <p className="text-xs text-slate-400">{dayjs(match.starting_at).format("D MMM YYYY · h:mm A")}</p>
                      </div>
                      <span className="text-xs bg-orange-100 text-orange-700 font-semibold px-2 py-0.5 rounded-full">Score</span>
                    </div>

                    <p className="font-bold text-slate-800 text-base mb-3 leading-snug">{match.name}</p>

                    <div className="flex gap-2 mb-4">
                      <input
                        type="number"
                        min="0"
                        placeholder={`${teamA} goals`}
                        className="assert-input flex-1 text-sm"
                        disabled={hasStarted}
                      />
                      <input
                        type="number"
                        min="0"
                        placeholder={`${teamB} goals`}
                        className="assert-input flex-1 text-sm"
                        disabled={hasStarted}
                      />
                    </div>

                    <button
                      className={`btn-assert w-full justify-center text-sm py-2 ${hasStarted ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={hasStarted}
                    >
                      Submit Prediction
                    </button>

                    {hasStarted && (
                      <p className={`text-center text-xs font-semibold mt-2 ${resultPublished ? "text-emerald-600" : "text-orange-500"}`}>
                        {resultPublished ? "✓ Result Published" : "● Match in Progress"}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
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
