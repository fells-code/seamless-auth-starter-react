import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAuth,
  useAuthClient,
  usePasskeySupport,
} from "@seamless-auth/react";
import type { LoginMethod, LoginStartResult } from "@seamless-auth/react";

type AuthMode = "login" | "register";
type VerificationStep =
  | "none"
  | "phone_otp"
  | "email_otp"
  | "magic_link"
  | "passkey_registration";

const DEFAULT_LOGIN_METHODS: LoginMethod[] = [
  "passkey",
  "magic_link",
  "phone_otp",
];

async function readLoginStart(response: Response): Promise<LoginStartResult> {
  try {
    return (await response.json()) as LoginStartResult;
  } catch {
    return {};
  }
}

function buildPasskeyMetadata() {
  const browser = navigator.userAgent;
  const platform = navigator.platform || "unknown platform";

  return {
    friendlyName: "Development passkey",
    platform,
    browser,
    deviceInfo: `${platform} browser`,
  };
}

export default function HeadlessAuth() {
  const navigate = useNavigate();
  const authClient = useAuthClient();
  const { markSignedIn, refreshSession } = useAuth();
  const { passkeySupported, loading: passkeyLoading } = usePasskeySupport();

  const [mode, setMode] = useState<AuthMode>("login");
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bootstrapToken, setBootstrapToken] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<VerificationStep>("none");
  const [loginMethods, setLoginMethods] =
    useState<LoginMethod[]>(DEFAULT_LOGIN_METHODS);
  const [fallbackReady, setFallbackReady] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const canSubmit = useMemo(() => {
    if (busy) return false;
    if (mode === "login") return identifier.trim().length > 3;
    return email.trim().length > 3 && phone.trim().length > 5;
  }, [busy, email, identifier, mode, phone]);

  async function completeAuth() {
    markSignedIn();
    await refreshSession();
    navigate("/", { replace: true });
  }

  useEffect(() => {
    if (step !== "magic_link") return;

    let active = true;
    const channel = new BroadcastChannel("seamless-auth");

    async function refreshFromMagicLink() {
      try {
        const response = await authClient.checkMagicLink();

        if (response.status !== 200) return;

        markSignedIn();
        await refreshSession();

        if (active) {
          navigate("/", { replace: true });
        }
      } catch {
        // The polling path is best effort; the visible callback route owns errors.
      }
    }

    channel.onmessage = (event) => {
      if (event.data?.type === "MAGIC_LINK_AUTH_SUCCESS") {
        void refreshFromMagicLink();
      }
    };

    const interval = window.setInterval(() => {
      void refreshFromMagicLink();
    }, 5000);

    return () => {
      active = false;
      channel.close();
      window.clearInterval(interval);
    };
  }, [authClient, markSignedIn, navigate, refreshSession, step]);

  async function startLogin() {
    const response = await authClient.login({
      identifier: identifier.trim(),
      passkeyAvailable: passkeySupported,
    });

    if (!response.ok) {
      throw new Error("Failed to start sign-in.");
    }

    const loginStart = await readLoginStart(response);
    const methods = loginStart.loginMethods?.length
      ? loginStart.loginMethods
      : DEFAULT_LOGIN_METHODS;

    setLoginMethods(methods);
    setFallbackReady(true);

    if (passkeySupported && methods.includes("passkey")) {
      const result = await authClient.loginWithPasskey();

      if (result.success) {
        await completeAuth();
        return;
      }

      setStatus("Passkey sign-in did not complete. Choose another method.");
    }

    if (methods.includes("email_otp")) {
      const otpResponse = await authClient.requestLoginEmailOtp();
      if (!otpResponse.ok) throw new Error("Failed to send email code.");
      setStep("email_otp");
      setStatus("Enter the email code to finish signing in.");
      return;
    }

    if (methods.includes("phone_otp")) {
      const otpResponse = await authClient.requestLoginPhoneOtp();
      if (!otpResponse.ok) throw new Error("Failed to send phone code.");
      setStep("phone_otp");
      setStatus("Enter the SMS code to finish signing in.");
      return;
    }

    if (methods.includes("magic_link")) {
      const linkResponse = await authClient.requestMagicLink();
      if (!linkResponse.ok) throw new Error("Failed to send magic link.");
      setStep("magic_link");
      setStatus("Check your email for a magic link.");
      return;
    }

    setStatus(loginStart.message || "Sign-in started.");
  }

  async function startRegistration() {
    const response = await authClient.register({
      email: email.trim(),
      phone: phone.trim(),
      bootstrapToken: bootstrapToken.trim() || null,
    });

    if (!response.ok) {
      throw new Error("Failed to create the account.");
    }

    setStep("phone_otp");
    setStatus("Enter the SMS code sent to your phone.");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setStatus("");
    setOtp("");
    setStep("none");
    setFallbackReady(false);

    try {
      if (mode === "login") {
        await startLogin();
      } else {
        await startRegistration();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp() {
    setBusy(true);
    setError("");

    try {
      if (otp.trim().length < 4) {
        throw new Error("Enter the verification code first.");
      }

      if (mode === "login" && step === "email_otp") {
        const response = await authClient.verifyLoginEmailOtp(otp.trim());
        if (!response.ok) throw new Error("Email verification failed.");
        await completeAuth();
        return;
      }

      if (mode === "login" && step === "phone_otp") {
        const response = await authClient.verifyLoginPhoneOtp(otp.trim());
        if (!response.ok) throw new Error("Phone verification failed.");
        await completeAuth();
        return;
      }

      if (mode === "register" && step === "phone_otp") {
        const response = await authClient.verifyPhoneOtp(otp.trim());
        if (!response.ok) throw new Error("Phone verification failed.");

        const emailResponse = await authClient.requestEmailOtp();
        if (!emailResponse.ok) throw new Error("Failed to send email code.");

        setOtp("");
        setStep("email_otp");
        setStatus("Phone verified. Enter the email code next.");
        return;
      }

      if (mode === "register" && step === "email_otp") {
        const response = await authClient.verifyEmailOtp(otp.trim());
        if (!response.ok) throw new Error("Email verification failed.");

        if (passkeySupported) {
          setOtp("");
          setStep("passkey_registration");
          setStatus("Email verified. Register a passkey to finish.");
          return;
        }

        await completeAuth();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setBusy(false);
    }
  }

  async function registerPasskey() {
    setBusy(true);
    setError("");

    try {
      const result = await authClient.registerPasskey(buildPasskeyMetadata());

      if (!result.success) {
        throw new Error(result.message || "Passkey registration failed.");
      }

      await completeAuth();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Passkey registration failed.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function retryPasskeyLogin() {
    setBusy(true);
    setError("");

    try {
      const result = await authClient.loginWithPasskey();

      if (!result.success) {
        throw new Error(result.message || "Passkey sign-in failed.");
      }

      await completeAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Passkey sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  async function chooseFallback(method: LoginMethod) {
    setBusy(true);
    setError("");
    setStatus("");

    try {
      if (method === "email_otp") {
        const response = await authClient.requestLoginEmailOtp();
        if (!response.ok) throw new Error("Failed to send email code.");
        setStep("email_otp");
        setStatus("Enter the email code to finish signing in.");
      }

      if (method === "phone_otp") {
        const response = await authClient.requestLoginPhoneOtp();
        if (!response.ok) throw new Error("Failed to send phone code.");
        setStep("phone_otp");
        setStatus("Enter the SMS code to finish signing in.");
      }

      if (method === "magic_link") {
        const response = await authClient.requestMagicLink();
        if (!response.ok) throw new Error("Failed to send magic link.");
        setStep("magic_link");
        setStatus("Check your email for a magic link.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not continue.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex gap-2 rounded-md bg-gray-100 p-1 dark:bg-gray-800">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setStep("none");
                setFallbackReady(false);
                setError("");
                setStatus("");
              }}
              className={`flex-1 rounded px-3 py-2 text-sm font-semibold ${
                mode === "login"
                  ? "bg-white text-gray-950 shadow-sm dark:bg-black dark:text-white"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setStep("none");
                setFallbackReady(false);
                setError("");
                setStatus("");
              }}
              className={`flex-1 rounded px-3 py-2 text-sm font-semibold ${
                mode === "register"
                  ? "bg-white text-gray-950 shadow-sm dark:bg-black dark:text-white"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {mode === "login" ? (
              <label className="block">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Email or phone
                </span>
                <input
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder="you@example.com or +15555550123"
                  className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 outline-none focus:border-[#2169a8] dark:border-gray-700 dark:bg-black dark:text-white"
                  autoComplete="username"
                />
              </label>
            ) : (
              <>
                <label className="block">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Email
                  </span>
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 outline-none focus:border-[#2169a8] dark:border-gray-700 dark:bg-black dark:text-white"
                    autoComplete="email"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Phone
                  </span>
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+15555550123"
                    className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 outline-none focus:border-[#2169a8] dark:border-gray-700 dark:bg-black dark:text-white"
                    autoComplete="tel"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Bootstrap token
                  </span>
                  <input
                    value={bootstrapToken}
                    onChange={(event) => setBootstrapToken(event.target.value)}
                    placeholder="Optional local bootstrap invite token"
                    className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 outline-none focus:border-[#2169a8] dark:border-gray-700 dark:bg-black dark:text-white"
                    autoComplete="off"
                  />
                </label>
              </>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-md bg-[#2169a8] px-4 py-2 font-semibold text-white transition hover:bg-[#1a568a] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {busy ? "Working..." : mode === "login" ? "Continue" : "Create account"}
            </button>
          </form>

          {mode === "login" && passkeySupported && (
            <button
              type="button"
              onClick={retryPasskeyLogin}
              disabled={busy || passkeyLoading}
              className="mt-3 w-full rounded-md border border-gray-300 px-4 py-2 font-semibold text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
            >
              Sign in with passkey
            </button>
          )}

          {mode === "login" &&
            fallbackReady &&
            step === "none" &&
            loginMethods.length > 0 && (
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {loginMethods
                .filter((method) => method !== "passkey" && method !== "oauth")
                .map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => chooseFallback(method)}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
                  >
                    {method === "magic_link"
                      ? "Magic link"
                      : method === "email_otp"
                        ? "Email code"
                        : "SMS code"}
                  </button>
                ))}
            </div>
          )}

          {(step === "email_otp" || step === "phone_otp") && (
            <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-black">
              <label className="block">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Verification code
                </span>
                <input
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  placeholder="123456"
                  className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 outline-none focus:border-[#2169a8] dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  autoComplete="one-time-code"
                />
              </label>
              <button
                type="button"
                onClick={verifyOtp}
                disabled={busy}
                className="mt-3 rounded-md bg-gray-950 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-500 dark:bg-white dark:text-black"
              >
                Verify code
              </button>
            </div>
          )}

          {step === "passkey_registration" && (
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/30">
              <p className="text-sm text-green-900 dark:text-green-200">
                This browser supports passkeys. Register one now or skip and
                refresh the session.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={registerPasskey}
                  disabled={busy}
                  className="rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-500"
                >
                  Register passkey
                </button>
                <button
                  type="button"
                  onClick={completeAuth}
                  disabled={busy}
                  className="rounded-md border border-green-700 px-4 py-2 text-sm font-semibold text-green-800 hover:bg-green-100 disabled:cursor-not-allowed dark:text-green-200 dark:hover:bg-green-950"
                >
                  Skip for now
                </button>
              </div>
            </div>
          )}

          {step === "magic_link" && (
            <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200">
              Open the magic link in this browser. This page will poll for the
              completed session and also listens for the callback tab.
            </div>
          )}

          {status && (
            <p className="mt-4 rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
              {status}
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </p>
          )}
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h1 className="text-2xl font-bold text-gray-950 dark:text-white">
            Headless Seamless Auth
          </h1>
          <p className="mt-3 text-gray-700 dark:text-gray-300">
            This template builds every visible auth control in the application
            using the React SDK hooks instead of mounting the SDK auth routes.
          </p>

          <div className="mt-6 grid gap-4">
            {[
              "Start login with an identifier and the headless client.",
              "Choose passkey, magic link, email OTP, or phone OTP from the server policy.",
              "Verify registration in the same phone-to-email order as the built-in routes.",
              "Refresh provider state after the custom flow completes.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-md border border-gray-200 p-4 text-sm text-gray-700 dark:border-gray-800 dark:text-gray-300"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
