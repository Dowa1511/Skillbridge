import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, Lock, Eye, EyeOff, Sparkles, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../components/ToastContext';

function Signup() {
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.role) {
            setError('Please select an account type to continue.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            setLoading(true);

            const res = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.fullName,
                    phone: formData.phone,
                    password: formData.password,
                    role: formData.role,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            const userObj = data.data?.user || data.user;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(userObj));

            addToast('Account created successfully! Welcome to SkillBridge!', 'success');
            
            if (userObj?.role === "worker") {
                navigate("/worker/profile");
            } else {
                navigate("/customer/dashboard");
            }

        } catch (err) {
            setError(err.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#f8fafc] relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-emerald-500/20 shadow-[0_0_100px_rgba(16,185,129,0.3)] rounded-full blur-[120px] animate-pulse-glow" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[35vw] h-[35vw] bg-accent-500/20 shadow-[0_0_100px_rgba(139,92,246,0.3)] rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '3s' }} />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-6xl flex rounded-[2rem] overflow-hidden glass-card shadow-2xl relative z-10 my-4"
            >
                {/* Left Side: Detail */}
                <div className="hidden lg:flex w-[45%] bg-slate-900 p-12 flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tl from-emerald-600/40 via-transparent to-primary-600/40 mix-blend-screen" />
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.05]" />
                    
                    <div className="relative z-10">
                        <Link to="/" className="inline-flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
                                <span className="text-white font-extrabold text-sm">SB</span>
                            </div>
                            <span className="text-2xl font-black tracking-tight">SkillBridge</span>
                        </Link>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, x: -30 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="relative z-10 space-y-6 mt-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-full font-semibold text-sm backdrop-blur-sm border border-emerald-500/30">
                            <Sparkles size={16} /> Fast, Secure, Verified
                        </div>
                        <h1 className="text-5xl font-black leading-[1.1] tracking-tight">
                            Start Your <br/>Journey With Us.
                        </h1>
                        <p className="text-slate-300 text-lg max-w-sm font-light leading-relaxed">
                            Join thousands of satisfied workers and customers streamlining their day-to-day services.
                        </p>
                        
                        <div className="pt-8 space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                                    <UserPlus size={20} className="text-emerald-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-md">Easy Onboarding</h4>
                                    <p className="text-sm text-slate-400">Get set up and verified in under 5 minutes.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    
                    <div className="relative z-10 text-slate-500 text-sm mt-12">
                        © 2026 SkillBridge. All rights reserved.
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full lg:w-[55%] p-8 sm:p-10 lg:p-14 bg-white/80 backdrop-blur-3xl overflow-y-auto max-h-[90vh]">
                    <div className="max-w-md mx-auto h-full flex flex-col justify-center">
                        <div className="mb-6 text-center lg:text-left">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
                            <p className="text-slate-500 mt-2 font-medium">Please enter your details to register.</p>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: 'auto' }} 
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6 text-sm font-medium text-rose-600 bg-rose-50 border border-rose-100 px-4 py-3 rounded-2xl flex items-center gap-3 overflow-hidden"
                                >
                                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">
                                I am looking to...
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'customer' })}
                                    className={`relative px-4 py-4 rounded-2xl border-2 font-bold transition-all flex flex-col items-center gap-2 overflow-hidden
                                        ${formData.role === 'customer'
                                            ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md shadow-primary-500/10'
                                            : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    {formData.role === 'customer' && (
                                        <motion.div layoutId="roleOutline" className="absolute inset-0 bg-primary-500/5" />
                                    )}
                                    Hire Workers
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'worker' })}
                                    className={`relative px-4 py-4 rounded-2xl border-2 font-bold transition-all flex flex-col items-center gap-2 overflow-hidden
                                        ${formData.role === 'worker'
                                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-500/10'
                                            : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    {formData.role === 'worker' && (
                                        <motion.div layoutId="roleOutline" className="absolute inset-0 bg-emerald-500/5" />
                                    )}
                                    Find Jobs
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">Full Name</label>
                                <div className="relative group">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        placeholder="John Doe"
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-slate-800 font-medium placeholder:text-slate-400 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">Phone Number</label>
                                <div className="relative group">
                                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-slate-800 font-medium placeholder:text-slate-400 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">Password</label>
                                    <div className="relative group">
                                        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-10 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-slate-800 font-medium placeholder:text-slate-400 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">Confirm</label>
                                    <div className="relative group">
                                        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            placeholder="••••••••"
                                            className="w-full pl-10 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-slate-800 font-medium placeholder:text-slate-400 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all hover:scale-[1.02] shadow-lg shadow-slate-900/20 disabled:opacity-70 disabled:hover:scale-100"
                            >
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>

                        <div className="mt-8 text-center pb-4">
                            <p className="text-slate-500 font-medium">
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold ml-1 transition-colors">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}

export default Signup;
