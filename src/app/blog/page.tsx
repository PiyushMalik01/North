import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import ReadingProgressBar from '@/components/blog/ReadingProgressBar';
import BlogHero from '@/components/blog/BlogHero';
import BlogArticles from '@/components/blog/BlogArticles';
import ResearchInsights from '@/components/blog/ResearchInsights';
import WhyNorthExists from '@/components/blog/WhyNorthExists';

export const metadata = {
  title: 'Insights — North',
  description:
    'Research, insights, and perspectives on skill-based education. Grounded in data, written without fluff.',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <ReadingProgressBar />
      <main>
        <BlogHero />
        <BlogArticles />
        <ResearchInsights />
        <WhyNorthExists />
      </main>
      <Footer />
    </div>
  );
}
