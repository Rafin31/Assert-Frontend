import { configureStore } from "@reduxjs/toolkit";
import notifications from "./notification/notificationSlice.js";
import votes from "./votes/voteSlice";

export const store = configureStore({
    reducer: {
        notifications,
        votes
    }
});
