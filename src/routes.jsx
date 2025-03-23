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

export default function AppRouter() {

    const location = useLocation();
    const isDashboard = location.pathname.startsWith('/dashboard');

    return (
        <>
            <ScrollToTop />
            {!isDashboard && <Header />}

            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/sports" element={<SportsPredictions />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route path="overview" element={<Overview />} />
                    <Route path="predictions" element={<MyPredictions />} />
                    <Route path="wallet" element={<TokenWallet />} />
                    <Route path="create" element={<CreateIssue />} />
                </Route>
            </Routes>

            {!isDashboard && <Footer />}
        </>
    );
}
