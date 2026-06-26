import api from "./api";

export const createReview = (data) => {
  return api.post("/api/reviews", data);
};

export const getWorkerReviews = (workerId) => {
  return api.get(`/api/reviews/worker/${workerId}`);
};

export const getReviewableBookings = () => {
  return api.get("/api/reviews/reviewable");
};
