import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useParams, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Id } from "convex/_generated/dataModel";

export function FileUploadForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const generateUploadUrl = useMutation(api.context.generateUploadUrl);
  const saveFileContext = useMutation(api.context.saveFileContext);
  const { siteId } = useParams({ from: "/dashboard/$siteId/context/add" });
  const navigate = useNavigate();

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
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of files) {
        // Step 1: Get the upload URL
        const postUrl = await generateUploadUrl({
          siteId: siteId as Id<"sites">,
        });

        // Step 2: Upload the file
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await result.json();

        // Step 3: Save the file context
        await saveFileContext({
          siteId: siteId as Id<"sites">,
          title: file.name,
          storageId,
        });
      }

      toast.success("Files uploaded successfully");
      navigate({ to: "/dashboard/$siteId/context", params: { siteId } });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload files");
    } finally {
      setIsUploading(false);
    }
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
          <label htmlFor="file-upload" className="mt-2 cursor-pointer">
            <Input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInput}
              accept=".txt,.pdf,.doc,.docx"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
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

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            navigate({ to: "/dashboard/$siteId/context", params: { siteId } })
          }
        >
          Cancel
        </Button>
        <Button type="submit" disabled={files.length === 0 || isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload Files"
          )}
        </Button>
      </div>
    </form>
  );
}
