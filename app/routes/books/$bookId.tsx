import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../../components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Id } from "../../../convex/_generated/dataModel";
import { createFileRoute } from "@tanstack/react-router";

function BookDetailPage() {
  const { bookId } = Route.useParams();
  const navigate = useNavigate();

  const book = useQuery(api.books.getBook, {
    bookId: bookId as Id<"books">,
  });

  const chapters = useQuery(api.chapters.listChapters, {
    bookId: bookId as Id<"books">,
  });

  if (!book || !chapters) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
          <p className="text-gray-600 text-lg mb-4">{book.description}</p>
          {book.price ? (
            <div className="mb-6">
              <span className="text-2xl font-semibold text-green-600">
                ${book.price.toFixed(2)}
              </span>
              <Button className="ml-4 bg-green-500 hover:bg-green-600 text-white">
                Purchase Book
              </Button>
            </div>
          ) : (
            <div className="mb-6">
              <span className="text-2xl font-semibold text-green-600">
                Free
              </span>
            </div>
          )}
        </div>

        <div className="border-t pt-6">
          <h2 className="text-2xl font-bold mb-4">Chapters</h2>
          <div className="space-y-4">
            {chapters.map((chapter) => (
              <div
                key={chapter._id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{chapter.title}</h3>
                  <Button
                    onClick={() =>
                      navigate({
                        to: "/chapters/$chapterId",
                        params: { chapterId: chapter._id },
                      })
                    }
                    variant="outline"
                  >
                    Read Chapter
                  </Button>
                </div>
                {!chapter.published && (
                  <span className="text-sm text-yellow-600 mt-2 inline-block">
                    Unpublished
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/books/$bookId")({
  component: BookDetailPage,
});
