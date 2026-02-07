import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider, AuthRoutes, useAuth } from "@seamless-auth/react";

import "./App.css";
import Login from "./pages/Login";
import BetaAccess from "./pages/BetaAccess";
import MainLayout from "./layouts/Layout";
import About from "./pages/About";

const AUTH_SERVER = "http://localhost:3000/";

function ApplicationRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/*" element={<MainLayout />}>
        <Route path="about" element={<About />} />
        {isAuthenticated ? (
          <>
            <Route path="beta" element={<BetaAccess />} />
            <Route path="*" element={<BetaAccess />} />
          </>
        ) : (
          <>
            <Route path="/*" element={<Login />}>
              <Route index element={<AuthRoutes />} />
              <Route path="*" element={<AuthRoutes />} />
            </Route>
          </>
        )}
      </Route>
    </Routes>
  );
}

const App = () => {
  return (
    <Router>
      <AuthProvider apiHost={AUTH_SERVER} mode="server">
        <ApplicationRoutes />
      </AuthProvider>
    </Router>
  );
};
export default App;
