import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import LoginPage from "./pages/LoginPage"
import ForgotPassword from "./pages/ForgotPassword"
import SignupPage from "./pages/SignupPage"
import EmailVerification from "./pages/EmailVerification";

function App() {

  return (
    <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<SignupPage />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Routes>
    </Router>
  );
}

export default App;
