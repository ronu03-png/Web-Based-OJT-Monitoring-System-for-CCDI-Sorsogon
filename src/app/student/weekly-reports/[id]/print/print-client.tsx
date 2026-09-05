"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import PdfDownloadButton from "@/components/shared/pdf-download-button";

export default function PrintActions({ reportId }: { reportId: string }) {
  return (
    <div className="mb-4 flex items-center justify-between print:hidden">
      <h1 className="text-lg font-semibold">Weekly Accomplishment Report</h1>
      <div className="flex gap-2">
        <PdfDownloadButton
          targetId="weekly-report-document"
          filename={`OJT_Weekly_Report_${reportId}.pdf`}
          label="Download PDF"
        />
        <Button size="sm" onClick={() => window.print()}>
          <Printer className="mr-1 h-4 w-4" /> Print
        </Button>
      </div>
    </div>
  );
}
