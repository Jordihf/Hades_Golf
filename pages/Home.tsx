import React from 'react';
import Hero from '../components/Hero';
import ProblemSection from '../components/ProblemSection';
import SolutionSection from '../components/SolutionSection';
import OptionsSection from '../components/OptionsSection';
import ProcessSection from '../components/ProcessSection';
import PricingSection from '../components/PricingSection';
import WhySection from '../components/WhySection';
import CTAFinal from '../components/CTAFinal';

const Home: React.FC = () => {
  return (
    <main>
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <OptionsSection />
      <ProcessSection />
      <PricingSection />
      <WhySection />
      <CTAFinal />
    </main>
  );
};

export default Home;
