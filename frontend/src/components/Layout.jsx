import { Link } from "react-router-dom";

function Layout({ eyebrow, title, description, children }) {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/"
            className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500"
          >
            Choose Man
          </Link>
        </div>

        <section className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-glow backdrop-blur sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral">
            {eyebrow}
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{description}</p>
          <div className="mt-10">{children}</div>
        </section>
      </div>
    </div>
  );
}

export default Layout;
