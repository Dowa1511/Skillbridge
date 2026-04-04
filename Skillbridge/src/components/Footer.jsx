import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight, Heart } from 'lucide-react';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
  { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:bg-sky-500' },
  { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500' },
  { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:bg-blue-700' },
];

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">SB</span>
              </div>
              <span className="text-xl font-bold text-white">
                Skill<span className="text-primary-400">Bridge</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 mb-6">
              Connecting skilled blue-collar workers with trusted employers.
            </p>
            <div className="flex items-center gap-2.5">
              {socialLinks.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-gray-400 ${color} hover:text-white transition-all duration-300`}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-primary-500 rounded-full" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-2 text-sm text-gray-400 hover:text-primary-400 transition-colors duration-200"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-emerald-500 rounded-full" />
              Services
            </h3>
            <ul className="space-y-3">
              {['Electricians', 'Plumbers', 'Carpenters', 'Mechanics', 'Construction', 'Housekeeping'].map(
                (service) => (
                  <li key={service}>
                    <Link
                      to="/services"
                      className="group flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                    >
                      <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      {service}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-amber-500 rounded-full" />
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={14} className="text-primary-400" />
                </div>
                <span className="text-sm text-gray-400">
                  Akurdi, Pimpri Chinchwad, Pune 411035
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                  <Phone size={14} className="text-emerald-400" />
                </div>
                <span className="text-sm text-gray-400">+91 9421101892</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-amber-400" />
                </div>
                <span className="text-sm text-gray-400">contact@skillbridge.in</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-sm text-gray-500">
              © 2026 SkillBridge. All rights reserved.
            </p>
            <p className="flex items-center gap-1 text-sm text-gray-500">
              Made with <Heart size={14} className="text-rose-500 fill-rose-500" /> in India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;