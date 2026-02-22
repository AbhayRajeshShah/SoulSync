import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // optional
});

export const aiAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PYTHON_URL,
  withCredentials: true, // optional
});

export const quotesApi = axios.create({
  baseURL: "https://zenquotes.io/api/quotes",
});

export default api;
