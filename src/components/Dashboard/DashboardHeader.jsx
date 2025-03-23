export default function DashboardHeader() {
    return (
        <header className="bg-base-100 shadow px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-primary">Dashboard</h1>
            <button className="btn btn-accent btn-sm">Claim Daily Reward</button>
        </header>
    );
}
