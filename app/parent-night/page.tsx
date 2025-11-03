import { Metadata } from "next";
import { flags } from "@/lib/flags";
import { redirect } from "next/navigation";
import { PARENT_NIGHT_COPY, BRAND } from "@/content/parent-night-copy";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Parent Night RSVP | Go4it Sports Academy",
  description: PARENT_NIGHT_COPY.page.description,
};

/**
 * Parent Night RSVP page with Cal.com inline embeds
 * Feature-gated via PARENT_NIGHT_PAGE flag
 */
export default function ParentNightPage() {
  // Feature gate - redirect to home if disabled
  if (!flags.PARENT_NIGHT_PAGE) {
    redirect("/");
  }

  const { page, compliance } = PARENT_NIGHT_COPY;

  return (
    <>
      {/* Cal.com embed script */}
      <Script
        src="https://app.cal.com/embed/embed.js"
        strategy="lazyOnload"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
            <p className="text-xl text-blue-100 max-w-3xl">
              {page.description}
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          
          {/* Tuesday: Info & Discovery */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {page.tuesdayInfo.title}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {page.tuesdayInfo.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Europe */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {page.europeLable}
                  </h3>
                  <p className="text-gray-600">{page.europeTime}</p>
                </div>
                <div
                  className="cal-inline"
                  data-cal-namespace="parent-night-info-eu"
                  data-cal-link="PARENT_NIGHT_INFO_EU"
                  data-cal-config='{"theme":"light"}'
                  style={{ minHeight: "500px" }}
                />
              </div>

              {/* United States */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {page.usLabel}
                  </h3>
                  <p className="text-gray-600">{page.usTime}</p>
                </div>
                <div
                  className="cal-inline"
                  data-cal-namespace="parent-night-info-us"
                  data-cal-link="PARENT_NIGHT_INFO_US"
                  data-cal-config='{"theme":"light"}'
                  style={{ minHeight: "500px" }}
                />
              </div>
            </div>
          </section>

          {/* Thursday: Confirmation & Decision */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {page.thursdayDecision.title}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {page.thursdayDecision.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Europe */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {page.europeLable}
                  </h3>
                  <p className="text-gray-600">{page.europeTime}</p>
                </div>
                <div
                  className="cal-inline"
                  data-cal-namespace="parent-night-decision-eu"
                  data-cal-link="PARENT_NIGHT_DECISION_EU"
                  data-cal-config='{"theme":"light"}'
                  style={{ minHeight: "500px" }}
                />
              </div>

              {/* United States */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {page.usLabel}
                  </h3>
                  <p className="text-gray-600">{page.usTime}</p>
                </div>
                <div
                  className="cal-inline"
                  data-cal-namespace="parent-night-decision-us"
                  data-cal-link="PARENT_NIGHT_DECISION_US"
                  data-cal-config='{"theme":"light"}'
                  style={{ minHeight: "500px" }}
                />
              </div>
            </div>
          </section>

          {/* Monday: Onboarding */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {page.mondayOnboarding.title}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {page.mondayOnboarding.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Europe */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {page.europeLable}
                  </h3>
                  <p className="text-gray-600">{page.mondayEuTime}</p>
                </div>
                <div
                  className="cal-inline"
                  data-cal-namespace="onboarding-eu"
                  data-cal-link="ONBOARDING_EU"
                  data-cal-config='{"theme":"light"}'
                  style={{ minHeight: "500px" }}
                />
              </div>

              {/* United States */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {page.usLabel}
                  </h3>
                  <p className="text-gray-600">{page.mondayUsTime}</p>
                </div>
                <div
                  className="cal-inline"
                  data-cal-namespace="onboarding-us"
                  data-cal-link="ONBOARDING_US"
                  data-cal-config='{"theme":"light"}'
                  style={{ minHeight: "500px" }}
                />
              </div>
            </div>
          </section>

          {/* Compliance footer */}
          <section className="border-t pt-8">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <p className="text-sm text-gray-600">
                {compliance.micro}
              </p>
              <details className="text-xs text-gray-500">
                <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                  Important Information
                </summary>
                <p className="mt-4 text-left leading-relaxed">
                  {compliance.full}
                </p>
              </details>
              <p className="text-sm text-gray-600">
                {compliance.footer}
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Initialize Cal.com embeds */}
      <Script id="cal-init" strategy="lazyOnload">
        {`
          (function() {
            if (typeof Cal !== 'undefined') {
              Cal("init", {origin: "https://app.cal.com"});
              Cal.ns["parent-night-info-eu"]("inline", {
                elementOrSelector: "[data-cal-namespace='parent-night-info-eu']",
                calLink: "PARENT_NIGHT_INFO_EU"
              });
              Cal.ns["parent-night-info-us"]("inline", {
                elementOrSelector: "[data-cal-namespace='parent-night-info-us']",
                calLink: "PARENT_NIGHT_INFO_US"
              });
              Cal.ns["parent-night-decision-eu"]("inline", {
                elementOrSelector: "[data-cal-namespace='parent-night-decision-eu']",
                calLink: "PARENT_NIGHT_DECISION_EU"
              });
              Cal.ns["parent-night-decision-us"]("inline", {
                elementOrSelector: "[data-cal-namespace='parent-night-decision-us']",
                calLink: "PARENT_NIGHT_DECISION_US"
              });
              Cal.ns["onboarding-eu"]("inline", {
                elementOrSelector: "[data-cal-namespace='onboarding-eu']",
                calLink: "ONBOARDING_EU"
              });
              Cal.ns["onboarding-us"]("inline", {
                elementOrSelector: "[data-cal-namespace='onboarding-us']",
                calLink: "ONBOARDING_US"
              });
            }
          })();
        `}
      </Script>
    </>
  );
}
