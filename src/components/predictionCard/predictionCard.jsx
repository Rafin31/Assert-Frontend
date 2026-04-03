import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { castVote, getUserVotes } from "../../Services/votingService.jsx";
import { useAuth } from "../../Context/AuthContext.jsx";
import { Slide, toast } from "react-toastify";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

dayjs.extend(relativeTime);
dayjs.extend(duration);

export default function PredictionCard({ match, index, refreshBalance }) {
  const { user } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [isMatchStarted, setIsMatchStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  const teamA = match?.name.split("vs")[0]?.trim();
  const teamB = match?.name.split("vs")[1]?.trim();
  const modalId = `vote_modal_${index}`;
  const matchStartTime = dayjs(match?.starting_at);

  useEffect(() => {
    setUserVote(null);
    const fetchVotes = async () => {
      if (!user) return;
      try {
        const res = await getUserVotes(user?.id);
        const vote = res?.find(v => v.fixtureId === match.id);
        if (vote) setUserVote(vote.teamVoted);
      } catch { /* silent */ }
    };
    fetchVotes();
  }, [user, match.id]);

  useEffect(() => {
    const update = () => {
      const diff = matchStartTime.diff(dayjs());
      if (diff <= 0) { setIsMatchStarted(true); return; }
      const d = dayjs.duration(diff);
      setTimeLeft({ d: d.days(), h: d.hours(), m: d.minutes(), s: d.seconds() });
      setIsMatchStarted(false);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [match.id]);

  const openVoteModal = (team) => {
    if (!user) {
      toast.error("Please log in to vote.", { position: "top-center", autoClose: 2000, theme: "light", transition: Slide });
      return;
    }
    setSelectedTeam(team);
    document.getElementById(modalId).showModal();
  };

  const handleVote = async () => {
    setLoading(true);
    try {
      const res = await castVote({ userId: user?.id, fixtureId: match?.id, teamVoted: selectedTeam });
      toast.success(res.message, { position: "top-center", autoClose: 2000, theme: "light" });
      setUserVote(selectedTeam);
      refreshBalance();
    } catch (err) {
      toast.error(err.message || "Vote failed.", { position: "top-center", autoClose: 2000, theme: "light" });
    }
    setLoading(false);
    document.getElementById(modalId).close();
  };

  const resultPublished = dayjs().isAfter(matchStartTime.add(3, "hour"));

  return (
    <div className="assert-card flex flex-col justify-between min-h-[280px] p-5">
      {/* League + date */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{match?.league?.name || "Football"}</p>
          <p className="text-xs text-slate-400">{dayjs(matchStartTime).format("D MMM YYYY · h:mm A")}</p>
        </div>
        <span className="text-xs bg-violet-100 text-violet-700 font-semibold px-2 py-0.5 rounded-full">Match</span>
      </div>

      {/* Teams */}
      <div className="flex-1">
        <p className="font-bold text-slate-800 text-base mb-1 leading-snug">{match?.name}</p>
        <p className="text-xs text-slate-400 mb-4">Who will win?</p>

        {userVote ? (
          <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-xl p-3">
            <svg className="w-4 h-4 text-violet-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-violet-700 font-medium">Voted: <strong>{userVote}</strong></p>
          </div>
        ) : !isMatchStarted ? (
          <div className="flex gap-2">
            <button onClick={() => openVoteModal(teamA)} className="team-btn">{teamA}</button>
            <button onClick={() => openVoteModal(teamB)} className="team-btn">{teamB}</button>
          </div>
        ) : null}
      </div>

      {/* Countdown or status */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        {!isMatchStarted ? (
          <div className="flex items-center justify-center gap-1.5">
            {[{ v: timeLeft.d, l: "D" }, { v: timeLeft.h, l: "H" }, { v: timeLeft.m, l: "M" }, { v: timeLeft.s, l: "S" }].map(({ v, l }) => (
              <div key={l} className="countdown-block">
                <span className="num">{String(v).padStart(2, "0")}</span>
                <span className="lbl">{l}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center text-sm font-bold ${resultPublished ? "text-emerald-600" : "text-orange-500"}`}>
            {resultPublished ? "✓ Result Published" : "● Match in Progress"}
          </div>
        )}
      </div>

      {/* Confirm modal */}
      <dialog id={modalId} className="modal">
        <div className="modal-box rounded-2xl max-w-sm">
          <h3 className="font-bold text-lg text-slate-800 mb-1">Confirm Vote</h3>
          <p className="text-slate-500 text-sm mb-1">You are voting for:</p>
          <p className="text-xl font-black text-violet-700 mb-3">{selectedTeam}</p>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4">
            <p className="text-orange-700 text-sm font-semibold flex items-center gap-1.5">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              5 AT tokens will be deducted from your wallet.
            </p>
          </div>
          <div className="modal-action mt-0 gap-2">
            <button className="btn-assert" onClick={handleVote} disabled={loading}>
              {loading ? "Processing..." : "Confirm Vote"}
            </button>
            <button className="btn-assert-ghost" onClick={() => document.getElementById(modalId).close()}>Cancel</button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
