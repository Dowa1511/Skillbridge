import { Target, Eye, Heart, Lightbulb, Award, Users, Globe, TrendingUp } from 'lucide-react';

const values = [
    {
        icon: Target,
        title: 'Our Mission',
        description:
            'To create a seamless bridge between skilled blue-collar workers and employers who need them. We believe every hardworking individual deserves fair opportunities and every business deserves reliable talent.',
        color: 'text-primary-600',
        bg: 'bg-gradient-to-br from-primary-50 to-blue-50',
        ring: 'ring-primary-100',
    },
    {
        icon: Eye,
        title: 'Our Vision',
        description:
            'To become India\'s most trusted platform for blue-collar employment, empowering millions of skilled workers and transforming how businesses find and hire talent.',
        color: 'text-accent-600',
        bg: 'bg-gradient-to-br from-indigo-50 to-violet-50',
        ring: 'ring-indigo-100',
    },
    {
        icon: Heart,
        title: 'The Problem We Solve',
        description:
            'Blue-collar workers often struggle to find stable, well-paying jobs, while employers face challenges in finding verified, skilled workers quickly. SkillBridge eliminates these challenges with technology.',
        color: 'text-rose-600',
        bg: 'bg-gradient-to-br from-rose-50 to-pink-50',
        ring: 'ring-rose-100',
    },
    {
        icon: Lightbulb,
        title: 'Why We Built This',
        description:
            'We saw a massive gap between skilled workers and quality employment opportunities. Traditional hiring methods are slow, unreliable, and unfair. SkillBridge was created to fix that — with speed, trust, and technology.',
        color: 'text-amber-600',
        bg: 'bg-gradient-to-br from-amber-50 to-yellow-50',
        ring: 'ring-amber-100',
    },
];

const highlights = [
    { icon: Award, value: 'Trusted', label: 'Platform', color: 'from-primary-500 to-primary-600' },
    { icon: Users, value: '10K+', label: 'Workers', color: 'from-emerald-500 to-emerald-600' },
    { icon: Globe, value: '50+', label: 'Cities', color: 'from-violet-500 to-violet-600' },
    { icon: TrendingUp, value: '95%', label: 'Success', color: 'from-amber-500 to-amber-600' },
];

function About() {
    return (
        <main>
            {/* Hero Banner */}
            <section className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-accent-600 py-20 lg:py-28 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-10 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
                    <div className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                            backgroundSize: '32px 32px',
                        }}
                    />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-200 bg-white/10 px-4 py-1.5 rounded-full mb-4 border border-white/15">
                        <Heart size={14} />
                        About Us
                    </span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5">
                        Empowering Workers. <br className="hidden sm:block" />
                        Enabling Employers.
                    </h1>
                    <p className="text-lg text-primary-100 max-w-2xl mx-auto leading-relaxed mb-10">
                        SkillBridge was founded to transform the blue-collar hiring landscape
                        by making it accessible, trustworthy, and efficient for everyone.
                    </p>

                    {/* Quick Stats */}
                    <div className="flex flex-wrap justify-center gap-4">
                        {highlights.map(({ icon: Icon, value, label, color }) => (
                            <div key={label} className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl">
                                <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center shadow-md`}>
                                    <Icon size={18} className="text-white" />
                                </div>
                                <div className="text-left">
                                    <div className="text-lg font-bold text-white">{value}</div>
                                    <div className="text-xs text-primary-200">{label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-20 lg:py-28 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50/50 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-50/50 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Image Side */}
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary-100 via-accent-100 to-emerald-100 overflow-hidden shadow-xl">
                                <div className="w-full h-full flex items-center justify-center relative">
                                    <div className="absolute inset-0 opacity-10"
                                        style={{
                                            backgroundImage: 'radial-gradient(circle, #2563eb 1px, transparent 1px)',
                                            backgroundSize: '20px 20px',
                                        }}
                                    />
                                    <div className="text-center p-8 relative z-10">
                                        <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                                            <span className="text-4xl font-bold text-white">SB</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-primary-800 mb-2">SkillBridge</h3>
                                        <p className="text-primary-600 font-medium">Since 2024</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-accent-500/20 to-violet-500/20 rounded-2xl -z-10" />
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-primary-500/20 rounded-full -z-10" />
                        </div>

                        {/* Text Side */}
                        <div>
                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 bg-primary-50 px-4 py-1.5 rounded-full mb-4 border border-primary-100">
                                <Globe size={14} />
                                Our Story
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                                Building the Future of <span className="gradient-text">Blue-Collar Hiring</span>
                            </h2>
                            <div className="space-y-4 text-gray-600 leading-relaxed">
                                <p>
                                    In India, over 450 million workers are employed in
                                    blue-collar jobs — yet most rely on word-of-mouth or
                                    middlemen to find work. This results in exploitation,
                                    job insecurity, and wasted potential.
                                </p>
                                <p>
                                    SkillBridge was built to change this. We provide a
                                    technology-driven platform where workers can showcase
                                    their skills and employers can find verified talent
                                    instantly. No middlemen, no exploitation — just
                                    fair, efficient, and transparent employment.
                                </p>
                                <p>
                                    Our platform verifies every worker, provides secure
                                    payment guarantees, and offers real-time communication
                                    tools — making hiring seamless for everyone involved.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 bg-violet-50 px-4 py-1.5 rounded-full mb-4 border border-violet-100">
                            <Lightbulb size={14} />
                            What Drives Us
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                            Our Core <span className="gradient-text">Values</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {values.map(({ icon: Icon, title, description, color, bg, ring }) => (
                            <div
                                key={title}
                                className={`group p-8 rounded-2xl bg-white ring-1 ${ring} hover:ring-2 card-shadow hover:card-shadow-hover hover:-translate-y-2 transition-all duration-300`}
                            >
                                <div
                                    className={`w-14 h-14 ${bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                                >
                                    <Icon size={26} className={color} />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                                    {title}
                                </h3>
                                <p className="text-gray-500 leading-relaxed">
                                    {description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default About;
