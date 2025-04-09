import { Button } from "./ui/button";
import { ChatPreview } from "./ChatPreview";
import { Link } from "@tanstack/react-router";

export function Hero() {
  return (
    <div className="relative isolate bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-7xl py-12 sm:py-16 lg:flex lg:items-center lg:gap-x-10 lg:py-20">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
            <div className="flex">
              <div className="relative flex items-center gap-x-4 rounded-full px-4 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                <span className="font-semibold text-indigo-600">New</span>
                <span className="h-4 w-px bg-gray-900/10" aria-hidden="true" />
                <Link to="/changelog" className="flex items-center gap-x-1">
                  See what's new
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <h1 className="mt-10 max-w-lg text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Add AI chat to your website in minutes
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Transform your website into an interactive knowledge base. Our AI
              automatically learns your content and helps users find exactly
              what they're looking for.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button className="bg-indigo-600 hover:bg-indigo-500">
                Get Started Free
              </Button>
              <Button variant="ghost">
                View Demo <span aria-hidden="true">→</span>
              </Button>
            </div>
          </div>
          <div className="mt-16 sm:mt-20 lg:mt-0 lg:flex-shrink-0">
            <ChatPreview />
          </div>
        </div>
      </div>
      <div
        className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
}
