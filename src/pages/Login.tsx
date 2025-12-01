import { Outlet } from "react-router";

export default function Login() {
  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      {/* LEFT SIDE */}
      <div
        className="hidden lg:flex flex-col justify-center px-20 w-1/2 
  bg-gradient-to-b from-[#2169a8] to-black text-white"
      >
        <div className="max-w-xl space-y-6">
          {/* BRAND / PRODUCT NAME */}
          <h1 className="text-6xl font-extrabold tracking-tight leading-[1.1]">
            Seamless Auth Template
          </h1>

          {/* TAGLINE */}
          <p className="text-2xl font-light leading-relaxed opacity-90">
            An award-winning tagline for your money-making startup — simple,
            elegant, and unforgettable.
          </p>

          {/* CALL TO ACTION */}
          <p className="pt-8 text-lg font-medium opacity-90 flex items-center gap-2">
            Join our exclusive private beta
            <span className="text-2xl">→</span>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-6 sm:px-10">
        <div className="max-w-md w-full">
          <Outlet />

          {/* Footer */}
          <p className="mt-10 text-sm text-center text-gray-600 dark:text-gray-400">
            Protected by Seamless Auth — Secure, passwordless by design.
          </p>
        </div>
      </div>
    </div>
  );
}
