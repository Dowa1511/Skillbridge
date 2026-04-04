import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastContext";
import { completeBooking } from "../services/bookingService";
import ReviewModal from "../components/ReviewModal";
import { isBookingCompleted } from "../utils/bookingUtils";
import { motion } from "framer-motion";
import { Search, MapPin, DollarSign, Briefcase, Star, Calendar, Clock, CheckCircle } from "lucide-react";

function CustomerDashboard() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [profession, setProfession] = useState("");
  const [workers, setWorkers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reviewModal, setReviewModal] = useState({ isOpen: false, bookingId: null });

  // ======================
  // SEARCH WORKERS
  // ======================
  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setWorkers([]);

    try {
      const res = await fetch(
        "http://localhost:5000/api/worker/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ profession }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Search failed");
      }

      setWorkers(data.workers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // OPEN REVIEW MODAL
  // ======================
  const handleReview = (bookingId) => {
    setReviewModal({ isOpen: true, bookingId });
  };

  // ======================
  // SUBMIT REVIEW
  // ======================
  const handleSubmitReview = async (bookingId, rating, comment) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookingId,
            rating: Number(rating),
            comment,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      addToast("Review submitted successfully! ⭐", "success");
      fetchMyBookings();
    } catch (err) {
      throw err; // Re-throw to let modal handle it
    }
  };

  // ======================
  // COMPLETE BOOKING
  // ======================
  const handleCompleteBooking = async (bookingId) => {
    try {
      await completeBooking(bookingId);
      addToast("Booking marked as completed! ✅", "success");
      fetchMyBookings();
    } catch (err) {
      addToast(err.message || "Failed to complete booking", "error");
    }
  };

  // ======================
  // FETCH CUSTOMER BOOKINGS
  // ======================
  const fetchMyBookings = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/bookings/customer",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setBookings(data.bookings);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden pb-20">
      {/* Background Graphic */}
      <div className="fixed top-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-primary-400/10 shadow-[0_0_100px_rgba(59,130,246,0.3)] rounded-full blur-[120px] animate-pulse-glow z-0 pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-accent-500/10 shadow-[0_0_100px_rgba(139,92,246,0.3)] rounded-full blur-[100px] animate-pulse-glow pointer-events-none z-0" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-12 relative z-10 space-y-10">
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="mb-8"
        >
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                Customer <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">Dashboard</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Find skilled professionals and manage your upcoming bookings.</p>
        </motion.div>

        {/* ================= SEARCH ================= */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card shadow-xl border border-white/40 p-8 rounded-[2rem] bg-white/60 backdrop-blur-3xl"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <Search className="text-primary-500" /> Find Workers
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                <select
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 bg-white/70 text-slate-800 font-semibold focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all appearance-none cursor-pointer shadow-sm"
                >
                <option value="">Select a profession to search...</option>
                <option value="Plumber">Plumber</option>
                <option value="Electrician">Electrician</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Painter">Painter</option>
                <option value="Mechanic">Mechanic</option>
                </select>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading || !profession}
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all hover:scale-[1.02] shadow-lg shadow-slate-900/20 disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Searching...</span>
                </div>
              ) : (
                "Search"
              )}
            </button>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-2xl mb-6 font-medium">
              ⚠️ {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((w, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                key={w._id}
                className="bg-white/80 border border-slate-100 rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:border-primary-200 transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/workers/${w._id}`)}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20 rounded-2xl flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                    <Briefcase size={24} />
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-100/50 px-3 py-1.5 rounded-full border border-yellow-200/50">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-sm text-yellow-700">
                      {w.rating?.avgRating
                        ? `${w.rating.avgRating} (${w.rating.totalReviews})`
                        : "New"}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-1">
                        {w.profession}
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">{w.user?.name || 'Professional'}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <MapPin size={16} className="text-slate-400" />
                    <span>{w.location?.city || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <DollarSign size={16} className="text-green-500" />
                    <span className="text-green-700 font-bold">₹{w.hourlyRate}/hr</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <Briefcase size={16} className="text-blue-500" />
                    <span className="text-blue-700 font-bold">{w.experience} yrs exp.</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/workers/${w._id}`);
                  }}
                  className="w-full py-3.5 bg-primary-50 text-primary-700 border border-primary-100 rounded-xl font-bold hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-300"
                >
                  View Profile
                </button>
              </motion.div>
            ))}
          </div>
          {workers.length === 0 && !loading && profession && !error && (
              <div className="text-center py-10 text-slate-500 font-medium">
                  No workers found for this profession.
              </div>
          )}
        </motion.div>

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
              <p className="text-slate-400 text-sm mt-1">Book a worker to get started</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-black text-lg text-slate-900">{b.worker?.profession || "Service"}</h3>
                    <p className="text-slate-500 text-sm font-medium mt-1">Worker ID: {b.worker?._id?.slice(-6).toUpperCase()}</p>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      b.status === "accepted" ? "bg-green-100 text-green-700 border border-green-200" :
                      b.status === "rejected" ? "bg-red-100 text-red-700 border border-red-200" :
                      b.status === "completed" ? "bg-blue-100 text-blue-700 border border-blue-200" :
                      "bg-yellow-100 text-yellow-700 border border-yellow-200"
                    }`}>
                      {b.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                        <Calendar size={16} className="text-slate-400" />
                        <span>Date: <strong className="text-slate-800">{b.date}</strong></span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                        <Clock size={16} className="text-slate-400" />
                        <span>Time: <strong className="text-slate-800">{b.time}</strong></span>
                    </div>
                </div>

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
                      <CheckCircle size={18} /> Mark as Completed
                    </button>
                  </div>
                )}

                {b.status === "completed" && (
                  <div>
                    <button
                      onClick={() => handleReview(b._id)}
                      className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:from-yellow-500 hover:to-amber-600 transition-all hover:scale-[1.02] shadow-lg shadow-amber-500/20"
                    >
                      <Star size={18} className="fill-white" /> Rate Worker
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ isOpen: false, bookingId: null })}
        onSubmit={handleSubmitReview}
        bookingId={reviewModal.bookingId}
      />
    </div>
  );
}

export default CustomerDashboard;