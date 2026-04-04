// Utility functions for booking management

export const isBookingCompleted = (bookingDate, bookingTime) => {
  if (!bookingDate || !bookingTime) return false;

  try {
    // Combine date and time
    const bookingDateTime = new Date(`${bookingDate} ${bookingTime}`);

    // Add some buffer time (e.g., 2 hours after booking time)
    const completionTime = new Date(bookingDateTime.getTime() + (2 * 60 * 60 * 1000)); // 2 hours buffer

    // Check if current time is past the completion time
    return new Date() > completionTime;
  } catch (error) {
    console.error('Error checking booking completion:', error);
    return false;
  }
};

export const formatBookingDateTime = (date, time) => {
  try {
    const dateTime = new Date(`${date} ${time}`);
    return dateTime.toLocaleString();
  } catch (error) {
    return `${date} ${time}`;
  }
};

export const getBookingStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'accepted':
      return 'bg-green-100 text-green-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};