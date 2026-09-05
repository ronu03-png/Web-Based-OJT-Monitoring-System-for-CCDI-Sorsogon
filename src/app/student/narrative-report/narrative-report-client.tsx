"use client";

import { useState, useTransition } from "react";
import {
  BookOpen,
  CheckCircle2,
  Edit3,
  Eye,
  FileText,
  RefreshCw,
  Save,
  Send,
  Sparkles,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  generateNarrativeReportAction,
  saveNarrativeReportAction,
  submitNarrativeReportAction,
} from "./actions";

export function NarrativeReportClient({
  studentId,
  initialContent,
  initialStatus,
  hasEnoughData,
}: {
  studentId: string;
  initialContent: string;
  initialStatus: string;
  hasEnoughData: boolean;
}) {
  const [content, setContent] = useState(initialContent);
  const [status, setStatus] = useState(initialStatus);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await generateNarrativeReportAction(studentId);
      if (result.success && result.data) {
        setContent(result.data.content);
        setStatus(result.data.status);
        setSuccess("Narrative summary generated successfully!");
      } else {
        setError(result.error ?? "Failed to generate report");
      }
    });
  }

  function handleSave() {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await saveNarrativeReportAction(studentId, content);
      if (result.success) {
        setIsEditing(false);
        setSuccess("Saved successfully!");
      } else {
        setError(result.error ?? "Failed to save");
      }
    });
  }

  function handleSubmit() {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await submitNarrativeReportAction(studentId);
      if (result.success) {
        setStatus("SUBMITTED");
        setSuccess("Narrative report submitted successfully!");
      } else {
        setError(result.error ?? "Failed to submit");
      }
    });
  }

  const isSubmitted = status === "SUBMITTED";

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {!isSubmitted && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerate}
              disabled={isPending || !hasEnoughData}
            >
              <RefreshCw className={`mr-1 h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
              Regenerate
            </Button>
            {isEditing ? (
              <Button size="sm" onClick={handleSave} disabled={isPending}>
                <Save className="mr-1 h-4 w-4" />
                Save
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                disabled={isPending}
              >
                <Edit3 className="mr-1 h-4 w-4" />
                Edit
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isPending || isEditing}
              className="ml-auto"
            >
              <Send className="mr-1 h-4 w-4" />
              Submit
            </Button>
          </>
        )}
        {isSubmitted && (
          <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            This report has been submitted
          </div>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {success}
        </div>
      )}

      {/* Content */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Narrative Summary</span>
        </div>

        {isEditing ? (
          <div className="p-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[500px] font-mono text-sm leading-relaxed"
              placeholder="Your narrative summary will appear here..."
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Edit the content above. You can regenerate anytime to restore the auto-generated version.
            </p>
          </div>
        ) : (
          <div className="p-6">
            <MarkdownPreview content={content} />
          </div>
        )}
      </Card>
    </div>
  );
}

function MarkdownPreview({ content }: { content: string }) {
  // Simple markdown-like rendering
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={key++} className="mb-4 text-2xl font-bold text-primary">
          {line.replace("# ", "")}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="mb-3 mt-6 text-lg font-semibold border-b pb-2">
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="mb-2 mt-4 text-base font-semibold text-muted-foreground">
          {line.replace("### ", "")}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      const text = line.replace("- ", "");
      // Check for bold markers
      const renderedText = renderBold(text);
      elements.push(
        <li key={key++} className="ml-4 mb-1 text-sm leading-relaxed list-disc">
          {renderedText}
        </li>
      );
    } else if (line.startsWith("---")) {
      elements.push(<hr key={key++} className="my-4 border-muted" />);
    } else if (line.startsWith("*") && line.endsWith("*")) {
      elements.push(
        <p key={key++} className="text-xs text-muted-foreground italic">
          {line.replace(/\*/g, "")}
        </p>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={key++} className="h-2" />);
    } else {
      elements.push(
        <p key={key++} className="text-sm leading-relaxed">
          {line}
        </p>
      );
    }
  }

  return <div className="space-y-1">{elements}</div>;
}

function renderBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
