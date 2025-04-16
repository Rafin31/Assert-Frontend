import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import ServerApi from "../../api/ServerAPI";

const OutcomePoll = ({ data = [], from }) => {
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
    <div className={`${from !== 'create' ? "mx-auto max-w-[1450px] grid grid-cols-1 gap-6 py-4 px-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : ""}`}>

      {polls.map((poll) => {
        if (!poll || !Array.isArray(poll.outcome)) return null;

        const totalVotes = poll.outcome.reduce((acc, o) => acc + o.votes, 0);

        return (
          <div key={poll._id} className="w-full max-w-sm rounded-sm shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]  p-5 flex flex-col justify-between min-h-[320px]">
            {/* Top Section */}
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-3">
              {capitalize(poll.realm)}
            </div>

            {/* Question */}
            <h2 className="text-lg font-bold mb-4 text-custom leading-tight">
              {poll.question}
            </h2>

            {/* Middle Section */}
            <div className="flex flex-col gap-2 flex-grow overflow-y-auto max-h-[180px] px-1">
              <div className="grid grid-cols-4 text-xs font-semibold text-gray-600 pb-2 border-b border-gray-200">
                <span className="col-span-2">Outcome</span>
                <span className="text-center">Votes</span>
                <span className="text-center">Chance</span>
              </div>

              {poll.outcome.map((opt) => {

                const chance = totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0;
                return (
                  <div key={opt._id} className="grid grid-cols-4 items-center text-sm text-custom gap-2">
                    <span className="font-medium">{opt.name}</span>
                    <span className="text-center">{opt.votes}</span>
                    <span className="text-center">{chance.toFixed(1)}%</span>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleVote(poll._id, opt._id)}
                        className="cursor-pointer px-4 py-[6px] text-sm rounded-md bg-[#27AE6080] text-custom font-semibold hover:bg-[#27AE60] hover:text-white transition-all duration-200"
                      >
                        Vote
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3">
              <p className="text-gray-500 text-sm text-center">
                Total Votes: <span className="font-semibold">{totalVotes}</span>
              </p>

              <div className="mt-3 flex justify-between bg-base-200 rounded-lg overflow-hidden text-blue-600 font-semibold text-sm">
                <button
                  className="w-1/2 cursor-pointer py-2 hover:bg-gray-200 border-r border-gray-300"
                  onClick={() => openModal(poll, "votes")}
                >
                  Votes
                </button>
                <button
                  className="w-1/2 py-2 cursor-pointer hover:bg-gray-300"
                  onClick={() => openModal(poll, "rules")}
                >
                  Rules
                </button>
              </div>
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
                {selectedPoll?.outcome?.map((opt) => (


                  <ul className="list-inside ml-4 mt-1">
                    {opt.voters?.length > 0 ? (
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
