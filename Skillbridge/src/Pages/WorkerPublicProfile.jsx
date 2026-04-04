import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, MapPin, Clock, AlignLeft } from "lucide-react";
import { useToast } from "../components/ToastContext";

function WorkerPublicProfile() {
  const { workerId } = useParams();
  const token = localStorage.getItem("token");
  const { addToast } = useToast();

  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    date: "",
    time: "",
    address: "",
    description: "",
  });

  // ======================
  // FETCH WORKER PROFILE
  // ======================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/worker/public/${workerId}`
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setWorker(data.worker);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [workerId]);

  // ======================
  // FETCH REVIEWS
  // ======================
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/reviews/worker/${workerId}`
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setReviews(data.reviews);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [workerId]);

  // ======================
  // BOOK WORKER
  // ======================
  const submitBooking = async (e) => {
    e.preventDefault();
    if (!token) {
      addToast("Please log in to book a worker.", "error");
      return;
    }

    setBookingLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          workerId,
          date: bookingForm.date,
          time: bookingForm.time,
          address: bookingForm.address,
          description: bookingForm.description,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      addToast("Booking created successfully! ✅", "success");
      setIsBookingModalOpen(false);
    } catch (err) {
      addToast(err.message || "Failed to create booking", "error");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!worker) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-xl font-bold text-slate-500">Worker not found</p>
    </div>
  );

  const avgRating =
    reviews.length === 0
      ? "New"
      : (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-12 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* PROFILE HEADER */}
        <div className="glass-card overflow-hidden mb-8">
          <div className="bg-gradient-premium p-8 sm:p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
              <div className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-5xl border-4 border-white/30 shadow-xl">
                👷‍♂️
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-4xl font-black mb-2 tracking-tight">{worker.profession}</h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-white/90 font-medium">
                  <span className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full"><MapPin size={16} /> {worker.location?.city || "Remote"}</span>
                  <span className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full text-yellow-300"><Star size={16} fill="currentColor" /> {avgRating}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className="flex flex-col items-center justify-center p-6 bg-primary-50 rounded-2xl border border-primary-100">
                <span className="text-sm font-bold text-primary-600 uppercase tracking-wider mb-2">Hourly Rate</span>
                <span className="text-3xl font-black text-slate-800">₹{worker.hourlyRate}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                <span className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2">Experience</span>
                <span className="text-3xl font-black text-slate-800">{worker.experience} <span className="text-lg text-slate-500 font-medium">Yrs</span></span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-amber-50 rounded-2xl border border-amber-100">
                <span className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-2">Total Reviews</span>
                <span className="text-3xl font-black text-slate-800">{reviews.length}</span>
              </div>
            </div>

            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/20 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <CalendarIcon size={22} /> Request Service Booking
            </button>
          </div>
        </div>

        {/* REVIEWS */}
        <div className="glass-card p-8 sm:p-10 bg-white">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-amber-100 text-amber-500 rounded-xl flex items-center justify-center">
              <Star size={24} fill="currentColor" />
            </div>
            <h2 className="text-2xl font-black text-slate-800">Client Reviews</h2>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
              <p className="text-slate-500 font-medium text-lg">No reviews yet.</p>
              <p className="text-slate-400 text-sm mt-1">Be the first to hire and review this professional!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {reviews.map((r) => (
                <div key={r._id} className="p-6 rounded-2xl border border-slate-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300 bg-white group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center text-primary-700 font-bold shrink-0">
                      {r.customer?.name ? r.customer.name.charAt(0).toUpperCase() : "C"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-800">{r.customer?.name || "Anonymous Customer"}</span>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-amber-500">{r.rating}.0</span>
                          <Star size={14} className="text-amber-500" fill="currentColor" />
                        </div>
                      </div>
                      {r.comment && (
                        <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">"{r.comment}"</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* BOOKING MODAL */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 p-4"
            >
              <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                  <div>
                    <h3 className="text-xl font-black text-slate-800">Book {worker.profession}</h3>
                    <p className="text-sm font-medium text-slate-500 mt-1">Fill out the details for your service request.</p>
                  </div>
                  <button onClick={() => setIsBookingModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-500 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-colors shrink-0">
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={submitBooking} className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Service Date</label>
                      <div className="relative">
                        <CalendarIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="date"
                          name="date"
                          value={bookingForm.date}
                          onChange={handleInputChange}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-800 font-medium focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-sans"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Initial Time</label>
                      <div className="relative">
                        <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="time"
                          name="time"
                          value={bookingForm.time}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-800 font-medium focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-sans"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Service Address</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-4 text-slate-400" />
                      <textarea
                        name="address"
                        value={bookingForm.address}
                        onChange={handleInputChange}
                        required
                        placeholder="123 Main St, Apartment 4B..."
                        rows="2"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-800 font-medium placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all resize-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Problem Description <span className="text-slate-400 font-normal">(Optional)</span></label>
                    <div className="relative">
                      <AlignLeft size={18} className="absolute left-4 top-4 text-slate-400" />
                      <textarea
                        name="description"
                        value={bookingForm.description}
                        onChange={handleInputChange}
                        placeholder="The sink under the master bathroom is leaking..."
                        rows="3"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-800 font-medium placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="w-full py-4 text-white rounded-xl font-bold text-lg bg-gradient-premium hover:shadow-lg hover:shadow-primary-500/30 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {bookingLoading ? (
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "Confirm Booking Request"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WorkerPublicProfile;