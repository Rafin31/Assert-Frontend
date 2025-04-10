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

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const teamA = match?.name.split("vs")[0]?.trim();
  const teamB = match?.name.split("vs")[1]?.trim();
  const modalId = `vote_modal_${index}`;
  const matchStartTime = dayjs(match?.starting_at);

  useEffect(() => {
    setUserVote(null);
    const fetchUserVotes = async () => {
      if (!user) return;
      try {
        const response = await getUserVotes(user?.id);
        const existingVote = response.find((vote) => vote.fixtureId === match.id);
        if (existingVote) {
          setUserVote(existingVote.teamVoted);
        }
      } catch (error) {
        console.error("Error fetching user votes:", error);
      }
    };
    fetchUserVotes();
  }, [user, match.id]);

  useEffect(() => {
    const updateTimer = () => {
      const now = dayjs();
      const timeDiff = matchStartTime.diff(now);
      const matchHasStarted = timeDiff <= 0;
      setIsMatchStarted(matchHasStarted);

      if (!matchHasStarted) {
        const durationTime = dayjs.duration(timeDiff);
        setDays(durationTime.days());
        setHours(durationTime.hours());
        setMinutes(durationTime.minutes());
        setSeconds(durationTime.seconds());
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [match.id]);

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
      setUserVote(selectedTeam);
      refreshBalance();
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
        <div className="top">
          <h2 className="card-title text-lg font-bold">Who will win?</h2>
          <p className="text-xl font-semibold text-accent">{match?.name}</p>
          <p className="text-sm text-gray-500">{`${match?.league?.name}`}</p>
          <p className="text-sm text-gray-500">
            {dayjs(matchStartTime).format("MMMM D, YYYY h:mm A")}
          </p>
        </div>

        <div className="flex items-center flex-wrap mt-4 justify-center xl:justify-between">
          {userVote ? (
            <div className="badge badge-sm text-center badge-success mx-auto mt-4 p-8 lg:badge-lg">
              <p>You voted for <span className="font-bold">{userVote}</span> in this match.</p>
            </div>
          ) : (
            !isMatchStarted && <>
              <button
                className="btn btn-sm btn-success m-2 w-[40%] lg:btn-md"
                onClick={() => openVoteModal(teamA)}
              >
                {teamA}
              </button>
              <button
                className="btn btn-sm btn-error w-[40%] lg:btn-md"
                onClick={() => openVoteModal(teamB)}
              >
                {teamB}
              </button>
            </>
          )}
        </div>

        {/* Countdown or Match Status */}
        <div className="flex justify-center gap-1 mt-2 text-base font-bold">
          {!isMatchStarted ? (
            // Countdown
            <>
              <div className="border border-gray-600 px-2 py-2 rounded-md text-center">
                <span className="text-sm">{days}</span>
                <div className="text-xs">Days</div>
              </div>
              <div className="border border-gray-600 px-2 py-2 rounded-md text-center">
                <span className="text-sm">{hours.toString().padStart(2, "0")}</span>
                <div className="text-xs">Hours</div>
              </div>
              <div className="border border-gray-600 px-2 py-2 rounded-md text-center">
                <span className="text-sm">{minutes.toString().padStart(2, "0")}</span>
                <div className="text-xs">Minutes</div>
              </div>
              <div className="border border-gray-600 px-2 py-2 rounded-md text-center">
                <span className="text-sm">{seconds.toString().padStart(2, "0")}</span>
                <div className="text-xs">Seconds</div>
              </div>
            </>
          ) : (
            // Match started or result published
            <div
              className={`text-lg font-bold ${dayjs().isAfter(matchStartTime.add(3, "hour"))
                ? "text-green-600"
                : "text-red-500"
                }`}
            >
              {dayjs().isAfter(matchStartTime.add(3, "hour"))
                ? "Result Published"
                : "Match Started"}
            </div>
          )}
        </div>

        {/* Vote Modal */}
        <dialog id={modalId} className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-xl">Confirm Your Vote</h3>
            <p className="py-4 text-xl">
              Are you sure you want to vote for <strong>{selectedTeam}</strong>?
            </p>
            <p className="text-red-500 text-xl">5 AT tokens will be deducted.</p>
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
