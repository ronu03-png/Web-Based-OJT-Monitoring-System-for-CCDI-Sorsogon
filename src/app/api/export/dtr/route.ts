import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const records = await prisma.dtrRecord.findMany({
    orderBy: { date: "desc" },
    include: {
      student: { select: { studentId: true, firstName: true, lastName: true } },
    },
  });

  const headers = [
    "Student ID", "Student Name", "Date", "Time In", "Time Out",
    "Break Minutes", "Total Hours", "Status", "Remarks",
  ];

  const rows = records.map((r) => [
    r.student.studentId,
    `${r.student.firstName} ${r.student.lastName}`,
    r.date.toISOString().split("T")[0],
    r.timeIn ? new Date(r.timeIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
    r.timeOut ? new Date(r.timeOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
    String(r.breakMinutes),
    String(r.totalHours),
    r.status,
    r.remarks ?? "",
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="dtr-records.csv"',
    },
  });
}
