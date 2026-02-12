import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@seamless-auth/react";

import "./App.css";
import BetaAccess from "./pages/BetaAccess";
import MainLayout from "./layouts/Layout";
import About from "./pages/About";
import Home from "./pages/Home";

const AUTH_SERVER = import.meta.env.VITE_AUTH_SERVER_URL;

function ApplicationRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="beta" element={<BetaAccess />} />
        <Route path="*" element={<Home />} />
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
