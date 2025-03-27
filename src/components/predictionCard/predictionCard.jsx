import dayjs from "dayjs";

export default function PredictionCard({ match }) {


    const teamA = match?.name.split('vs')[0]
    const teamB = match?.name.split('vs')[1]

    return (
        <div className="card w-full shadow-lg py-4">
            <div className="card-body">
                <div className="top grid grid-cols-2 h-[70%]">
                    <div className="left col-span-2">
                        <h2 className="card-title text-lg font-bold">Who will win?</h2>
                        <p className="text-2xl font-semibold text-accent">{match?.name}</p>
                        <p className="text-sm text-gray-500">{`${match?.league?.name} 2025/2026`}</p>
                        <p className="text-sm text-gray-500">
                            {dayjs(match?.starting_at).format('MMMM D, YYYY h:mm A')}
                        </p>
                    </div>
                    <div className="right">
                        <img className="w-[70%]" src={match?.league?.image_path} alt="leagueImage" />
                    </div>
                </div>
                <div className="flex items-center flex-wrap mt-4 justify-center xl:justify-between">
                    <button className="btn btn-lg btn-soft btn-success m-2 w-[40%]">
                        {teamA}
                    </button>
                    <button className="btn btn-lg btn-soft btn-error w-[40%]">
                        {teamB}
                    </button>
                </div>
            </div>
        </div>
    );
}


