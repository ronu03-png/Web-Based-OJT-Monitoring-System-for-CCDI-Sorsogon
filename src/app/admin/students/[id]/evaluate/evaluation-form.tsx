"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { createOjtEvaluation } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";

interface Criterion {
  key: string;
  label: string;
}

const WORK_PERFORMANCE: Criterion[] = [
  { key: "qualityOfWork", label: "Quality of Work" },
  { key: "productivityEfficiency", label: "Productivity / Efficiency" },
  { key: "accuracyAttentionToDetail", label: "Accuracy & Attention to Detail" },
  { key: "abilityToFollowInstructions", label: "Ability to Follow Instructions" },
  { key: "abilityToWorkIndependently", label: "Ability to Work Independently" },
];

const KNOWLEDGE_SKILLS: Criterion[] = [
  { key: "understandingOfTasks", label: "Understanding of Tasks" },
  { key: "technicalSkills", label: "Technical Skills" },
  { key: "problemSolvingSkills", label: "Problem-Solving Skills" },
  { key: "abilityToLearnApplyFeedback", label: "Ability to Learn & Apply Feedback" },
];

const WORK_ATTITUDE: Criterion[] = [
  { key: "punctualityAttendance", label: "Punctuality & Attendance" },
  { key: "initiative", label: "Initiative" },
  { key: "responsibilityDependability", label: "Responsibility & Dependability" },
  { key: "professionalBehavior", label: "Professional Behavior" },
];

const COMMUNICATION: Criterion[] = [
  { key: "communicationSkills", label: "Communication Skills" },
  { key: "teamworkCollaboration", label: "Teamwork & Collaboration" },
  { key: "customerClientInteraction", label: "Customer/Client Interaction (if applicable)" },
];

const RATINGS = [5, 4, 3, 2, 1];

export default function EvaluationForm({
  studentId,
  studentName,
}: {
  studentId: string;
  studentName: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [scores, setScores] = useState<Record<string, number | null>>({});
  const [department, setDepartment] = useState("");
  const [trainingPeriod, setTrainingPeriod] = useState("");
  const [supervisorName, setSupervisorName] = useState("");
  const [evaluationDate, setEvaluationDate] = useState(new Date().toISOString().split("T")[0]);
  const [comments, setComments] = useState("");
  const [evaluatorSignature, setEvaluatorSignature] = useState("");

  function setScore(key: string, value: number) {
    setScores((prev) => ({ ...prev, [key]: value }));
  }

  function renderSection(title: string, weight: string, criteria: Criterion[]) {
    return (
      <Card className="p-5">
        <h3 className="mb-3 text-base font-bold">{title} ({weight})</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Criteria</th>
              {RATINGS.map((r) => (
                <th key={r} className="w-10 py-2 text-center">{r}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criteria.map((c) => (
              <tr key={c.key} className="border-b">
                <td className="py-2">{c.label}</td>
                {RATINGS.map((r) => (
                  <td key={r} className="py-2 text-center">
                    <input
                      type="radio"
                      name={c.key}
                      value={r}
                      checked={scores[c.key] === r}
                      onChange={() => setScore(c.key, r)}
                      className="size-4 cursor-pointer"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await createOjtEvaluation({
        studentId,
        department,
        trainingPeriod,
        supervisorName,
        evaluationDate,
        qualityOfWork: scores["qualityOfWork"] ?? null,
        productivityEfficiency: scores["productivityEfficiency"] ?? null,
        accuracyAttentionToDetail: scores["accuracyAttentionToDetail"] ?? null,
        abilityToFollowInstructions: scores["abilityToFollowInstructions"] ?? null,
        abilityToWorkIndependently: scores["abilityToWorkIndependently"] ?? null,
        understandingOfTasks: scores["understandingOfTasks"] ?? null,
        technicalSkills: scores["technicalSkills"] ?? null,
        problemSolvingSkills: scores["problemSolvingSkills"] ?? null,
        abilityToLearnApplyFeedback: scores["abilityToLearnApplyFeedback"] ?? null,
        punctualityAttendance: scores["punctualityAttendance"] ?? null,
        initiative: scores["initiative"] ?? null,
        responsibilityDependability: scores["responsibilityDependability"] ?? null,
        professionalBehavior: scores["professionalBehavior"] ?? null,
        communicationSkills: scores["communicationSkills"] ?? null,
        teamworkCollaboration: scores["teamworkCollaboration"] ?? null,
        customerClientInteraction: scores["customerClientInteraction"] ?? null,
        comments,
        evaluatorSignature,
      });
      if (res.success) {
        router.push(`/admin/students/${studentId}`);
      }
    });
  }

  const wpScores = WORK_PERFORMANCE.map((c) => scores[c.key]).filter((s): s is number => s !== undefined && s !== null);
  const ksScores = KNOWLEDGE_SKILLS.map((c) => scores[c.key]).filter((s): s is number => s !== undefined && s !== null);
  const waScores = WORK_ATTITUDE.map((c) => scores[c.key]).filter((s): s is number => s !== undefined && s !== null);
  const ctScores = COMMUNICATION.map((c) => scores[c.key]).filter((s): s is number => s !== undefined && s !== null);

  const wpAvg = wpScores.length ? (wpScores.reduce((a, b) => a + b, 0) / wpScores.length / 5) * 40 : 0;
  const ksAvg = ksScores.length ? (ksScores.reduce((a, b) => a + b, 0) / ksScores.length / 5) * 25 : 0;
  const waAvg = waScores.length ? (waScores.reduce((a, b) => a + b, 0) / waScores.length / 5) * 20 : 0;
  const ctAvg = ctScores.length ? (ctScores.reduce((a, b) => a + b, 0) / ctScores.length / 5) * 15 : 0;
  const total = wpAvg + ksAvg + waAvg + ctAvg;

  return (
    <div className="space-y-6">
      <PageHeader
        title="OJT Evaluation Form"
        description={`Evaluate trainee: ${studentName}`}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/students/${studentId}`}><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Trainee Name</Label>
              <Input value={studentName} disabled />
            </div>
            <div>
              <Label>Department</Label>
              <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. IT Department" />
            </div>
            <div>
              <Label>Training Period</Label>
              <Input value={trainingPeriod} onChange={(e) => setTrainingPeriod(e.target.value)} placeholder="e.g. July 6 - October 5, 2026" />
            </div>
            <div>
              <Label>Supervisor / Evaluator</Label>
              <Input value={supervisorName} onChange={(e) => setSupervisorName(e.target.value)} placeholder="Evaluator name" />
            </div>
            <div>
              <Label>Evaluation Date</Label>
              <Input type="date" value={evaluationDate} onChange={(e) => setEvaluationDate(e.target.value)} />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-2 font-bold">Rating Scale</h3>
          <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-5">
            <div><strong>5</strong> Excellent – Consistently exceeds expectations</div>
            <div><strong>4</strong> Very Good – Frequently exceeds expectations</div>
            <div><strong>3</strong> Good – Meets expectations</div>
            <div><strong>2</strong> Fair – Sometimes meets expectations</div>
            <div><strong>1</strong> Poor – Does not meet expectations</div>
          </div>
        </Card>

        {renderSection("I. WORK PERFORMANCE", "40%", WORK_PERFORMANCE)}
        {renderSection("II. KNOWLEDGE & SKILLS", "25%", KNOWLEDGE_SKILLS)}
        {renderSection("III. WORK ATTITUDE & PROFESSIONALISM", "20%", WORK_ATTITUDE)}
        {renderSection("IV. COMMUNICATION & TEAMWORK", "15%", COMMUNICATION)}

        <Card className="p-5">
          <h3 className="mb-3 font-bold">V. OVERALL COMPUTATION</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Category</th>
                <th className="py-2 text-right">Weighted Score</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b"><td className="py-2">Work Performance</td><td className="py-2 text-right">{wpAvg.toFixed(2)}</td></tr>
              <tr className="border-b"><td className="py-2">Knowledge & Skills</td><td className="py-2 text-right">{ksAvg.toFixed(2)}</td></tr>
              <tr className="border-b"><td className="py-2">Work Attitude & Professionalism</td><td className="py-2 text-right">{waAvg.toFixed(2)}</td></tr>
              <tr className="border-b"><td className="py-2">Communication & Teamwork</td><td className="py-2 text-right">{ctAvg.toFixed(2)}</td></tr>
              <tr className="font-bold"><td className="py-2">TOTAL SCORE</td><td className="py-2 text-right">{total.toFixed(2)} / 100</td></tr>
            </tbody>
          </table>
        </Card>

        <Card className="p-5">
          <h3 className="mb-2 font-bold">VI. COMMENT / RECOMMENDATION</h3>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            placeholder="Enter comments or recommendations..."
          />
        </Card>

        <Card className="p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Evaluator&apos;s Signature</Label>
              <Input value={evaluatorSignature} onChange={(e) => setEvaluatorSignature(e.target.value)} placeholder="Type full name as signature" />
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={evaluationDate} disabled />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Evaluation"}
          </Button>
        </div>
      </form>
    </div>
  );
}
