import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/changelog")({
  component: ChangelogComponent,
});

function ChangelogComponent() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-8">
        What's New
      </h1>
      <div className="prose prose-lg">
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            Latest Updates
          </h2>
          <div className="mt-6 space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Initial Release
              </h3>
              <p className="mt-2 text-gray-600">
                Welcome to our first release! We're excited to help you
                transform your website into an interactive knowledge base.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
