import { InternshipCategory } from "@prisma/client";

type ResumeAnalysis = {
  skills: string[];
  targetTrack: InternshipCategory | null;
  targetRole: string | null;
  confidence: number;
  summary: string | null;
};

const DEFAULT_BASE_URL = (
  process.env.GEMINI_BASE_URL ||
  process.env.EXTERNAL_AI_BASE_URL ||
  "https://generativelanguage.googleapis.com/v1beta"
).replace(/\/+$/, "");
const DEFAULT_MODEL = process.env.GEMINI_MODEL || process.env.EXTERNAL_AI_MODEL || "gemini-2.0-flash";

function isGeminiProvider(baseUrl: string, model: string): boolean {
  return baseUrl.includes("googleapis.com") || /^gemini/i.test(model);
}

async function analyzeWithGemini(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch(
    `${DEFAULT_BASE_URL}/models/${encodeURIComponent(DEFAULT_MODEL)}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: "Return strict JSON only." }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const parts = payload?.candidates?.[0]?.content?.parts;
  const content = Array.isArray(parts)
    ? parts
        .map((part: { text?: unknown }) => (typeof part?.text === "string" ? part.text : ""))
        .join("")
        .trim()
    : "";

  if (!content) {
    throw new Error("Gemini response did not include message content");
  }

  return content;
}

async function analyzeWithOpenAI(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch(`${DEFAULT_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      temperature: 0,
      messages: [
        { role: "system", content: "Return strict JSON only." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("OpenAI response did not include message content");
  }

  return content;
}

function normalizeCatalogSkills(skillNames: string[]): string[] {
  return Array.from(
    new Set(
      skillNames
        .map((skill) => skill.trim())
        .filter(Boolean)
    )
  );
}

function extractJsonBlock(text: string): string {
  const fencedMatch = text.match(/```json\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return text.slice(start, end + 1).trim();
  }

  return text.trim();
}

function parseTrack(value: unknown): InternshipCategory | null {
  if (value === "COMPUTING" || value === "BUSINESS" || value === "ENGINEERING") {
    return value;
  }

  return null;
}

export async function analyzeResumeWithExternalApi(
  resumeText: string,
  catalogSkills: string[]
): Promise<ResumeAnalysis | null> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.EXTERNAL_AI_API_KEY;
  if (!apiKey || !resumeText.trim()) {
    return null;
  }

  const skills = normalizeCatalogSkills(catalogSkills).slice(0, 200);
  const prompt = [
    "You are analyzing a student CV for internship matching.",
    "Return only JSON with these keys: skills, targetTrack, targetRole, confidence, summary.",
    "skills must be an array of exact skill names selected only from the provided catalogSkills list.",
    "targetTrack must be one of COMPUTING, BUSINESS, ENGINEERING, or null.",
    "targetRole should be a short role label such as Frontend Developer or Full Stack Developer.",
    "confidence must be a number from 0 to 100.",
    "summary must be a short one-sentence explanation.",
    "Do not invent skills that are not in catalogSkills.",
    "catalogSkills:",
    skills.join(", "),
    "resumeText:",
    resumeText.slice(0, 12000),
  ].join("\n");

  try {
    const content = isGeminiProvider(DEFAULT_BASE_URL, DEFAULT_MODEL)
      ? await analyzeWithGemini(apiKey, prompt)
      : await analyzeWithOpenAI(apiKey, prompt);

    const parsed = JSON.parse(extractJsonBlock(content));
    const extractedSkills = Array.isArray(parsed.skills)
      ? parsed.skills
          .map((skill: unknown) => (typeof skill === "string" ? skill.trim() : ""))
          .filter((skill: string) => skill && skills.includes(skill))
      : [];

    return {
      skills: extractedSkills,
      targetTrack: parseTrack(parsed.targetTrack),
      targetRole: typeof parsed.targetRole === "string" ? parsed.targetRole.trim() || null : null,
      confidence:
        typeof parsed.confidence === "number"
          ? Math.max(0, Math.min(100, parsed.confidence))
          : 0,
      summary: typeof parsed.summary === "string" ? parsed.summary.trim() || null : null,
    };
  } catch (error) {
    console.error("External CV analysis failed:", error);
    return null;
  }
}