"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/reader", label: "Reader" },
  { href: "/reviews", label: "Reviews" },
  { href: "/song", label: "Song" },
  { href: "/about", label: "About" },
];

type SiteNavProps = {
  className?: string;
};

const SiteNav = ({ className }: SiteNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav
        className={cn(
          "flex items-center justify-between rounded-[2rem] border border-slate-200 bg-white/80 px-5 py-4 shadow-sm",
          className,
        )}
      >
        <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
          I Don&apos;t Know What I Want
        </span>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </nav>

      {/* Drawer */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed right-0 top-0 z-50 h-full w-64 border-l border-slate-200 bg-white shadow-xl">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <span className="text-sm font-semibold text-slate-900">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 space-y-1 p-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SiteNav;
