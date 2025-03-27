import ServerApi from "../api/ServerAPI";

export const castVote = async ({ userId, fixtureId, teamVoted }) => {
  try {
    const response = await ServerApi.post("/prediction/vote/castVote", {
      userId,
      fixtureId,
      teamVoted,
    });

    return response.data;
  } catch (error) {
    console.error("Error casting vote:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Voting failed");
  }
};

export const getUserVotes = async (userId) => {
  try {
    const response = await ServerApi.get(`/prediction/vote/user/${userId}`);
    return response.data.votes;
  } catch (error) {
    console.error("Error fetching user votes:", error);
    return [];
  }
};
