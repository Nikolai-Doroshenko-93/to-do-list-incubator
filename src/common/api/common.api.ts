import axios from "axios";

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "0ca925e4-9f59-4d59-ac63-6da41cf2f0df",
  },
});
