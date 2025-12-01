export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* HEADER SECTION */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            About Our Private Beta
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A transparent look at what we’re building, why we’re doing a
            waitlist, and how early founders can shape the future of our
            product.
          </p>
        </header>

        {/* SECTION 1: WHAT WE’RE BUILDING */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            What We’re Building
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            This product is built for early-stage founders, indie developers,
            and fast-moving teams who want powerful tools without the
            complexity. Our mission is to remove friction, automate the painful
            parts, and give founders the freedom to launch faster and iterate
            with confidence.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            The private beta includes a focused set of features designed to
            validate our core ideas, gather real-world feedback, and ensure that
            we’re solving the right problems before scaling.
          </p>
        </section>

        {/* SECTION 2: WHY A WAITLIST */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Why a Waitlist?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We want to work closely with our earliest users — founders who care
            deeply about product quality and developer experience. A waitlist
            helps us onboard teams in manageable waves, ensuring that everyone
            receives attention, support, and a feedback loop that actually makes
            an impact.
          </p>

          <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>We onboard in small cohorts</li>
            <li>We prioritize founders building in our problem space</li>
            <li>We tailor onboarding sessions based on early feedback</li>
            <li>
              We ensure infrastructure and support are rock-solid before scaling
            </li>
          </ul>
        </section>

        {/* SECTION 3: WHO IT’S FOR */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Who This Beta Is For
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            This early access phase is built for creators who want to move fast
            and help shape the direction of the product. If you fall into one of
            these groups, you’ll be right at home:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                🚀 Startup Founders
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                Launching quickly and validating ideas without overhead.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                👩‍💻 Indie Hackers
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                Building polished apps with limited time and resources.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                🧠 Technical Teams
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                Integrating quickly without reinventing infrastructure.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                ❤️ Early Adopters
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                Passionate about giving feedback and shaping product direction.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: OUR PROMISE */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Our Promise to Early Users
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We’re committed to building with clarity, speed, and transparency.
            As an early participant, you’ll get a direct line to the team,
            faster turnaround on feedback, and long-term benefits as the product
            grows.
          </p>

          <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>You will influence core product decisions</li>
            <li>Your feedback will shape features before launch</li>
            <li>You’ll experience the product before anyone else</li>
            <li>You’ll help us build something truly meaningful</li>
          </ul>
        </section>

        {/* SECTION 5: CTA */}
        <section className="text-center pt-6">
          <a
            href="/waitlist"
            className="inline-block px-8 py-3 text-lg font-semibold rounded-lg 
            bg-brand text-white hover:bg-brand-dark transition shadow-md"
          >
            Join the Waitlist →
          </a>

          <p className="mt-4 text-gray-600 dark:text-gray-500 text-sm">
            Help shape the future — start by joining our early adopter
            community.
          </p>
        </section>
      </div>
    </div>
  );
}
