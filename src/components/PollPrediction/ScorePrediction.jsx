import { useEffect, useState } from "react";
import { getFixturesForDateRange } from "../../Services/FootballService";
import dayjs from "dayjs";

export default function ScorePrediction() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRange, setFilterRange] = useState("next30");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const today = dayjs().format("YYYY-MM-DD");
  const dateRanges = {
    next30: { from: today, to: dayjs().add(30, "day").format("YYYY-MM-DD") },
    next7: { from: today, to: dayjs().add(7, "day").format("YYYY-MM-DD") },
    past7: { from: dayjs().subtract(7, "day").format("YYYY-MM-DD"), to: today },
  };

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        setLoading(true);
        const range = dateRanges[filterRange];
        const data = await getFixturesForDateRange(range.from, range.to);
        setFixtures(data);
      } catch (err) {
        console.error("Error loading fixtures:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFixtures();
  }, [filterRange]);

  const paginatedFixtures = fixtures?.data?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(fixtures?.data?.length / ITEMS_PER_PAGE);

  return (
    <div className="mx-auto max-w-[1450px] py-4">
      <h1 className="text-center text-3xl font-bold mb-4">Predict Scores</h1>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-2 mb-6">
        {Object.keys(dateRanges).map((range) => (
          <button
            key={range}
            className={`btn btn-sm ${filterRange === range ? "bg-[#E64800] text-white" : "btn-outline"}`}
            onClick={() => setFilterRange(range)}
          >
            {range === "next30" ? "Next 30 Days" : range === "next7" ? "Next 7 Days" : "Past 7 Days"}
          </button>
        ))}
      </div>

      {/* Score Prediction Cards */}
      <div className="max-w-[1450px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4 px-10">
        {loading ? (
          [...Array(ITEMS_PER_PAGE)].map((_, i) => (
            <div key={i} className="skeleton h-[280px] w-full rounded-lg"></div>
          ))
        ) : (
          paginatedFixtures?.map((match, idx) => {
            const teamA = match.name.split("vs")[0]?.trim();
            const teamB = match.name.split("vs")[1]?.trim();
            const matchStart = dayjs(match.starting_at);
            const now = dayjs();
            const hasStarted = now.isAfter(matchStart);
            const resultPublished = now.isAfter(matchStart.add(3, "hour"));

            return (
              <div key={idx} className="card bg-base p-5 rounded-xl shadow-md">
                <div className="top min-h-[110px] ">
                  <p className="text-sm text-gray-500 font-semibold">
                    {match?.league?.name || "League"}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    {dayjs(match?.starting_at).format("YYYY-MM-DD | hh:mm A (AEDT)")}
                  </p>
                  <h2 className="font-bold text-center text-lg mb-3">{match.name}</h2>
                </div>
                <div className="flex gap-2 mb-3">
                  <input
                    type="number"
                    min="0"
                    placeholder={`${teamA} Goals`}
                    className="input input-bordered w-full"
                    disabled={hasStarted}
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder={`${teamB} Goals`}
                    className="input input-bordered w-full"
                    disabled={hasStarted}
                  />
                </div>


                <button
                  className="btn btn-block bg-[#27AE6080] text-custom font-semibold hover:bg-[#27AE60] hover:text-white transition-all duration-200"
                  disabled={hasStarted}
                >
                  Submit Prediction
                </button>

                <p className="text-center text-sm font-medium mt-2">
                  {resultPublished ? "Result Published" : hasStarted ? "Match Started" : ""}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
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
      )}
    </div>
  );
}
