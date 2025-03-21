export default function PredictionCard({ match, index, handleVote }) {
    return (
        <div className="card w-full shadow-xl py-4 ">
            <div className="card-body">
                <h2 className="card-title text-lg font-semibold">{match.question}</h2>
                <div className="flex items-center flex-wrap mt-4 justify-center xl:justify-between">
                    <button
                        className="btn btn-soft btn-success m-5"
                        onClick={() => handleVote(index, "A")}
                    >
                        {match.teamA} ({match.votesA}%)
                    </button>
                    <button
                        className="btn btn-soft btn-error"
                        onClick={() => handleVote(index, "B")}
                    >
                        {match.teamB} ({match.votesB}%)
                    </button>
                </div>
            </div>
        </div>
    );
}


