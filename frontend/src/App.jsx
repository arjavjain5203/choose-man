import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AnswerPage from "./pages/AnswerPage";
import ResultPage from "./pages/ResultPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/answer/:questionId" element={<AnswerPage />} />
      <Route path="/result/:questionId" element={<ResultPage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
