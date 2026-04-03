import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import ServerApi from "../../api/ServerAPI";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" } })
};

const OutcomePoll = ({ data = [], from }) => {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [countdowns, setCountdowns] = useState({});
  const navigate = useNavigate();

  useEffect(() => { setPolls(data); }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = {};
      polls.forEach((poll) => {
        const closingDateStr = poll.rule?.[0]?.closingDate;
        if (closingDateStr) {
          const diff = new Date(closingDateStr) - new Date();
          if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            updated[poll._id] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
          } else {
            updated[poll._id] = "Poll Closed";
          }
        }
      });
      setCountdowns(updated);
    }, 1000);
    return () => clearInterval(interval);
  }, [polls]);

  const handleVote = async (pollId, optionId) => {
    if (!user) return navigate("/login");
    try {
      const res = await ServerApi.put(`/userPoll/${pollId}/vote`, {
        optionId,
        username: user.userName,
        email: user.email,
        votedAt: new Date().toISOString(),
      });
      const updatedPoll = res.data.updatedPoll;
      setPolls(prev => prev.map(p => p._id === updatedPoll._id ? updatedPoll : p));
    } catch (error) {
      console.error("Vote error:", error.response?.data || error.message);
    }
  };

  const capitalize = (text) => text?.charAt(0).toUpperCase() + text?.slice(1);
  const formatTimestamp = (ts) => new Date(ts).toLocaleString("en-US", {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: true,
  });

  const openModal = (poll, type) => {
    setSelectedPoll(poll);
    setModalType(type);
    const modal = document.getElementById("global_modal");
    if (modal?.showModal) { modal.close(); modal.showModal(); }
  };

  return (
    <div className={`grid gap-5 py-4 ${from === "QueryApproval" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
      {polls.map((poll, index) => {
        if (!poll || !Array.isArray(poll.outcome)) return null;
        const totalVotes = poll.outcome.reduce((acc, o) => acc + o.votes, 0);
        const userHasVoted = poll.outcome.some(opt => opt.voters?.some(v => v.email === user?.email));
        const countdown = countdowns[poll._id] || "";
        const pollClosed = countdown === "Poll Closed";

        return (
          <motion.div key={index} custom={index} initial="hidden" animate="visible" variants={fadeUpVariants}>
            <div className="assert-card flex flex-col min-h-[360px] p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{capitalize(poll.realm)}</span>
                {pollClosed ? (
                  <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">Closed</span>
                ) : (
                  <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">Live</span>
                )}
              </div>

              <p className="text-xs text-slate-400 mb-2">By <span className="font-semibold text-slate-600">{poll.username}</span> · {formatTimestamp(poll.timestamp)}</p>
              <h2 className="text-sm font-bold text-slate-800 mb-4 leading-snug line-clamp-3 break-words flex-1">{poll.question}</h2>

              {/* Options */}
              <div className="space-y-1.5 mb-3">
                <div className="grid grid-cols-4 text-xs font-semibold text-slate-400 pb-1 mb-1 border-b border-slate-100">
                  <span>Outcome</span>
                  <span className="text-center">Votes</span>
                  <span className="text-center">Chance</span>
                  <span className="text-right">Action</span>
                </div>
                {poll.outcome.sort((a, b) => b.votes - a.votes).map((opt) => {
                  const chance = totalVotes ? (opt.votes / totalVotes) * 100 : 0;
                  const userVotedThisOption = opt.voters?.some(v => v.email === user?.email);
                  return (
                    <div key={opt._id} className="grid grid-cols-4 items-center text-sm gap-1">
                      <span className="truncate text-xs text-slate-700 font-medium">{opt.name}</span>
                      <span className="text-center text-xs text-slate-500">{opt.votes}</span>
                      <span className="text-center text-xs text-slate-500">{chance.toFixed(1)}%</span>
                      <button
                        onClick={() => handleVote(poll._id, opt._id)}
                        disabled={userHasVoted || pollClosed}
                        className={`ml-auto px-2 py-1 text-xs rounded-lg font-semibold transition-all ${
                          userVotedThisOption
                            ? "bg-violet-600 text-white"
                            : userHasVoted || pollClosed
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-violet-50 border border-violet-200 text-violet-700 hover:bg-violet-600 hover:text-white hover:border-violet-600"
                        }`}
                      >
                        {userVotedThisOption ? "✓" : "Vote"}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Countdown */}
              {countdown && (
                <p className={`text-center text-xs font-semibold mt-1 ${pollClosed ? "text-red-500" : "text-slate-500 font-mono"}`}>
                  {countdown}
                </p>
              )}
              <p className="text-center text-xs text-slate-400 mt-0.5 mb-3">{totalVotes} vote{totalVotes !== 1 ? "s" : ""} cast</p>

              {/* Actions */}
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => openModal(poll, "votes")}
                  className="flex-1 py-1.5 text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-200 rounded-xl hover:bg-violet-100 transition-colors"
                >
                  Votes
                </button>
                <button
                  onClick={() => openModal(poll, "rules")}
                  className="flex-1 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Rules
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}

      <dialog id="global_modal" className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
        <div className="modal-box rounded-2xl max-w-md">
          {modalType === "votes" && selectedPoll?.outcome && (
            <>
              <h3 className="font-bold text-lg text-slate-800 mb-1">Vote Summary</h3>
              <p className="mb-4 text-sm text-slate-500">{selectedPoll?.question}</p>
              <div className="space-y-1.5">
                {[...selectedPoll.outcome].sort((a, b) => b.votes - a.votes).map((opt) => (
                  <div key={opt._id} className="mb-3">
                    <p className="text-xs font-bold text-violet-700 uppercase mb-1">{opt.name}</p>
                    {opt.voters?.length > 0 ? (
                      opt.voters.map((voter, i) => (
                        <p key={i} className="text-xs text-slate-600 pl-2">
                          <span className="font-medium">{voter.username}</span> — {formatTimestamp(voter.votedAt)}
                        </p>
                      ))
                    ) : (
                      <p className="text-slate-400 italic text-xs pl-2">No votes yet.</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
          {modalType === "rules" && selectedPoll && (
            <>
              <h3 className="font-bold text-lg text-slate-800 mb-1">Rules</h3>
              <p className="mb-4 text-sm text-slate-500">{selectedPoll.question}</p>
              <div className="space-y-2">
                {selectedPoll.rule?.map((r, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm">
                    <p className="font-medium text-slate-700">{r.condition}</p>
                    <p className="text-xs text-slate-400 mt-1">Closes: {new Date(r.closingDate).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </>
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

export default OutcomePoll;
