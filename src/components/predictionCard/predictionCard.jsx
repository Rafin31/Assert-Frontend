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
    <div className="card w-full shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] flex flex-col justify-between min-h-[260px]">
      <div className="card-body">

        <div className="flex flex-col gap-2 min-h-[200px]">
          <div className="cardTop min-h-[150px] lg:min-h-[120px]">
            <h2 className="card-title text-base font-bold">Who will win?</h2>
            <p className="text-base font-semibold text-accent">{match?.name}</p>
            <p className="text-sm text-gray-500">{match?.league?.name}</p>
            <p className="text-sm text-gray-500">
              {dayjs(matchStartTime).format("MMMM D, YYYY h:mm A")}
            </p>
          </div>

          <div className="flex items-center flex-wrap mt-2 justify-center xl:justify-between">
            {userVote ? (
              <div className="badge badge-soft badge-sm text-center mx-auto badge-success mt-4 px-2 py-5 lg:badge-md">
                <p>You voted for <span className="font-bold">{userVote}</span> in this match.</p>
              </div>
            ) : (
              !isMatchStarted && <>
                <button
                  className="hover:bg-[#219653] bg-[#27AE601A] text-[#27AE60] hover:text-white btn btn-sm m-2 w-[45%] lg:btn-md"
                  onClick={() => openVoteModal(teamA)}
                >
                  {teamA}
                </button>
                <button
                  className="hover:bg-[#E64800] bg-[#FFCDCB] text-[#EB5757] hover:text-white btn btn-sm w-[45%] lg:btn-md"
                  onClick={() => openVoteModal(teamB)}
                >
                  {teamB}
                </button>
              </>
            )}
          </div>

        </div>

        <div className="flex justify-center gap-1 text-base font-bold min-h-[50px] ">
          {!isMatchStarted ? (
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
            <div className={`text-lg font-bold ${dayjs().isAfter(matchStartTime.add(3, "hour")) ? "text-green-600" : "text-red-500"}`}>
              {dayjs().isAfter(matchStartTime.add(3, "hour")) ? "Result Published" : "Match Started"}
            </div>
          )}
        </div>

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
