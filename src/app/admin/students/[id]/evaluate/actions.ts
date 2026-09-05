"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";

function calcWeighted(scores: (number | null)[], maxRaw: number, weightPct: number): number | null {
  const valid = scores.filter((s): s is number => s !== null && s !== undefined);
  if (valid.length === 0) return null;
  const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
  return (avg / maxRaw) * weightPct;
}

export async function createOjtEvaluation(formData: {
  studentId: string;
  department: string;
  trainingPeriod: string;
  supervisorName: string;
  evaluationDate: string;
  qualityOfWork: number | null;
  productivityEfficiency: number | null;
  accuracyAttentionToDetail: number | null;
  abilityToFollowInstructions: number | null;
  abilityToWorkIndependently: number | null;
  understandingOfTasks: number | null;
  technicalSkills: number | null;
  problemSolvingSkills: number | null;
  abilityToLearnApplyFeedback: number | null;
  punctualityAttendance: number | null;
  initiative: number | null;
  responsibilityDependability: number | null;
  professionalBehavior: number | null;
  communicationSkills: number | null;
  teamworkCollaboration: number | null;
  customerClientInteraction: number | null;
  comments: string;
  evaluatorSignature: string;
}) {
  const wp = calcWeighted(
    [formData.qualityOfWork, formData.productivityEfficiency, formData.accuracyAttentionToDetail, formData.abilityToFollowInstructions, formData.abilityToWorkIndependently],
    5, 40
  );
  const ks = calcWeighted(
    [formData.understandingOfTasks, formData.technicalSkills, formData.problemSolvingSkills, formData.abilityToLearnApplyFeedback],
    5, 25
  );
  const wa = calcWeighted(
    [formData.punctualityAttendance, formData.initiative, formData.responsibilityDependability, formData.professionalBehavior],
    5, 20
  );
  const ct = calcWeighted(
    [formData.communicationSkills, formData.teamworkCollaboration, formData.customerClientInteraction],
    5, 15
  );

  const total = [wp, ks, wa, ct].filter((s): s is number => s !== null).reduce((a, b) => a + b, 0);

  const evaluation = await prisma.ojtEvaluation.create({
    data: {
      studentId: formData.studentId,
      department: formData.department || null,
      trainingPeriod: formData.trainingPeriod || null,
      supervisorName: formData.supervisorName || null,
      evaluationDate: new Date(formData.evaluationDate),
      qualityOfWork: formData.qualityOfWork,
      productivityEfficiency: formData.productivityEfficiency,
      accuracyAttentionToDetail: formData.accuracyAttentionToDetail,
      abilityToFollowInstructions: formData.abilityToFollowInstructions,
      abilityToWorkIndependently: formData.abilityToWorkIndependently,
      understandingOfTasks: formData.understandingOfTasks,
      technicalSkills: formData.technicalSkills,
      problemSolvingSkills: formData.problemSolvingSkills,
      abilityToLearnApplyFeedback: formData.abilityToLearnApplyFeedback,
      punctualityAttendance: formData.punctualityAttendance,
      initiative: formData.initiative,
      responsibilityDependability: formData.responsibilityDependability,
      professionalBehavior: formData.professionalBehavior,
      communicationSkills: formData.communicationSkills,
      teamworkCollaboration: formData.teamworkCollaboration,
      customerClientInteraction: formData.customerClientInteraction,
      workPerformanceScore: wp,
      knowledgeSkillsScore: ks,
      workAttitudeScore: wa,
      communicationTeamworkScore: ct,
      totalScore: total,
      comments: formData.comments || null,
      evaluatorSignature: formData.evaluatorSignature || null,
    },
  });

  revalidatePath(`/admin/students/${formData.studentId}`);
  return { success: true, id: evaluation.id };
}
