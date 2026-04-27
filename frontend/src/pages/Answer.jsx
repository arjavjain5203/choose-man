import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DecisionButtons from "../components/DecisionButtons";
import ResultPanel from "../components/ResultPanel";
import { answerQuestion, getQuestion } from "../services/api";
import { getAnonymousUserId } from "../utils/user";

function isExpired(question) {
  return new Date(question.expires_at).getTime() < Date.now();
}

function Answer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [userId] = useState(() => getAnonymousUserId());

  useEffect(() => {
    let isMounted = true;

    async function loadQuestion() {
      setLoading(true);
      try {
        const response = await getQuestion(id);
        if (!isMounted) {
          return;
        }

        setQuestion(response);
        if (response.status === "answered") {
          navigate(`/result/${id}`, { replace: true });
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadQuestion();
    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  const handleAnswer = async (selectedValue) => {
    setSubmitting(true);
    setError("");

    try {
      if (question.mode === "fixed") {
        await answerQuestion(id, userId, selectedValue);
      } else {
        await answerQuestion(id, userId);
      }
      navigate(`/result/${id}`);
    } catch (answerError) {
      if (answerError.message === "Question has already been answered.") {
        navigate(`/result/${id}`, { replace: true });
        return;
      }

      setError(
        answerError.message === "Question has expired."
          ? "This question expired."
          : answerError.message,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const expired = question && !question.answer && isExpired(question);

  return (
    <div className="page-shell">
      <div className="single-column">
        <header className="page-header">
          <p className="eyebrow">Answer question</p>
          <h1>Give your response</h1>
        </header>

        <ResultPanel answer={question?.answer} error={error} loading={loading} question={question} title="Question status" />

        {question && !loading && !expired && !question.answer ? (
          <DecisionButtons disabled={submitting} mode={question.mode} onSelect={handleAnswer} />
        ) : null}
      </div>
    </div>
  );
}

export default Answer;
