import { Users, Briefcase, TrendingUp, Headphones } from 'lucide-react';

const stats = [
    { icon: Users, value: '10,000+', label: 'Workers Registered', color: 'from-cyan-400 to-blue-500' },
    { icon: Briefcase, value: '5,000+', label: 'Jobs Posted', color: 'from-emerald-400 to-green-500' },
    { icon: TrendingUp, value: '95%', label: 'Successful Matches', color: 'from-amber-400 to-orange-500' },
    { icon: Headphones, value: '24/7', label: 'Support Available', color: 'from-violet-400 to-purple-500' },
];

function StatsSection() {
    return (
        <section className="relative py-20 lg:py-24 bg-gradient-to-br from-primary-800 via-primary-700 to-accent-600 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-14">
                    <span className="inline-block text-sm font-semibold text-primary-200 bg-white/10 px-4 py-1.5 rounded-full mb-4 border border-white/10">
                        Our Impact
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                        Our Impact in Numbers
                    </h2>
                    <p className="text-primary-100 max-w-xl mx-auto">
                        Trusted by thousands of workers and employers across India.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {stats.map(({ icon: Icon, value, label, color }) => (
                        <div
                            key={label}
                            className="group text-center p-6 lg:p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                <Icon size={24} className="text-white" />
                            </div>
                            <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                                {value}
                            </div>
                            <div className="text-sm text-primary-100/80 font-medium">
                                {label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default StatsSection;
