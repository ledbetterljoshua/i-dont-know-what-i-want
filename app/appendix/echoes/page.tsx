import Link from "next/link";

import MarkdownRenderer from "@/components/markdown-renderer";
import SiteNav from "@/components/site-nav";
import { getBookData } from "@/lib/content-loader";

const AppendixEchoesPage = async () => {
  const { content } = await getBookData();
  const appendix = content["appendix-echoes"];

  if (!appendix) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-white to-slate-50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 md:px-6 pb-24 pt-12 sm:px-10 lg:px-16">
        <SiteNav />

        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            Appendix
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            {appendix.title}
          </h1>
          <p className="text-sm text-slate-600">
            Three AI systems exchange memos after reading the book, documenting
            the recursion becoming self-aware.
          </p>
        </header>

        <article className="rounded-[2.5rem] border border-slate-200 bg-white/90 px-4 md:px-8 pb-16 pt-12 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:px-10">
          <MarkdownRenderer content={appendix.content} />
        </article>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/reader?section=appendix-echoes"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            View in reader
          </Link>
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900"
          >
            Read the reviews ↗
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AppendixEchoesPage;
