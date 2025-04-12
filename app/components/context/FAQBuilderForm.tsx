import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash, X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { Id } from "../../../convex/_generated/dataModel";
import { InnerCard } from "../InnerCard";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQBuilderFormProps {
  initialTitle?: string;
  initialContent?: string;
  contextId?: Id<"contexts">;
  onSubmit?: (data: { title: string; content: string }) => Promise<void>;
  siteId: Id<"sites">;
}

// Utility function to parse FAQ content back into structured format
const parseFAQContent = (content: string): FAQItem[] => {
  const faqs: FAQItem[] = [];
  const faqPairs = content.split("\n\n");

  for (const pair of faqPairs) {
    const questionMatch = pair.match(/Q\d+: (.*)/);
    const answerMatch = pair.match(/A\d+: (.*)/);

    if (questionMatch && answerMatch) {
      faqs.push({
        question: questionMatch[1],
        answer: answerMatch[1],
      });
    }
  }

  return faqs.length > 0 ? faqs : [{ question: "", answer: "" }];
};

export function FAQBuilderForm({
  initialTitle = "",
  initialContent = "",
  contextId,
  onSubmit,
  siteId,
}: FAQBuilderFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [faqs, setFaqs] = useState<FAQItem[]>([{ question: "", answer: "" }]);
  const createContext = useMutation(api.context.createTextContext);
  const updateContext = useMutation(api.context.updateTextContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialContent) {
      setFaqs(parseFAQContent(initialContent));
    }
  }, [initialContent]);

  useEffect(() => {
    if (initialTitle) {
      setTitle(initialTitle);
    }
  }, [initialTitle]);

  const addFAQ = () => {
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
  };

  const removeFAQ = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFAQ = (index: number, field: keyof FAQItem, value: string) => {
    setFaqs((prev) =>
      prev.map((faq, i) => (i === index ? { ...faq, [field]: value } : faq))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a title for your FAQ collection");
      return;
    }

    try {
      // Format FAQs into a structured content string
      const formattedContent = faqs
        .map(
          (faq, index) =>
            `Q${index + 1}: ${faq.question}\nA${index + 1}: ${faq.answer}`
        )
        .join("\n\n");

      if (onSubmit) {
        await onSubmit({ title: title.trim(), content: formattedContent });
      } else if (contextId) {
        await updateContext({
          contextId,
          title: title.trim(),
          content: formattedContent,
        });
        toast.success("FAQs updated successfully");
      } else {
        await createContext({
          siteId,
          title: title.trim(),
          content: formattedContent,
          type: "faq",
        });
        toast.success("FAQs saved successfully");
      }

      navigate({ to: "/dashboard/$siteId/context", params: { siteId } });
    } catch (error) {
      toast.error(
        `Failed to ${contextId ? "update" : "save"} FAQs: ` +
          (error as Error).message
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="faq-title" className="text-sm font-medium">
          FAQ Collection Title
        </label>
        <Input
          id="faq-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for your FAQ collection"
          required
        />
        <p className="text-sm text-muted-foreground">
          Give your FAQ collection a descriptive title to help identify it later
        </p>
      </div>

      {faqs.map((faq, index) => (
        <InnerCard
          key={index}
          className="border p-8 rounded-xl last:border-b-0 space-y-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <label
                htmlFor={`question-${index}`}
                className="text-sm font-medium"
              >
                Question {index + 1}
              </label>
              <Input
                id={`question-${index}`}
                value={faq.question}
                onChange={(e) => updateFAQ(index, "question", e.target.value)}
                placeholder="Enter your question"
                required
              />
            </div>
            {faqs.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeFAQ(index)}
                className="mt-6"
              >
                <Trash className="size-4" />
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor={`answer-${index}`} className="text-sm font-medium">
              Answer {index + 1}
            </label>
            <Textarea
              id={`answer-${index}`}
              value={faq.answer}
              onChange={(e) => updateFAQ(index, "answer", e.target.value)}
              placeholder="Enter the answer"
              className="min-h-[100px]"
              required
            />
          </div>
        </InnerCard>
      ))}

      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" onClick={addFAQ}>
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              navigate({ to: "/dashboard/$siteId/context", params: { siteId } })
            }
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              !title.trim() ||
              faqs.some((faq) => !faq.question.trim() || !faq.answer.trim())
            }
          >
            {contextId ? "Update FAQ" : "Save FAQ"}
          </Button>
        </div>
      </div>
    </form>
  );
}
