import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import LoginPage from "./pages/LoginPage"
import ForgotPassword from "./pages/ForgotPassword"

function App() {

  return (
    <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Routes>
    </Router>
  );
}

export default App;
