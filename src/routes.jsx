import { Route, Routes, useLocation } from 'react-router-dom'
import LandingPage from './Page/LandingPage/LandingPage';
import SportsPredictions from './components/sportsPrediction/sportsPrediction';
import Header from './components/header/Header';
import LoginPage from './Page/Login/Login';
import SignupPage from './Page/Signup/Signup';
import Footer from './components/footer/footer';
import ScrollToTop from './components/Utils/ScrollToTop'

import DashboardLayout from '../src/Layout/DashboardLayout';
import Overview from '../src/Page/Dashboard/Overview';
import MyPredictions from '../src/Page/dashboard/MyPredictions';
import TokenWallet from '../src/Page/dashboard/TokenWallet';
import CreateIssue from '../src/Page/dashboard/CreateIssue';
import PrivateRoute from './Services/privateAuth';
import { useState } from 'react';

export default function AppRouter() {
    const location = useLocation();
    const isDashboard = location.pathname.startsWith('/dashboard');
    const isLogin = location.pathname.startsWith('/login');
    const isSignup = location.pathname.startsWith('/signup');


    const [refreshKey, setRefreshKey] = useState(0);

    const refreshBalance = () => {
        setRefreshKey((prevKey) => prevKey + 1);
    };



    return (
        <>
            <ScrollToTop />
            {!isDashboard && <Header refreshBalance={refreshBalance} />}

            <Routes>
                <Route path="/" element={<LandingPage refreshBalance={refreshBalance} />} />
                <Route path="/sports" element={<SportsPredictions />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

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
