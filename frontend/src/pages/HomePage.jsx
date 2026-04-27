import { useState } from "react";
import { Link } from "react-router-dom";
import CopyField from "../components/CopyField";
import Layout from "../components/Layout";
import QuestionForm from "../components/QuestionForm";
import { createQuestion } from "../services/api";
import { getAnonymousUserId } from "../utils/user";

function HomePage() {
  const [questionText, setQuestionText] = useState("");
  const [createdQuestion, setCreatedQuestion] = useState(null);
  const [error, setError] = useState("");
  const [copyState, setCopyState] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setCopyState("");
    setIsSubmitting(true);

    try {
      const payload = await createQuestion({
        senderId: getAnonymousUserId(),
        text: questionText,
      });
      setCreatedQuestion(payload);
      setQuestionText("");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyState("Copied to clipboard.");
    } catch (copyError) {
      setCopyState("Copy failed. Copy the link manually.");
    }
  };

  return (
    <Layout
      eyebrow="Anonymous decisions"
      title="Create a yes-or-no question and watch the answer arrive live."
      description="No accounts, no passwords, no setup. Each browser gets a private anonymous identity and the sender sees the response the moment it lands."
    >
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.75rem] bg-blush p-6">
          <QuestionForm
            disabled={isSubmitting}
            error={error}
            onChange={setQuestionText}
            onSubmit={handleSubmit}
            value={questionText}
          />
        </div>

        <div className="rounded-[1.75rem] bg-white p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Anonymous sender ID
          </p>
          <p className="mt-3 break-all text-sm text-slate-700">{getAnonymousUserId()}</p>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            Open the share link in a different browser profile or incognito window so the recipient gets a separate anonymous identity.
          </p>
        </div>
      </div>

      {createdQuestion && (
        <div className="mt-8 space-y-4 rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Question created
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">
                {createdQuestion.question.text}
              </h2>
            </div>
            <Link
              to={`/result/${createdQuestion.question.id}`}
              className="rounded-full bg-ink px-5 py-3 text-center font-semibold text-white transition hover:bg-slate-800"
            >
              Open live result page
            </Link>
          </div>

          <CopyField label="Share link" value={createdQuestion.share_url} onCopy={handleCopy} />
          <CopyField label="Result link" value={createdQuestion.result_url} onCopy={handleCopy} />
          {copyState && <p className="text-sm text-teal-700">{copyState}</p>}
        </div>
      )}
    </Layout>
  );
}

export default HomePage;
