import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQBuilderForm() {
  const [faqs, setFaqs] = useState<FAQItem[]>([{ question: "", answer: "" }]);

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
    // TODO: Implement FAQ saving logic
    console.log("FAQs to save:", faqs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          disabled={faqs.some(
            (faq) => !faq.question.trim() || !faq.answer.trim()
          )}
        >
          Save FAQ
        </Button>
      </div>
    </form>
  );
}
