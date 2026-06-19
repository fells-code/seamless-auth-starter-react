import type { ReactNode } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider, useAuth } from "@seamless-auth/react";

import "./App.css";
import BetaAccess from "./pages/BetaAccess";
import MainLayout from "./layouts/Layout";
import About from "./pages/About";
import HeadlessAuth from "./pages/HeadlessAuth";
import Home from "./pages/Home";
import MagicLinkCallback from "./pages/MagicLinkCallback";
import { API_URL } from "./lib/api";

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-6">
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
        Checking session...
      </div>
    </div>
  );
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function GuestOnly({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function ApplicationRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route
          path="beta"
          element={
            <RequireAuth>
              <BetaAccess />
            </RequireAuth>
          }
        />
      </Route>

      <Route
        path="/auth"
        element={
          <GuestOnly>
            <HeadlessAuth />
          </GuestOnly>
        }
      />

      <Route path="/verify-magiclink" element={<MagicLinkCallback />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}

const App = () => {
  return (
    <Router>
      <AuthProvider apiHost={API_URL}>
        <ApplicationRoutes />
      </AuthProvider>
    </Router>
  );
};
export default App;
