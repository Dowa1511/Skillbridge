import api from "./api";

export const signupUser = (data) => {
  return api.post("/api/auth/signup", data);
};

export const loginUser = (data) => {
  return api.post("/api/auth/login", data);
};
