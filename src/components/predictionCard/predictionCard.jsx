export default function PredictionCard({ match, index, handleVote }) {
    return (
        <div className="card w-full bg-base-100 shadow-xl py-4 border border-gray-200 ">
            <div className="card-body">
                <h2 className="card-title text-lg font-semibold text-gray-900">{match.question}</h2>
                <div className="flex justify-between items-center mt-4">
                    <button
                        className="btn btn-soft btn-success"
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


