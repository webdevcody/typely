import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../../components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

function BooksListPage() {
  const navigate = useNavigate();
  const [showOnlyPublished, setShowOnlyPublished] = useState(true);
  const books = useQuery(api.books.listBooks, {
    publishedOnly: showOnlyPublished,
  });

  if (!books) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Books</h1>
        <Button
          onClick={() => navigate({ to: "/books/new" })}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Write a Book
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book._id}
            className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            {book.coverImage && (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {book.description}
              </p>
              <div className="flex justify-between items-center">
                <Button
                  onClick={() =>
                    navigate({
                      to: "/books/$bookId",
                      params: { bookId: book._id },
                    })
                  }
                  variant="outline"
                >
                  Read Now
                </Button>
                {book.price ? (
                  <span className="text-lg font-semibold text-green-600">
                    ${book.price.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-lg font-semibold text-green-600">
                    Free
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/books/")({
  component: BooksListPage,
});
