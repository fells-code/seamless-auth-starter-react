import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@seamless-auth/react";
import { OAUTH_PROVIDER_KEY } from "./OAuthLogin";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { finishOAuthLogin, markSignedIn, refreshSession } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function finish() {
      const params = new URLSearchParams(window.location.search);
      const providerId =
        params.get("provider") || sessionStorage.getItem(OAUTH_PROVIDER_KEY);
      const code = params.get("code");
      const state = params.get("state");

      if (!providerId || !code || !state) {
        setError("OAuth callback is missing provider, code, or state.");
        return;
      }

      try {
        await finishOAuthLogin({ providerId, code, state });
        sessionStorage.removeItem(OAUTH_PROVIDER_KEY);
        markSignedIn();
        await refreshSession();

        if (active) {
          navigate("/", { replace: true });
        }
      } catch {
        if (active) {
          setError("OAuth sign-in could not be completed.");
        }
      }
    }

    void finish();

    return () => {
      active = false;
    };
  }, [finishOAuthLogin, markSignedIn, navigate, refreshSession]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-black">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-xl font-bold text-gray-950 dark:text-white">
          Finishing sign-in
        </h1>
        <p className="mt-3 text-gray-700 dark:text-gray-300">
          Seamless Auth is completing the OAuth callback and refreshing your
          application session.
        </p>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
