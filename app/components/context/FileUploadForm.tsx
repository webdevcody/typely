import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";

export function FileUploadForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement file upload logic
    console.log("Files to upload:", files);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
        <div className="mt-4">
          <p className="text-sm font-medium">Drag and drop your files here</p>
          <p className="text-sm text-muted-foreground">or</p>
          <label className="mt-2 cursor-pointer">
            <Input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInput}
              accept=".txt,.pdf,.doc,.docx"
            />
            <Button type="button" variant="outline">
              Browse Files
            </Button>
          </label>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected Files:</p>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border bg-card p-3"
            >
              <span className="text-sm truncate">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={files.length === 0}>
          Upload Files
        </Button>
      </div>
    </form>
  );
}
