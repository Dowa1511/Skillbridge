import { Search, UserCheck, Handshake } from 'lucide-react';

const steps = [
    {
        step: '01',
        icon: Search,
        title: 'Search & Browse',
        description: 'Browse through our extensive catalog of skilled professionals or post your job requirements.',
        color: 'from-primary-500 to-primary-600',
        bg: 'bg-primary-50',
        ring: 'ring-primary-200',
    },
    {
        step: '02',
        icon: UserCheck,
        title: 'Verify & Connect',
        description: 'Review verified profiles, check ratings and reviews, and connect with the right workers.',
        color: 'from-emerald-500 to-emerald-600',
        bg: 'bg-emerald-50',
        ring: 'ring-emerald-200',
    },
    {
        step: '03',
        icon: Handshake,
        title: 'Hire & Succeed',
        description: 'Finalize the hiring, complete the job, and make secure payments — hassle free.',
        color: 'from-violet-500 to-violet-600',
        bg: 'bg-violet-50',
        ring: 'ring-violet-200',
    },
];

function HowItWorksSection() {
    return (
        <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-primary-200 to-transparent opacity-30 hidden lg:block" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full mb-4 border border-emerald-100">
                        <Handshake size={14} />
                        How It Works
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        Get Started in <span className="gradient-text">3 Easy Steps</span>
                    </h2>
                    <p className="text-gray-500 leading-relaxed">
                        Whether you&apos;re hiring or looking for work, SkillBridge makes it simple and fast.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {steps.map(({ step, icon: Icon, title, description, color, bg, ring }) => (
                        <div key={step} className="relative group">
                            <div className={`p-8 rounded-2xl bg-white ring-1 ${ring} hover:ring-2 card-shadow hover:card-shadow-hover hover:-translate-y-2 transition-all duration-300`}>
                                {/* Step Number */}
                                <div className={`inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br ${color} rounded-lg text-white font-bold text-sm mb-5 shadow-md`}>
                                    {step}
                                </div>

                                {/* Icon */}
                                <div className={`w-16 h-16 ${bg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon size={30} className={`bg-gradient-to-br ${color} bg-clip-text`} style={{ color: 'inherit' }} />
                                </div>

                                <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
                                <p className="text-gray-500 leading-relaxed">{description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HowItWorksSection;
