import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AnswerButtons from "../components/AnswerButtons";
import Layout from "../components/Layout";
import LoadingState from "../components/LoadingState";
import QuestionStatusCard from "../components/QuestionStatusCard";
import { getQuestion, submitAnswer } from "../services/api";
import { getAnonymousUserId } from "../utils/user";

function AnswerPage() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadQuestion() {
      setIsLoading(true);
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
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadQuestion();

    return () => {
      isMounted = false;
    };
  }, [questionId]);

  const handleAnswer = async (answer) => {
    setError("");
    setIsSubmitting(true);

    try {
      const payload = await submitAnswer({
        questionId,
        receiverId: getAnonymousUserId(),
        answer,
      });
      setQuestion(payload.question);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout
      eyebrow="Answer the question"
      title="One tap, one answer."
      description="This page is anonymous. Your browser keeps its own local identity and the sender is notified instantly once you answer."
    >
      {isLoading && <LoadingState label="Loading question..." />}

      {!isLoading && error && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          {error}
        </div>
      )}

      {!isLoading && !error && question && (
        <div className="space-y-6">
          <QuestionStatusCard question={question} />

          {question.status === "pending" ? (
            <div className="rounded-[1.75rem] bg-white p-6">
              <p className="mb-5 text-lg text-slate-600">
                Choose a side. This answer can only be submitted once.
              </p>
              <AnswerButtons disabled={isSubmitting} onAnswer={handleAnswer} />
            </div>
          ) : (
            <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-6 text-emerald-700">
              This question has already been answered.
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}

export default AnswerPage;
