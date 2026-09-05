"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";

interface PdfDownloadButtonProps {
  targetId: string;
  filename: string;
  pageSize?: "a4" | "letter";
  orientation?: "portrait" | "landscape";
  label?: string;
}

export default function PdfDownloadButton({
  targetId,
  filename,
  pageSize = "a4",
  orientation = "portrait",
  label = "Download PDF",
}: PdfDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDownload() {
    const element = document.getElementById(targetId);
    if (!element) return;

    setIsLoading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation,
        unit: "mm",
        format: pageSize,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
      const imgX = (pageWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(filename);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try using the Print button and Save as PDF instead.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Download className="mr-1 h-4 w-4" />}
      {isLoading ? "Generating..." : label}
    </Button>
  );
}
