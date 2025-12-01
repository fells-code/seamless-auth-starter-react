import { useAuth } from "@seamless-auth/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function BetaAccess() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // You can replace this with a real API call later
  const [inviteStatus, setInviteStatus] = useState("pending");
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    // Mock: if user's email ends with "@allowed.com", auto-approve
    if (user?.email?.endsWith("@allowed.com")) {
      setInviteStatus("approved");
    }
  }, [user]);

  async function handleRequestAccess() {
    setRequesting(true);

    // Simulate API call
    await new Promise((res) => setTimeout(res, 800));

    setRequested(true);
    setRequesting(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white dark:bg-gray-900 p-10 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Beta Access
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome {user?.email || user?.phone}!
          </p>
        </div>

        {/* Approved State */}
        {inviteStatus === "approved" && (
          <div className="text-center">
            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-300 dark:border-green-700">
              <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300">
                You're In! 🎉
              </h2>
              <p className="mt-2 text-gray-700 dark:text-gray-400">
                You’ve been granted full access to the private beta.
              </p>
            </div>

            <button
              onClick={() => navigate("/beta")}
              className="w-full mt-8 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
            >
              Enter the Beta →
            </button>
          </div>
        )}

        {/* Pending State */}
        {inviteStatus === "pending" && !requested && (
          <div className="text-center">
            <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-300 dark:border-purple-700">
              <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-300">
                Your Account Is Awaiting Approval
              </h2>
              <p className="mt-2 text-gray-700 dark:text-gray-400">
                This beta is invite-only. Request access below and we’ll notify
                you soon.
              </p>
            </div>

            <button
              onClick={handleRequestAccess}
              disabled={requesting}
              className="w-full mt-8 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-50"
            >
              {requesting ? "Requesting..." : "Request Beta Access"}
            </button>
          </div>
        )}

        {/* Requested State */}
        {inviteStatus === "pending" && requested && (
          <div className="text-center">
            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-300 dark:border-blue-700">
              <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300">
                Request Sent!
              </h2>
              <p className="mt-2 text-gray-700 dark:text-gray-400">
                You’re on the waitlist. We’ll email you once you’re approved.
              </p>
            </div>

            <button
              disabled
              className="w-full mt-8 py-3 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold cursor-not-allowed"
            >
              Pending Approval
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
