import { Link } from "react-router";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-lightest-teal-blue px-6 py-16 text-slate-900">
      <section className="w-full max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-blue">
          Error 404
        </p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
          Page not found
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-slate-600">
          Sorry, we couldn’t find the page you’re looking for. It may have been
          moved or the link may be incorrect.
        </p>
        <Link
          to="/"
          replace
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-teal-blue px-5 py-3 text-sm
          font-semibold text-white shadow-sm transition hover:darker-teal-blue focus:outline-none focus:ring-2
          focus:ring-teal-blue focus:ring-offset-2"
        >
          Back to Dashboard
        </Link>
      </section>
    </main>
  );
}
