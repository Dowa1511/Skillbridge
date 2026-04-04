import { Zap, Droplets, Hammer, Wrench, HardHat, Sparkles } from 'lucide-react';

const services = [
    {
        icon: Zap,
        title: 'Electricians',
        description: 'Licensed professionals for wiring, repairs, installations, and maintenance of electrical systems.',
        color: 'text-yellow-500',
        bg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
        border: 'hover:border-yellow-300',
        glow: 'group-hover:shadow-yellow-100',
    },
    {
        icon: Droplets,
        title: 'Plumbers',
        description: 'Expert plumbing services for leak repairs, pipe installations, and drainage solutions.',
        color: 'text-blue-500',
        bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
        border: 'hover:border-blue-300',
        glow: 'group-hover:shadow-blue-100',
    },
    {
        icon: Hammer,
        title: 'Carpenters',
        description: 'Skilled woodworkers for furniture, cabinets, framing, and custom woodwork projects.',
        color: 'text-amber-600',
        bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
        border: 'hover:border-amber-300',
        glow: 'group-hover:shadow-amber-100',
    },
    {
        icon: Wrench,
        title: 'Mechanics',
        description: 'Certified mechanics for vehicle maintenance, engine repairs, and diagnostic services.',
        color: 'text-slate-600',
        bg: 'bg-gradient-to-br from-slate-50 to-gray-100',
        border: 'hover:border-slate-300',
        glow: 'group-hover:shadow-slate-100',
    },
    {
        icon: HardHat,
        title: 'Construction Workers',
        description: 'Experienced crews for building, renovation, demolition, and civil construction projects.',
        color: 'text-orange-500',
        bg: 'bg-gradient-to-br from-orange-50 to-red-50',
        border: 'hover:border-orange-300',
        glow: 'group-hover:shadow-orange-100',
    },
    {
        icon: Sparkles,
        title: 'Housekeeping',
        description: 'Professional cleaning and housekeeping services for homes, offices, and commercial spaces.',
        color: 'text-purple-500',
        bg: 'bg-gradient-to-br from-purple-50 to-violet-50',
        border: 'hover:border-purple-300',
        glow: 'group-hover:shadow-purple-100',
    },
];

function ServicesSection() {
    return (
        <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-50/50 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 bg-primary-50 px-4 py-1.5 rounded-full mb-4 border border-primary-100">
                        <Sparkles size={14} />
                        Our Services
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        What We <span className="gradient-text">Offer</span>
                    </h2>
                    <p className="text-gray-500 leading-relaxed">
                        Browse through our wide range of blue-collar service categories
                        and find the right professionals for your needs.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map(({ icon: Icon, title, description, color, bg, border, glow }) => (
                        <div
                            key={title}
                            className={`group p-7 rounded-2xl bg-white border-2 border-transparent ${border} card-shadow hover:card-shadow-hover ${glow} hover:-translate-y-2 transition-all duration-300 cursor-pointer`}
                        >
                            <div
                                className={`w-14 h-14 ${bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                            >
                                <Icon size={26} className={color} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                {title}
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {description}
                            </p>
                            <div className={`mt-4 h-1 w-0 group-hover:w-12 ${bg} rounded-full transition-all duration-500`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ServicesSection;
