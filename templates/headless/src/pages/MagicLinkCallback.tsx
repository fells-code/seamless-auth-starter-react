import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useAuthClient } from "@seamless-auth/react";

export default function MagicLinkCallback() {
  const navigate = useNavigate();
  const authClient = useAuthClient();
  const { markSignedIn, refreshSession } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function verify() {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setError("Magic-link token is missing.");
        return;
      }

      try {
        const response = await authClient.verifyMagicLink(token);

        if (!response.ok) {
          throw new Error("Magic-link verification failed.");
        }

        const channel = new BroadcastChannel("seamless-auth");
        channel.postMessage({ type: "MAGIC_LINK_AUTH_SUCCESS" });
        channel.close();

        markSignedIn();
        await refreshSession();

        if (active) {
          navigate("/", { replace: true });
        }
      } catch {
        if (active) {
          setError("Magic-link verification failed.");
        }
      }
    }

    void verify();

    return () => {
      active = false;
    };
  }, [authClient, markSignedIn, navigate, refreshSession]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-black">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-xl font-bold text-gray-950 dark:text-white">
          Verifying magic link
        </h1>
        <p className="mt-3 text-gray-700 dark:text-gray-300">
          Seamless Auth is validating the link and refreshing your session.
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
