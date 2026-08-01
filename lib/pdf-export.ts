// lib/pdf-export.ts
import jsPDF from "jspdf";

interface ConsultationEntry {
    agent: string;
    title: string;
    description: string;
    date: string;
}

export function markdownToPlainText(md: string): string {
    return md
        .replace(/^#{1,6}\s*/gm, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/`{1,3}([^`]*)`{1,3}/g, "$1")
        .replace(/^\s*[-*+]\s+/gm, "• ")
        .replace(/\|/g, "   ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

const TEAL: [number, number, number] = [10, 191, 174];
const INDIGO: [number, number, number] = [99, 91, 241];
const INK: [number, number, number] = [24, 28, 38];
const MUTED: [number, number, number] = [110, 118, 132];

function drawGradientBanner(doc: jsPDF, pageWidth: number, height: number) {
    const bands = 60;
    const bandWidth = pageWidth / bands;
    for (let i = 0; i < bands; i++) {
        const t = i / (bands - 1);
        const r = Math.round(TEAL[0] + t * (INDIGO[0] - TEAL[0]));
        const g = Math.round(TEAL[1] + t * (INDIGO[1] - TEAL[1]));
        const b = Math.round(TEAL[2] + t * (INDIGO[2] - TEAL[2]));
        doc.setFillColor(r, g, b);
        doc.rect(bandWidth * i, 0, bandWidth + 0.5, height, "F");
    }
}

function ensureSpace(doc: jsPDF, y: number, needed: number, pageHeight: number): number {
    if (y + needed > pageHeight - 70) {
        doc.addPage();
        return 56;
    }
    return y;
}

export function generateSummaryPDF(summaryMarkdown: string, history: ConsultationEntry[]) {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 48;
    const contentWidth = pageWidth - margin * 2;

    drawGradientBanner(doc, pageWidth, 118);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("MedAgent AI", margin, 52);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Your Autonomous Multi-Agent Healthcare Assistant", margin, 72);

    const dateStr = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    doc.setFontSize(10);
    doc.text(`Health Summary Report  ·  Generated ${dateStr}`, margin, 96);

    let y = 150;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...TEAL);
    doc.text("Consultation Log", margin, y);
    y += 8;
    doc.setDrawColor(...TEAL);
    doc.setLineWidth(1.4);
    doc.line(margin, y, margin + 90, y);
    y += 22;

    history.forEach((entry) => {
        y = ensureSpace(doc, y, 70, pageHeight);

        const boxTop = y - 14;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...TEAL);
        doc.text(entry.agent.toUpperCase(), margin + 12, y);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...INK);
        doc.text(entry.title, margin + 12, y + 15);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(...MUTED);
        const descLines = doc.splitTextToSize(entry.description, contentWidth - 24);
        doc.text(descLines, margin + 12, y + 30);

        const boxHeight = 46 + (descLines.length - 1) * 12;
        doc.setDrawColor(228, 231, 236);
        doc.setLineWidth(0.75);
        doc.roundedRect(margin, boxTop, contentWidth, boxHeight, 6, 6);

        doc.setFontSize(8.5);
        doc.setTextColor(...MUTED);
        doc.text(entry.date, margin + contentWidth - 12, boxTop + boxHeight - 10, { align: "right" });

        y = boxTop + boxHeight + 14;
    });

    y = ensureSpace(doc, y, 60, pageHeight);
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...INDIGO);
    doc.text("Summary & Recommendations", margin, y);
    y += 8;
    doc.setDrawColor(...INDIGO);
    doc.setLineWidth(1.4);
    doc.line(margin, y, margin + 170, y);
    y += 24;

    const plainText = markdownToPlainText(summaryMarkdown);
    const paragraphs = plainText.split(/\n{2,}/);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...INK);

    paragraphs.forEach((para) => {
        const isBullet = para.trim().startsWith("•");
        const isHeading = para.trim().length < 60 && /^[A-Z][a-zA-Z\s&]+:?$/.test(para.trim()) && !isBullet;

        if (isHeading) {
            y = ensureSpace(doc, y, 24, pageHeight);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11.5);
            doc.setTextColor(...TEAL);
            doc.text(para.trim(), margin, y);
            y += 18;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10.5);
            doc.setTextColor(...INK);
            return;
        }

        const lines = doc.splitTextToSize(para, contentWidth);
        lines.forEach((line: string) => {
            y = ensureSpace(doc, y, 16, pageHeight);
            doc.text(line, margin, y);
            y += 15;
        });
        y += 8;
    });

    const totalPages = (doc.internal as any).getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setDrawColor(225, 228, 233);
        doc.setLineWidth(0.75);
        doc.line(margin, pageHeight - 54, pageWidth - margin, pageHeight - 54);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...MUTED);
        doc.text(
            "Generated by MedAgent AI. This is an AI-generated summary, not a medical diagnosis — please consult a licensed doctor.",
            margin,
            pageHeight - 38,
            { maxWidth: pageWidth - margin * 2 }
        );
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 38, { align: "right" });
    }

    doc.save(`medagent-health-summary-${new Date().toISOString().slice(0, 10)}.pdf`);
}

function extractOverview(plainText: string): string {
    const paragraphs = plainText.split(/\n{2,}/).map((p) => p.trim());
    const overview = paragraphs.find(
        (p) =>
            p.length > 60 &&
            !p.toLowerCase().startsWith("top concern") &&
            !p.toLowerCase().startsWith("recommendation")
    );
    return overview || paragraphs[0] || "";
}

function extractBullets(plainText: string, headingKeyword: string, limit = 4): string[] {
    const lines = plainText.split("\n").map((l) => l.trim());
    const startIdx = lines.findIndex((l) => l.toLowerCase().startsWith(headingKeyword));
    if (startIdx === -1) return [];

    const bullets: string[] = [];
    for (let i = startIdx + 1; i < lines.length && bullets.length < limit; i++) {
        const line = lines[i];
        if (!line) continue;
        if (line.startsWith("•") || /^\d+\.\s/.test(line)) {
            bullets.push(line.replace(/^•\s*/, "").replace(/^\d+\.\s*/, ""));
        } else if (bullets.length > 0) {
            break;
        }
    }
    return bullets;
}

// Turns a report-style overview paragraph into something that reads like a
// person actually typing a message, not a pasted summary block.
function humanizeOverview(overview: string): string {
    let text = overview.trim();

    text = text
        .replace(/^Over the past couple of weeks,?\s*/i, "Over the last couple of weeks, ")
        .replace(/\byou've\b/gi, "I've")
        .replace(/\byou have\b/gi, "I have")
        .replace(/\byour\b/gi, "my")
        .replace(/\byou\b/gi, "I")
        .replace(/\bIt seems I've been\b/gi, "I've been")
        .replace(/\s+/g, " ")
        .trim();

    return text;
}

function humanizeBullet(bullet: string): string {
    let text = bullet.trim();
    text = text.replace(/^([A-Za-z ]+):\s*/, ""); // drop "Label:" prefixes like "Discuss blood panel results:"
    text = text.replace(/\byour\b/gi, "my").replace(/\byou\b/gi, "I");
    if (text.length > 0) {
        text = text.charAt(0).toLowerCase() + text.slice(1);
    }
    return text;
}

export function shareSummaryOnWhatsApp(summaryMarkdown: string) {
    const plainText = markdownToPlainText(summaryMarkdown);
    const overview = humanizeOverview(extractOverview(plainText));
    const concerns = extractBullets(plainText, "top concern", 4).map(humanizeBullet);
    const recommendations = extractBullets(plainText, "recommendation", 3).map(humanizeBullet);

    let message = `Hey, sharing my health summary from MedAgent AI 🩺\n\n${overview}`;

    if (concerns.length > 0) {
        message += `\n\nThings that stood out:\n${concerns.map((c) => `- ${c}`).join("\n")}`;
    }

    if (recommendations.length > 0) {
        message += `\n\nWhat I still need to do:\n${recommendations.map((r) => `- ${r}`).join("\n")}`;
    }

    message += `\n\n(Got the full PDF report too, happy to send it over if you want.)\nJust a heads up — this is an AI-generated summary, not an actual diagnosis, so I'll confirm everything with my doctor 🙏`;

    const trimmed = message.length > 1500 ? `${message.slice(0, 1480)}...` : message;
    const encoded = encodeURIComponent(trimmed);
    window.open(`https://wa.me/?text=${encoded}`, "_blank", "noopener,noreferrer");
}