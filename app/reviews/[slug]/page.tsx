import { notFound } from "next/navigation";

import MarkdownRenderer from "@/components/markdown-renderer";
import SiteNav from "@/components/site-nav";
import { getReviewBySlug, getReviewsList } from "@/lib/reviews";

type ReviewPageProps = {
  params: Promise<{ slug: string }>;
};

const ReviewPage = async ({ params }: ReviewPageProps) => {
  const { slug } = await params;
  const review = await getReviewBySlug(slug);

  if (!review) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-white to-slate-50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 pb-24 pt-12 sm:px-10 lg:px-16">
        <SiteNav />

        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            {review.reviewer}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            {review.title}
          </h1>
          <p className="text-sm text-slate-600">{review.description}</p>
        </header>

        <article className="rounded-[2.5rem] border border-slate-200 bg-white/90 px-8 pb-16 pt-12 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:px-10">
          <MarkdownRenderer content={review.content} />
        </article>
      </div>
    </div>
  );
};

export const revalidate = 0;

export const generateStaticParams = async () => {
  const reviews = await getReviewsList();
  return reviews.map((review) => ({ slug: review.slug }));
};

export default ReviewPage;
