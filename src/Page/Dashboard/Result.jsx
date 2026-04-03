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
    refetchInterval: 1000 * 60,
  });

  const { mutate: triggerResultProcessing } = useMutation({
    mutationFn: (fixtureId) => processFixtureResult(fixtureId),
  });

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!votes?.length) return;
    votes.forEach((v) => {
      if (!v.isProcessed && dayjs(v.processAfterTime).isBefore(dayjs())) {
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
      const q = searchTerm.toLowerCase();
      return v.teamVoted?.toLowerCase().includes(q) || v.matchResult?.toLowerCase().includes(q);
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
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalPages = Math.ceil(filteredVotes.length / votesPerPage);
  const currentVotes = filteredVotes.slice((currentPage - 1) * votesPerPage, currentPage * votesPerPage);

  if (isLoading) return (
    <div className="space-y-3 mt-4">
      {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-12 w-full rounded-xl" />)}
    </div>
  );

  if (isError) return <p className="text-center py-8 text-red-500">Something went wrong.</p>;

  const filterOptions = [
    { key: "all", label: "All" },
    { key: "win", label: "Win" },
    { key: "lose", label: "Lose" },
    { key: "pending", label: "Pending" },
    { key: "rewarded", label: "Rewarded" },
  ];

  return (
    <section className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Results</h1>
          <p className="text-slate-500 text-sm mt-0.5 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Live updates
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search by team or result..."
            className="assert-input pl-9 w-full"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map(opt => (
            <button
              key={opt.key}
              onClick={() => { setFilter(opt.key); setCurrentPage(1); }}
              className={`filter-pill ${filter === opt.key ? "active" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="assert-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="assert-table">
            <thead>
              <tr>
                <th>Fixture ID</th>
                <th>Team Voted</th>
                <th>Match Result</th>
                <th>Match Start</th>
                <th>Countdown</th>
                <th>Outcome</th>
                <th>Tokens</th>
                <th>Rewarded</th>
              </tr>
            </thead>
            <tbody>
              {currentVotes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">No results found.</td>
                </tr>
              ) : currentVotes.map((v) => {
                const published = dayjs(v.processAfterTime).diff(now) <= 0;
                let outcomeLabel, badgeClass, tokenOutcome = "";
                if (!published) {
                  outcomeLabel = "Pending";
                  badgeClass = "badge-pending";
                } else if (!v.isProcessed) {
                  outcomeLabel = "Processing";
                  badgeClass = "badge-processing";
                } else if (v.teamVoted === v.matchResult) {
                  outcomeLabel = "Win";
                  badgeClass = "badge-win";
                  tokenOutcome = "+10";
                } else {
                  outcomeLabel = "Lose";
                  badgeClass = "badge-lose";
                  tokenOutcome = "-5";
                }

                return (
                  <tr key={v._id}>
                    <td className="whitespace-nowrap font-mono text-xs text-slate-500">{v.fixtureId}</td>
                    <td className="whitespace-nowrap font-medium">{v.teamVoted}</td>
                    <td className="whitespace-nowrap">{v.matchResult || "—"}</td>
                    <td className="whitespace-nowrap">{dayjs(v.matchStartTime).format("D MMM YYYY · h:mm A")}</td>
                    <td className="whitespace-nowrap text-xs font-mono text-slate-500">{published ? "Published" : countdown(v.processAfterTime)}</td>
                    <td><span className={badgeClass}>{outcomeLabel}</span></td>
                    <td className={`font-bold ${tokenOutcome.startsWith('+') ? 'text-emerald-600' : tokenOutcome.startsWith('-') ? 'text-red-500' : 'text-slate-400'}`}>
                      {tokenOutcome || "—"}
                    </td>
                    <td>{v.isRewarded ? <span className="badge-win">Yes</span> : <span className="text-slate-400 text-xs">No</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-6 gap-3">
          <button className="btn-assert-ghost" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Previous</button>
          <span className="text-sm text-slate-500 font-medium">Page {currentPage} of {totalPages}</span>
          <button className="btn-assert-ghost" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
        </div>
      )}
    </section>
  );
};

export default MyResult;
