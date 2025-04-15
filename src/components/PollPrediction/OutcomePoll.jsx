import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import ServerApi from "../../api/ServerAPI";

const OutcomePoll = ({ data = [] }) => {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [selectedPoll, setSelectedPoll] = useState(null);

  useEffect(() => {
    setPolls(data); // Load initial poll data
  }, [data]);

  useEffect(() => {
    if (selectedPoll && modalType) {
      const modal = document.getElementById("global_modal");
      if (modal && typeof modal.showModal === "function") {
        modal.showModal();
      }
    }
  }, [selectedPoll, modalType]);

  const handleVote = async (pollId, optionId) => {
    try {
      const res = await ServerApi.put(`/userPoll/${pollId}/vote`, {
        optionId,
        username: user.userName,
        email: user.email,
      });

      const updatedPoll = res.data.updatedPoll;

      // Replace only the updated poll in state
      setPolls((prevPolls) =>
        prevPolls.map((poll) => (poll._id === updatedPoll._id ? updatedPoll : poll))
      );
    } catch (error) {
      console.error("Vote error:", error.response?.data || error.message);
    }
  };

  const capitalize = (text) => text?.charAt(0).toUpperCase() + text?.slice(1);

  const openModal = (poll, type) => {
    setSelectedPoll(poll);
    setModalType(type);
  
    const modal = document.getElementById("global_modal");
    if (modal && typeof modal.showModal === "function") {
      modal.close(); // Close first if already open
      modal.showModal();
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-6 mt-10">
      {polls.map((poll) => {
        if (!poll || !Array.isArray(poll.outcome)) return null;

        const totalVotes = poll.outcome.reduce((acc, o) => acc + o.votes, 0);

        return (
          <div key={poll._id} className="min-w-[350px] w-full max-w-sm rounded-xl shadow-lg p-5">
            <div className="text-sm text-gray-500 mb-2">
              {capitalize(poll.realm)} {capitalize(poll.category)} {capitalize(poll.subcategory)}
            </div>

            <div className="text-lg font-bold mb-4">{poll.question}</div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between font-bold text-base">
                <span className="flex-2">Outcome</span>
                <span className="flex-1 text-center">Votes</span>
                <span className="flex-1 text-center">Chance</span>
                <span className="flex-1"></span>
              </div>

              {poll.outcome.map((opt) => {
                const chance = totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0;
                return (
                  <div key={opt._id} className="flex justify-between items-center">
                    <span className="flex-2 font-bold text-sm">{opt.name}</span>
                    <span className="flex-1 text-center font-semibold text-sm">{opt.votes}</span>
                    <span className="flex-1 text-center text-sm">{chance.toFixed(1)}%</span>
                    <span className="flex-1 flex gap-2 justify-end text-sm">
                      <button
                        onClick={() => handleVote(poll._id, opt._id)}
                        className="px-4 py-2 text-sm rounded-md bg-[#afd89e] text-custom font-semibold hover:bg-[#9ec28e]"
                      >
                        Vote
                      </button>
                    </span>
                  </div>
                );
              })}

              <div className="mt-2 text-sm font-semibold text-center">
                Total Votes: {totalVotes}
              </div>
            </div>

            <div className="flex justify-between mt-3">
              <span className="link link-primary cursor-pointer" onClick={() => openModal(poll, "votes")}>Votes</span>
              <span className="link link-primary cursor-pointer" onClick={() => openModal(poll, "rules")}>Rules</span>
            </div>
          </div>
        );
      })}

      {/* Shared Modal */}
      <dialog id="global_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          {modalType === "votes" && selectedPoll?.outcome && (
            <>
              <h3 className="font-bold text-lg mt-2 mb-2">Vote Summary</h3>
              <p className="mb-4">{selectedPoll?.question}</p>
              <ul className=" pl-5 text-sm mb-4">
                {selectedPoll.outcome.map((opt, i) => (
                  
                    
                    <ul className="list-inside ml-4 mt-1">
                      {opt.voters.length > 0 ? (
                        opt.voters.map((voter, index) => (
                          <div key={index}>{voter.username} voted for <strong>{opt.name}</strong></div>
                        ))
                      ) : (
                        <li className="italic text-gray-500"></li>
                      )}
                    </ul>
                  
                ))}
              </ul>
            </>
          )}

          {modalType === "rules" && selectedPoll && (
            <>
              <h3 className="font-bold text-lg mb-2">Rules</h3>
              <p className="mb-4">{selectedPoll.question}</p>
              <ul className="list-disc pl-5 text-sm">
                <li>One vote per user per option</li>
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
