import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Phone, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../components/ToastContext";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser({
        phone: formData.phone,
        password: formData.password,
      });

      const data = response.data;
      localStorage.setItem("token", data.token);
      const userObj = data.data?.user || data.user;
      localStorage.setItem("user", JSON.stringify(userObj));

      addToast("Login successful! Welcome back!", "success");

      if (userObj?.role === "worker") {
        navigate("/worker/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Login failed";
      setError(message);
      addToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#f8fafc] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary-400/20 shadow-[0_0_100px_rgba(59,130,246,0.3)] rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35vw] h-[35vw] bg-accent-500/20 shadow-[0_0_100px_rgba(139,92,246,0.3)] rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-6xl flex rounded-3xl overflow-hidden glass-card shadow-2xl relative z-10"
      >
        {/* Left Side: Graphic */}
        <div className="hidden lg:flex w-1/2 bg-gradient-premium p-12 flex-col justify-between text-white relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.05]" />
          
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <span className="text-white font-extrabold text-sm">SB</span>
              </div>
              <span className="text-2xl font-black tracking-tight">SkillBridge</span>
            </Link>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative z-10 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full font-medium text-sm backdrop-blur-sm border border-white/20">
              <Sparkles size={16} className="text-yellow-300" /> Connecting professionals
            </div>
            <h1 className="text-5xl font-black leading-[1.2]">
              Welcome Back <br/>To Excellence.
            </h1>
            <p className="text-white/80 text-lg max-w-md font-light leading-relaxed">
              Sign in to manage your appointments, discover new job opportunities, and connect with SkillBridge network.
            </p>
          </motion.div>
          
          <div className="relative z-10 text-white/60 text-sm">
            © 2026 SkillBridge Inc. All rights reserved.
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 bg-white/80 backdrop-blur-3xl flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Sign In</h2>
              <p className="text-slate-500 mt-2">Enter your details to access your account</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-8 text-sm font-medium text-rose-600 bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                <div className="relative group">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-slate-800 font-medium placeholder:text-slate-400 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-slate-800 font-medium placeholder:text-slate-400 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <Link to="/forgot-password" className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-slate-900/20 disabled:opacity-70 disabled:hover:scale-100"
              >
                {loading ? "Signing in..." : (
                  <>Sign In <ArrowRight size={18} /></>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-500 font-medium">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-bold ml-1 transition-colors">
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

export default Login;
