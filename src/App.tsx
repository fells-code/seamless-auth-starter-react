import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@seamless-auth/react";

import "./App.css";
import BetaAccess from "./pages/BetaAccess";
import MainLayout from "./layouts/Layout";
import About from "./pages/About";
import Home from "./pages/Home";
import { API_URL } from "./lib/api";

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
      <AuthProvider apiHost={API_URL} mode="server">
        <ApplicationRoutes />
      </AuthProvider>
    </Router>
  );
};
export default App;
