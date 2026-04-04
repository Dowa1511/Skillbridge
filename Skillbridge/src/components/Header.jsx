import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight, User, Bell, Settings, LogOut, MessageSquare, Calendar, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './ToastContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
];

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { success } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.warn("Cleared corrupted user session from local storage.");
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setNotifications([
      { id: 1, type: 'booking', message: 'New booking request from John Doe', time: '2 min ago', unread: true },
      { id: 2, type: 'review', message: 'You received a 5-star review', time: '1 hour ago', unread: true },
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setUserMenuOpen(false);
    success('Logged out successfully');
    navigate('/');
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between rounded-2xl px-6 py-3 transition-all duration-500 shadow-lg ${
          scrolled ? 'glass' : 'bg-white/80 backdrop-blur-md'
        }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.4 }}
              className="w-10 h-10 bg-gradient-premium rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary-500/50"
            >
              <span className="text-white font-heading font-extrabold text-sm tracking-wider">SB</span>
            </motion.div>
            <span className="text-2xl font-heading font-black text-slate-800 tracking-tight">
              Skill<span className="text-gradient">Bridge</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className="relative py-1" end={link.to === '/'}>
                {({ isActive }) => (
                  <span className={`text-sm font-semibold transition-colors duration-200 ${
                    isActive ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'
                  }`}>
                    {link.label}
                    {isActive && (
                      <motion.div 
                        layoutId="navIndicator"
                        className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-primary-600 to-accent-500"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden xl:flex items-center gap-5">
            {user ? (
              <>
                <div className="relative">
                  <button onClick={() => { setNotificationsOpen(!notificationsOpen); setUserMenuOpen(false); }} className="relative p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                    <Bell size={22} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <AnimatePresence>
                    {notificationsOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 glass-card py-2 z-50 overflow-hidden"
                      >
                        <div className="px-5 py-3 border-b border-gray-100/50 bg-white/40">
                          <h3 className="font-heading font-bold text-slate-800">Notifications</h3>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.map((n) => (
                            <div key={n.id} className={`px-5 py-4 border-b border-gray-50/50 hover:bg-white/50 cursor-pointer ${n.unread ? 'bg-primary-50/50' : ''}`}>
                              <div className="flex items-start gap-3">
                                <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                                  {n.type === 'booking' && <Calendar size={16} className="text-primary-600" />}
                                  {n.type === 'review' && <Star size={16} className="text-amber-500" />}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-800">{n.message}</p>
                                  <p className="text-xs text-slate-500 mt-1">{n.time}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative">
                  <button onClick={() => { setUserMenuOpen(!userMenuOpen); setNotificationsOpen(false); }} className="flex items-center gap-3 p-1.5 pr-4 rounded-full border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all bg-white">
                    <div className="w-8 h-8 rounded-full bg-gradient-premium flex items-center justify-center text-white font-bold text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{user.name ? user.name.split(' ')[0] : "User"}</span>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-60 glass-card py-2 z-50 overflow-hidden"
                      >
                        <div className="px-5 py-4 border-b border-gray-100/50 bg-white/40">
                          <p className="font-heading font-bold text-slate-800 truncate">{user.name}</p>
                          <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mt-1">{user.role}</p>
                        </div>
                        <div className="py-2">
                          <Link to={user.role === 'worker' ? '/worker/dashboard' : '/customer/dashboard'} className="flex items-center px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors" onClick={() => setUserMenuOpen(false)}>
                            <User size={18} className="mr-3" /> Dashboard
                          </Link>
                          <Link to="/settings" className="flex items-center px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors" onClick={() => setUserMenuOpen(false)}>
                            <Settings size={18} className="mr-3" /> Settings
                          </Link>
                        </div>
                        <div className="border-t border-gray-100/50 py-2">
                          <button onClick={handleLogout} className="flex items-center w-full px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                            <LogOut size={18} className="mr-3" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="px-6 py-2.5 text-sm font-bold text-slate-700 hover:text-primary-600 transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="px-6 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-primary-600 shadow-lg hover:shadow-xl hover-lift transition-all">
                  Sign up free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="xl:hidden p-2 text-slate-600 rounded-xl hover:bg-gray-100">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 mt-2"
          >
            <div className="px-5 py-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} onClick={() => setIsOpen(false)} className={({ isActive }) => `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-primary-50 text-primary-600' : 'text-slate-700 hover:bg-gray-50'}`}>
                  {link.label}
                  <ChevronRight size={18} className="text-slate-400" />
                </NavLink>
              ))}
              {!user && (
                <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col gap-3">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="w-full py-3 text-center rounded-xl font-bold border border-slate-200 text-slate-700">Log in</Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)} className="w-full py-3 text-center rounded-xl font-bold bg-slate-900 text-white">Sign up free</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Header;