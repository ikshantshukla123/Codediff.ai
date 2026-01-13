import { GoogleGenAI } from "@google/genai";

interface Bug {
  type: string;
  line?: number;
  description: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
}

interface BugReport {
  bugs: Bug[];
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function explainImpactWithGemini(
  bugs: BugReport,
  diffContext: string
): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are a FinTech Security Reviewer writing a SHORT GitHub PR comment.

INPUT:
- Bugs: ${JSON.stringify(bugs)}
- Code Context: ${diffContext.substring(0, 2500)}

RULES:
- Keep it SHORT (max 12 lines)
- Output ONLY Markdown
- Use ONLY ONE table (max 3 issues)
- No long paragraphs, no extra sections
- Keep financial exposure as ONE line only

FORMAT (exactly like this):

## 🛡️ CodeDiff PR Security Summary
**Status:** [PASS/FAIL] | **Risk:** [0-100]/100  
**Estimated Exposure:** ~$[number]

| Sev | Issue | Line | Fix |
|-----|------|------|-----|
| HIGH | ... | ... | ... |

**Recommendation:** [1 short line, e.g. "DO NOT MERGE until fixed."]

              `,
            },
          ],
        },
      ],
    });

    return response.text || "⚠️ Summary Failed";
  } catch (err) {
    console.error("❌ Gemini Impact Error:", err);
    return "⚠️ Summary Failed (AI Error)";
  }
}
