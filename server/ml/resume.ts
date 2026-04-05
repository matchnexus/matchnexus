import fs from "fs/promises";
import path from "path";

const WORD_SPLIT = /[^a-z0-9+.#\-]+/gi;

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSkillName(input: string): string {
  return normalizeText(input)
    .replace(/react\.js/g, "react")
    .replace(/node\.js/g, "node")
    .replace(/typescript/g, "typescript")
    .replace(/javascript/g, "javascript")
    .replace(/\bjs\b/g, "javascript")
    .replace(/\bts\b/g, "typescript");
}

async function readPdfText(fileBuffer: Buffer): Promise<string> {
  const pdfParseModule = await import("pdf-parse");
  const pdfParse = (pdfParseModule as unknown as {
    default?: (buffer: Buffer) => Promise<{ text: string }>;
  }).default ?? (pdfParseModule as unknown as (buffer: Buffer) => Promise<{ text: string }>);
  const parsed = await pdfParse(fileBuffer);
  return parsed.text || "";
}

export async function extractResumeTextFromPath(resumePath: string): Promise<string> {
  const absolutePath = path.join(process.cwd(), "public", resumePath.replace(/^\//, ""));
  const fileBuffer = await fs.readFile(absolutePath);
  const extension = path.extname(absolutePath).toLowerCase();

  if (extension === ".pdf") {
    return readPdfText(fileBuffer);
  }

  if (extension === ".txt" || extension === ".md") {
    return fileBuffer.toString("utf8");
  }

  return fileBuffer.toString("utf8");
}

export function extractSkillsFromResumeText(
  resumeText: string,
  skillNames: string[]
): string[] {
  const normalizedText = normalizeText(resumeText);
  const compactText = normalizedText.replace(WORD_SPLIT, " ");
  const skills: string[] = [];
  const seen = new Set<string>();

  for (const skillName of skillNames) {
    const normalizedSkill = normalizeSkillName(skillName);
    if (!normalizedSkill || seen.has(normalizedSkill)) {
      continue;
    }

    const pattern = new RegExp(
      `(^|[^a-z0-9+.#-])${normalizedSkill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9+.#-]|$)`
    );
    const exactMatch = pattern.test(normalizedText);
    const compactMatch = compactText.includes(normalizedSkill.replace(/\s+/g, " "));

    if (exactMatch || compactMatch) {
      seen.add(normalizedSkill);
      skills.push(skillName);
    }
  }

  return skills;
}
