import { Link } from "react-router-dom";
import Layout from "../components/Layout";

function NotFoundPage() {
  return (
    <Layout
      eyebrow="Not found"
      title="That page does not exist."
      description="The link may be broken, expired after a backend restart, or typed incorrectly."
    >
      <Link
        to="/"
        className="inline-flex rounded-full bg-ink px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
      >
        Back to home
      </Link>
    </Layout>
  );
}

export default NotFoundPage;
