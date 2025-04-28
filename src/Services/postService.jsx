import ServerApi from "../api/ServerAPI";


export const getAllApproved = async () => {
    try {
        const response = await ServerApi.get("/form/userPosts");
        if (response.data) {
            const sortedData = response.data.data
                .filter(form => form.status === "approved")
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by newest first

            return { success: true, data: sortedData };
        } else {
            return { success: false, message: response.data.message };
        }
    } catch (error) {
        console.error("Error fetching approved posts:", error);
        return { success: false, message: "Failed to fetch posts." };
    }
};

export const toggleLike = async (formId, username, email) => {
    try {
        const response = await ServerApi.put(`/form/${formId}/like`, { username, email });
        return response.data;
    } catch (error) {
        console.error("Error toggling like:", error);
        return { success: false, message: "Failed to update like." };
    }
};

export const addReply = async (formId, username, email, reply) => {
    try {
        const response = await ServerApi.put(`/form/${formId}/reply`, {
            username,
            email,
            reply,
        });
        return response.data;
    } catch (error) {
        console.error("Error adding reply:", error);
        return { success: false, message: "Failed to add reply." };
    }
};