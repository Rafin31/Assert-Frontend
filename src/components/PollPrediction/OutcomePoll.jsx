import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import ServerApi from "../../api/ServerAPI";
import { Link, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';


const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut"
    }
  })
};

const OutcomePoll = ({ data = [], from }) => {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [countdowns, setCountdowns] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setPolls(data);
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedCountdowns = {};
      polls.forEach((poll) => {
        const closingDateStr = poll.rule?.[0]?.closingDate;
        if (closingDateStr) {
          const closingDate = new Date(closingDateStr);
          const now = new Date();
          const diff = closingDate - now;
          if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            updatedCountdowns[poll._id] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
          } else {
            updatedCountdowns[poll._id] = "Poll Closed";
          }
        }
      });
      setCountdowns(updatedCountdowns);
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
      setPolls((prevPolls) => prevPolls.map((poll) => poll._id === updatedPoll._id ? updatedPoll : poll));
    } catch (error) {
      console.error("Vote error:", error.response?.data || error.message);
    }
  };

  const capitalize = (text) => text?.charAt(0).toUpperCase() + text?.slice(1);
  const formatTimestamp = (ts) => new Date(ts).toLocaleString("en-US", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
  });

  const openModal = (poll, type) => {
    setSelectedPoll(poll);
    setModalType(type);
    const modal = document.getElementById("global_modal");
    if (modal?.showModal) {
      modal.close();
      modal.showModal();
    }
  };

  return (
    <div className={`grid gap-6 py-4 md:px-0 ${from === "QueryApproval" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
      {polls.map((poll, index) => {
        if (!poll || !Array.isArray(poll.outcome)) return null;
        const totalVotes = poll.outcome.reduce((acc, o) => acc + o.votes, 0);
        const userHasVoted = poll.outcome.some((opt) => opt.voters?.some((v) => v.email === user?.email));
        const countdown = countdowns[poll._id] || "";
        const pollClosed = countdown === "Poll Closed";

        return (

          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
          >

            <div key={poll._id} className="bg-white shadow rounded-lg p-5 flex flex-col min-h-[380px]">
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{capitalize(poll.realm)}</div>
              <span className="text-sm mb-1">Posted by: <span className="font-semibold">{poll.username}</span></span>
              <span className="text-xs mb-2">{formatTimestamp(poll.timestamp)}</span>
              <h2 className="text-md font-bold mb-4 leading-snug text-custom line-clamp-3 break-words">{poll.question}</h2>

              <div className="flex-grow overflow-y-auto">
                <div className="grid grid-cols-4 text-xs font-semibold text-gray-600 border-b pb-1 mb-2">
                  <span>Outcome</span>
                  <span className="text-center">Votes</span>
                  <span className="text-center">Chance</span>
                  <span className="text-right">Action</span>
                </div>
                {poll.outcome.sort((a, b) => b.votes - a.votes).map((opt) => {
                  const chance = totalVotes ? (opt.votes / totalVotes) * 100 : 0;
                  const userVotedThisOption = opt.voters?.some((voter) => voter.email === user?.email);
                  return (
                    <div key={opt._id} className="grid grid-cols-4 items-center text-sm gap-2 mb-1">
                      <span className="truncate">{opt.name}</span>
                      <span className="text-center">{opt.votes}</span>
                      <span className="text-center">{chance.toFixed(1)}%</span>
                      <button
                        onClick={() => handleVote(poll._id, opt._id)}
                        disabled={userHasVoted || pollClosed}
                        className={`ml-auto px-3 py-1 text-xs rounded-md font-semibold transition-all duration-200 ${userVotedThisOption ? "bg-green-600 text-white" : userHasVoted || pollClosed ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-100 hover:bg-green-600 hover:text-white"}`}
                      >
                        {userVotedThisOption ? "Voted" : "Vote"}
                      </button>
                    </div>
                  );
                })}
              </div>

              {countdown && <p className="text-center text-sm font-mono mt-2 text-gray-700">{countdown}</p>}
              <p className="text-center text-xs text-gray-500 mt-1">Total Votes: <strong>{totalVotes}</strong></p>

              <div className="mt-3 flex justify-between bg-gray-50 border rounded-lg text-blue-600 font-medium text-sm">
                <button className="w-1/2 py-2 hover:bg-gray-100 border-r" onClick={() => openModal(poll, "votes")}>Votes</button>
                <button className="w-1/2 py-2 hover:bg-gray-100" onClick={() => openModal(poll, "rules")}>Rules</button>
              </div>
            </div>
          </motion.div>
        );
      })}

      <dialog id="global_modal" className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
        <div className="modal-box">
          {modalType === "votes" && selectedPoll?.outcome && (
            <>
              <h3 className="font-bold text-lg mb-2">Vote Summary</h3>
              <p className="mb-4 font-medium text-sm">{selectedPoll?.question}</p>
              {[...selectedPoll.outcome].sort((a, b) => b.votes - a.votes).map((opt) => (
                <div key={opt._id} className="mb-2">
                  {opt.voters?.length > 0 ? (
                    opt.voters.map((voter, i) => (
                      <p key={i} className="text-sm">
                        <strong>{voter.username}</strong> voted for <strong>{opt.name}</strong> at {formatTimestamp(voter.votedAt)}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-500 italic text-sm">No votes yet for {opt.name}.</p>
                  )}
                </div>
              ))}
            </>
          )}

          {modalType === "rules" && selectedPoll && (
            <>
              <h3 className="font-bold text-lg mb-2">Rules</h3>
              <p className="mb-2 text-sm font-medium">{selectedPoll.question}</p>
              <ul className="list-disc pl-5 text-sm">
                {selectedPoll.rule?.map((r, i) => (
                  <li key={i} className="mb-1">
                    {r.condition} — Closes on {new Date(r.closingDate).toLocaleString()}
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default OutcomePoll;
