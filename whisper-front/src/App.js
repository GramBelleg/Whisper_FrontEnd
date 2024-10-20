import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import SignupPage from "./pages/SignupPage";
import useAuth from "./hooks/useAuth";
import EmailVerification from "./pages/EmailVerification";
import GithubCallback from "./pages/GithubCallback";

function App() {
  const { user,token } = useAuth();
  
  return (
    <Router>
      <Routes>
        {user ? (
          token ? (
            user.role !== "admin" ? (
              <>
                <Route path="/" element={<div>home</div>} /> 
                <Route path="/*" element={<Navigate to="/" />} />
              </>
            ) : (
              <>
                <Route path="/dashboard" element={<div>Dashboard</div>} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/*" element={<Navigate to="/dashboard" />} />
              </>
            )
          ) : (
            <>
              <Route path="/email-verification" element={<EmailVerification />} />
              <Route path="/*" element={<Navigate to="/email-verification" />} />
            </>
          )
        ) : (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/*" element={<Navigate to="/signup" />} />
          </>
        )}
        <Route path="/github-callback" element={<GithubCallback />} />
      </Routes>
    </Router>
  );
}

export default App;
