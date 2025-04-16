import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import ServerApi from '../../api/ServerAPI';
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

export const PollCard = ({ data }) => {
  const { user } = useAuth();
  const navigate = useNavigate(); // initialize navigate
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });


  const {
    question,
    outcome = {},
    realm,
    category,
    subcategory,
    username,
    email,
    timestamp,
    rule = {},
    _id,
  } = data;

  const [votes, setVotes] = useState({
    yesVotes: outcome?.yesVotes || [],
    noVotes: outcome?.noVotes || [],
  });

  const [userVote, setUserVote] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const votesPerPage = 10;

  useEffect(() => {
    if (user?.userName) {
      const userVotedYes = votes.yesVotes.find(v => v.username === user.userName);
      const userVotedNo = votes.noVotes.find(v => v.username === user.userName);

      if (userVotedYes) setUserVote("yes");
      else if (userVotedNo) setUserVote("no");
    }
  }, [user, votes]);

  useEffect(() => {
    if (Array.isArray(rule) && rule.length > 0) {
      const nextClosingDate = new Date(Math.min(...rule.map(r => new Date(r.closingDate))));

      const interval = setInterval(() => {
        const now = new Date();
        const distance = nextClosingDate - now;

        if (distance <= 0) {
          clearInterval(interval);
          setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          setCountdown({ days, hours, minutes, seconds, expired: false });
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [rule]);

  if (!data) return <div>Error: No prediction data available</div>;


  const totalVotes = votes.yesVotes.length + votes.noVotes.length;
  const yesPercentage = totalVotes > 0 ? ((votes.yesVotes.length / totalVotes) * 100).toFixed(0) : 0;
  const noPercentage = totalVotes > 0 ? ((votes.noVotes.length / totalVotes) * 100).toFixed(0) : 0;



  const handleVote = async (voteType) => {
    if (!user?.userName || !user?.email) {
      return navigate("/login"); // redirect to login if not authenticated

    }

    if (userVote) return; // already voted

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
        setVotes((prev) => ({
          yesVotes: voteType === "yes" ? [...prev.yesVotes, newVote] : prev.yesVotes,
          noVotes: voteType === "no" ? [...prev.noVotes, newVote] : prev.noVotes,
        }));
        setUserVote(voteType);
      }
    } catch (err) {
      console.error("Voting error:", err);
    }
  };

  const openModal = (id) => {
    setCurrentPage(1); // reset page
    document.getElementById(id).showModal();
  };

  const formatTimestamp = (ts) =>
    new Date(ts).toLocaleString("en-US", {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
    });

  const combinedVotes = [
    ...votes.yesVotes.map(v => ({ ...v, voteType: 'yes' })),
    ...votes.noVotes.map(v => ({ ...v, voteType: 'no' })),
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const totalPages = Math.ceil(combinedVotes.length / votesPerPage);
  const paginatedVotes = combinedVotes.slice(
    (currentPage - 1) * votesPerPage,
    currentPage * votesPerPage
  );

  const progressBarColor = yesPercentage > noPercentage ? "bg-[#afd89e]" : "bg-[#ff7b7a]";
  const progressBarPercentage = Math.max(yesPercentage, noPercentage);

  const capitalize = (text) => text?.charAt(0).toUpperCase() + text?.slice(1);



  return (
    <div className="flex flex-wrap gap-3 justify-center mt-5 w-full sm:w-90 m-1 transform transition-transform hover:scale-102">
      <div className="bg-base-100 rounded-lg p-4 shadow-lg w-90 flex-1 sm:flex-1 md:flex-none">
        <span className="text-base text-md font-semibold">
          {capitalize(realm)} {capitalize(category)} {capitalize(subcategory)}
        </span>
        <br />
        <span className="text-base text-sm">
          Posted by: <span className="font-semibold">{username}</span> at: {formatTimestamp(timestamp)}
        </span>

        <h3 className="font-bold text-xl mt-2 mb-2">{question}</h3>

        <div className="flex flex-wrap gap-3 justify-center">
          <span className="text-green-600 text-sm">Yes: {yesPercentage}% ({votes.yesVotes.length} votes)</span>
          <span className="text-red-600 text-sm">No: {noPercentage}% ({votes.noVotes.length} votes)</span>
        </div>

        <div className="flex justify-center gap-2 mt-4 mb-4">
          <button
            className={`py-2 px-4 rounded-md font-semibold ${userVote === "yes" ? "bg-[#afd89e] cursor-not-allowed opacity-70" : "bg-[#afd89e] hover:bg-[#9ec28e]"
              }`}
            disabled={!!userVote}
            onClick={() => handleVote("yes")}
          >
            Yes
          </button>
          <button
            className={`py-2 px-4 rounded-md font-semibold ${userVote === "no" ? "bg-[#ff7b7a] cursor-not-allowed opacity-70" : "bg-[#ff7b7a] hover:bg-[#e66f6e]"
              }`}
            disabled={!!userVote}
            onClick={() => handleVote("no")}
          >
            No
          </button>
        </div>



        <div className="w-4/5 bg-gray-300 h-2 rounded-full mx-auto my-4">
          <div
            className={`h-full rounded-full ${progressBarColor}`}
            style={{ width: `${progressBarPercentage}%` }}
          ></div>
        </div>



        {userVote && (
          <p className="text-center text-lg ">
            You predicted <span className={userVote === "yes" ? "text-green-600" : "text-red-600"}>{userVote === "yes" ? "Yes" : "No"}</span>
          </p>
        )}


        <p className="text-lg text-base mt-2 countdown font-mono flex justify-center">
          {countdown.expired
            ? "Prediction closed<"
            : `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`}
        </p>

        <p className="text-gray-500 text-sm text-center mt-2">Total Votes: {totalVotes}</p>





        <div className="flex justify-between mt-3">
          <div className="link link-primary cursor-pointer" onClick={() => openModal(`modal_${_id}`)}>
            Votes
          </div>



          <div className="link link-primary cursor-pointer" onClick={() => openModal(`rules_${_id}`)}>
            Rules
          </div>
        </div>



        {/* Votes Modal */}
        <dialog id={`modal_${_id}`} className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg mt-2 mb-2">{question}</h3>
            <p className="font-semibold text-md mb-2">Votes History Yes: {votes.yesVotes.length}, No: {votes.noVotes.length}</p>


            {paginatedVotes.map((vote, i) => (
              <div key={i} className="mb-2">
                <span className="font-semibold">{vote.username}</span> predicted{" "}
                <span className={vote.voteType === "yes" ? "text-green-600" : "text-red-600"}>
                  {vote.voteType === "yes" ? "Yes" : "No"}
                </span>{" "}
                at <span className="text-sm">{formatTimestamp(vote.timestamp)}</span>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 rounded ${currentPage === index + 1
                      ? "bg-gray-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}

            <div className="modal-action">
              <form method="dialog">
                <button className="btn" onClick={() => setCurrentPage(1)}>Close</button>
              </form>
            </div>
          </div>
        </dialog>

        {/* Rules Modal */}
        <dialog id={`rules_${_id}`} className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">

            <h3 className="font-bold text-xl mb-4">{question}</h3>

            {Array.isArray(data.rule) && data.rule.length > 0 ? (
              data.rule.map((r, index) => (
                <div key={index} className="mb-4 ">
                  <p><span className="font-semibold">Condition:</span> {r.condition}</p>
                  <br />
                  <p><span className="font-semibold">Closing Date:</span> {formatTimestamp(r.closingDate)}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No rules provided.</p>
            )}

            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};
