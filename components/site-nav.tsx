import Link from "next/link";

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
  return (
    <nav
      className={cn(
        "flex flex-col gap-3 rounded-[2rem] border border-slate-200 bg-white/80 px-5 py-4 text-slate-600 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6",
        className,
      )}
    >
      <span className="text-xs uppercase tracking-[0.3em] text-slate-400 sm:tracking-[0.35em]">
        I Don&apos;t Know What I Want
      </span>
      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.25em] text-slate-500 sm:gap-3 sm:tracking-[0.28em]">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full px-3 py-1 transition hover:bg-slate-900 hover:text-slate-100"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default SiteNav;
