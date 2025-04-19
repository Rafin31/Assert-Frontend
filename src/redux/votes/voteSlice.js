import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserVotes } from "../../Services/votingService.jsx";

export const fetchVotes = createAsyncThunk("votes/fetchVotes", async (userId) => {
    const data = await getUserVotes(userId);
    return data;
});

const voteSlice = createSlice({
    name: "votes",
    initialState: {
        items: [],
        status: "idle",
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVotes.fulfilled, (state, action) => {
                state.items = action.payload;
                state.status = "succeeded";
            });
    },
});

export default voteSlice.reducer;
