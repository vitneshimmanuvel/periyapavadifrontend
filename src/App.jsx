import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Herosection from "./components/Herosection";
import Admin from "./components/Admin";
import Fileshowup from "./components/Fileshowup";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <Analytics />
      <Routes>
        <Route path="/" element={<Herosection />} />
        <Route path="/documents" element={<Fileshowup />} />
        <Route
          path="/admin/login"
          element={
            isAuthenticated ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <Admin
                setIsAuthenticated={setIsAuthenticated}
                isAuthenticated={isAuthenticated}
              />
            )
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            isAuthenticated ? (
              <Admin
                setIsAuthenticated={setIsAuthenticated}
                isAuthenticated={isAuthenticated}
              />
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
