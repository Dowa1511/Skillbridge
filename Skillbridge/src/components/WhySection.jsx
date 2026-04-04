import { ShieldCheck, Zap, Lock, MessageCircle } from 'lucide-react';

const features = [
    {
        icon: ShieldCheck,
        title: 'Verified Workers',
        description: 'Every worker on SkillBridge is background-checked and skill-verified for your peace of mind.',
        color: 'text-emerald-600',
        bg: 'bg-gradient-to-br from-emerald-50 to-green-50',
        ring: 'ring-emerald-100',
        accent: 'bg-emerald-500',
    },
    {
        icon: Zap,
        title: 'Fast Hiring',
        description: 'Post a job and connect with qualified workers within hours, not days. Speed up your hiring process.',
        color: 'text-amber-500',
        bg: 'bg-gradient-to-br from-amber-50 to-yellow-50',
        ring: 'ring-amber-100',
        accent: 'bg-amber-500',
    },
    {
        icon: Lock,
        title: 'Secure Payments',
        description: 'Our escrow-based payment system ensures fair transactions and secure payouts for every job.',
        color: 'text-primary-600',
        bg: 'bg-gradient-to-br from-blue-50 to-primary-50',
        ring: 'ring-blue-100',
        accent: 'bg-primary-500',
    },
    {
        icon: MessageCircle,
        title: 'Easy Communication',
        description: 'Built-in messaging lets you discuss requirements, share updates, and stay connected seamlessly.',
        color: 'text-violet-600',
        bg: 'bg-gradient-to-br from-violet-50 to-purple-50',
        ring: 'ring-violet-100',
        accent: 'bg-violet-500',
    },
];

function WhySection() {
    return (
        <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary-50/60 rounded-full -translate-x-1/2 blur-3xl" />
            <div className="absolute top-1/4 right-0 w-72 h-72 bg-violet-50/60 rounded-full translate-x-1/2 blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 bg-primary-50 px-4 py-1.5 rounded-full mb-4 border border-primary-100">
                        <ShieldCheck size={14} />
                        Why Choose Us
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        Why Choose <span className="gradient-text">SkillBridge</span>?
                    </h2>
                    <p className="text-gray-500 leading-relaxed">
                        We are committed to creating the most trusted and efficient platform
                        for blue-collar hiring.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map(({ icon: Icon, title, description, color, bg, ring, accent }) => (
                        <div
                            key={title}
                            className={`group text-center p-7 rounded-2xl bg-white ring-1 ${ring} hover:ring-2 card-shadow hover:card-shadow-hover hover:-translate-y-2 transition-all duration-300`}
                        >
                            <div className="relative mx-auto mb-5">
                                <div
                                    className={`w-16 h-16 ${bg} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                                >
                                    <Icon size={28} className={color} />
                                </div>
                                <div className={`absolute -top-1 -right-1 w-4 h-4 ${accent} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                {title}
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default WhySection;
