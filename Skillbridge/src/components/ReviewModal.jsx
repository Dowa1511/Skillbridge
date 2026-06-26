import { useState } from "react";
import { Star, X, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LABELS = ["", "Poor 😞", "Fair 😐", "Good 😊", "Very Good 😄", "Excellent 🤩"];

function ReviewModal({ isOpen, onClose, onSubmit, bookingId, workerName, workerProfession }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setComment("");
    setLoading(false);
    setSubmitted(false);
    setError("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating before submitting.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onSubmit(bookingId, rating, comment);
      setSubmitted(true);
      setTimeout(handleClose, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
        >
          {submitted ? (
            // ── Success State ──
            <div className="p-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-5">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Review Submitted!</h3>
              <p className="text-slate-500 font-medium">Thanks for your feedback 🙏</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6 text-white relative">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl">
                    ⭐
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-semibold uppercase tracking-wider">Rate your experience</p>
                    <h2 className="text-xl font-black">
                      {workerProfession || "Worker"}
                    </h2>
                    {workerName && (
                      <p className="text-white/80 text-sm font-medium">{workerName}</p>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Star Rating */}
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-500 mb-4">How would you rate this service?</p>
                  <div className="flex justify-center gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110 active:scale-95"
                      >
                        <Star
                          size={40}
                          className={`transition-colors ${
                            star <= (hoverRating || rating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-200 fill-slate-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <AnimatePresence mode="wait">
                    {(hoverRating || rating) > 0 && (
                      <motion.p
                        key={hoverRating || rating}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-sm font-bold text-amber-600"
                      >
                        {LABELS[hoverRating || rating]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Share your experience <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell others what you thought of this worker's service..."
                    className="w-full p-4 border-2 border-slate-100 bg-slate-50 rounded-2xl text-slate-800 font-medium placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-400/10 transition-all resize-none"
                    rows={3}
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="text-sm font-medium text-rose-600 bg-rose-50 border border-rose-100 px-4 py-3 rounded-xl">
                    ⚠️ {error}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-3.5 border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={rating === 0 || loading}
                    className="flex-1 py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl font-bold hover:from-amber-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] shadow-lg shadow-amber-500/20 disabled:hover:scale-100"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      "Submit Review ⭐"
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ReviewModal;