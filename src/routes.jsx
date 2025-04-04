import { Route, Routes, useLocation } from 'react-router-dom'
import LandingPage from './Page/LandingPage/LandingPage';
import SportsPredictions from './components/sportsPrediction/sportsPrediction';
import Header from './components/header/header';
import LoginPage from './Page/Login/Login';
import SignupPage from './Page/Signup/Signup';
import Footer from './components/footer/footer';
import ScrollToTop from './components/Utils/ScrollToTop'

import DashboardLayout from '../src/Layout/DashboardLayout';
import Overview from '../src/Page/Dashboard/Overview';
import MyPredictions from '../src/Page/Dashboard/MyPredictions';
import TokenWallet from '../src/Page/Dashboard/TokenWallet';
import CreateIssue from '../src/Page/Dashboard/CreateIssue';
import PrivateRoute from './Services/privateAuth';
import { useState } from 'react';
import { PoliticsPage } from './Page/Politics/PoliticsPage';
import { TechnologyPage } from './Page/Technology/TechnologyPage';


import CreateQuery from './components/CreateThread/CreateQuery';
import CreateDebate from './components/CreateThread/CreateDebate';
import CreatePrediction from './components/CreateThread/CreatePrediction';
import CreatePoll from './components/CreateThread/CreatePoll';
import DisplayThread from './components/DisplayThread/DisplayThread';
import Reward from './components/Reward/Reward'
import AdminPanel from './components/Admin/AdminPanel'

export default function AppRouter() {
    const location = useLocation();
    const isDashboard = location.pathname.startsWith('/dashboard');
    const isLogin = location.pathname.startsWith('/login');
    const isSignup = location.pathname.startsWith('/signup');


    const [refreshKey, setRefreshKey] = useState(0);

    const refreshBalance = () => {
        setRefreshKey((prevKey) => prevKey + 1);
    };

    console.log(refreshKey)



    return (
        <>
            <ScrollToTop />
            {!isDashboard && <Header refreshBalance={refreshBalance} refreshKey={refreshKey} />}

            <Routes>
                <Route path="/" element={<LandingPage refreshBalance={refreshBalance} refreshKey={refreshKey} />} />
                <Route path="/sports" element={<SportsPredictions />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/politics" element={<PoliticsPage />} />
                <Route path="/technology" element={<TechnologyPage />} />
                <Route path="/thread" element={<DisplayThread />} />
                <Route path="/reward" element={<Reward />} />

                <Route element={<PrivateRoute />}>
                    <Route path="/createquery" element={<CreateQuery />} />
                    <Route path="/createdebate" element={<CreateDebate />} />
                    <Route path="/createprediction" element={<CreatePrediction />} />
                    <Route path="/createpoll" element={<CreatePoll />} />
                    <Route path="/adminpanel" element={<AdminPanel />} />
                </Route>


                <Route path="/dashboard" element={<PrivateRoute />}>
                    <Route element={<DashboardLayout />}>
                        <Route index element={<Overview />} />
                        <Route path="overview" element={<Overview />} />
                        <Route path="predictions" element={<MyPredictions />} />
                        <Route path="wallet" element={<TokenWallet />} />
                        <Route path="create" element={<CreateIssue />} />
                        <Route path="football" element={<SportsPredictions />} />
                    </Route>
                </Route>
            </Routes>

            {!isDashboard && !isLogin && !isSignup && <Footer />}
        </>
    );
}
