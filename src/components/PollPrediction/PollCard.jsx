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
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-5 flex flex-col justify-between w-full min-w-[280px] max-w-[310px] h-[400px] transition-all duration-300">
      <div className="text-xs text-gray-500 mb-1">{realm} • {category} • {subcategory}</div>
      <p className="text-sm text-gray-600">Posted by <span className="font-semibold">{username}</span><br />{formatTimestamp(timestamp)}</p>
      <h3 className="font-medium text-sm mt-2 mb-3 leading-snug break-words">
        {expanded || question.length <= 90 ? question : `${question.slice(0, 90)}...`}
        {question.length > 90 && (
          <span className="text-blue-600 cursor-pointer ml-1 text-xs" onClick={() => setExpanded(p => !p)}>
            {expanded ? "See less" : "See more"}
          </span>
        )}
      </h3>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${yesPercent >= noPercent ? "bg-green-500" : "bg-red-500"}`}
          style={{ width: `${Math.max(yesPercent, noPercent)}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-600 mt-1">
        <span className="text-green-600">Yes: {yesPercent}%</span>
        <span className="text-red-600">No: {noPercent}%</span>
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={() => handleVote("yes")} disabled={!!userVote} className={`w-1/2 py-1 rounded-md text-sm font-semibold ${userVote ? "bg-green-400 opacity-70 cursor-not-allowed text-white" : "bg-green-100 hover:bg-green-600 hover:text-white"}`}>Yes</button>
        <button onClick={() => handleVote("no")} disabled={!!userVote} className={`w-1/2 py-1 rounded-md text-sm font-semibold ${userVote ? "bg-red-400 opacity-70 cursor-not-allowed text-white" : "bg-red-100 hover:bg-red-500 hover:text-white"}`}>No</button>
      </div>
      <div className="text-center text-xs mt-2 font-mono text-gray-700">
        {countdown.expired ? "Closed" : `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`}
      </div>
      <p className="text-center text-xs text-gray-500">Total Votes: <strong>{totalVotes}</strong></p>
      <div className="flex justify-between text-xs text-blue-600 mt-2 font-medium">
        <button onClick={() => document.getElementById(`modal_${_id}`).showModal()} className="hover:underline">Votes</button>
        <button onClick={() => document.getElementById(`rules_${_id}`).showModal()} className="hover:underline">Rules</button>
      </div>

      {/* Votes Modal */}
      <dialog id={`modal_${_id}`} className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-2">Vote Summary</h3>
          <p className="mb-3 text-sm">{question}</p>
          {paginatedVotes.map((vote, i) => (
            <p key={i} className="text-sm mb-1">
              <strong>{vote.username}</strong> predicted <span className={vote.voteType === 'yes' ? 'text-green-600' : 'text-red-600'}>{vote.voteType.toUpperCase()}</span> at <span className="text-gray-600">{formatTimestamp(vote.timestamp)}</span>
            </p>
          ))}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-gray-800 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>{i + 1}</button>
              ))}
            </div>
          )}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Rules Modal */}
      <dialog id={`rules_${_id}`} className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-2">Rules</h3>
          <p className="mb-2 text-sm">{question}</p>
          {Array.isArray(rule) && rule.length > 0 ? (
            rule.map((r, i) => (
              <div key={i} className="mb-2">
                <p><strong>Condition:</strong> {r.condition}</p>
                <p><strong>Closes:</strong> {formatTimestamp(r.closingDate)}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic text-sm">No rules defined.</p>
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
