import './App.css'
import AppRouter from './routes'
import { ToastContainer, Slide } from 'react-toastify';
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "./redux/notification/notificationSlice.js";
import { useAuth } from "./Context/AuthContext";
import { fetchVotes } from './redux/votes/voteSlice.js';
import { processFixtureResult } from './Services/votingService.jsx';


function App() {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const votes = useSelector((state) => state.votes.items);

  useEffect(() => {
    let notifInterval, voteInterval;

    if (user?.id) {

      dispatch(fetchVotes(user.id));
      dispatch(fetchNotifications(user.id));

      // Notification polling every 1 min
      notifInterval = setInterval(() => {
        dispatch(fetchNotifications(user.id));
      }, 60 * 1000);

      // Vote polling every 5 mins
      voteInterval = setInterval(() => {
        dispatch(fetchVotes(user.id));
      }, 60 * 1000);
    }

    return () => {
      clearInterval(notifInterval);
      clearInterval(voteInterval);
    };
  }, [dispatch, user?.id]);


  // Automatic result processing from anywhere
  useEffect(() => {
    if (!votes.length) return;

    votes.forEach((v) => {
      const isTimePassed = new Date(v.processAfterTime) <= new Date();
      if (!v.isProcessed && isTimePassed) {
        processFixtureResult(v.fixtureId).catch(() => {
          console.error("Failed to process result");
        });
      }
    });
  }, [votes]);


  console.count()

  return (
    <div data-theme="corporate">
      <AppRouter />
      <ToastContainer
        position="top-center"
        autoClose={1200}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
      />
    </div>

  )
}

export default App
