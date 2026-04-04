import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import WhySection from '../components/WhySection';
import HowItWorksSection from '../components/HowItWorksSection';
import StatsSection from '../components/StatsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTASection from '../components/CTASection';

function Home() {
    return (
        <main>
            <HeroSection />
            <ServicesSection />
            <WhySection />
            <HowItWorksSection />
            <StatsSection />
            <TestimonialsSection />
            <CTASection />
        </main>
    );
}

export default Home;
