import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import LoginPage from "./pages/LoginPage"
import ForgotPassword from "./pages/ForgotPassword"
import SignupPage from "./pages/SignupPage"

function App() {

  return (
    <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Routes>
    </Router>
  );
}

export default App;
