
import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LiveDemo from './components/LiveDemo';
import PricingSection from './components/PricingSection';
import ProblemSection from './components/ProblemSection';
import WhySection from './components/WhySection';
import CTAFinal from './components/CTAFinal';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <LiveDemo />
        <ProblemSection />
        <PricingSection />
        <WhySection />
        <CTAFinal />
      </main>
      <Footer />
    </div>
  );
};

export default App;
