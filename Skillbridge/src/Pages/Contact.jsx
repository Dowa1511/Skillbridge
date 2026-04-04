import { useState } from 'react';
import { MapPin, Phone, Mail, Send, Clock, MessageSquare } from 'lucide-react';

const contactInfo = [
    {
        icon: MapPin,
        title: 'Our Address',
        detail: 'Akurdi, Pimpri Chinchwad, Pune 411035',
        color: 'text-primary-600',
        bg: 'bg-gradient-to-br from-primary-50 to-blue-50',
        ring: 'ring-primary-100',
    },
    {
        icon: Phone,
        title: 'Phone Number',
        detail: '+91 9421101892',
        color: 'text-emerald-600',
        bg: 'bg-gradient-to-br from-emerald-50 to-green-50',
        ring: 'ring-emerald-100',
    },
    {
        icon: Mail,
        title: 'Email Address',
        detail: 'contact@skillbridge.in',
        color: 'text-amber-600',
        bg: 'bg-gradient-to-br from-amber-50 to-yellow-50',
        ring: 'ring-amber-100',
    },
    {
        icon: Clock,
        title: 'Working Hours',
        detail: 'Mon - Sat: 9:00 AM - 6:00 PM',
        color: 'text-violet-600',
        bg: 'bg-gradient-to-br from-violet-50 to-purple-50',
        ring: 'ring-violet-100',
    },
];

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for reaching out! We will get back to you soon.');
        setFormData({ name: '', email: '', phone: '', message: '' });
    };

    return (
        <main>
            {/* Hero Banner */}
            <section className="relative bg-gradient-to-br from-primary-800 via-accent-600 to-emerald-700 py-20 lg:py-24 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-10 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
                    <div className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                            backgroundSize: '28px 28px',
                        }}
                    />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-200 bg-white/10 px-4 py-1.5 rounded-full mb-4 border border-white/15">
                        <MessageSquare size={14} />
                        Get In Touch
                    </span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5">
                        We&apos;d Love to Hear <br className="hidden sm:block" />
                        From You
                    </h1>
                    <p className="text-lg text-primary-100 max-w-2xl mx-auto leading-relaxed">
                        Have questions or feedback? Fill out the form below and our team
                        will get back to you within 24 hours.
                    </p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 lg:py-28 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary-50/50 rounded-full translate-x-1/3 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-50/50 rounded-full -translate-x-1/3 blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
                        {/* Contact Form */}
                        <div className="lg:col-span-3">
                            <div className="gradient-border">
                                <div className="bg-white rounded-2xl p-8 lg:p-10">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                        Send us a <span className="gradient-text">Message</span>
                                    </h2>
                                    <p className="text-gray-500 mb-8">
                                        Fill in the details below and we&apos;ll get back to you.
                                    </p>
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid sm:grid-cols-2 gap-5">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
                                                    Full Name
                                                </label>
                                                <input
                                                    id="name"
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="John Doe"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-slate-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                                                    Email Address
                                                </label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="john@example.com"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-slate-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                                                Phone Number
                                            </label>
                                            <input
                                                id="phone"
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+91 98765 43210"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-slate-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-white transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
                                                Your Message
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows={5}
                                                placeholder="How can we help you?"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-slate-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all resize-none"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-accent-700 transition-all duration-200 shadow-md hover:shadow-lg"
                                        >
                                            <Send size={18} />
                                            Send Message
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="lg:col-span-2 space-y-5">
                            {contactInfo.map(({ icon: Icon, title, detail, color, bg, ring }) => (
                                <div
                                    key={title}
                                    className={`flex items-start gap-4 p-5 rounded-2xl bg-white ring-1 ${ring} hover:ring-2 card-shadow hover:-translate-y-0.5 transition-all duration-300`}
                                >
                                    <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                                        <Icon size={22} className={color} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
                                        <p className="text-sm text-gray-500">{detail}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Map Placeholder */}
                            <div className="rounded-2xl overflow-hidden card-shadow bg-white p-2">
                                <div className="aspect-video rounded-xl bg-gradient-to-br from-primary-50 via-accent-50 to-emerald-50 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10"
                                        style={{
                                            backgroundImage: 'radial-gradient(circle, #2563eb 1px, transparent 1px)',
                                            backgroundSize: '16px 16px',
                                        }}
                                    />
                                    <div className="text-center relative z-10">
                                        <MapPin size={40} className="text-primary-400 mx-auto mb-2" />
                                        <p className="text-sm font-medium text-primary-600">Mumbai, India</p>
                                        <p className="text-xs text-primary-400 mt-1">Map integration coming soon</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Contact;
