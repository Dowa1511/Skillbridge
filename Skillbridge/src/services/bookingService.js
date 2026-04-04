import api from "./api";

export const bookWorker = (data) => {
  return api.post("/api/bookings/create", data);
};

export const acceptBooking = (bookingId) => {
  return api.put(`/api/bookings/${bookingId}/accept`);
};

export const rejectBooking = (bookingId) => {
  return api.put(`/api/bookings/${bookingId}/reject`);
};

export const completeBooking = (bookingId) => {
  return api.put(`/api/bookings/${bookingId}/complete`);
};
