import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'Rajesh Kumar',
        role: 'Electrician, Delhi',
        content: 'SkillBridge changed my life. I now get consistent work, fair pay, and the app makes everything transparent. Highly recommended for workers!',
        rating: 5,
        avatar: 'RK',
        color: 'from-primary-500 to-primary-600',
    },
    {
        name: 'Priya Sharma',
        role: 'Homeowner, Mumbai',
        content: 'Finding a reliable plumber used to be a nightmare. SkillBridge made it so easy — verified profiles, real reviews, and quick response times.',
        rating: 5,
        avatar: 'PS',
        color: 'from-rose-500 to-rose-600',
    },
    {
        name: 'Amit Patel',
        role: 'Construction Manager, Pune',
        content: 'We hired an entire crew through SkillBridge for our project. The quality was outstanding and the process was seamless. Great platform!',
        rating: 5,
        avatar: 'AP',
        color: 'from-emerald-500 to-emerald-600',
    },
];

function TestimonialsSection() {
    return (
        <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-10 right-10 w-72 h-72 bg-amber-50/50 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-primary-50/50 rounded-full blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 bg-amber-50 px-4 py-1.5 rounded-full mb-4 border border-amber-100">
                        <Star size={14} />
                        Testimonials
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        What People Are <span className="gradient-text">Saying</span>
                    </h2>
                    <p className="text-gray-500 leading-relaxed">
                        Real stories from real people who trust SkillBridge for their hiring and job needs.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map(({ name, role, content, rating, avatar, color }) => (
                        <div
                            key={name}
                            className="group p-7 rounded-2xl bg-white card-shadow hover:card-shadow-hover hover:-translate-y-2 transition-all duration-300 border border-gray-100"
                        >
                            {/* Quote Icon */}
                            <Quote size={32} className="text-primary-100 mb-4" />

                            {/* Content */}
                            <p className="text-gray-600 leading-relaxed mb-6 italic">
                                &ldquo;{content}&rdquo;
                            </p>

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-5">
                                {Array.from({ length: rating }).map((_, i) => (
                                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            {/* Author */}
                            <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                                <div className={`w-11 h-11 bg-gradient-to-br ${color} rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md`}>
                                    {avatar}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 text-sm">{name}</h4>
                                    <p className="text-xs text-gray-400">{role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TestimonialsSection;
