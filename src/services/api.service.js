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

export const updateQuest = async (questId, quest) => {
    const response = await axios.put(`/api/tasks/${questId}`, quest);
    return response.data;
}

export const deleteQuest = async (questId) => {
    const response = await axios.delete(`/api/tasks/${questId}`);
    return response.data;
}

export const getLoginState = async () => {
    const response = await axios.get("/api/login-state");
    return response.data;
}

export const registerUser = async (user) => {
    const response = await axios.post("/api/sign-up", user);
    return response.data;
}

export const loginUser = async (user) => {
    const response = await axios.post("/api/login", user);
    return response.data;
}

export const checkout = async (user) => {
    const response = await axios.post("/api/checkout", user);
    return response.data;
}