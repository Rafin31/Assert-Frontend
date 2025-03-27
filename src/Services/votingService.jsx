import ServerApi from '../api/ServerAPI';

export const castVote = async ({ userId, fixtureId, teamVoted }) => {
    try {
        const response = await ServerApi.post('/prediction/vote/castVote', {
            userId,
            fixtureId,
            teamVoted,
        });

        return response.data;
    } catch (error) {
        console.error('Error casting vote:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Voting failed');
    }
};
