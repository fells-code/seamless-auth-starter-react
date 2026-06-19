import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { useAuth, usePasskeySupport } from "@seamless-auth/react";
import type { OAuthProvider } from "@seamless-auth/react";

const OAUTH_PROVIDER_KEY = "seamless_oauth_provider";

export default function OAuthLogin({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    handlePasskeyLogin,
    listOAuthProviders,
    refreshSession,
    startOAuthLogin,
  } = useAuth();
  const { passkeySupported, loading: passkeyLoading } = usePasskeySupport();

  const [providers, setProviders] = useState<OAuthProvider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [busyProvider, setBusyProvider] = useState<string | null>(null);
  const [error, setError] = useState("");

  const showProviderPanel = location.pathname === "/login";

  useEffect(() => {
    if (!showProviderPanel) {
      setLoadingProviders(false);
      return;
    }

    let active = true;

    async function loadProviders() {
      setLoadingProviders(true);
      setError("");

      try {
        const result = await listOAuthProviders();
        if (active) setProviders(result.providers);
      } catch {
        if (active) {
          setError("OAuth providers could not be loaded from the auth server.");
        }
      } finally {
        if (active) setLoadingProviders(false);
      }
    }

    void loadProviders();

    return () => {
      active = false;
    };
  }, [listOAuthProviders, showProviderPanel]);

  async function startProviderLogin(provider: OAuthProvider) {
    setBusyProvider(provider.id);
    setError("");

    try {
      sessionStorage.setItem(OAUTH_PROVIDER_KEY, provider.id);

      const result = await startOAuthLogin({
        providerId: provider.id,
        redirectUri: `${window.location.origin}/oauth/callback`,
        returnTo: `${window.location.origin}/`,
      });

      window.location.assign(result.authorizationUrl);
    } catch {
      sessionStorage.removeItem(OAUTH_PROVIDER_KEY);
      setBusyProvider(null);
      setError(`Could not start ${provider.name} sign-in.`);
    }
  }

  async function signInWithPasskey() {
    setError("");

    try {
      const completed = await handlePasskeyLogin();

      if (!completed) {
        setError("Passkey sign-in did not complete.");
        return;
      }

      await refreshSession();
      navigate("/", { replace: true });
    } catch {
      setError("Passkey sign-in failed.");
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto grid min-h-screen max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <section className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase text-[#2169a8]">
              Seamless Auth OAuth
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-950 dark:text-white">
              Passkeys and provider login in one starter
            </h1>
            <p className="mt-4 max-w-xl text-gray-700 dark:text-gray-300">
              This template keeps the normal Seamless Auth session model while
              adding dynamic OAuth provider buttons and a callback route.
            </p>
          </div>

          {showProviderPanel && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
              <div className="grid gap-3">
                {passkeySupported && (
                  <button
                    type="button"
                    onClick={signInWithPasskey}
                    disabled={passkeyLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-950 px-4 py-2 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black"
                  >
                    <KeyRound size={18} />
                    Continue with passkey
                  </button>
                )}

                {loadingProviders && (
                  <p className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 dark:border-gray-800 dark:bg-black dark:text-gray-400">
                    Loading OAuth providers...
                  </p>
                )}

                {!loadingProviders &&
                  providers.map((provider) => (
                    <button
                      key={provider.id}
                      type="button"
                      onClick={() => startProviderLogin(provider)}
                      disabled={busyProvider !== null}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-900 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-800"
                    >
                      {busyProvider === provider.id
                        ? "Redirecting..."
                        : `Continue with ${provider.name}`}
                    </button>
                  ))}

                {!loadingProviders && providers.length === 0 && (
                  <div className="rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-200">
                    No OAuth providers are enabled yet. Add `oauth` to
                    `LOGIN_METHODS` and configure `OAUTH_PROVIDERS` on the auth
                    server to make provider buttons appear here.
                  </div>
                )}
              </div>

              {error && (
                <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </p>
              )}
            </div>
          )}
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {children}
        </section>
      </div>
    </main>
  );
}

export { OAUTH_PROVIDER_KEY };
