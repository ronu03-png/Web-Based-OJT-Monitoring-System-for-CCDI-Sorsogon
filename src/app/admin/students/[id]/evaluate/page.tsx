import { redirect, notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/dal";
import { prisma } from "@/lib/db/prisma";
import EvaluationForm from "./evaluation-form";

export default async function AdminEvaluateStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (user.role !== "ADMIN") redirect("/unauthorized");

  const { id } = await params;
  const student = await prisma.student.findUnique({
    where: { id },
    include: { user: { select: { firstName: true, lastName: true } } },
  });

  if (!student) notFound();

  const studentName = `${student.firstName} ${student.lastName}`;

  return <EvaluationForm studentId={id} studentName={studentName} />;
}
