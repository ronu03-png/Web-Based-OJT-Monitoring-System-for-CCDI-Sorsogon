"use client";

import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PdfDownloadButton from "@/components/shared/pdf-download-button";

export default function PrintActions({ studentId, evalId }: { studentId: string; evalId: string }) {
  return (
    <div className="mb-4 flex items-center justify-between print:hidden">
      <h1 className="text-lg font-semibold">OJT Evaluation Form</h1>
      <div className="flex gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/students/${studentId}`}><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link>
        </Button>
        <PdfDownloadButton
          targetId="evaluation-document"
          filename={`OJT_Evaluation_${evalId}.pdf`}
          label="Download PDF"
        />
        <Button size="sm" onClick={() => window.print()}>
          <Printer className="mr-1 h-4 w-4" /> Print
        </Button>
      </div>
    </div>
  );
}
