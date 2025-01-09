import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Navigation from "./components/Navigation";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import ProfilePage from "./pages/Profile.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import EmailVerification from "./pages/EmailVerification.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email/:token" element={<EmailVerification />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute requiredRoles={["user", "admin"]}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
