// src/services/displayService.js
import ServerApi from "../api/ServerAPI";

export const fetchDisplayData = async () => {
    const response = await ServerApi.get("/display");
    return response.data;
};
