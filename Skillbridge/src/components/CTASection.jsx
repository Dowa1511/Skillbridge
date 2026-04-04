import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

function CTASection() {
    return (
        <section className="py-20 lg:py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-700 via-accent-600 to-violet-600 p-10 md:p-16 lg:p-20">
                    {/* Decorative Elements */}
                    <div className="absolute inset-0">
                        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl" />
                        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-amber-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                        {/* Grid Pattern */}
                        <div className="absolute inset-0 opacity-5"
                            style={{
                                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                                backgroundSize: '24px 24px',
                            }}
                        />
                    </div>

                    <div className="relative z-10 text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
                            <Sparkles size={14} className="text-amber-300" />
                            <span className="text-sm text-white/90 font-medium">Join 10,000+ Users Today</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
                            Ready to Get Started <br className="hidden sm:block" />
                            with SkillBridge?
                        </h2>
                        <p className="text-lg text-white/80 mb-10 leading-relaxed">
                            Whether you&apos;re a skilled worker looking for opportunities or an employer looking for talent,
                            SkillBridge is the platform built for you.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                to="/signup"
                                className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-[1.02]"
                            >
                                Get Started Free
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/contact"
                                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-[1.02]"
                            >
                                Contact Sales
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CTASection;
