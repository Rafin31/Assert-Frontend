import ServerApi from "../api/ServerAPI"; // adjusts to your folder layout


export const fetchNotifications = async (userId) => {
    const response = await ServerApi.post("/notifications/getUserNotification", { id: userId });
    return response;
}


export const markAllRead = async (userId) => {
    const response = await ServerApi.patch("/notifications/read", { id: userId });
    return response;
}


export const createNotification = (payload) => ServerApi.post("/notifications", payload);

