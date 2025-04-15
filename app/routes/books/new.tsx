import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../../components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import { useForm } from "react-hook-form";

interface CreateBookForm {
  title: string;
  description: string;
  price?: number;
  coverImage?: string;
}

function CreateBookPage() {
  const navigate = useNavigate();
  const createBook = useMutation(api.books.create);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBookForm>({
    defaultValues: {
      title: "",
      description: "",
      price: undefined,
      coverImage: "",
    },
  });

  const onSubmit = async (data: CreateBookForm) => {
    try {
      setIsSubmitting(true);
      const bookId = await createBook({
        ...data,
        price: data.price ? Number(data.price) : undefined,
      });
      navigate({ to: "/books/$bookId", params: { bookId } });
    } catch (error) {
      console.error("Failed to create book:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Create a New Book
          </h1>
          <p className="text-muted-foreground mt-2">
            Share your story with the world. Fill out the details below to
            create your book.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-card p-6 rounded-lg shadow-sm border"
          aria-label="Create book form"
        >
          <fieldset disabled={isSubmitting} className="space-y-6">
            <legend className="sr-only">Book Information</legend>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium mb-2 text-foreground"
              >
                Book Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="title"
                {...register("title", { required: "Title is required" })}
                className="w-full bg-background text-foreground border-input"
                placeholder="Enter your book title"
                aria-required="true"
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "title-error" : undefined}
              />
              {errors.title && (
                <p
                  id="title-error"
                  className="text-destructive text-sm mt-1"
                  role="alert"
                >
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2 text-foreground"
              >
                Description <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="description"
                {...register("description", {
                  required: "Description is required",
                })}
                className="w-full bg-background text-foreground border-input min-h-[100px]"
                placeholder="Write a compelling description for your book"
                aria-required="true"
                aria-invalid={!!errors.description}
                aria-describedby={
                  errors.description ? "description-error" : undefined
                }
              />
              {errors.description && (
                <p
                  id="description-error"
                  className="text-destructive text-sm mt-1"
                  role="alert"
                >
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium mb-2 text-foreground"
              >
                Price <span className="text-muted-foreground">(optional)</span>
              </label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...register("price", {
                  min: { value: 0, message: "Price cannot be negative" },
                  validate: (value) =>
                    !value || value >= 0 || "Price must be a positive number",
                })}
                className="w-full bg-background text-foreground border-input"
                placeholder="Enter price (leave empty for free)"
                aria-invalid={!!errors.price}
                aria-describedby={errors.price ? "price-error" : "price-hint"}
              />
              <p id="price-hint" className="text-muted-foreground text-sm mt-1">
                Leave empty to make your book free
              </p>
              {errors.price && (
                <p
                  id="price-error"
                  className="text-destructive text-sm mt-1"
                  role="alert"
                >
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="coverImage"
                className="block text-sm font-medium mb-2 text-foreground"
              >
                Cover Image URL{" "}
                <span className="text-muted-foreground">(optional)</span>
              </label>
              <Input
                id="coverImage"
                type="url"
                {...register("coverImage")}
                className="w-full bg-background text-foreground border-input"
                placeholder="Enter a URL for your book's cover image"
                aria-invalid={!!errors.coverImage}
                aria-describedby={
                  errors.coverImage ? "coverImage-error" : "coverImage-hint"
                }
              />
              <p
                id="coverImage-hint"
                className="text-muted-foreground text-sm mt-1"
              >
                Provide a URL to an image that represents your book
              </p>
              {errors.coverImage && (
                <p
                  id="coverImage-error"
                  className="text-destructive text-sm mt-1"
                  role="alert"
                >
                  {errors.coverImage.message}
                </p>
              )}
            </div>
          </fieldset>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/books" })}
              className="text-foreground hover:bg-muted focus:ring-2 focus:ring-ring"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground focus:ring-2 focus:ring-ring"
            >
              {isSubmitting ? "Creating..." : "Create Book"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

export const Route = createFileRoute("/books/new")({
  component: CreateBookPage,
});
