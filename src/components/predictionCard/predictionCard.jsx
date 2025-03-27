import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { castVote, getUserVotes } from "../../Services/votingService.jsx";
import { useAuth } from "../../Context/AuthContext.jsx"; // Using auth context
import { Slide, toast } from "react-toastify";

export default function PredictionCard({ match, index }) {
  const { user } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userVote, setUserVote] = useState(null); // Stores the user's previous vote

  const teamA = match?.name.split("vs")[0]?.trim();
  const teamB = match?.name.split("vs")[1]?.trim();

  // Generate a unique modal ID per card
  const modalId = `vote_modal_${index}`;

  // Fetch user votes when the component mounts or when user logs in/out
  useEffect(() => {
    const fetchUserVotes = async () => {
      if (!user) {
        setUserVote(null); // Reset votes when user logs out
        return;
      }

      try {
        const response = await getUserVotes(user?.id);

        if (response.length > 0) {
          const existingVote = response.find(
            (vote) => vote.fixtureId === match.id
          );

          if (existingVote) {
            setUserVote(existingVote.teamVoted);
          }
        }
      } catch (error) {
        console.error("Error fetching user votes:", error);
      }
    };

    fetchUserVotes();
  }, [user, match.id]);

  const openVoteModal = (teamName) => {
    if (!user) {
      toast.error("You must be logged in to vote!", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
        transition: Slide,
      });
      return;
    }

    setSelectedTeam(teamName);
    document.getElementById(modalId).showModal();
  };

  const handleVote = async () => {
    setLoading(true);
    try {
      const data = {
        userId: user?.id || "UserID_Not_Found",
        fixtureId: match?.id,
        teamVoted: selectedTeam,
      };

      const response = await castVote(data);

      toast.success(response.message, {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
        transition: Slide,
      });

      // Update the state to reflect the vote was cast
      setUserVote(selectedTeam);
    } catch (error) {
      toast.error(error.message || "Vote Failed!", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
        transition: Slide,
      });
    }
    setLoading(false);
    document.getElementById(modalId).close();
  };

  return (
    <div className="card w-full shadow-lg py-4">
      <div className="card-body">
        <div className="top grid grid-cols-2 h-[70%]">
          <div className="left col-span-2">
            <h2 className="card-title text-lg font-bold">Who will win?</h2>
            <p className="text-2xl font-semibold text-accent">{match?.name}</p>
            <p className="text-sm text-gray-500">{`${match?.league?.name} 2025/2026`}</p>
            <p className="text-sm text-gray-500">
              {dayjs(match?.starting_at).format("MMMM D, YYYY h:mm A")}
            </p>
          </div>
          <div className="right">
            <img
              className="w-[70%]"
              src={match?.league?.image_path}
              alt="leagueImage"
            />
          </div>
        </div>

        {/* Voting Buttons or Already Voted Message */}
        <div className="flex items-center flex-wrap mt-4 justify-center xl:justify-between">
          {userVote ? (
            <div className="badge badge-lg badge-success mx-auto mt-4 p-5">
              ✅ You voted for <span className="text-primary font-bold">{userVote}</span>{" "}
              in this match.
            </div>
          ) : (
            <>
              <button
                className="btn btn-lg btn-success m-2 w-[40%]"
                onClick={() => openVoteModal(teamA)}
              >
                {teamA}
              </button>
              <button
                className="btn btn-lg btn-error w-[40%]"
                onClick={() => openVoteModal(teamB)}
              >
                {teamB}
              </button>
            </>
          )}
        </div>

        {/* Unique Confirmation Modal for each card */}
        <dialog id={modalId} className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-xl">Confirm Your Vote</h3>
            <p className="py-4 text-xl">
              Are you sure you want to vote for <strong>{selectedTeam}</strong>?
            </p>
            <p className="text-red-500 text-xl">
              5 AT tokens will be deducted.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-success"
                onClick={handleVote}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => document.getElementById(modalId).close()}
              >
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
}
