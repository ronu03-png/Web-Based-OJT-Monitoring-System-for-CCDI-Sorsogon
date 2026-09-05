"use client";

import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import PdfDownloadButton from "@/components/shared/pdf-download-button";

const RATINGS = [1, 2, 3, 4, 5];

const wpItems = [
  { label: "Quality of Work", score: 4 },
  { label: "Productivity / Efficiency", score: 4 },
  { label: "Accuracy & Attention to Detail", score: 5 },
  { label: "Ability to Follow Instructions", score: 4 },
  { label: "Ability to Work Independently", score: 3 },
];

const ksItems = [
  { label: "Understanding of Tasks", score: 4 },
  { label: "Technical Skills", score: 4 },
  { label: "Problem-Solving Skills", score: 4 },
  { label: "Ability to Learn & Apply Feedback", score: 5 },
];

const waItems = [
  { label: "Punctuality & Attendance", score: 5 },
  { label: "Initiative", score: 4 },
  { label: "Responsibility & Dependability", score: 5 },
  { label: "Professional Behavior", score: 4 },
];

const ctItems = [
  { label: "Communication Skills", score: 4 },
  { label: "Teamwork & Collaboration", score: 4 },
  { label: "Customer/Client Interaction (if applicable)", score: 4 },
];

const wpScore = 33.6;
const ksScore = 22.5;
const waScore = 18.4;
const ctScore = 12.0;
const totalScore = 86.5;

function Section({
  title,
  maxScore,
  weight,
  items,
}: {
  title: string;
  maxScore: number;
  weight: string;
  items: { label: string; score: number }[];
}) {
  const subtotal = items.reduce((a, b) => a + b.score, 0);
  const weighted = ((subtotal / (items.length * 5)) * parseInt(weight)).toFixed(2);

  return (
    <div className="mb-4">
      <h3 className="mb-1 text-[9px] font-bold uppercase leading-tight sm:text-[10px]">
        {title}
      </h3>
      <table className="w-full border-collapse border border-black text-[8px] sm:text-[9px]">
        <thead>
          <tr className="border-b border-black">
            <th className="border-r border-black px-1 py-0.5 text-left font-semibold sm:px-1.5 sm:py-1">Criteria</th>
            {RATINGS.map((n) => (
              <th key={n} className="w-5 border-r border-black py-0.5 text-center font-semibold sm:w-6 sm:py-1">{n}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="border-b border-black">
              <td className="border-r border-black px-1 py-0.5 sm:px-1.5 sm:py-1">{item.label}</td>
              {RATINGS.map((n) => (
                <td key={n} className="border-r border-black py-0.5 text-center sm:py-1">
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
          <span className="inline-block min-w-[24px] border-b border-black text-center">{subtotal}</span>
          <span>/ {maxScore}*100</span>
        </div>
        <div className="mt-0.5 flex items-end gap-1">
          <span className="whitespace-nowrap">Weighted Score (x {weight}%):</span>
          <span className="inline-block min-w-[32px] border-b border-black text-center">{weighted}</span>
        </div>
      </div>
    </div>
  );
}

export default function EvaluationDemoPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-lg font-semibold">OJT Evaluation Form - Demo</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <PdfDownloadButton
            targetId="evaluation-demo"
            filename="OJT_Evaluation_Demo.pdf"
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

      {/* Paper */}
      <div id="evaluation-demo" className="mx-auto max-w-[900px] border bg-white p-6 shadow-sm print:border-0 print:p-0 print:shadow-none">
        {/* Title */}
        <div className="mb-3 text-center">
          <img
            src="/assets/ccdi-logo.png"
            alt="CCDI Logo"
            className="mx-auto mb-1 h-16 w-auto"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <h1 className="text-[11px] font-bold uppercase leading-tight sm:text-xs">
            On-The-Job Trainee (OJT) Evaluation Form
          </h1>
          <p className="text-[9px] text-muted-foreground sm:text-[10px]">Computer Communication Development Institute &middot; Rizal St., Sorsogon City</p>
        </div>

        {/* Two-column layout with vertical divider */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:divide-x sm:divide-black">
          {/* LEFT COLUMN */}
          <div className="sm:pr-4">
            {/* Trainee Info */}
            <div className="mb-4 space-y-1 text-[9px] sm:text-[10px]">
              <div className="flex items-end gap-1">
                <span className="whitespace-nowrap">Trainee Name:</span>
                <span className="flex-1 border-b border-black pb-0.5 text-center font-medium">Jose Rizal Bonifacio</span>
              </div>
              <div className="flex items-end gap-1">
                <span className="whitespace-nowrap">Department:</span>
                <span className="flex-1 border-b border-black pb-0.5 text-center font-medium">IT Department</span>
              </div>
              <div className="flex items-end gap-1">
                <span className="whitespace-nowrap">Training Period:</span>
                <span className="flex-1 border-b border-black pb-0.5 text-center font-medium">July 6 - Oct 5, 2026</span>
              </div>
              <div className="flex items-end gap-1">
                <span className="whitespace-nowrap">Supervisor/Evaluator:</span>
                <span className="flex-1 border-b border-black pb-0.5 text-center font-medium">Engr. Maria Santos</span>
              </div>
              <div className="flex items-end gap-1">
                <span className="whitespace-nowrap">Evaluation Date:</span>
                <span className="flex-1 border-b border-black pb-0.5 text-center font-medium">Oct 5, 2026</span>
              </div>
            </div>

            {/* Rating Scale */}
            <div className="mb-4 text-[9px] sm:text-[10px]">
              <p className="font-bold">Rating Scale</p>
              <p className="font-semibold">Rating Description</p>
              <div className="mt-1 space-y-0.5">
                <div><strong>5</strong> Excellent – Consistently exceeds expectations</div>
                <div><strong>4</strong> Very Good – Frequently exceeds expectations</div>
                <div><strong>3</strong> Good – Meets expectations</div>
                <div><strong>2</strong> Fair – Sometimes meets expectations</div>
                <div><strong>1</strong> Poor – Does not meet expectations</div>
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
              <h3 className="mb-1 text-[9px] font-bold uppercase sm:text-[10px]">V. Overall Computation</h3>
              <table className="w-full border-collapse border border-black text-[8px] sm:text-[9px]">
                <thead>
                  <tr className="border-b border-black">
                    <th className="border-r border-black px-1 py-0.5 text-left font-semibold sm:px-1.5 sm:py-1">Category</th>
                    <th className="px-1 py-0.5 text-right font-semibold sm:px-1.5 sm:py-1">Weighted Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-black">
                    <td className="border-r border-black px-1 py-0.5 sm:px-1.5 sm:py-1">Work Performance</td>
                    <td className="px-1 py-0.5 text-right sm:px-1.5 sm:py-1">{wpScore.toFixed(1)}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-r border-black px-1 py-0.5 sm:px-1.5 sm:py-1">Knowledge & Skills</td>
                    <td className="px-1 py-0.5 text-right sm:px-1.5 sm:py-1">{ksScore.toFixed(1)}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-r border-black px-1 py-0.5 sm:px-1.5 sm:py-1">Work Attitude & Professionalism</td>
                    <td className="px-1 py-0.5 text-right sm:px-1.5 sm:py-1">{waScore.toFixed(1)}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-r border-black px-1 py-0.5 sm:px-1.5 sm:py-1">Communication & Teamwork</td>
                    <td className="px-1 py-0.5 text-right sm:px-1.5 sm:py-1">{ctScore.toFixed(1)}</td>
                  </tr>
                  <tr className="font-bold">
                    <td className="border-r border-black px-1 py-0.5 sm:px-1.5 sm:py-1">TOTAL SCORE</td>
                    <td className="px-1 py-0.5 text-right sm:px-1.5 sm:py-1">{totalScore.toFixed(1)} / 100</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Comments */}
            <div className="mb-4">
              <h3 className="mb-1 text-[9px] font-bold uppercase sm:text-[10px]">VI. Comment / Recommendation</h3>
              <div className="space-y-1 text-[8px] leading-snug sm:text-[9px]">
                <p className="border-b border-black pb-1">The trainee has shown excellent performance throughout the OJT period.</p>
                <p className="border-b border-black pb-1">Demonstrated strong technical skills, particularly in network troubleshooting and software configuration.</p>
                <p className="border-b border-black pb-1">Always punctual and shows great initiative in taking on new tasks.</p>
                <p className="border-b border-black pb-1">Recommended for completion of the OJT program.</p>
                <p className="border-b border-black pb-1">Areas for improvement: Could be more confident when working independently on complex tasks.</p>
              </div>
            </div>

            {/* Signature */}
            <div className="mt-6 text-[9px] sm:text-[10px]">
              <div className="mb-3 flex items-end gap-1">
                <span className="whitespace-nowrap">Evaluator&apos;s Signature:</span>
                <span className="flex-1 border-b border-black pb-0.5 text-center font-medium">Engr. Maria Santos</span>
              </div>
              <div className="flex items-end gap-1">
                <span className="whitespace-nowrap">Date:</span>
                <span className="flex-1 border-b border-black pb-0.5 text-center font-medium">Oct 5, 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
