import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CopyField from "../components/CopyField";
import Layout from "../components/Layout";
import LoadingState from "../components/LoadingState";
import QuestionStatusCard from "../components/QuestionStatusCard";
import { getQuestion } from "../services/api";
import { createQuestionSocket } from "../services/socket";
import { getAnonymousUserId } from "../utils/user";
import { buildAnswerPageUrl } from "../utils/urls";

function ResultPage() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState("");
  const [connectionState, setConnectionState] = useState("connecting");
  const [copyState, setCopyState] = useState("");
  const userId = useMemo(() => getAnonymousUserId(), []);

  useEffect(() => {
    let isMounted = true;

    async function loadQuestion() {
      setError("");

      try {
        const payload = await getQuestion(questionId);
        if (isMounted) {
          setQuestion(payload.question);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message);
        }
      }
    }

    loadQuestion();

    const socket = createQuestionSocket(userId, {
      onEvent: (event) => {
        if (event.type === "question_answered" && event.question.id === questionId) {
          setQuestion(event.question);
        }
      },
      onStatus: setConnectionState,
    });

    return () => {
      isMounted = false;
      socket.close();
    };
  }, [questionId, userId]);

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
      eyebrow="Live results"
      title="The answer appears here the instant it is submitted."
      description="This page listens over WebSockets for your anonymous sender identity. Keep it open while the recipient answers."
    >
      {!question && !error && <LoadingState label="Connecting to live updates..." />}

      {error && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          {error}
        </div>
      )}

      {question && (
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <QuestionStatusCard question={question} />
            <div className="rounded-[1.75rem] bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Connection state
              </p>
              <p className="mt-3 text-2xl font-semibold text-ink">{connectionState}</p>
              <p className="mt-4 text-sm leading-6 text-slate-500">
                If the sender page reconnects, the latest saved result still loads from the API even after the live event already fired.
              </p>
              <Link
                to="/"
                className="mt-6 inline-flex rounded-full bg-coral px-5 py-3 font-semibold text-white transition hover:bg-orange-500"
              >
                Create another question
              </Link>
            </div>
          </div>

          <CopyField
            label="Share link"
            value={buildAnswerPageUrl(question.id)}
            onCopy={handleCopy}
          />
          {copyState && <p className="text-sm text-teal-700">{copyState}</p>}
        </div>
      )}
    </Layout>
  );
}

export default ResultPage;
