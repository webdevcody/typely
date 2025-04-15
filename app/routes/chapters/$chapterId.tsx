import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../../components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { Textarea } from "../../components/ui/textarea";

function ChapterDetailPage() {
  const { chapterId } = Route.useParams();
  const [newComment, setNewComment] = useState("");

  const chapter = useQuery(api.chapters.getChapter, {
    chapterId: chapterId as Id<"chapters">,
  });

  const comments = useQuery(api.comments.listComments, {
    chapterId: chapterId as Id<"chapters">,
  });

  const createComment = useMutation(api.comments.create);

  if (!chapter || !comments) {
    return <div>Loading...</div>;
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    await createComment({
      chapterId: chapterId as Id<"chapters">,
      content: newComment.trim(),
    });

    setNewComment("");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <article className="prose lg:prose-xl max-w-none mb-12">
          <h1 className="text-4xl font-bold mb-6">{chapter.title}</h1>
          <div className="whitespace-pre-wrap">{chapter.content}</div>
        </article>

        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Comments</h2>

          <div className="mb-8">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="mb-4"
              rows={4}
            />
            <Button
              onClick={handleSubmitComment}
              className="bg-blue-500 hover:bg-blue-600 text-white"
              disabled={!newComment.trim()}
            >
              Post Comment
            </Button>
          </div>

          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment._id} className="border-b pb-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-2">
                      {new Date(comment._creationTime).toLocaleDateString()}
                    </div>
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/chapters/$chapterId")({
  component: ChapterDetailPage,
});
