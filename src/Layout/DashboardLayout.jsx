import { Outlet } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar";

export default function DashboardLayout() {
    return (
        <div className="drawer h-screen lg:drawer-open">
            <input id="dash-drawer" type="checkbox" className="drawer-toggle" />

            {/* Main content */}
            <div className="drawer-content flex flex-col lg:ml-64">
                {/* Mobile hamburger */}
                <label htmlFor="dash-drawer" className="btn btn-ghost w-fit m-3 lg:hidden gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span className="font-bold text-sm">Dashboard</span>
                </label>

                <main className="flex-1 overflow-y-auto p-4 md:p-6" style={{ background: 'var(--assert-bg)' }}>
                    <Outlet />
                </main>
            </div>

            {/* Desktop fixed sidebar */}
            <div className="hidden lg:block w-64 fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-100 shadow-sm">
                <Sidebar />
            </div>

            {/* Mobile drawer */}
            <div className="drawer-side lg:hidden z-50">
                <label htmlFor="dash-drawer" className="drawer-overlay"></label>
                <div className="w-64 bg-white border-r border-gray-100 h-full">
                    <Sidebar />
                </div>
            </div>
        </div>
    );
}
