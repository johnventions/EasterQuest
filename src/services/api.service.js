import axios from "axios";

export const getExamples = async () => {
    const quests = axios.get("/api/examples");
    return quests; 
}

export const getQuests = async () => {
    const quests = await axios.get("/api/tasks");
    const ordered = quests.data.map((q, i) => ({
        ...q,
        displayOrder: (q.type == 0 ? q.itemOrder : i)
      }));
    return ordered;
};

export const getSharedQuests = async (id) => {
    const quests = await axios.get(`/api/shared/${id}`);
    const ordered = quests.data.map((q, i) => ({
        ...q,
        displayOrder: (i.type == 0 ? i.itemOrder : i)
      }));
    return ordered; 
}

export const createQuests = async (list) => {
    const quests = await axios.post("/api/tasks", list);
    const ordered = quests.data.map((q) => ({
        ...q,
        displayOrder: q.itemOrder
      }));
    return ordered;
};

export const updateQuest = async (questId, quest) => {
    const response = await axios.put(`/api/tasks/${questId}`, quest);
    return response.data;
}

export const updateQuestOrder = async(updates) => {
    const response = await axios.post(`/api/tasks/order`, updates);
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

export const logOut = async () => {
    const response = await axios.post("/api/logout");
    return response.data;
}

export const checkout = async (user) => {
    const response = await axios.post("/api/checkout", user);
    return response.data;
}

export const updatePassword = async (data) => {
    const response = await axios.post("/api/password", data);
    return response.data;
}

export const resetPasswordInit =  async (data) => {
    const response = await axios.post("/api/reset-password", data);
    return response.data;
}

export const resetPasswordFinish =  async (data) => {
    const response = await axios.post("/api/set-new-password", data);
    return response.data;
}