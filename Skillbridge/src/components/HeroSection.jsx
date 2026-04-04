import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { ArrowRight, Briefcase, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const slides = [
    {
        headline: 'SkillBridge: Top Trusted Workforce',
        subtext: 'Your one-stop platform for discovering verified professionals and meaningful job opportunities.',
        bg: 'from-slate-900 via-primary-900 to-slate-900',
        accent1: 'bg-primary-500/20',
        accent2: 'bg-accent-500/20',
        badge: { icon: Users, text: '10,000+ Workers', color: 'bg-emerald-500' },
    },
    {
        headline: 'Find the Right Talent, Fast',
        subtext: 'Browse thousands of skilled workers vetted and ready to elevate your upcoming projects.',
        bg: 'from-slate-900 via-slate-800 to-accent-900',
        accent1: 'bg-accent-500/20',
        accent2: 'bg-amber-500/20',
        badge: { icon: Briefcase, text: '5,000+ Jobs', color: 'bg-amber-500' },
    },
    {
        headline: 'Build Your Career with Us',
        subtext: 'Discover jobs matching your skills. Get hired by premium employers who value craftsmanship.',
        bg: 'from-primary-900 via-emerald-900 to-slate-900',
        accent1: 'bg-emerald-500/20',
        accent2: 'bg-primary-500/20',
        badge: { icon: Star, text: '95% Success', color: 'bg-primary-500' },
    },
];

function HeroSection() {
    return (
        <section className="relative overflow-hidden w-full h-[85vh] min-h-[600px] max-h-[900px]">
            <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop
                className="w-full h-full"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        {({ isActive }) => (
                            <div className={`relative w-full h-full bg-gradient-to-br ${slide.bg} flex items-center`}>
                                {/* Abstract Animated Shapes */}
                                <div className="absolute inset-0 overflow-hidden">
                                    <div className={`absolute top-0 left-1/4 w-[40vw] h-[40vw] ${slide.accent1} rounded-full blur-[100px] animate-pulse-glow opacity-60 mix-blend-screen`} />
                                    <div className={`absolute bottom-0 right-1/4 w-[35vw] h-[35vw] ${slide.accent2} rounded-full blur-[120px] animate-pulse-glow opacity-60 mix-blend-screen mix-blend-screen`} style={{ animationDelay: '2s' }} />
                                    
                                    {/* Grain Texture Overlay */}
                                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />
                                </div>

                                <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full pt-16">
                                    <div className="max-w-3xl">
                                        {isActive && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.8, ease: "easeOut" }}
                                            >
                                                {/* Floating Badge */}
                                                <div className="inline-flex items-center gap-2.5 px-4 py-2 glass-card border-white/10 !bg-white/5 shadow-2xl rounded-full mb-8">
                                                    <span className={`w-2.5 h-2.5 ${slide.badge.color} rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.3)]`} />
                                                    <slide.badge.icon size={14} className="text-white/90" />
                                                    <span className="text-sm text-white/90 font-medium tracking-wide">{slide.badge.text}</span>
                                                </div>

                                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black text-white leading-[1.1] mb-6 tracking-tight drop-shadow-2xl">
                                                    {slide.headline.split(' ').map((word, i) => (
                                                        <span key={i} className={i >= slide.headline.split(' ').length - 2 ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-accent-300" : ""}>
                                                            {word}{' '}
                                                        </span>
                                                    ))}
                                                </h1>
                                                
                                                <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl font-light">
                                                    {slide.subtext}
                                                </p>
                                                
                                                <div className="flex flex-wrap gap-5">
                                                    <Link to="/services" className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-300 hover-lift shadow-xl hover:shadow-cyan-500/20">
                                                        Find Opportunities
                                                        <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                                                    </Link>
                                                    <Link to="/signup" className="group inline-flex items-center gap-2 px-8 py-4 glass text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300 hover-lift shadow-xl">
                                                        Hire Professionals
                                                        <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>

            <style>{`
                .swiper-pagination-bullet {
                    width: 8px;
                    height: 8px;
                    background: rgba(255, 255, 255, 0.3);
                    opacity: 1;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .swiper-pagination-bullet-active {
                    background: white;
                    width: 32px;
                    border-radius: 4px;
                    box-shadow: 0 0 10px rgba(255,255,255,0.5);
                }
                .swiper-pagination {
                    bottom: 30px !important;
                }
            `}</style>
        </section>
    );
}

export default HeroSection;
