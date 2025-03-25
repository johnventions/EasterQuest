import axios from "axios";

export const getQuest = async () => {
    const quests = axios.get("/api/quests");
    return quests;
};

export const createQuests = async (quests) => {
    axios.post("/api/quests", {
        quests
    })
};