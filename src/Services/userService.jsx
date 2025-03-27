import ServerApi from '../api/ServerAPI';


export const claimDailyReward = async ({ walletAddress }) => {
    try {
        const response = await ServerApi.post("/users/token/claimDailyReward", { walletAddress });
        return response; // Return success message & updated token balance
    } catch (error) {
        console.error(error || "Failed to claim daily reward");
        throw error;
    }
};

export const userData = async (userId) => {
    try {
        const response = await ServerApi.get(`/users/${userId}`);
        return response; // Return success message & updated token balance
    } catch (error) {
        console.error(error || "Error");
        throw error;
    }
};



