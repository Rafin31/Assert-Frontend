import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useAuth } from "../../Context/AuthContext";
import { getUserVotes, processFixtureResult } from "../../Services/votingService";

dayjs.extend(duration);

const MyResult = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [now, setNow] = useState(Date.now());
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const votesPerPage = 10;

  const { data: votes = [], isLoading, isError } = useQuery({
    queryKey: ["userVotes", userId],
    queryFn: () => getUserVotes(userId),
    enabled: !!userId,
    refetchInterval: 1000 * 60 * 1,
  });

  const { mutate: triggerResultProcessing } = useMutation({
    mutationFn: (fixtureId) => processFixtureResult(fixtureId),
  });

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!votes || !votes.length) return;
    votes.forEach((v) => {
      const isTimePassed = dayjs(v.processAfterTime).isBefore(dayjs());
      if (!v.isProcessed && isTimePassed) {
        triggerResultProcessing(v.fixtureId);
      }
    });
  }, [votes, triggerResultProcessing]);

  const countdown = (publishISO) => {
    const diff = dayjs(publishISO).diff(now);
    if (diff <= 0) return "Result Published";
    const d = dayjs.duration(diff);
    return `${d.days() ? d.days() + "d " : ""}${d.hours()}h ${d.minutes()}m ${d.seconds()}s`;
  };

  const filteredVotes = votes
    .filter((v) => {
      const searchText = searchTerm.toLowerCase();
      return (
        v.teamVoted?.toLowerCase().includes(searchText) ||
        v.matchResult?.toLowerCase().includes(searchText)
      );
    })
    .filter((v) => {
      const published = dayjs(v.processAfterTime).diff(now) <= 0;
      const won = v.teamVoted === v.matchResult;
      switch (filter) {
        case "win": return published && v.isProcessed && won;
        case "lose": return published && v.isProcessed && !won;
        case "pending": return !published;
        case "rewarded": return v.isRewarded;
        default: return true;
      }
    });

  const sortedVotes = filteredVotes.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const totalPages = Math.ceil(sortedVotes.length / votesPerPage);
  const startIndex = (currentPage - 1) * votesPerPage;
  const currentVotes = sortedVotes.slice(startIndex, startIndex + votesPerPage);

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (isLoading) {
    return <div className="mt-10 max-w-[1450px] min-h-[50vh] mx-auto grid grid-cols-1 gap-3">
      {[...Array(6)].map((_, idx) => (
        <div key={idx} className="skeleton h-[50px] w-full rounded-sm" />
      ))}
    </div>
  }


  if (isError) return <p className="text-center py-8 text-error">Something went wrong.</p>;

  return (
    <section className="max-w-[1450px] mx-auto px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          My Predictions
          <span className="badge badge-sm badge-outline badge-primary">Match Results</span>
        </h2>
        <div className="inline-flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </span>
          <span className="text-red-500 font-semibold uppercase text-sm">Live</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Team or Result"
          className="input input-bordered w-full md:max-w-sm"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="select select-bordered md:max-w-xs w-full"
        >
          <option value="all">All</option>
          <option value="win">Win</option>
          <option value="lose">Lose</option>
          <option value="pending">Pending</option>
          <option value="rewarded">Rewarded</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg shadow ring-1 ring-gray-300">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-3 text-left">Fixture ID</th>
              <th className="px-4 py-3 text-left">Team Voted</th>
              <th className="px-4 py-3 text-left">Match Result</th>
              <th className="px-4 py-3 text-left">Rewarded</th>
              <th className="px-4 py-3 text-left">Match Start (UTC)</th>
              <th className="px-4 py-3 text-left">Result Countdown</th>
              <th className="px-4 py-3 text-left">Win / Lose</th>
              <th className="px-4 py-3 text-left">Token Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {currentVotes.map((v) => {
              const published = dayjs(v.processAfterTime).diff(now) <= 0;
              let outcomeLabel, outcomeClass, tokenOutcome = "";
              if (!published) {
                outcomeLabel = "Pending";
                outcomeClass = "text-gray-500";
              } else if (!v.isProcessed) {
                outcomeLabel = "Processing...";
                outcomeClass = "text-orange-500";
              } else if (v.teamVoted === v.matchResult) {
                outcomeLabel = "Win";
                outcomeClass = "text-green-600 font-semibold";
                tokenOutcome = "+10";
              } else {
                outcomeLabel = "Lose";
                outcomeClass = "text-red-600 font-semibold";
                tokenOutcome = "-5";
              }

              return (
                <tr key={v._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">{v.fixtureId}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{v.teamVoted}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{v.matchResult || "-"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{v.isRewarded ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{dayjs(v.matchStartTime).format("D MMM YYYY h:mm A")}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{published ? "Result Published" : countdown(v.processAfterTime)}</td>
                  <td className={`px-4 py-3 whitespace-nowrap ${outcomeClass}`}>{outcomeLabel}</td>
                  <td className={`px-4 py-3 whitespace-nowrap font-semibold ${tokenOutcome.startsWith('+') ? 'text-green-500' : tokenOutcome.startsWith('-') ? 'text-red-500' : 'text-gray-400'}`}>
                    {tokenOutcome || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mt-6 gap-4">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className="btn btn-sm btn-outline"
        >
          Previous
        </button>
        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="btn btn-sm btn-outline"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default MyResult;
