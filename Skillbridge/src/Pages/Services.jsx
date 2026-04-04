import { Link } from 'react-router-dom';
import { Zap, Droplets, Hammer, Wrench, HardHat, Sparkles, PaintBucket, Truck, ArrowRight, Briefcase } from 'lucide-react';

const services = [
    {
        icon: Zap,
        title: 'Electricians',
        description: 'Licensed electricians for wiring, installations, repairs, and complete electrical solutions for homes and businesses.',
        color: 'text-yellow-500',
        bg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
        border: 'hover:border-yellow-300',
        badge: 'bg-yellow-100 text-yellow-700',
    },
    {
        icon: Droplets,
        title: 'Plumbers',
        description: 'Professional plumbing services including leak repairs, pipe installations, drainage, and water system maintenance.',
        color: 'text-blue-500',
        bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
        border: 'hover:border-blue-300',
        badge: 'bg-blue-100 text-blue-700',
    },
    {
        icon: Hammer,
        title: 'Carpenters',
        description: 'Expert woodworkers for custom furniture, cabinet making, framing, renovations, and all types of woodwork.',
        color: 'text-amber-600',
        bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
        border: 'hover:border-amber-300',
        badge: 'bg-amber-100 text-amber-700',
    },
    {
        icon: Wrench,
        title: 'Mechanics',
        description: 'Certified auto and industrial mechanics for engine diagnostics, maintenance, and comprehensive repair services.',
        color: 'text-slate-600',
        bg: 'bg-gradient-to-br from-slate-50 to-gray-100',
        border: 'hover:border-slate-300',
        badge: 'bg-slate-100 text-slate-700',
    },
    {
        icon: HardHat,
        title: 'Construction Workers',
        description: 'Skilled construction crews for building, renovation, demolition, masonry, and large-scale civil projects.',
        color: 'text-orange-500',
        bg: 'bg-gradient-to-br from-orange-50 to-red-50',
        border: 'hover:border-orange-300',
        badge: 'bg-orange-100 text-orange-700',
    },
    {
        icon: Sparkles,
        title: 'Housekeeping',
        description: 'Professional cleaning services for residential, commercial, and industrial spaces with reliable staff.',
        color: 'text-purple-500',
        bg: 'bg-gradient-to-br from-purple-50 to-violet-50',
        border: 'hover:border-purple-300',
        badge: 'bg-purple-100 text-purple-700',
    },
    {
        icon: PaintBucket,
        title: 'Painters',
        description: 'Interior and exterior painting professionals for homes, offices, and commercial buildings with quality finishes.',
        color: 'text-pink-500',
        bg: 'bg-gradient-to-br from-pink-50 to-rose-50',
        border: 'hover:border-pink-300',
        badge: 'bg-pink-100 text-pink-700',
    },
    {
        icon: Truck,
        title: 'Drivers & Movers',
        description: 'Reliable drivers and moving professionals for transportation, relocation, and logistics needs.',
        color: 'text-teal-600',
        bg: 'bg-gradient-to-br from-teal-50 to-cyan-50',
        border: 'hover:border-teal-300',
        badge: 'bg-teal-100 text-teal-700',
    },
];

function Services() {
    return (
        <main>
            {/* Hero Banner */}
            <section className="relative bg-gradient-to-br from-primary-800 via-accent-600 to-violet-700 py-20 lg:py-24 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
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
                        <Briefcase size={14} />
                        Our Services
                    </span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5">
                        Find Skilled Professionals <br className="hidden sm:block" />
                        For Every Job
                    </h1>
                    <p className="text-lg text-primary-100 max-w-2xl mx-auto leading-relaxed">
                        Browse our comprehensive range of blue-collar services and connect
                        with verified professionals near you.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 lg:py-28 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-72 h-72 bg-primary-50/50 rounded-full -translate-y-1/3 -translate-x-1/3 blur-3xl" />
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-violet-50/50 rounded-full translate-y-1/3 translate-x-1/3 blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map(({ icon: Icon, title, description, color, bg, border, badge }) => (
                            <div
                                key={title}
                                className={`group p-7 rounded-2xl bg-white border-2 border-transparent ${border} card-shadow hover:card-shadow-hover hover:-translate-y-2 transition-all duration-300`}
                            >
                                <div className="flex items-center justify-between mb-5">
                                    <div
                                        className={`w-14 h-14 ${bg} rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                                    >
                                        <Icon size={26} className={color} />
                                    </div>
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge}`}>Popular</span>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                    {title}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                                    {description}
                                </p>
                                <Link
                                    to="/contact"
                                    className={`inline-flex items-center gap-1.5 text-sm font-medium ${color} hover:opacity-80 transition-all group/link`}
                                >
                                    Explore
                                    <ArrowRight size={15} className="group-hover/link:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Services;
