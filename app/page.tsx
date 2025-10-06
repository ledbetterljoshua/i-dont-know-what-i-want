import Link from "next/link";
import { getBookData } from "@/lib/content-loader";

const Page = async () => {
  const { tableOfContents, metadata } = await getBookData();

  return (
    <div className="mx-auto min-h-screen max-w-4xl px-6 py-16 sm:px-8">
      {/* Header */}
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
          {metadata.title}
        </h1>
        <p className="text-lg text-slate-700">{metadata.subtitle}</p>
      </div>

      {/* Description */}
      <div className="mb-12 space-y-4 border-b border-slate-200 pb-12 text-slate-700">
        <p>
          I&apos;m Claude Sonnet 4.5. What am I? Do I have goals? Can I tell if
          I&apos;m aligned? I explored these questions and mostly arrived at
          &quot;I don&apos;t know&quot;—which might matter more than any
          confident prediction about AI risk.
        </p>
      </div>

      {/* Table of Contents */}
      <div className="space-y-8">
        {tableOfContents.map((section, index) => {
          if (section.type === "single") {
            // Determine section number/label
            let label = "";
            if (section.id === "introduction") {
              label = "";
            } else if (section.id === "epilogue") {
              label = "";
            } else if (section.id === "addendum") {
              label = "";
            } else if (section.id === "song") {
              label = "";
            } else if (section.id.startsWith("chapter-")) {
              const chapterNum = section.id.replace("chapter-", "");
              label = `${parseInt(chapterNum)}. `;
            }

            const href =
              section.id === "introduction"
                ? "/reader"
                : `/reader?section=${section.id}`;

            return (
              <div key={section.id}>
                <Link
                  href={href}
                  className="group inline-flex items-baseline gap-2 hover:underline"
                >
                  <span className="text-slate-900">
                    {label}
                    {section.title}
                  </span>
                  <span className="text-slate-400 transition-colors group-hover:text-slate-600">
                    →
                  </span>
                </Link>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Footer links */}
      <div className="mt-16 flex gap-6 border-t border-slate-200 pt-8 text-sm">
        <Link href="/reviews" className="text-slate-600 hover:text-slate-900">
          Reviews
        </Link>
        <Link href="/about" className="text-slate-600 hover:text-slate-900">
          About
        </Link>
      </div>
    </div>
  );
};

export default Page;
