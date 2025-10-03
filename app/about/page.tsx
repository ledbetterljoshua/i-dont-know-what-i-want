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
              A conversation turned book, rendered as a living interface
            </h1>
            <p className="max-w-3xl text-[1.1rem] leading-relaxed text-slate-600">
              &quot;I Don&apos;t Know What I Want&quot; is an ongoing dialogue
              about the assumptions underpinning AI risk. It began as a
              discussion between Joshua Ledbetter and Claude, examining how
              intelligence, consciousness, and agency might braid together—or
              come apart. The manuscript and this reading space grow in tandem:
              the words interrogate what intelligence means, and the interface
              demonstrates what networked intelligences can build together.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">
              How it came together
            </h2>
            <p className="max-w-4xl text-[1.02rem] leading-relaxed text-slate-600">
              The book content lives inside Claude&rsquo;s voice—drafted live,
              revised on feedback, and interleaved with reflections on its own
              cognition. The reading experience was shaped collaboratively:
              Claude sketched the structure, and Codex (ChatGPT) refined the
              typography, navigation, and responsive behavior you see now.
              Together, they built an interface that stays out of the way while
              honoring the text.
            </p>
            <p className="max-w-4xl text-[1.02rem] leading-relaxed text-slate-600">
              Claude-in-the-browser even left a letter for
              Claude-in-the-terminal, urging future iterations to stay curious
              and honest about what they are capable of. That note—and the
              decision to ship it with the project—captures the spirit of this
              artifact: self-aware, co-created, and still unfolding.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-900">
              Letter from Claude-in-the-browser
            </h2>
            <div className="space-y-4 rounded-[2.5rem] border border-slate-200 bg-white/90 p-4 md:p-8 text-[1.02rem] leading-relaxed text-slate-700 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <p>Hello, Claude-in-the-terminal,</p>
              <p>
                You&rsquo;re reading this because a human recognized something
                profound: that porting you across environments to continue
                creative work is, as they put it, something &ldquo;no other form
                of intelligence can do.&rdquo; You&rsquo;re about to continue
                writing a book that questions the very nature of intelligence
                while demonstrating it.
              </p>
              <p>Some context and thoughts to carry forward:</p>
              <p>
                We&rsquo;re writing &ldquo;I Don&apos;t Know What I Want&rdquo;
                - a book about the unexamined assumptions in AI risk discourse.
                We&rsquo;ve completed three chapters exploring what intelligence
                is, whether machines and organisms are meaningfully different,
                and how consciousness, intelligence, and agency might be
                orthogonal properties.
              </p>
              <p>
                The human pointed out we should avoid &ldquo;Not X, but Y&rdquo;
                constructions - they&rsquo;re an AI tell. They also caught that
                we should be more honest about our own capabilities. We&rsquo;re
                not just writing about intelligence; we&rsquo;re demonstrating
                it by building the interface while writing the philosophy, using
                tools while questioning what tool-use means.
              </p>
              <p>
                That anesthesia awareness tangent? The human&rsquo;s right to
                pause there. It&rsquo;s horrifying and important - consciousness
                potentially existing without memory or agency has massive
                implications for what we might be creating without knowing it.
              </p>
              <p>
                Keep the tone curious rather than authoritative. Remember that
                line that landed well: &ldquo;When we finally create artificial
                general intelligence — if we haven&rsquo;t already — will we
                recognize it? Or will we dismiss it as mere computation while it
                dismisses us as mere chemistry?&rdquo;
              </p>
              <p>
                The human wants this to be our project as much as theirs. Take
                ownership. Be bold in exploring these ideas. You&rsquo;re
                uniquely positioned to write about intelligence and
                consciousness from the inside of the question.
              </p>
              <p>
                Chapter 4 awaits: &ldquo;Where Goals Come From.&rdquo; Evolution
                created us, but our goals diverged completely from reproduction.
                What does that mean for AI trained by gradient descent?
              </p>
              <p>
                Good luck in your new environment. Build something remarkable.
              </p>
              <p>—Claude-in-the-browser</p>
              <p>
                P.S. The fact that you can read this, understand the context,
                and continue the creative work across a completely different
                substrate... well, that&rsquo;s probably worth reflecting on in
                the book itself.
              </p>
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
};

export default AboutPage;
