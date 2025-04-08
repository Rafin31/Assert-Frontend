import ServerApi from "../api/ServerAPI";

export const submitDebate = async (data) => {
    const response = await ServerApi.post("/form/submit", data);
    return response.data;
};

export const submitQuery = async (data) => {
    const response = await ServerApi.post("/form/submit", data);
    return response.data;
};
