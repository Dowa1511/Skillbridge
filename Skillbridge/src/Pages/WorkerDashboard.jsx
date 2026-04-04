import { useEffect, useState, useCallback } from "react";
import { acceptBooking, rejectBooking, completeBooking } from "../services/bookingService";
import { useToast } from "../components/ToastContext";
import { isBookingCompleted } from "../utils/bookingUtils";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, DollarSign, Briefcase, Star, Calendar, Clock, CheckCircle, XCircle, Award, User } from "lucide-react";

function WorkerDashboard() {
  const token = localStorage.getItem("token");
  const { addToast } = useToast();

  const [worker, setWorker] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  // =========================
  // FETCH WORKER PROFILE
  // =========================
  const fetchWorkerProfile = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/worker/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      setWorker(data.worker);
    } catch (err) {
      setError(err.message);
    }
  }, [token]);

  // =========================
  // FETCH BOOKINGS
  // =========================
  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/bookings/worker", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      setBookings(data.bookings);
    } catch (err) {
      setError(err.message);
    }
  }, [token]);

  // =========================
  // FETCH REVIEWS
  // =========================
  const fetchReviews = async (workerId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/reviews/worker/${workerId}`
      );

      const data = await res.json();
      if (res.ok) setReviews(data.reviews);
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // ACCEPT BOOKING
  // =========================
  const handleAcceptBooking = async (bookingId) => {
    try {
      await acceptBooking(bookingId);
      addToast("Booking accepted successfully!", "success");
      fetchBookings(); // Refresh bookings
    } catch (err) {
      addToast(err.message || "Failed to accept booking", "error");
    }
  };

  // =========================
  // COMPLETE BOOKING
  // =========================
  const handleCompleteBooking = async (bookingId) => {
    try {
      await completeBooking(bookingId);
      addToast("Booking marked as completed! ✅", "success");
      fetchBookings(); // Refresh bookings
    } catch (err) {
      addToast(err.message || "Failed to complete booking", "error");
    }
  };

  useEffect(() => {
    fetchWorkerProfile();
    fetchBookings();
  }, [fetchBookings, fetchWorkerProfile]);

  useEffect(() => {
    if (worker?._id) {
      fetchReviews(worker._id);
    }
  }, [worker]);

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="bg-rose-50 text-rose-600 px-6 py-4 rounded-2xl font-bold shadow-sm border border-rose-100">
            {error}
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden pb-20">
      {/* Background Graphic */}
      <div className="fixed top-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-accent-400/10 shadow-[0_0_100px_rgba(139,92,246,0.3)] rounded-full blur-[120px] animate-pulse-glow z-0 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-emerald-500/10 shadow-[0_0_100px_rgba(16,185,129,0.3)] rounded-full blur-[100px] animate-pulse-glow pointer-events-none z-0" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-12 relative z-10 space-y-8">
        {/* Header */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        >
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                Worker <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-emerald-600">Dashboard</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Manage your bookings, track your earnings, and grow your business.</p>
        </motion.div>

        {/* ================= PROFILE ================= */}
        {worker && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card shadow-xl border border-white/40 rounded-[2rem] bg-white/60 backdrop-blur-3xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/20 blur-3xl rounded-full" />
                <div className="relative z-10 flex items-center space-x-5">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
                    <Briefcase size={36} className="text-accent-300" />
                    </div>
                    <div>
                    <h2 className="text-3xl font-black">{worker.profession}</h2>
                    <p className="text-slate-300 font-medium">Professional Service Provider</p>
                    </div>
                </div>
            </div>
            
            <div className="p-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 bg-white/80 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center">
                    <MapPin size={24} />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Location</p>
                    <p className="font-black text-slate-800 text-lg">{worker.location?.city || "N/A"}</p>
                </div>
              </div>

              <div className="p-5 bg-white/80 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                    <DollarSign size={24} />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Rate</p>
                    <p className="font-black text-emerald-600 text-lg">₹{worker.hourlyRate}/hr</p>
                </div>
              </div>

              <div className="p-5 bg-white/80 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                    <Award size={24} />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Experience</p>
                    <p className="font-black text-blue-600 text-lg">{worker.experience} yrs</p>
                </div>
              </div>

              <div className="p-5 bg-white/80 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${worker.availability ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                    <CheckCircle size={24} />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Status</p>
                    <p className={`font-black text-lg ${worker.availability ? "text-green-600" : "text-red-600"}`}>
                        {worker.availability ? "Available" : "Busy"}
                    </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= BOOKINGS ================= */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card shadow-xl border border-white/40 p-8 rounded-[2rem] bg-white/60 backdrop-blur-3xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent-100 text-accent-600 rounded-xl flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">My Bookings</h2>
          </div>

          {bookings.length === 0 && (
            <div className="text-center py-16 bg-white/50 rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Calendar size={24} />
              </div>
              <p className="text-slate-600 font-bold text-lg">No bookings yet</p>
              <p className="text-slate-400 text-sm mt-1">Your assigned jobs will appear here</p>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {bookings.map((b) => (
              <div key={b._id} className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-50 text-accent-600 rounded-full flex items-center justify-center">
                        <User size={18} />
                    </div>
                    <div>
                        <p className="font-black text-lg text-slate-800">{b.customer?.name || "Customer"}</p>
                        <p className="text-xs font-bold text-slate-400 tracking-wider">BOOKING ID: {b._id.slice(-6).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      b.status === "pending" ? "bg-yellow-100 text-yellow-700 border border-yellow-200" :
                      b.status === "accepted" ? "bg-green-100 text-green-700 border border-green-200" :
                      b.status === "rejected" ? "bg-red-100 text-red-700 border border-red-200" :
                      b.status === "completed" ? "bg-blue-100 text-blue-700 border border-blue-200" :
                      "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}>
                      {b.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-medium text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-slate-400" />
                        <span className="text-slate-800">{b.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-slate-400" />
                        <span className="text-slate-800">{b.time}</span>
                    </div>
                    <div className="flex items-center gap-2 md:col-span-3 lg:col-span-1 truncate">
                        <MapPin size={16} className="text-slate-400 shrink-0" />
                        <span className="truncate" title={b.address}>{b.address}</span>
                    </div>
                </div>

                {b.status === "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAcceptBooking(b._id)}
                      className="flex-1 py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all hover:scale-[1.02]"
                    >
                      <CheckCircle size={18} /> Accept
                    </button>
                    <button
                      onClick={() => handleRejectBooking(b._id)}
                      className="flex-1 py-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all hover:scale-[1.02]"
                    >
                      <XCircle size={18} /> Reject
                    </button>
                  </div>
                )}

                {b.status === "accepted" && (
                  <div>
                    {isBookingCompleted(b.date, b.time) && (
                      <div className="mb-4 p-3 bg-amber-50/50 border border-amber-200/50 rounded-xl text-center">
                        <p className="text-sm font-bold text-amber-800">
                          Time has passed. Mark as completed?
                        </p>
                      </div>
                    )}
                    <button
                      onClick={() => handleCompleteBooking(b._id)}
                      className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all hover:scale-[1.02] shadow-lg shadow-slate-900/20"
                    >
                      <CheckCircle size={18} /> Complete Job
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ================= REVIEWS ================= */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card shadow-xl border border-white/40 p-8 rounded-[2rem] bg-white/60 backdrop-blur-3xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
              <Star size={20} className="fill-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">My Reviews</h2>
          </div>

          {reviews.length === 0 && (
            <div className="text-center py-16 bg-white/50 rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Star size={24} />
              </div>
              <p className="text-slate-600 font-bold text-lg">No reviews yet</p>
              <p className="text-slate-400 text-sm mt-1">Complete jobs to receive feedback</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((r) => (
              <div key={r._id} className="bg-yellow-50/50 border border-yellow-100 rounded-3xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm border border-yellow-200">
                    <Star size={20} className="fill-yellow-500 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-black text-slate-800">{r.rating}</span>
                        <span className="text-sm font-bold text-slate-400">/ 5</span>
                    </div>
                    {r.comment && (
                      <p className="text-slate-600 mb-4 font-medium italic">"{r.comment}"</p>
                    )}
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                      <User size={14} />
                      <span className="uppercase tracking-wide">{r.customer?.name || "Customer"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default WorkerDashboard;