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


  const asscVotes = votes.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Calculate pagination
  const totalPages = Math.ceil(asscVotes.length / votesPerPage);
  const startIndex = (currentPage - 1) * votesPerPage;
  const currentVotes = asscVotes.slice(startIndex, startIndex + votesPerPage);



  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // UI States
  if (isLoading) return <p className="text-center py-8">Loading…</p>;
  if (isError) return <p className="text-center py-8 text-error">Something went wrong.</p>;

  return (
    <section className="max-w-[1450px] mx-auto">
      <div className="header flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-4">
          My Predictions <div className="ml-2 badge badge-sm badge-outline badge-primary">Match Results</div>
        </h2>
        <div className="inline-flex items-center space-x-1">
          <div className="relative w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping"></span>
            <span className="relative block w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
          <span className="text-red-500 font-semibold uppercase">Live</span>
        </div>
      </div>

      <table className="table table-sm md:table-md">
        <thead>
          <tr className="bg-primary text-white">
            <th>Fixture ID</th>
            <th>Team Voted</th>
            <th>Match Result</th>
            <th>Rewarded</th>
            <th>Match Start (UTC)</th>
            <th>Result Countdown</th>
            <th>Win / Lose</th>
            <th>Token Outcome</th>
          </tr>
        </thead>
        <tbody>
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
              outcomeClass = "text-success";
              tokenOutcome = "+10";
            } else {
              outcomeLabel = "Lose";
              outcomeClass = "text-error";
              tokenOutcome = "-5";
            }

            return (
              <tr key={v._id}>
                <td>{v.fixtureId}</td>
                <td>{v.teamVoted}</td>
                <td>{v.matchResult || "-"}</td>
                <td>{v.isRewarded ? "Yes" : "No"}</td>
                <td>{dayjs(v.matchStartTime).format("D MMM YYYY h:mm A")}</td>
                <td>{published ? "Result Published" : countdown(v.processAfterTime)}</td>
                <td className={`font-semibold ${outcomeClass}`}>{outcomeLabel}</td>
                <td className={`font-semibold ${tokenOutcome.startsWith('+') ? 'text-green-500' : tokenOutcome.startsWith('-') ? 'text-red-500' : 'text-gray-400'}`}>
                  {tokenOutcome || "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className="btn btn-sm btn-outline mr-3"
        >
          Previous
        </button>

        <span className="text-sm font-medium mr-3">
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
