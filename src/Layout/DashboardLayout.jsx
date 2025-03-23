// src/layouts/DashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';

export default function DashboardLayout() {
    return (
        <div className="dashboardContainer flex h-screen ">
            <Sidebar />
            <div className="flex-1 flex flex-col ">
                <DashboardHeader />
                <main className="flex-1 overflow-y-auto p-4 bg-base-200 ">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
