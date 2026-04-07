import fs from "fs/promises";
import path from "path";
import { createRequire } from "module";

const WORD_SPLIT = /[^a-z0-9+.#\-]+/gi;
const require = createRequire(import.meta.url);

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/\bqa\b/g, "quality assurance")
    .replace(/\bsqa\b/g, "software quality assurance")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSkillName(input: string): string {
  return normalizeText(input)
    .replace(/react\.js/g, "react")
    .replace(/node\.js/g, "node")
    .replace(/quality-assurance/g, "quality assurance")
    .replace(/typescript/g, "typescript")
    .replace(/javascript/g, "javascript")
    .replace(/\bjs\b/g, "javascript")
    .replace(/\bts\b/g, "typescript");
}

async function readPdfText(fileBuffer: Buffer): Promise<string> {
  try {
    const pdfParseModule = require("pdf-parse") as {
      PDFParse: {
        new (options: { data: Uint8Array }): {
          getText: () => Promise<{ text: string }>;
          destroy: () => Promise<void>;
        };
      };
    };

    const parser = new pdfParseModule.PDFParse({ data: new Uint8Array(fileBuffer) });
    const parsed = await parser.getText();
    await parser.destroy();
    return parsed.text || "";
  } catch (error) {
    console.error("Failed to parse PDF resume text:", error);
    return "";
  }
}

export async function extractResumeTextFromPath(resumePath: string): Promise<string> {
  const absolutePath = path.join(process.cwd(), "public", resumePath.replace(/^\//, ""));
  let fileBuffer: Buffer;

  try {
    fileBuffer = await fs.readFile(absolutePath);
  } catch (error) {
    console.warn("Resume file is missing or unreadable:", absolutePath, error);
    return "";
  }

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
