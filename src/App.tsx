import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider, AuthRoutes, useAuth } from "@seamless-auth/react";

import reactLogo from "./assets/react.svg";
import seamlessAuthLogo from "./assets/seamlessAuth.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function MainView() {
  const { user, logout } = useAuth();
  const [count, setCount] = useState(0);

  return (
    <>
      <div id="app">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://docs.seamlessauth.com" target="_blank">
          <img
            src={seamlessAuthLogo}
            className="logo react"
            alt="Seamless Auth logo"
          />
        </a>
      </div>
      <h1>Vite + React + Seamless Auth</h1>
      <h2>Welcome, {user?.email}</h2>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite, React, or Seamless Auth logos to learn more
      </p>
      <button onClick={logout}> Logout </button>
    </>
  );
}

const AUTH_SERVER = "https://demo.seamlessauth.com/demo/";

function ApplicationRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {isAuthenticated ? (
        <>
          <Route path="/" element={<MainView />} />
          <Route path="*" element={<MainView />} />
        </>
      ) : (
        <>
          <Route index element={<AuthRoutes />} />
          <Route path="*" element={<AuthRoutes />} />
        </>
      )}
    </Routes>
  );
}

const App = () => {
  return (
    <Router>
      <AuthProvider apiHost={AUTH_SERVER} mode="web">
        <ApplicationRoutes />
      </AuthProvider>
    </Router>
  );
};
export default App;
