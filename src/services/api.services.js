import axios from "axios";

export const getExamples = async () => {
    const quests = axios.get("/api/examples");
    return quests; 
}

export const getQuests = async () => {
    const quests = axios.get("/api/tasks");
    return quests;
};

export const createQuests = async (quests) => {
    const response = await axios.post("/api/tasks", quests);
    return response.data;
};