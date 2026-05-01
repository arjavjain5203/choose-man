import { useEffect, useState } from "react";
import DecisionButtons from "../components/DecisionButtons";
import ModeSelector from "../components/ModeSelector";
import QuestionInput from "../components/QuestionInput";
import ResultPanel from "../components/ResultPanel";
import ShareLink from "../components/ShareLink";
import { answerQuestion, createQuestion, getQuestion } from "../services/api";
import { connect } from "../services/socket";
import { getAnonymousUserId } from "../utils/user";

const ACTIVE_QUESTION_ID_KEY = "activeQuestionId";

function buildShareLink(id) {
  return id ? `${window.location.origin}/answer/${id}` : "";
}

function Home() {
  const [mode, setMode] = useState("fixed");
  const [questionText, setQuestionText] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [question, setQuestion] = useState(null);
  const [result, setResult] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [answering, setAnswering] = useState(false);
  const [error, setError] = useState("");
  const [userId] = useState(() => getAnonymousUserId());

  useEffect(() => {
    const storedQuestionId = window.localStorage.getItem(ACTIVE_QUESTION_ID_KEY);
    if (storedQuestionId) {
      setQuestionId(storedQuestionId);
    }
  }, []);

  useEffect(() => {
    if (questionId) {
      window.localStorage.setItem(ACTIVE_QUESTION_ID_KEY, questionId);
      setShareLink(buildShareLink(questionId));
      return;
    }

    window.localStorage.removeItem(ACTIVE_QUESTION_ID_KEY);
    setShareLink("");
  }, [questionId]);

  useEffect(() => {
    let isMounted = true;

    async function loadActiveQuestion() {
      if (!questionId) {
        setQuestion(null);
        setResult("");
        return;
      }

      setLoading(true);
      setError("");
      setQuestion(null);
      setResult("");

      try {
        const latestQuestion = await getQuestion(questionId);
        if (!isMounted) {
          return;
        }

        setMode(latestQuestion.mode);
        setQuestion(latestQuestion);
        setResult(latestQuestion.answer || "");
        setShareLink(buildShareLink(questionId));
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        if (fetchError.message === "Question not found.") {
          window.localStorage.removeItem(ACTIVE_QUESTION_ID_KEY);
          setQuestionId("");
          setQuestion(null);
          setResult("");
          setError("");
          return;
        }

        setError(fetchError.message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadActiveQuestion();

    return () => {
      isMounted = false;
    };
  }, [questionId]);

  useEffect(() => {
    const socketConnection = connect(userId, async (message) => {
      if (message.type !== "answer" || message.question_id !== questionId) {
        return;
      }

      setResult(message.answer);
      try {
        const latestQuestion = await getQuestion(message.question_id);
        setQuestion(latestQuestion);
      } catch (socketError) {
        setError(socketError.message);
      }
    });

    return () => {
      socketConnection.close();
    };
  }, [questionId, userId]);

  const handleCreate = async () => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await createQuestion(questionText, mode, userId);
      setQuestionId(response.question_id);
    } catch (createError) {
      setError(createError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (selectedValue) => {
    if (!questionId) {
      setError("Create a question before answering.");
      return;
    }

    setAnswering(true);
    setError("");

    try {
      const response = await answerQuestion(questionId, userId, selectedValue);

      setResult(response.answer);
      const latestQuestion = await getQuestion(questionId);
      setQuestion(latestQuestion);
    } catch (answerError) {
      setError(answerError.message);
      if (questionId) {
        try {
          const latestQuestion = await getQuestion(questionId);
          setQuestion(latestQuestion);
        } catch (fetchError) {
          setError(fetchError.message);
        }
      }
    } finally {
      setAnswering(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-grid">
        <section className="content-column">
          <header className="page-header">
            <p className="eyebrow">Anonymous decisions</p>
            <h1>Ask a question, answer it yourself, or share it for someone else.</h1>
          </header>
          <ModeSelector mode={mode} onChange={setMode} />
          <QuestionInput
            value={questionText}
            onChange={setQuestionText}
            onSubmit={handleCreate}
            disabled={loading}
          />
          <ShareLink link={shareLink} />
          <DecisionButtons
            disabled={!questionId || answering}
            mode={question?.mode || mode}
            onSelect={handleAnswer}
          />
        </section>

        <ResultPanel answer={result} error={error} loading={loading} question={question} title="Live result" />
      </div>
    </div>
  );
}

export default Home;
