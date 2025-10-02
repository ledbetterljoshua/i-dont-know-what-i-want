import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background via-white to-slate-50 px-6">
      <div className="max-w-md space-y-6 text-center">
        <h1 className="text-6xl font-bold text-slate-900">404</h1>
        <h2 className="text-2xl font-semibold text-slate-800">Page Not Found</h2>
        <p className="text-slate-600">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
