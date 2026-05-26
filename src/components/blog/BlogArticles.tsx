'use client';

import { useStaggerReveal } from '@/hooks/useStaggerReveal';
import { blogArticles } from '@/data/blogData';
import ArticleCard from './ArticleCard';

export default function BlogArticles() {
  const ref = useStaggerReveal<HTMLDivElement>({ stagger: 0.1 });

  return (
    <section className="pb-16">
      <div ref={ref} className="max-w-[720px] mx-auto px-6 md:px-12 space-y-4">
        {blogArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
