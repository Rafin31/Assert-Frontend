import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserVotes } from "../../Services/votingService.jsx";

export const fetchVotes = createAsyncThunk(
    "votes/fetchVotes",
    async (userId, { rejectWithValue }) => {
        try {
            const data = await getUserVotes(userId);
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const voteSlice = createSlice({
    name: "votes",
    initialState: {
        items: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVotes.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchVotes.fulfilled, (state, action) => {
                state.items = action.payload;
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(fetchVotes.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default voteSlice.reducer;
