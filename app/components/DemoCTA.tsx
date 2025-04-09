import { Button } from "./ui/button";

export function DemoCTA() {
  return (
    <div className="overflow-hidden bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:items-center">
          <div className="mx-auto w-full max-w-2xl lg:mx-0">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Get Started in Minutes
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Add AI-powered chat to your website today
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Integrate our intelligent chat widget with just two lines of code.
              Watch as it automatically learns your content and starts helping
              your users instantly.
            </p>
            <div className="mt-8">
              <pre className="rounded-lg bg-gray-900 p-4">
                <code className="text-sm text-gray-300">
                  {`<script src="https://cdn.sitesensei.ai/widget.js"></script>
<div data-sensei-id="YOUR_SITE_ID"></div>`}
                </code>
              </pre>
            </div>
            <div className="mt-10 flex items-center gap-x-6">
              <Button className="bg-indigo-600 hover:bg-indigo-500">
                Start Free Trial
              </Button>
              <Button variant="outline">View Documentation</Button>
            </div>
          </div>
          <div className="mx-auto grid w-full max-w-xl grid-cols-1 items-center gap-y-8 lg:mx-0 lg:max-w-none">
            <div className="relative h-[600px] overflow-hidden rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
              <div className="absolute right-4 bottom-4 w-[300px]">
                <div className="rounded-lg bg-white p-4 shadow-lg ring-1 ring-gray-900/5">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-600"></div>
                    <div className="flex-1">
                      <div className="h-4 w-24 rounded bg-gray-100"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-end gap-4">
                      <div className="flex-1">
                        <div className="rounded-lg bg-gray-100 p-3">
                          <div className="h-4 w-full rounded bg-gray-200"></div>
                        </div>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                    </div>
                    <div className="flex items-end gap-4">
                      <div className="h-8 w-8 rounded-full bg-indigo-600"></div>
                      <div className="flex-1">
                        <div className="rounded-lg bg-indigo-600 p-3 text-sm text-white">
                          How can I help you today?
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full rounded-full border-gray-200 pl-4 pr-10 py-2 text-sm"
                        placeholder="Type your message..."
                        disabled
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-indigo-600 p-1.5 text-white">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
