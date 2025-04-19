// redux/notificationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    fetchNotifications as apiFetch,
    markAllRead as apiMarkRead,
} from "../../Services/notificationService.jsx";



const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

export const fetchNotifications = createAsyncThunk(
    "notifications/fetch",
    async (_, { rejectWithValue }) => {
        try {

            if (!loggedInUser.id) return [];

            const { data } = await apiFetch(loggedInUser.id);
            return data?.data || [];
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);

export const clearNotifications = createAsyncThunk(
    "notifications/clear",
    async () => {
        if (!loggedInUser.id) return [];
        await apiMarkRead(loggedInUser.id);
        return true;
    }
);

// slice
const notificationSlice = createSlice({
    name: "notifications",
    initialState: {
        items: [],
        status: "idle",
        unreadCount: 0,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload;
                state.unreadCount = action.payload.filter((n) => !n.read).length;

            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(clearNotifications.fulfilled, (state) => {
                state.items.forEach((n) => (n.read = true));
                state.unreadCount = 0;
            });
    },
});

export default notificationSlice.reducer;
