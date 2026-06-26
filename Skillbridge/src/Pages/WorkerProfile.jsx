import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function WorkerProfile() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    profession: "",
    experience: "",
    hourlyRate: "",
    city: "",
    area: "",
    availability: true,
  });

  // =========================
  // FETCH / CREATE WORKER
  // =========================
  useEffect(() => {
    if (!token) return;

    const fetchWorkerProfile = async () => {
      try {
        const { data } = await api.get("/api/worker/me");

        if (data.worker) {
          setFormData({
            profession: data.worker.profession || "",
            experience: data.worker.experience ?? "",
            hourlyRate: data.worker.hourlyRate ?? "",
            city: data.worker.location?.city || "",
            area: data.worker.location?.area || "",
            availability: data.worker.availability ?? true,
          });
        }
      } catch (err) {
        console.error("Fetch worker failed:", err.response?.data?.message || err.message);
      }
    };

    fetchWorkerProfile();
  }, [token]);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // SUBMIT PROFILE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!token) {
      setMessage("Please login again.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.put("/api/worker/me", {
        profession: formData.profession,
        experience: Number(formData.experience),
        hourlyRate: Number(formData.hourlyRate),
        city: formData.city,
        area: formData.area,
        availability: formData.availability,
      });

      if (!data.success) {
        throw new Error(data.message || "Profile update failed");
      }

      // ✅ SUCCESS
      setMessage("Profile updated successfully ✅");

      setTimeout(() => {
        navigate("/worker/dashboard");
      }, 800);

    } catch (err) {
      setMessage(err.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Complete Your Worker Profile
          </h1>
          <p className="text-gray-600">Set up your professional profile to start receiving bookings</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl">
                👷‍♂️
              </div>
              <div>
                <h2 className="text-2xl font-bold">Professional Profile Setup</h2>
                <p className="text-purple-100">Tell customers about your skills and availability</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {message && (
              <div className={`mb-6 p-4 rounded-xl ${
                message.includes("successfully")
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}>
                {message.includes("successfully") ? "✅" : "⚠️"} {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PROFESSION */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🎯 Your Profession
                  </label>
                  <select
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-lg"
                  >
                    <option value="">Select your profession</option>
                    <option value="Plumber">🔧 Plumber</option>
                    <option value="Electrician">⚡ Electrician</option>
                    <option value="Carpenter">🔨 Carpenter</option>
                    <option value="Painter">🎨 Painter</option>
                    <option value="Mechanic">🚗 Mechanic</option>
                    <option value="AC Technician">❄️ AC Technician</option>
                    <option value="Cleaner">🧹 Cleaner</option>
                    <option value="Other">🔧 Other</option>
                  </select>
                </div>

                {/* EXPERIENCE */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🛠 Experience (Years)
                  </label>
                  <input
                    type="number"
                    name="experience"
                    placeholder="e.g. 5"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-lg"
                  />
                </div>

                {/* HOURLY RATE */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    💰 Hourly Rate (₹)
                  </label>
                  <input
                    type="number"
                    name="hourlyRate"
                    placeholder="e.g. 500"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-lg"
                  />
                </div>

                {/* CITY */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📍 City
                  </label>
                  <input
                    name="city"
                    placeholder="e.g. Mumbai"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-lg"
                  />
                </div>

                {/* AREA */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🏠 Area/Locality
                  </label>
                  <input
                    name="area"
                    placeholder="e.g. Andheri West"
                    value={formData.area}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-lg"
                  />
                </div>
              </div>

              {/* AVAILABILITY */}
              <div className="bg-gray-50 rounded-xl p-6">
                <label className="flex items-center space-x-4 cursor-pointer">
                  <div className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                    formData.availability ? "bg-green-500 border-green-500" : "border-gray-300"
                  }`}>
                    {formData.availability && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
                  </div>
                  <input
                    type="checkbox"
                    name="availability"
                    checked={formData.availability}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div>
                    <span className="text-lg font-semibold text-gray-800">Available for Work</span>
                    <p className="text-sm text-gray-600">Customers can book you when you're available</p>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Saving Profile...</span>
                  </div>
                ) : (
                  "💾 Save Profile"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkerProfile;