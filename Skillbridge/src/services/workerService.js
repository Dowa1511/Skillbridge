import api from "./api";

export const searchWorkers = (data) => {
  return api.post("/api/worker/search", data);
};
