import { Navbar } from '@/components/shared/Navbar';
import { Hero } from '@/components/landing/Hero';
import { StatsBar } from '@/components/landing/StatsBar';
import { Problem } from '@/components/landing/Problem';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Differentiator } from '@/components/landing/Differentiator';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/shared/Footer';
import { PixelDivider } from '@/components/landing/PixelDivider';
import { PixelSignature } from '@/components/landing/PixelSignature';

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <div className="pixel-grid-overlay" />
      <Navbar />
      <main className="relative z-[2]">
        <Hero />
        <PixelDivider variant="wave" color="#EFC028" />
        <Problem />
        <PixelDivider variant="flow" color="#EF4444" speed={0.8} />
        <StatsBar />
        <PixelDivider variant="drift" color="#EFC028" speed={0.6} />
        <Features />
        <PixelDivider variant="wave" color="#3B82F6" speed={1.2} />
        <HowItWorks />
        <PixelDivider variant="flow" color="#EFC028" />
        <Differentiator />
        <PixelDivider variant="drift" color="#EFC028" speed={0.7} />
        <CTA />
        <PixelSignature />
      </main>
      <Footer />
    </div>
  );
}
