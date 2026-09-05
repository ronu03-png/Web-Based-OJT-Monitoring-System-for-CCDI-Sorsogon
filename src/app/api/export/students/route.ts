import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const students = await prisma.student.findMany({
    orderBy: { lastName: "asc" },
    select: {
      studentId: true,
      firstName: true,
      lastName: true,
      course: true,
      yearLevel: true,
      section: true,
      companyName: true,
      designation: true,
      requiredHours: true,
      completedHours: true,
      status: true,
      startDate: true,
      expectedEndDate: true,
    },
  });

  const headers = [
    "Student ID", "First Name", "Last Name", "Course", "Year Level", "Section",
    "Company", "Designation", "Required Hours", "Completed Hours", "Status",
    "Start Date", "Expected End Date",
  ];

  const rows = students.map((s) => [
    s.studentId,
    s.firstName,
    s.lastName,
    s.course,
    String(s.yearLevel),
    s.section ?? "",
    s.companyName ?? "",
    s.designation ?? "",
    String(s.requiredHours),
    String(s.completedHours),
    s.status,
    s.startDate ? s.startDate.toISOString().split("T")[0] : "",
    s.expectedEndDate ? s.expectedEndDate.toISOString().split("T")[0] : "",
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="students.csv"',
    },
  });
}
