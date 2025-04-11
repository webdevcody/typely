import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { Id } from "../../../convex/_generated/dataModel";

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
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for your FAQ collection"
          required
        />
      </div>

      {faqs.map((faq, index) => (
        <div
          key={index}
          className="relative rounded-lg border bg-card p-4 space-y-4"
        >
          <div className="absolute right-4 top-4">
            {faqs.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFAQ(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Input
              value={faq.question}
              onChange={(e) => updateFAQ(index, "question", e.target.value)}
              placeholder="Enter your question"
              required
            />
          </div>

          <div className="space-y-2">
            <Textarea
              value={faq.answer}
              onChange={(e) => updateFAQ(index, "answer", e.target.value)}
              placeholder="Enter the answer"
              className="min-h-[100px]"
              required
            />
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4">
        <Button type="button" variant="outline" onClick={addFAQ}>
          <Plus className="h-4 w-4 mr-2" />
          Add Question
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
    </form>
  );
}
