import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getNarrativeReport(studentId: string) {
  return prisma.narrativeReport.findUnique({
    where: { studentId },
  });
}

export async function generateNarrativeReport(studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      user: true,
      dtrRecords: { orderBy: { date: "asc" } },
      weeklyReports: {
        orderBy: { weekNumber: "asc" },
        include: { activities: { orderBy: { date: "asc" } } },
      },
      tasks: { orderBy: { date: "asc" } },
      ojtEvaluations: { orderBy: { evaluationDate: "desc" }, take: 1 },
    },
  });

  if (!student) throw new Error("Student not found");

  const fullName = `${student.firstName} ${student.middleName ? student.middleName + " " : ""}${student.lastName}`;
  const courseYear = `${student.course} - ${student.yearLevel}${student.section ? " " + student.section : ""}`;
  const totalWeeks = student.weeklyReports.length;
  const totalHours = student.weeklyReports.reduce((sum, wr) => sum + (wr.totalHours || 0), 0);
  const totalTasks = student.tasks.length;
  const completedTasks = student.tasks.filter((t) => t.status === "COMPLETED").length;
  const evalData = student.ojtEvaluations[0];

  // Build sections
  const sections: string[] = [];

  // Header
  sections.push(`# OJT Narrative Summary Report`);
  sections.push(``);

  // Student Profile
  sections.push(`## Student Profile`);
  sections.push(`- **Name:** ${fullName}`);
  sections.push(`- **Course / Year:** ${courseYear}`);
  sections.push(`- **Student ID:** ${student.studentId}`);
  if (student.companyName) {
    sections.push(`- **Company / Agency:** ${student.companyName}`);
  }
  if (student.companyAddress) {
    sections.push(`- **Company Address:** ${student.companyAddress}`);
  }
  if (student.designation) {
    sections.push(`- **Designation:** ${student.designation}`);
  }
  sections.push(``);

  // OJT Overview
  sections.push(`## OJT Overview`);
  sections.push(`- **Training Status:** ${student.status.replace(/_/g, " ")}`);
  sections.push(`- **Total Weeks Reported:** ${totalWeeks}`);
  sections.push(`- **Total Hours Logged:** ${totalHours.toFixed(1)} / ${student.requiredHours.toFixed(0)} required`);
  sections.push(`- **DTR Entries:** ${student.dtrRecords.length} records`);
  sections.push(`- **Tasks:** ${completedTasks} completed out of ${totalTasks} total`);
  sections.push(``);

  // Weekly Accomplishments Timeline
  if (student.weeklyReports.length > 0) {
    sections.push(`## Weekly Accomplishments`);
    for (const report of student.weeklyReports) {
      const start = report.weekStartDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const end = report.weekEndDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      sections.push(`### Week ${report.weekNumber} (${start} - ${end})`);
      sections.push(`**Total Hours:** ${report.totalHours.toFixed(1)} hrs`);
      if (report.activities.length > 0) {
        for (const act of report.activities) {
          const date = act.date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          sections.push(`- **${date}** (${act.hoursSpent?.toFixed(1) ?? "0"} hrs): ${act.activity}`);
          if (act.remarks) sections.push(`  - ${act.remarks}`);
          if (act.skillsLearned) sections.push(`  - Skills: ${act.skillsLearned}`);
        }
      }
      sections.push(``);
    }
  }

  // Tasks Summary
  if (student.tasks.length > 0) {
    sections.push(`## Tasks & Activities Summary`);
    for (const task of student.tasks) {
      const date = task.date ? task.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No date";
      const statusEmoji = task.status === "COMPLETED" ? "✅" : task.status === "ONGOING" ? "🔄" : "⬜";
      sections.push(`- ${statusEmoji} **${task.title}** (${date})`);
      if (task.description) sections.push(`  - ${task.description}`);
      if (task.skillsLearned) sections.push(`  - Skills learned: ${task.skillsLearned}`);
    }
    sections.push(``);
  }

  // Skills Developed
  const allSkills = new Set<string>();
  for (const wr of student.weeklyReports) {
    for (const act of wr.activities) {
      if (act.skillsLearned) allSkills.add(act.skillsLearned);
    }
  }
  for (const task of student.tasks) {
    if (task.skillsLearned) allSkills.add(task.skillsLearned);
  }
  if (allSkills.size > 0) {
    sections.push(`## Skills Developed`);
    for (const skill of Array.from(allSkills).sort()) {
      sections.push(`- ${skill}`);
    }
    sections.push(``);
  }

  // Evaluation Summary
  if (evalData) {
    sections.push(`## OJT Evaluation Summary`);
    sections.push(`- **Department:** ${evalData.department ?? "N/A"}`);
    sections.push(`- **Training Period:** ${evalData.trainingPeriod ?? "N/A"}`);
    sections.push(`- **Supervisor/Evaluator:** ${evalData.supervisorName ?? "N/A"}`);
    sections.push(`- **Evaluation Date:** ${evalData.evaluationDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`);
    sections.push(``);
    sections.push(`### Scores`);
    if (evalData.workPerformanceScore != null) {
      sections.push(`- **Work Performance (40%):** ${evalData.workPerformanceScore.toFixed(2)}`);
    }
    if (evalData.knowledgeSkillsScore != null) {
      sections.push(`- **Knowledge & Skills (25%):** ${evalData.knowledgeSkillsScore.toFixed(2)}`);
    }
    if (evalData.workAttitudeScore != null) {
      sections.push(`- **Work Attitude & Professionalism (20%):** ${evalData.workAttitudeScore.toFixed(2)}`);
    }
    if (evalData.communicationTeamworkScore != null) {
      sections.push(`- **Communication & Teamwork (15%):** ${evalData.communicationTeamworkScore.toFixed(2)}`);
    }
    if (evalData.totalScore != null) {
      sections.push(`- **TOTAL SCORE:** ${evalData.totalScore.toFixed(2)} / 100`);
    }
    sections.push(``);
    if (evalData.comments) {
      sections.push(`### Supervisor Comments`);
      sections.push(evalData.comments);
      sections.push(``);
    }
  }

  // DTR Attendance Summary
  if (student.dtrRecords.length > 0) {
    const present = student.dtrRecords.filter((r) => r.status === "PRESENT").length;
    const late = student.dtrRecords.filter((r) => r.status === "LATE").length;
    const absent = student.dtrRecords.filter((r) => r.status === "ABSENT").length;
    const excused = student.dtrRecords.filter((r) => r.status === "EXCUSED").length;
    const dtrHours = student.dtrRecords.reduce((sum, r) => sum + (r.totalHours || 0), 0);

    sections.push(`## Attendance Summary (DTR)`);
    sections.push(`- **Present Days:** ${present}`);
    sections.push(`- **Late Days:** ${late}`);
    sections.push(`- **Absent Days:** ${absent}`);
    sections.push(`- **Excused Days:** ${excused}`);
    sections.push(`- **Total Hours (from DTR):** ${dtrHours.toFixed(2)}`);
    sections.push(``);
  }

  // Conclusion
  sections.push(`---`);
  sections.push(`*This narrative summary was automatically generated by the CCDI OJT Monitoring System based on the student's submitted weekly reports, tasks, evaluation, and daily time records.*`);

  return sections.join("\n");
}

export async function upsertNarrativeReport(studentId: string, content: string) {
  return prisma.narrativeReport.upsert({
    where: { studentId },
    create: { studentId, content, status: "DRAFT" },
    update: { content, status: "DRAFT" },
  });
}

export async function submitNarrativeReport(studentId: string) {
  return prisma.narrativeReport.update({
    where: { studentId },
    data: { status: "SUBMITTED" },
  });
}

export async function regenerateNarrativeReport(studentId: string) {
  const content = await generateNarrativeReport(studentId);
  return upsertNarrativeReport(studentId, content);
}
