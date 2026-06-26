import api from "./api";

export const bookWorker = (data) => {
  return api.post("/api/bookings", data);
};

export const acceptBooking = (bookingId) => {
  return api.put(`/api/bookings/${bookingId}/accept`, {});
};

export const rejectBooking = (bookingId) => {
  return api.put(`/api/bookings/${bookingId}/reject`, {});
};

export const completeBooking = (bookingId) => {
  return api.put(`/api/bookings/${bookingId}/complete`, {});
};

export const generateOTP = (bookingId) => {
  return api.post("/api/bookings/generate-otp", { bookingId });
};

export const verifyOTP = (bookingId, otp) => {
  return api.post("/api/bookings/verify-otp", { bookingId, otp });
};
