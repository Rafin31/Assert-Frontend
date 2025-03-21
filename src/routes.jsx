import { Route, Routes } from 'react-router-dom'
import LandingPage from './Page/LandingPage/LandingPage';
import SportsPredictions from './components/sportsPrediction/sportsPrediction';
import Header from './components/header/Header';
import LoginPage from './Page/Login/Login';
import SignupPage from './Page/Signup/Signup';

export default function AppRouter() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/sports" element={<SportsPredictions />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
            </Routes>
        </>
    );
}
