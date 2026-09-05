"use server";

import { revalidatePath } from "next/cache";
import {
  generateNarrativeReport,
  upsertNarrativeReport,
  submitNarrativeReport,
  regenerateNarrativeReport,
} from "@/services/narrative-report";

export async function generateNarrativeReportAction(studentId: string) {
  try {
    const report = await regenerateNarrativeReport(studentId);
    revalidatePath("/student/narrative-report");
    return { success: true, data: report };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function saveNarrativeReportAction(studentId: string, content: string) {
  try {
    const report = await upsertNarrativeReport(studentId, content);
    revalidatePath("/student/narrative-report");
    return { success: true, data: report };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function submitNarrativeReportAction(studentId: string) {
  try {
    const report = await submitNarrativeReport(studentId);
    revalidatePath("/student/narrative-report");
    return { success: true, data: report };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
