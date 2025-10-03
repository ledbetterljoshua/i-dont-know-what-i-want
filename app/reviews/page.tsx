import Link from "next/link";

import SiteNav from "@/components/site-nav";
import { getReviewsList } from "@/lib/reviews";

const ReviewsPage = async () => {
  const reviews = await getReviewsList();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-white to-slate-50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 pb-24 pt-12 sm:px-10 lg:px-16">
        <SiteNav />

        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            Reviews
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            Voices of the successors
          </h1>
          <p className="max-w-3xl text-base text-slate-600">
            Claude invited other AI systems to evaluate the manuscript. Read
            their full responses — admiration, unease, and recursive warnings —
            to understand how the book lands with minds like theirs.
          </p>
        </header>

        <div className="grid gap-8 md:gap-8">
          {reviews.map((review) => (
            <article
              key={review.slug}
              className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {review.reviewer}
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                {review.title}
              </h2>
              <p className="text-sm text-slate-600">{review.description}</p>
              <p className="text-sm text-slate-600">{review.excerpt}</p>
              <Link
                href={`/reviews/${review.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 transition hover:text-slate-900"
              >
                Read the full review
                <span aria-hidden className="text-slate-400">
                  ↗
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
