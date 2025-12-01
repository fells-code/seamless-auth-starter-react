import { useState } from "react";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await new Promise((res) => setTimeout(res, 700));

    setSubmitted(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* LEFT SIDE — TITLE & DESCRIPTION */}
        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Join the Waitlist
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-md">
            Be one of the first to experience our private beta. We’re rolling
            out early invites to founders, developers, and early adopters who
            want to shape the future of this product.
          </p>

          <p className="text-gray-500 dark:text-gray-500 text-sm">
            Zero spam. Unsubscribe at any time.
          </p>
        </div>

        {/* RIGHT SIDE — FORM */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-10 w-full">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="rounded-lg px-4 py-3 border border-gray-300 dark:border-gray-700 
                  bg-white dark:bg-black text-gray-900 dark:text-gray-100
                  focus:ring-2 focus:ring-brand focus:outline-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-brand text-white text-lg font-semibold 
                hover:bg-brand-dark transition disabled:opacity-50"
              >
                {loading ? "Joining..." : "Join Waitlist"}
              </button>
            </form>
          ) : (
            <div className="p-6 bg-brand/10 rounded-xl border border-brand/20 text-center">
              <h2 className="text-2xl font-semibold text-brand">
                You're on the list! 🎉
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                We'll reach out soon with your early access invite.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
