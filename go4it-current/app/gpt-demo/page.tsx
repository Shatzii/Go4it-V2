import GPTEmbed from '@/components/gpt/GPTEmbed';

export default function GPTDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Go4it Sports GPT
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Your AI Command Center for Sports Excellence
          </p>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              What Can I Help You With?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Event Planning</h3>
                <p className="text-sm text-blue-600">
                  Create FNL events, soccer camps, and combines
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Lead Generation</h3>
                <p className="text-sm text-green-600">
                  Find and qualify potential student-athletes
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Sales Automation</h3>
                <p className="text-sm text-purple-600">
                  Build offers, process payments, nurture leads
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">Compliance</h3>
                <p className="text-sm text-orange-600">
                  NCAA/FIFA eligibility and compliance checks
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">Analytics</h3>
                <p className="text-sm text-red-600">
                  KPI dashboards and growth projections
                </p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-800 mb-2">Content Creation</h3>
                <p className="text-sm text-indigo-600">
                  AI-generated lessons, assignments, and marketing
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Try Go4it Sports GPT
            </h2>
            <p className="text-sm text-gray-600">
              Ask me anything about our programs, events, or how to get started!
            </p>
          </div>
          <div className="p-6">
            <GPTEmbed
              height="700px"
              className="rounded-lg border"
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Quick Commands to Try
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Event Planning:</h4>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  /eventpack soccer city=Vienna date=2026-04-01
                </code>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Sales:</h4>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  /offer builder bundle_name="Spring Pathway"
                </code>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Compliance:</h4>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  /audit eligibility country=AT sport=soccer age=16
                </code>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Analytics:</h4>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  /kpi pulse month=2026-05
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}