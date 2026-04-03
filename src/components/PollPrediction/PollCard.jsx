import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import ServerApi from '../../api/ServerAPI';
import { useNavigate } from "react-router-dom";

export const PollCard = ({ data }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    question,
    outcome = {},
    realm,
    category,
    subcategory,
    username,
    timestamp,
    rule = [],
    _id,
  } = data;

  const [votes, setVotes] = useState({
    yesVotes: outcome?.yesVotes || [],
    noVotes: outcome?.noVotes || [],
  });
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });
  const [userVote, setUserVote] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const votesPerPage = 10;

  const totalVotes = votes.yesVotes.length + votes.noVotes.length;
  const yesPercent = totalVotes ? ((votes.yesVotes.length / totalVotes) * 100).toFixed(0) : 0;
  const noPercent = totalVotes ? ((votes.noVotes.length / totalVotes) * 100).toFixed(0) : 0;

  const combinedVotes = [
    ...votes.yesVotes.map(v => ({ ...v, voteType: 'yes' })),
    ...votes.noVotes.map(v => ({ ...v, voteType: 'no' }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const totalPages = Math.ceil(combinedVotes.length / votesPerPage);
  const paginatedVotes = combinedVotes.slice((currentPage - 1) * votesPerPage, currentPage * votesPerPage);

  useEffect(() => {
    const userVotedYes = votes.yesVotes.some(v => v.username === user?.userName);
    const userVotedNo = votes.noVotes.some(v => v.username === user?.userName);
    if (userVotedYes) setUserVote("yes");
    else if (userVotedNo) setUserVote("no");
  }, [user, votes]);

  useEffect(() => {
    const targetDate = rule.length ? new Date(Math.min(...rule.map(r => new Date(r.closingDate)))) : null;
    if (!targetDate) return;
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        clearInterval(interval);
      } else {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
          expired: false,
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [rule]);

  const handleVote = async (voteType) => {
    if (!user?.userName || !user?.email) return navigate("/login");
    if (userVote) return;
    try {
      const res = await ServerApi.post("/userPrediction/vote", {
        predictionId: _id,
        voteType,
        username: user.userName,
        email: user.email,
        timestamp: new Date().toISOString(),
      });
      if (res.data.success) {
        const newVote = { username: user.userName, timestamp: new Date().toISOString() };
        setVotes(prev => ({
          yesVotes: voteType === "yes" ? [...prev.yesVotes, newVote] : prev.yesVotes,
          noVotes: voteType === "no" ? [...prev.noVotes, newVote] : prev.noVotes
        }));
        setUserVote(voteType);
      }
    } catch (err) {
      console.error("Vote failed:", err);
    }
  };

  const formatTimestamp = ts => new Date(ts).toLocaleString("en-US", {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true,
  });

  return (
    <div className="assert-card flex flex-col justify-between w-full min-w-[280px] max-w-[310px] min-h-[400px] p-5">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{realm} · {category} · {subcategory}</div>
      <p className="text-xs text-slate-400 mb-2">By <span className="font-semibold text-slate-600">{username}</span> · {formatTimestamp(timestamp)}</p>

      <h3 className="font-semibold text-slate-800 text-sm mt-1 mb-3 leading-snug break-words flex-1">
        {expanded || question.length <= 90 ? question : `${question.slice(0, 90)}...`}
        {question.length > 90 && (
          <span className="text-violet-600 cursor-pointer ml-1 text-xs" onClick={() => setExpanded(p => !p)}>
            {expanded ? "See less" : "See more"}
          </span>
        )}
      </h3>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600"
          style={{ width: `${yesPercent}%` }}
        />
      </div>
      <div className="flex justify-between text-xs mb-3">
        <span className="text-emerald-600 font-medium">Yes {yesPercent}%</span>
        <span className="text-red-500 font-medium">No {noPercent}%</span>
      </div>

      {/* Vote buttons */}
      {userVote ? (
        <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-xl p-2.5 mb-2">
          <svg className="w-4 h-4 text-violet-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-violet-700 font-medium">Voted <strong>{userVote.toUpperCase()}</strong></p>
        </div>
      ) : (
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => handleVote("yes")}
            className="flex-1 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all"
          >
            Yes
          </button>
          <button
            onClick={() => handleVote("no")}
            className="flex-1 py-1.5 rounded-xl text-xs font-semibold bg-red-50 border border-red-200 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
          >
            No
          </button>
        </div>
      )}

      <p className="text-center text-xs text-slate-400 mb-2">{totalVotes} vote{totalVotes !== 1 ? "s" : ""} cast</p>

      {/* Countdown */}
      <div className="text-center text-xs font-mono font-semibold text-slate-500 mb-3">
        {countdown.expired ? (
          <span className="text-red-500">Closed</span>
        ) : (
          `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => document.getElementById(`modal_${_id}`).showModal()}
          className="flex-1 py-1.5 text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-200 rounded-xl hover:bg-violet-100 transition-colors"
        >
          Votes
        </button>
        <button
          onClick={() => document.getElementById(`rules_${_id}`).showModal()}
          className="flex-1 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
        >
          Rules
        </button>
      </div>

      {/* Votes Modal */}
      <dialog id={`modal_${_id}`} className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
        <div className="modal-box rounded-2xl max-w-md">
          <h3 className="font-bold text-lg text-slate-800 mb-1">Vote Summary</h3>
          <p className="mb-4 text-sm text-slate-500">{question}</p>
          <div className="space-y-1.5">
            {paginatedVotes.map((vote, i) => (
              <div key={i} className="flex items-center gap-2 text-sm py-1.5 border-b border-slate-100">
                <span className={`w-12 text-center text-xs font-bold rounded-full py-0.5 ${vote.voteType === 'yes' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                  {vote.voteType.toUpperCase()}
                </span>
                <span className="font-medium text-slate-700">{vote.username}</span>
                <span className="text-slate-400 text-xs ml-auto">{formatTimestamp(vote.timestamp)}</span>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold ${currentPage === i + 1 ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
          <div className="modal-action mt-4">
            <form method="dialog">
              <button className="btn-assert-ghost">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Rules Modal */}
      <dialog id={`rules_${_id}`} className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
        <div className="modal-box rounded-2xl max-w-md">
          <h3 className="font-bold text-lg text-slate-800 mb-1">Rules</h3>
          <p className="mb-4 text-sm text-slate-500">{question}</p>
          {Array.isArray(rule) && rule.length > 0 ? (
            <div className="space-y-3">
              {rule.map((r, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm">
                  <p className="font-medium text-slate-700">{r.condition}</p>
                  <p className="text-slate-400 text-xs mt-1">Closes: {formatTimestamp(r.closingDate)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic text-sm">No rules defined.</p>
          )}
          <div className="modal-action mt-4">
            <form method="dialog">
              <button className="btn-assert-ghost">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};
