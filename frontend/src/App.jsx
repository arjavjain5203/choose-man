import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Answer from "./pages/Answer";
import Result from "./pages/Result";

function App() {
  return (
    <div className="app-container">
      <div className="magic-particles">
        <div className="magic-particle particle-1"></div>
        <div className="magic-particle particle-2"></div>
        <div className="magic-particle particle-snitch"></div>
        <div className="magic-particle particle-3"></div>
        <div className="magic-particle particle-4"></div>
        <div className="magic-particle particle-5"></div>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/answer/:id" element={<Answer />} />
        <Route path="/result/:id" element={<Result />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
