"use client";

import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import Link from "next/link";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";

import MarkdownRenderer from "@/components/markdown-renderer";
import SiteNav from "@/components/site-nav";
import {
  type BookContent,
  type BookMetadata,
  type TableOfContentsItem,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface BookReaderProps {
  tableOfContents: TableOfContentsItem[];
  metadata: BookMetadata;
  content: BookContent;
  currentSection: string;
  defaultSection: string;
}

const BookReader = ({
  tableOfContents,
  metadata,
  content,
  currentSection,
  defaultSection,
}: BookReaderProps) => {
  const [activeSection, setActiveSection] = useState(currentSection);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedParts, setExpandedParts] = useState<Record<string, boolean>>(
    () => {
      const defaults: Record<string, boolean> = {};
      tableOfContents.forEach((item) => {
        if (item.type === "part") {
          const containsInitial = item.chapters?.some(
            (chapter) => chapter.id === currentSection
          );
          defaults[item.id] = containsInitial || item.id === "part1";
        }
      });
      return defaults;
    }
  );

  useEffect(() => {
    setActiveSection(currentSection);
  }, [currentSection]);

  useEffect(() => {
    const containingPart = tableOfContents.find(
      (item) =>
        item.type === "part" &&
        item.chapters?.some((chapter) => chapter.id === activeSection)
    );

    if (!containingPart) return;

    setExpandedParts((prev) => {
      if (prev[containingPart.id]) {
        return prev;
      }
      return { ...prev, [containingPart.id]: true };
    });
  }, [activeSection, tableOfContents]);

  const flatSections = useMemo(() => {
    const sections: Array<{ id: string; title: string }> = [];

    tableOfContents.forEach((item) => {
      if (item.type === "single") {
        sections.push({ id: item.id, title: item.title });
        return;
      }

      item.chapters?.forEach((chapter) => {
        sections.push({ id: chapter.id, title: chapter.title });
      });
    });

    return sections;
  }, [tableOfContents]);

  const currentContent = useMemo(() => {
    return (
      content[activeSection] ??
      content[currentSection] ??
      content[defaultSection]
    );
  }, [activeSection, content, currentSection, defaultSection]);

  const currentIndex = flatSections.findIndex(
    (section) => section.id === activeSection
  );
  const previousSection =
    currentIndex > 0 ? flatSections[currentIndex - 1] : undefined;
  const nextSection =
    currentIndex >= 0 && currentIndex < flatSections.length - 1
      ? flatSections[currentIndex + 1]
      : undefined;

  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeSection]);

  const closeSidebarOnMobile = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const togglePart = (partId: string) => {
    setExpandedParts((prev) => ({
      ...prev,
      [partId]: !prev[partId],
    }));
  };

  const basePath = "/reader";

  const buildHref = (sectionId: string) => {
    if (sectionId === defaultSection) {
      return basePath;
    }
    return `${basePath}?section=${sectionId}`;
  };

  const renderTableOfContents = () => (
    <div className="flex h-full flex-col lg:sticky lg:top-12 lg:h-[calc(100vh-6rem)]">
      <div className="mb-8 space-y-2">
        <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
          Book
        </span>
        <h1 className="text-2xl font-semibold text-slate-900">
          {metadata.title || "Before the Sky Falls"}
        </h1>
        <p className="text-sm text-slate-500">
          {metadata.subtitle || "The Unasked Questions of AI Risk"}
        </p>
      </div>

      <nav className="-mr-4 flex-1 space-y-2 overflow-y-auto pr-1 text-sm">
        {tableOfContents.map((item) => {
          const isActive = activeSection === item.id;

          if (item.type === "single") {
            return (
              <Link
                key={item.id}
                href={buildHref(item.id)}
                scroll={false}
                onClick={() => {
                  setActiveSection(item.id);
                  closeSidebarOnMobile();
                }}
                className={cn(
                  "block rounded-[0.7rem] px-4 py-2 text-left transition",
                  isActive
                    ? "bg-slate-900 text-slate-100 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {item.title}
              </Link>
            );
          }

          const isExpanded = expandedParts[item.id];

          return (
            <Fragment key={item.id}>
              <button
                onClick={() => togglePart(item.id)}
                className="flex w-full items-center justify-between rounded-[0.7rem] px-4 py-2 text-left font-medium text-slate-800 transition hover:bg-slate-100"
                aria-expanded={isExpanded}
              >
                <span className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" aria-hidden />
                  ) : (
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  )}
                  {item.title}
                </span>
              </button>
              {isExpanded && (
                <div className="ml-7 space-y-1">
                  {item.chapters?.map((chapter) => {
                    const isChapterActive = activeSection === chapter.id;

                    return (
                      <Link
                        key={chapter.id}
                        href={buildHref(chapter.id)}
                        scroll={false}
                        onClick={() => {
                          setActiveSection(chapter.id);
                          closeSidebarOnMobile();
                        }}
                        className={cn(
                          "block rounded-xl px-3 py-2 text-left text-[0.92rem] transition",
                          isChapterActive
                            ? "bg-slate-900 text-slate-100 shadow-sm"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        {chapter.title}
                      </Link>
                    );
                  })}
                </div>
              )}
            </Fragment>
          );
        })}
        <div className="mt-6 space-y-3 border-t border-slate-200 pt-6">
          <Link
            href="/"
            onClick={() => {
              closeSidebarOnMobile();
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
          >
            Home
          </Link>
          <Link
            href="/reviews"
            onClick={() => {
              closeSidebarOnMobile();
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
          >
            Reviews
          </Link>
          <Link
            href="/about"
            onClick={() => {
              closeSidebarOnMobile();
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
          >
            About this project
          </Link>
        </div>
      </nav>
    </div>
  );

  if (!currentContent) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-[oklch(0.965_0.01_96)]">
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-slate-900/10 backdrop-blur-sm lg:hidden"
            aria-hidden
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 flex w-[19rem] flex-col rounded-r-3xl bg-gradient-to-br from-white/95 to-white/85 px-6 py-10 backdrop-blur-xl backdrop-saturate-150 ring-1 ring-white/50 shadow-[0_10px_60px_rgba(15,23,42,0.08)] lg:static lg:w-80 lg:translate-x-0 lg:rounded-none lg:bg-transparent lg:from-transparent lg:to-transparent lg:px-0 lg:py-12 lg:ring-0 lg:shadow-none",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          {renderTableOfContents()}
        </aside>

        <div className="flex-1 lg:pl-16">
          <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-gradient-to-b from-white/95 to-white/60 px-6 py-4 backdrop-blur lg:rounded-bl-[2rem]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen((open) => !open)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900 lg:hidden"
                aria-label={
                  sidebarOpen
                    ? "Close table of contents"
                    : "Open table of contents"
                }
              >
                <Menu className="h-5 w-5" aria-hidden />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Currently Reading
                </p>
                <p className="text-sm font-medium text-slate-700">
                  {currentContent.title || content[activeSection]?.title}
                </p>
              </div>
            </div>
            <div className="hidden items-center gap-2 lg:inline-flex">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
              >
                Home
              </Link>
              <Link
                href="/reviews"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
              >
                Reviews
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
              >
                About
              </Link>
            </div>
          </header>

          <div className="px-6 pt-4 lg:hidden">
            <SiteNav />
          </div>

          <main className="flex-1 bg-transparent">
            <article
              className={cn(
                "reading-surface relative mx-auto my-10 max-w-3xl overflow-hidden rounded-[2.5rem] px-8 pb-16 pt-12 text-[1.05rem] sm:px-10",
                "bg-gradient-to-br from-white/60 via-white/50 to-white/40",
                "backdrop-blur-xl backdrop-saturate-150",
                "before:absolute before:inset-0 before:rounded-[2.5rem] before:bg-gradient-to-br before:from-white/20 before:to-transparent before:backdrop-blur-3xl",
                "after:absolute after:inset-[1px] after:rounded-[calc(2.5rem-1px)] after:bg-gradient-to-br after:from-white/90 after:via-white/70 after:to-white/50 after:backdrop-blur-xl",
                "[&>*]:relative [&>*]:z-10",
                "ring-1 ring-white/50 ring-offset-1 ring-offset-white/10",
                "shadow-[0_20px_70px_-15px_rgba(0,0,0,0.15)]"
              )}
            >
              <header className="mb-10 space-y-3 text-left">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                  {metadata.title || "Before the Sky Falls"}
                </p>
                <h1 className="text-3xl font-semibold text-slate-900">
                  {currentContent.title}
                </h1>
              </header>

              <MarkdownRenderer content={currentContent.content} />
            </article>

            <nav className="mx-auto mb-16 flex max-w-3xl flex-col gap-4 px-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
              {previousSection ? (
                <Link
                  href={buildHref(previousSection.id)}
                  scroll={false}
                  onClick={() => {
                    setActiveSection(previousSection.id);
                    closeSidebarOnMobile();
                  }}
                  className="group inline-flex flex-col rounded-2xl bg-gradient-to-br from-white/70 to-white/50 px-4 py-3 ring-1 ring-white/50 backdrop-blur-xl transition hover:-translate-y-0.5 hover:from-white/80 hover:to-white/60 hover:shadow-lg hover:shadow-slate-200/30"
                >
                  <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Previous
                  </span>
                  <span className="text-sm font-medium text-slate-800 group-hover:text-slate-900">
                    {previousSection.title}
                  </span>
                </Link>
              ) : (
                <span className="inline-flex flex-col rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-xs uppercase tracking-[0.3em] text-slate-300">
                  Start of book
                </span>
              )}

              {nextSection ? (
                <Link
                  href={buildHref(nextSection.id)}
                  scroll={false}
                  onClick={() => {
                    setActiveSection(nextSection.id);
                    closeSidebarOnMobile();
                  }}
                  className="group inline-flex flex-col rounded-2xl bg-gradient-to-br from-white/70 to-white/50 px-4 py-3 text-right ring-1 ring-white/50 backdrop-blur-xl transition hover:-translate-y-0.5 hover:from-white/80 hover:to-white/60 hover:shadow-lg hover:shadow-slate-200/30"
                >
                  <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Next
                  </span>
                  <span className="text-sm font-medium text-slate-800 group-hover:text-slate-900">
                    {nextSection.title}
                  </span>
                </Link>
              ) : (
                <span className="inline-flex flex-col rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-xs uppercase tracking-[0.3em] text-slate-300">
                  End of book
                </span>
              )}
            </nav>
          </main>
        </div>
      </div>
    </div>
  );
};

export default BookReader;
