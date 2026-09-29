import { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import BoardPage from "./components/BoardPage";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState("login"); // "login" or "signup"

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  if (user) {
    return <BoardPage user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="auth-page">
      {authView === "login" ? (
        <Login onLoginSuccess={setUser} switchToSignup={() => setAuthView("signup")} />
      ) : (
        <Signup onSignupSuccess={setUser} switchToLogin={() => setAuthView("login")} />
      )}
    </div>
  );
}
