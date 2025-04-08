import React, { useState } from "react";

export const PollCard = ({ question, yesVotes: initialYesVotes, noVotes: initialNoVotes, realm, category, subcategory, disabled }) => {
    const [yesVotes, setYesVotes] = useState(initialYesVotes);
    const [noVotes, setNoVotes] = useState(initialNoVotes);
  
    const totalVotes = yesVotes + noVotes;
    const yesPercentage = totalVotes > 0 ? ((yesVotes / totalVotes) * 100).toFixed(0) : 0;
    const noPercentage = totalVotes > 0 ? ((noVotes / totalVotes) * 100).toFixed(0) : 0;
  
    const handleYesClick = () => setYesVotes(yesVotes + 1);
    const handleNoClick = () => setNoVotes(noVotes + 1);
  
    // Determine which percentage is higher, and set the progress bar accordingly
    const progressBarColor = yesPercentage > noPercentage ? 'bg-[#afd89e]' : 'bg-[#ff7b7a]'; // Green for Yes, Red for No
    const progressBarPercentage = Math.max(yesPercentage, noPercentage); // Show the higher percentage on the bar
  
    return (
      <div className="flex flex-wrap gap-3 justify-center mt-5 w-full sm:w-90 m-1">
        <div className="bg-base-100 rounded-lg p-4 shadow-lg w-90 flex-1 sm:flex-1 md:flex-none">
          <span className="text-base text-sm">{realm} - {category} - {subcategory}</span> {/* Added subcategory */}
          <h3 className="font-bold text-xl mt-2 mb-2">{question}</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <span className="text-green-600  text-sm">
              Yes: {totalVotes > 0 ? `${yesPercentage}% (${yesVotes} votes)` : "0% (0 votes)"}
            </span>
            <span className="text-red-600 text-sm">
              No: {totalVotes > 0 ? `${noPercentage}% (${noVotes} votes)` : "0% (0 votes)"}
            </span>
          </div>
          
          <div className="flex justify-center gap-2 mt-4 mb-4">
            <button
              className="bg-[#afd89e] text-custom py-2 px-4 rounded-md font-semibold hover:bg-[#9ec28e] cursor-pointer disabled:opacity-50"
              onClick={handleYesClick}
              disabled={disabled}
              aria-label="Vote Yes"
            >
              Yes
            </button>
            <button
              className="bg-[#ff7b7a] text-custom py-2 px-4 rounded-md font-semibold hover:bg-[#e66f6e] cursor-pointer disabled:opacity-50"
              onClick={handleNoClick}
              disabled={disabled}
              aria-label="Vote No"
            >
              No
            </button>
          </div>
  
          <div className="w-4/5 bg-gray-300 h-2 rounded-full mx-auto my-6">
            <div
              className={`h-full rounded-full ${progressBarColor}`}
              style={{ width: `${progressBarPercentage}%` }}
            ></div>
          </div>
          <p className="text-gray-500 text-sm flex flex-wrap justify-center">Total Votes: {totalVotes}</p>
          <div className="flex flex-row justify-between">


            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <div className="link link-primary" onClick={()=>document.getElementById('my_modal_5').showModal()}>Votes</div>
            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Votes History</h3>
                <p className="py-4">Press ESC key or click the button below to close</p>
                <div className="modal-action">
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>


            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <div className="link link-primary" onClick={()=>document.getElementById('my_modal_6').showModal()}>Rules</div>
            <dialog id="my_modal_6" className="modal modal-bottom sm:modal-middle">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Rule</h3>
                <p className="py-4">Press ESC key or click the button below to close</p>
                <div className="modal-action">
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>

        </div>
      </div>
    );
  };