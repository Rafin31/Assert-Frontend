import { Outlet } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar";

export default function DashboardLayout() {
    return (
        <div className="drawer h-screen lg:drawer-open">
            {/* Mobile drawer toggle */}
            <input id="dash-drawer" type="checkbox" className="drawer-toggle" />

            {/* ===== Main column ===== */}
            <div className="drawer-content flex flex-col">
                {/* Hamburger (mobile only) */}
                <label htmlFor="dash-drawer" className="btn btn-ghost w-fit m-2 lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span className="ml-2 font-bold">Dashboard</span>
                </label>

                <main className="flex-1 overflow-y-auto p-4 bg-base-200">
                    <Outlet />
                </main>
            </div>

            {/* ===== Sidebar ===== */}
            {/* Fixed and always visible on desktop */}
            <div className="hidden lg:block w-64 fixed inset-y-0 left-0 z-40 bg-[#13242a] text-white">
                <Sidebar />
            </div>

            {/* Drawer side (mobile only) */}
            <div className="drawer-side lg:hidden">
                <label htmlFor="dash-drawer" className="drawer-overlay"></label>
                <div className="w-64 bg-[#13242a] text-white h-full p-4">
                    <Sidebar />
                </div>
            </div>
        </div>
    );
}
