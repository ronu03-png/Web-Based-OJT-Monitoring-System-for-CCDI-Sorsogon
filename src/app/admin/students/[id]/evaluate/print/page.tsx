import { redirect, notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/dal";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/format";
import PrintActions from "./print-actions";

export default async function AdminEvaluationPrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ evalId?: string }>;
}) {
  const user = await getCurrentUser();
  if (user.role !== "ADMIN") redirect("/unauthorized");

  const { id } = await params;
  const { evalId } = await searchParams;
  if (!evalId) notFound();

  const evaluation = await prisma.ojtEvaluation.findFirst({
    where: { id: evalId, studentId: id },
    include: { student: true },
  });
  if (!evaluation) notFound();

  const s = evaluation.student;

  const wpItems = [
    { label: "Quality of Work", score: evaluation.qualityOfWork },
    { label: "Productivity / Efficiency", score: evaluation.productivityEfficiency },
    { label: "Accuracy & Attention to Detail", score: evaluation.accuracyAttentionToDetail },
    { label: "Ability to Follow Instructions", score: evaluation.abilityToFollowInstructions },
    { label: "Ability to Work Independently", score: evaluation.abilityToWorkIndependently },
  ];

  const ksItems = [
    { label: "Understanding of Tasks", score: evaluation.understandingOfTasks },
    { label: "Technical Skills", score: evaluation.technicalSkills },
    { label: "Problem-Solving Skills", score: evaluation.problemSolvingSkills },
    { label: "Ability to Learn & Apply Feedback", score: evaluation.abilityToLearnApplyFeedback },
  ];

  const waItems = [
    { label: "Punctuality & Attendance", score: evaluation.punctualityAttendance },
    { label: "Initiative", score: evaluation.initiative },
    { label: "Responsibility & Dependability", score: evaluation.responsibilityDependability },
    { label: "Professional Behavior", score: evaluation.professionalBehavior },
  ];

  const ctItems = [
    { label: "Communication Skills", score: evaluation.communicationSkills },
    { label: "Teamwork & Collaboration", score: evaluation.teamworkCollaboration },
    { label: "Customer/Client Interaction (if applicable)", score: evaluation.customerClientInteraction },
  ];

  function Section({
    title,
    maxScore,
    weight,
    items,
  }: {
    title: string;
    maxScore: number;
    weight: string;
    items: { label: string; score: number | null }[];
  }) {
    const validScores = items.map((i) => i.score).filter((s): s is number => s !== null);
    const subtotal = validScores.reduce((a, b) => a + b, 0);
    const weighted =
      validScores.length > 0 ? ((subtotal / (items.length * 5)) * parseInt(weight)).toFixed(2) : "";

    return (
      <div className="mb-4">
        <h3 className="mb-1 text-[9px] font-bold uppercase leading-tight sm:text-[10px]">
          {title}
        </h3>
        <table className="w-full border-collapse border border-black text-[8px] sm:text-[9px]">
          <thead>
            <tr className="border-b border-black">
              <th className="border-r border-black px-1 py-0.5 text-left font-semibold sm:px-1.5 sm:py-1">
                Criteria
              </th>
              {[1, 2, 3, 4, 5].map((n) => (
                <th
                  key={n}
                  className="w-5 border-r border-black py-0.5 text-center font-semibold sm:w-6 sm:py-1"
                >
                  {n}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-black">
                <td className="border-r border-black px-1 py-0.5 sm:px-1.5 sm:py-1">
                  {item.label}
                </td>
                {[1, 2, 3, 4, 5].map((n) => (
                  <td
                    key={n}
                    className="border-r border-black py-0.5 text-center sm:py-1"
                  >
                    {item.score === n ? "☑" : "☐"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-1 text-[8px] sm:text-[9px]">
          <div className="flex items-end gap-1">
            <span className="whitespace-nowrap">Subtotal ({title.split("(")[0].trim()}):</span>
            <span className="inline-block min-w-[24px] border-b border-black text-center">
              {subtotal || ""}
            </span>
            <span>/ {maxScore}*100</span>
          </div>
          <div className="mt-0.5 flex items-end gap-1">
            <span className="whitespace-nowrap">Weighted Score (x {weight}%):</span>
            <span className="inline-block min-w-[32px] border-b border-black text-center">
              {weighted}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[900px] p-6 print:p-0">
      <PrintActions studentId={id} evalId={evalId} />

      <div id="evaluation-document" className="bg-white p-4 print:p-0">
        {/* Title */}
        <div className="mb-3 text-center">
          <img
            src="/assets/ccdi-logo.png"
            alt="CCDI Logo"
            className="mx-auto mb-1 h-16 w-auto"
          />
          <h1 className="text-[11px] font-bold uppercase leading-tight sm:text-xs">
            On-The-Job Trainee (OJT) Evaluation Form
          </h1>
          <p className="text-[9px] text-muted-foreground sm:text-[10px]">Computer Communication Development Institute &middot; Rizal St., Sorsogon City</p>
        </div>

        {/* Two-column main layout with vertical divider */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:divide-x sm:divide-black">
          {/* LEFT COLUMN */}
          <div className="sm:pr-4">
            {/* Trainee Info */}
            <div className="mb-4 space-y-1 text-[9px] sm:text-[10px]">
              <div className="flex items-end gap-1">
                <span className="whitespace-nowrap">Trainee Name:</span>
                <span className="flex-1 border-b border-black pb-0.5 text-center">
                  {s.firstName} {s.lastName}
                </span>
              </div>
              <div className="flex items-end gap-1">
                <span className="whitespace-nowrap">Department:</span>
                <span className="flex-1 border-b border-black pb-0.5 text-center">
                  {evaluation.department ?? ""}
                </span>
              </div>
              <div className="flex items-end gap-1">
                <span className="whitespace-nowrap">Training Period:</span>
                <span className="flex-1 border-b border-black pb-0.5 text-center">
                  {evaluation.trainingPeriod ?? ""}
                </span>
              </div>
              <div className="flex items-end gap-1">
                <span className="whitespace-nowrap">Supervisor/Evaluator:</span>
                <span className="flex-1 border-b border-black pb-0.5 text-center">
                  {evaluation.supervisorName ?? ""}
                </span>
              </div>
              <div className="flex items-end gap-1">
                <span className="whitespace-nowrap">Evaluation Date:</span>
                <span className="flex-1 border-b border-black pb-0.5 text-center">
                  {evaluation.evaluationDate ? formatDate(evaluation.evaluationDate) : ""}
                </span>
              </div>
            </div>

            {/* Rating Scale */}
            <div className="mb-4 text-[9px] sm:text-[10px]">
              <p className="font-bold">Rating Scale</p>
              <p className="font-semibold">Rating Description</p>
              <div className="mt-1 space-y-0.5">
                <div>
                  <strong>5</strong> Excellent – Consistently exceeds expectations
                </div>
                <div>
                  <strong>4</strong> Very Good – Frequently exceeds expectations
                </div>
                <div>
                  <strong>3</strong> Good – Meets expectations
                </div>
                <div>
                  <strong>2</strong> Fair – Sometimes meets expectations
                </div>
                <div>
                  <strong>1</strong> Poor – Does not meet expectations
                </div>
              </div>
            </div>

            <Section title="I. Work Performance (40%)" maxScore={25} weight="40" items={wpItems} />
            <Section title="II. Knowledge & Skills (25%)" maxScore={20} weight="25" items={ksItems} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="sm:pl-4">
            <Section title="III. Work Attitude & Professionalism (20%)" maxScore={20} weight="20" items={waItems} />
            <Section title="IV. Communication & Teamwork (15%)" maxScore={15} weight="15" items={ctItems} />

            {/* Overall Computation */}
            <div className="mb-4">
              <h3 className="mb-1 text-[9px] font-bold uppercase sm:text-[10px]">
                V. Overall Computation
              </h3>
              <table className="w-full border-collapse border border-black text-[8px] sm:text-[9px]">
                <thead>
                  <tr className="border-b border-black">
                    <th className="border-r border-black px-1 py-0.5 text-left font-semibold sm:px-1.5 sm:py-1">
                      Category
                    </th>
                    <th className="px-1 py-0.5 text-right font-semibold sm:px-1.5 sm:py-1">
                      Weighted Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-black">
                    <td className="border-r border-black px-1 py-0.5 sm:px-1.5 sm:py-1">
                      Work Performance
                    </td>
                    <td className="px-1 py-0.5 text-right sm:px-1.5 sm:py-1">
                      {evaluation.workPerformanceScore?.toFixed(2) ?? ""}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-r border-black px-1 py-0.5 sm:px-1.5 sm:py-1">
                      Knowledge & Skills
                    </td>
                    <td className="px-1 py-0.5 text-right sm:px-1.5 sm:py-1">
                      {evaluation.knowledgeSkillsScore?.toFixed(2) ?? ""}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-r border-black px-1 py-0.5 sm:px-1.5 sm:py-1">
                      Work Attitude & Professionalism
                    </td>
                    <td className="px-1 py-0.5 text-right sm:px-1.5 sm:py-1">
                      {evaluation.workAttitudeScore?.toFixed(2) ?? ""}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-r border-black px-1 py-0.5 sm:px-1.5 sm:py-1">
                      Communication & Teamwork
                    </td>
                    <td className="px-1 py-0.5 text-right sm:px-1.5 sm:py-1">
                      {evaluation.communicationTeamworkScore?.toFixed(2) ?? ""}
                    </td>
                  </tr>
                  <tr className="font-bold">
                    <td className="border-r border-black px-1 py-0.5 sm:px-1.5 sm:py-1">
                      TOTAL SCORE
                    </td>
                    <td className="px-1 py-0.5 text-right sm:px-1.5 sm:py-1">
                      {evaluation.totalScore?.toFixed(2) ?? ""} / 100
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Comments - blank lines when empty, filled text when present */}
            <div className="mb-4">
              <h3 className="mb-1 text-[9px] font-bold uppercase sm:text-[10px]">
                VI. Comment / Recommendation
              </h3>
              {evaluation.comments ? (
                <div className="space-y-1 text-[8px] leading-snug sm:text-[9px]">
                  {evaluation.comments.split("\n").map((line, i) => (
                    <p key={i} className="border-b border-black pb-1">
                      {line}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="border-b border-black pb-1">&nbsp;</div>
                  <div className="border-b border-black pb-1">&nbsp;</div>
                  <div className="border-b border-black pb-1">&nbsp;</div>
                  <div className="border-b border-black pb-1">&nbsp;</div>
                  <div className="border-b border-black pb-1">&nbsp;</div>
                </div>
              )}
            </div>

            {/* Signature */}
            <div className="mt-6 text-[9px] sm:text-[10px]">
              <div className="mb-3 flex items-end gap-1">
                <span className="whitespace-nowrap">Evaluator&apos;s Signature:</span>
                <span className="flex-1 border-b border-black pb-0.5 text-center">
                  {evaluation.evaluatorSignature ?? ""}
                </span>
              </div>
              <div className="flex items-end gap-1">
                <span className="whitespace-nowrap">Date:</span>
                <span className="flex-1 border-b border-black pb-0.5 text-center">
                  {evaluation.evaluationDate ? formatDate(evaluation.evaluationDate) : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
