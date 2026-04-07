import path from "path";
import { spawn } from "child_process";

type PythonJobInput = {
  id: string;
  title: string;
  description: string;
  responsibilities: string | null;
  keyRequirements: string | null;
  techStack: string | null;
  requiredSkills: string[];
  optionalSkills: string[];
};

type PythonRequestPayload = {
  resume_text: string;
  resume_skills: string[];
  jobs: PythonJobInput[];
};

type PythonScoreRow = {
  id: string;
  pythonScore: number;
  confidence: number;
  reason: string;
};

type PythonResponsePayload = {
  scores: PythonScoreRow[];
  model?: string;
  resumeRole?: string | null;
  error?: string;
};

export async function runPythonCvJobRanker(
  payload: PythonRequestPayload,
  timeoutMs = 12000
): Promise<PythonResponsePayload | null> {
  const scriptPath = path.join(process.cwd(), "server", "ml", "python", "cv_job_ranker.py");
  const pythonCommands = process.platform === "win32" ? ["python", "py"] : ["python3", "python"];

  for (const command of pythonCommands) {
    const response = await tryRunPython(command, scriptPath, payload, timeoutMs);
    if (response) {
      return response;
    }
  }

  return null;
}

async function tryRunPython(
  command: string,
  scriptPath: string,
  payload: PythonRequestPayload,
  timeoutMs: number
): Promise<PythonResponsePayload | null> {
  return new Promise((resolve) => {
    const args = command === "py" ? ["-3", scriptPath] : [scriptPath];
    const child = spawn(command, args, {
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";
    let settled = false;

    const finish = (result: PythonResponsePayload | null) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    const timer = setTimeout(() => {
      child.kill();
      finish(null);
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", () => {
      clearTimeout(timer);
      finish(null);
    });

    child.on("close", (code) => {
      clearTimeout(timer);

      if (code !== 0 && !stdout.trim()) {
        if (stderr.trim()) {
          console.warn("Python ranker failed:", stderr.trim());
        }
        finish(null);
        return;
      }

      try {
        const parsed = JSON.parse(stdout) as PythonResponsePayload;
        if (!parsed || !Array.isArray(parsed.scores)) {
          finish(null);
          return;
        }
        finish(parsed);
      } catch {
        finish(null);
      }
    });

    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });
}
