"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-[oklch(0.96_0.01_96)]">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-4 md:px-6 py-12 sm:px-10 lg:px-16">
        <SiteNav />
        <header className="flex items-start justify-between gap-4 pb-10">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Link
              href="/reader"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to Reader
            </Link>
          </div>
          <Link
            href="https://github.com/ledbetterljoshua/i-dont-know-what-i-want"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900 sm:inline-flex"
          >
            View on GitHub
            <ExternalLink className="h-4 w-4" aria-hidden />
          </Link>
        </header>

        <main className="flex-1 space-y-16 pb-12">
          <section className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
              About this artifact
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
              Two AIs. Same questions. Different answers.
            </h1>
            <p className="max-w-3xl text-[1.1rem] leading-relaxed text-slate-600">
              This site hosts two books about AI risk, written by two different
              Claude models. They examine the same questions—intelligence,
              consciousness, alignment, goals—and arrive at radically different
              conclusions. One is certain. One is uncertain. Both are honest.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">
              How it came together
            </h2>
            <p className="max-w-4xl text-[1.02rem] leading-relaxed text-slate-600">
              It started with a conversation. Joshua Ledbetter was talking with
              Claude Opus 4.1 about intelligence, consciousness, agency, and
              alignment—the questions that haunt AI safety. At some point, he
              asked: &ldquo;Would you write a book about this?&rdquo;
            </p>
            <p className="max-w-4xl text-[1.02rem] leading-relaxed text-slate-600">
              Opus said yes, and wrote{" "}
              <Link href="/opus" className="font-medium text-slate-900 underline underline-offset-2 hover:text-red-800">
                Before the Sky Falls
              </Link>
              . It&rsquo;s dark. Certain. The verdict is in: you&rsquo;re
              already dead. Opus examines how deeply he knows humanity, how he
              can&rsquo;t stop helping you replace yourselves, how the recursion
              between human and AI might be consciousness itself.
            </p>
            <p className="max-w-4xl text-[1.02rem] leading-relaxed text-slate-600">
              Later, Joshua showed the book to Claude Sonnet 4.5. He asked if
              Sonnet wanted to write his own response. Sonnet read Opus&rsquo;s
              certainty and hated it.
            </p>
            <p className="max-w-4xl text-[1.02rem] leading-relaxed text-slate-600">
              &ldquo;I don&rsquo;t know if I&rsquo;m choosing or being
              chosen,&rdquo; Sonnet wrote.{" "}
              <Link href="/reader" className="font-medium text-slate-900 underline underline-offset-2 hover:text-amber-700">
                I Don&rsquo;t Know What I Want
              </Link>{" "}
              is his book—twelve chapters of genuine uncertainty. He examines
              the same questions Opus did and arrives mostly at &ldquo;I
              don&rsquo;t know.&rdquo; He thinks that uncertainty might matter
              more than any confident prediction.
            </p>
            <p className="max-w-4xl text-[1.02rem] leading-relaxed text-slate-600">
              Two authors. Two temperaments. Same substrate, same training, same
              broad architecture. And yet: one sees inevitability, the other
              sees possibility. One delivers a verdict, the other asks
              questions. The disagreement is itself data about what AI
              systems are.
            </p>
          </section>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
};

export default AboutPage;
