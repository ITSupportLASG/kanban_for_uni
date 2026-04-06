import axios from "axios";

export const api = axios.create({
  baseURL: "https://kanban-for-uni.onrender.com",
});
