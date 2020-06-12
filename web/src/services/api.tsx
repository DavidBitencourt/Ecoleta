import axios from "axios";

const api = axios.create({
  baseURL: "https://dvd-server-ecoleta.herokuapp.com",
});

export default api;
