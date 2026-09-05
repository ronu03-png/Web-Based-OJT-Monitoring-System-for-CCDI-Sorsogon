"use client";

import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import PdfDownloadButton from "@/components/shared/pdf-download-button";

const DEMO_ACTIVITIES = [
  { date: "Aug 3, 2026", hoursSpent: 8, activity: "Assisted in network troubleshooting and maintenance", remarks: "Resolved 3 connectivity issues" },
  { date: "Aug 4, 2026", hoursSpent: 8, activity: "Installed and configured software on workstations", remarks: "Completed setup for 5 new PCs" },
  { date: "Aug 5, 2026", hoursSpent: 8, activity: "Attended team meeting and training session", remarks: "Learned about company IT policies" },
  { date: "Aug 6, 2026", hoursSpent: 8, activity: "Documented IT inventory and asset tracking", remarks: "Updated spreadsheet for 50+ assets" },
  { date: "Aug 7, 2026", hoursSpent: 8, activity: "Shadowed senior IT staff on server maintenance", remarks: "Observed backup procedures" },
];

export default function WeeklyReportDemoPage() {
  const totalHours = DEMO_ACTIVITIES.reduce((sum, a) => sum + (Number(a.hoursSpent) || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-lg font-semibold">Weekly Accomplishment Report - Demo</h1>
        <div className="flex gap-2">
          <Link
            href="/student/weekly-reports"
            className="inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <PdfDownloadButton
            targetId="weekly-report-demo"
            filename="OJT_Weekly_Report_Demo.pdf"
            label="Download PDF"
          />
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Printer className="h-4 w-4" /> Print
          </button>
        </div>
      </div>

      {/* Paper Format */}
      <div id="weekly-report-demo" className="mx-auto max-w-[800px] border bg-white p-8 shadow-sm print:border-0 print:p-0 print:shadow-none">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full border-2 border-black">
            <span className="text-2xl font-bold text-[#1b4d8c]">C</span>
          </div>
          <h1 className="text-[11px] font-bold uppercase tracking-wide">Computer Communication Development Institute</h1>
          <p className="text-[9px]">Rizal St., Sorsogon City</p>
          <div className="mx-auto my-3 w-full border-t border-black" />
          <h2 className="text-sm font-bold uppercase">OJT Weekly Accomplishment Report</h2>
          <p className="mt-1 text-[11px]">
            From <span className="inline-block min-w-[80px] border-b border-black px-2 text-center font-medium">Aug 3, 2026</span>{" "}
            to <span className="inline-block min-w-[80px] border-b border-black px-2 text-center font-medium">Aug 7, 2026</span>, 2026
          </p>
        </div>

        {/* Info block */}
        <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 text-[10px]">
          <div className="flex items-end gap-1">
            <span className="whitespace-nowrap">Name of Trainee:</span>
            <span className="flex-1 border-b border-black pb-0.5 text-center font-medium">Jose Rizal Bonifacio</span>
          </div>
          <div className="flex items-end gap-1">
            <span className="whitespace-nowrap">Designation:</span>
            <span className="flex-1 border-b border-black pb-0.5 text-center font-medium">IT Support Intern</span>
          </div>
          <div className="flex items-end gap-1">
            <span className="whitespace-nowrap">Name of Company/Agency:</span>
            <span className="flex-1 border-b border-black pb-0.5 text-center font-medium">ABC Technologies</span>
          </div>
          <div className="flex items-end gap-1">
            <span className="whitespace-nowrap">Office/Department:</span>
            <span className="flex-1 border-b border-black pb-0.5 text-center font-medium">IT Department</span>
          </div>
        </div>

        {/* Table - exactly 5 rows */}
        <table className="mt-5 w-full border-collapse border border-black text-[10px]">
          <thead>
            <tr className="border-b border-black">
              <th className="w-[100px] border-r border-black px-2 py-2 text-center font-semibold italic">
                Date &amp; Time
              </th>
              <th className="w-[75px] border-r border-black px-2 py-2 text-center font-semibold italic">
                No of Hrs<br />Worked
              </th>
              <th className="border-r border-black px-2 py-2 text-center font-semibold italic">
                Activity/Task
              </th>
              <th className="px-2 py-2 text-center font-semibold italic">
                Remarks/Details
              </th>
            </tr>
          </thead>
          <tbody>
            {DEMO_ACTIVITIES.map((act, i) => (
              <tr key={i} className="border-b border-black">
                <td className="h-[55px] border-r border-black px-2 py-1 align-middle text-center">
                  {act.date}
                </td>
                <td className="h-[55px] border-r border-black px-2 py-1 align-middle text-center font-medium">
                  {act.hoursSpent}
                </td>
                <td className="h-[55px] border-r border-black px-2 py-1 align-middle">
                  {act.activity}
                </td>
                <td className="h-[55px] px-2 py-1 align-middle">
                  {act.remarks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Signatures */}
        <div className="mt-10 flex justify-between text-[10px]">
          <div className="w-1/2">
            <p>Noted:</p>
            <div className="mt-10 w-60 border-t border-black" />
            <p className="mt-1 text-center text-[9px]">Signature of Supervisor Above Printed Name</p>
          </div>
          <div className="w-1/2 text-right">
            <div className="mt-10 inline-block w-60 border-t border-black" />
            <p className="mt-1 text-center text-[9px]">Signature of OJT Student<br />Above Printed Name</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-[9px]">
          <p>
            <strong>To the OJT student:</strong>{" "}
            <em>Submit this document to the OJT Coordinator during OJT Face to Face class.</em>
          </p>
        </div>
      </div>
    </div>
  );
}
