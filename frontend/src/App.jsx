import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Answer from "./pages/Answer";
import Result from "./pages/Result";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/answer/:id" element={<Answer />} />
      <Route path="/result/:id" element={<Result />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
