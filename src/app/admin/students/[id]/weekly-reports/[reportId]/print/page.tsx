import { redirect, notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/dal";
import { getWeeklyReportByIdAdmin } from "@/services/weekly-reports";
import { formatDate } from "@/lib/format";
import PrintActions from "@/app/student/weekly-reports/[id]/print/print-client";

export default async function AdminWeeklyReportPrintPage({
  params,
}: {
  params: Promise<{ id: string; reportId: string }>;
}) {
  const user = await getCurrentUser();
  if (user.role !== "ADMIN") redirect("/unauthorized");

  const { reportId } = await params;
  const report = await getWeeklyReportByIdAdmin(reportId);
  if (!report || !report.student) notFound();

  const student = report.student;
  const studentName = `${student.firstName} ${student.lastName}`;
  const yearStr = report.weekStartDate.getFullYear();

  const rows = [...report.activities];
  while (rows.length < 5) {
    rows.push(null as any);
  }

  return (
    <div className="mx-auto max-w-[800px] p-6 print:p-0">
      <PrintActions reportId={reportId} />

      <div id="weekly-report-document" className="bg-white p-6 print:p-0">
        {/* Header */}
        <div className="text-center">
          <img
            src="/assets/ccdi-logo.png"
            alt="CCDI Logo"
            className="mx-auto mb-2 h-20 w-auto"
          />
          <h1 className="text-[11px] font-bold uppercase tracking-wide sm:text-xs">
            Computer Communication Development Institute
          </h1>
          <p className="text-[9px] sm:text-[10px]">Rizal St., Sorsogon City</p>
          <div className="mx-auto my-3 w-full border-t border-black" />
          <h2 className="text-sm font-bold uppercase sm:text-base">OJT Weekly Accomplishment Report</h2>
          <p className="mt-1 text-[11px] sm:text-xs">
            From{" "}
            <span className="inline-block min-w-[80px] border-b border-black px-2 text-center font-medium">
              {formatDate(report.weekStartDate)}
            </span>{" "}
            to{" "}
            <span className="inline-block min-w-[80px] border-b border-black px-2 text-center font-medium">
              {formatDate(report.weekEndDate)}
            </span>
            , {yearStr}
          </p>
        </div>

        {/* Info block */}
        <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 text-[10px] sm:grid-cols-2 sm:text-xs">
          <div className="flex items-end gap-1">
            <span className="whitespace-nowrap">Name of Trainee:</span>
            <span className="flex-1 border-b border-black pb-0.5 text-center font-medium">
              {studentName}
            </span>
          </div>
          <div className="flex items-end gap-1">
            <span className="whitespace-nowrap">Designation:</span>
            <span className="flex-1 border-b border-black pb-0.5 text-center font-medium">
              {student.designation ?? ""}
            </span>
          </div>
          <div className="flex items-end gap-1">
            <span className="whitespace-nowrap">Name of Company/Agency:</span>
            <span className="flex-1 border-b border-black pb-0.5 text-center font-medium">
              {student.companyName ?? ""}
            </span>
          </div>
          <div className="flex items-end gap-1">
            <span className="whitespace-nowrap">Office/Department:</span>
            <span className="flex-1 border-b border-black pb-0.5 text-center font-medium"></span>
          </div>
        </div>

        {/* Table - exactly 5 rows matching paper */}
        <table className="mt-5 w-full border-collapse border border-black text-[10px] sm:text-xs">
          <thead>
            <tr className="border-b border-black">
              <th className="w-[90px] border-r border-black px-1 py-1 text-center font-semibold italic sm:w-[100px] sm:px-2 sm:py-2">
                Date &amp; Time
              </th>
              <th className="w-[65px] border-r border-black px-1 py-1 text-center font-semibold italic sm:w-[75px] sm:px-2 sm:py-2">
                No of Hrs<br className="hidden sm:block" />Worked
              </th>
              <th className="border-r border-black px-1 py-1 text-center font-semibold italic sm:px-2 sm:py-2">
                Activity/Task
              </th>
              <th className="px-1 py-1 text-center font-semibold italic sm:px-2 sm:py-2">
                Remarks/Details
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((act, i) => (
              <tr key={act?.id ?? `blank-${i}`} className="border-b border-black">
                <td className="h-[55px] border-r border-black px-1 py-1 align-middle text-center sm:h-[65px] sm:px-2">
                  {act ? formatDate(act.date) : ""}
                </td>
                <td className="h-[55px] border-r border-black px-1 py-1 align-middle text-center font-medium sm:h-[65px] sm:px-2">
                  {act ? (act.hoursSpent ?? "") : ""}
                </td>
                <td className="h-[55px] border-r border-black px-1 py-1 align-middle sm:h-[65px] sm:px-2">
                  {act ? act.activity : ""}
                </td>
                <td className="h-[55px] px-1 py-1 align-middle sm:h-[65px] sm:px-2">
                  {act ? (act.remarks ?? "") : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Signatures */}
        <div className="mt-10 flex justify-between text-[10px] sm:text-xs">
          <div className="w-1/2">
            <p>Noted:</p>
            <div className="mt-10 w-48 border-t border-black sm:mt-12 sm:w-60" />
            <p className="mt-1 text-center text-[9px] sm:text-[10px]">
              Signature of Supervisor Above Printed Name
            </p>
          </div>
          <div className="w-1/2 text-right">
            <div className="mt-10 inline-block w-48 border-t border-black sm:mt-12 sm:w-60" />
            <p className="mt-1 text-center text-[9px] sm:text-[10px]">
              Signature of OJT Student<br />Above Printed Name
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-[9px] sm:text-[10px]">
          <p>
            <strong>To the OJT student:</strong>{" "}
            <em>Submit this document to the OJT Coordinator during OJT Face to Face class.</em>
          </p>
        </div>
      </div>
    </div>
  );
}
