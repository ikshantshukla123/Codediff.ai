import { GoogleGenAI } from "@google/genai";

// 1. Define the Shape of our Data (The "Contract")
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

// 2. The Bug Hunter
export async function findBugsWithGemini(diff: string): Promise<BugReport> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
              You are a Senior Fintech Security Auditor. Analyze this code diff for strict logical issues:
              1. 🚨 Race Conditions (Double spending risk)
              2. 🔓 Data Leaks (Logging unencrypted secrets/PII)
              3. ⚠️ SQL Injection / Insecure Endpoints

              Return a JSON object ONLY in this format:
              {
                "bugs": [
                  { "type": "Race Condition", "line": 42, "description": "Update without lock", "severity": "HIGH" }
                ]
              }
              
              Code Diff:
              ${diff.substring(0, 20000)}
              `
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text || '{"bugs": []}';
    return JSON.parse(responseText);
  } catch (err) {
    console.error("❌ Gemini Bug Hunter Error:", err);
    return { bugs: [] };
  }
}

// 3. The Impact Analyzer (CFO View)
// 🚨 CHANGE: Replaced 'any' with 'BugReport'
export async function explainImpactWithGemini(bugs: BugReport, diffContext: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
              You are a CTO summarizing a technical audit.
              Bugs Found: ${JSON.stringify(bugs)}
              
              Generate a markdown report explaining:
              1. 💰 Financial Risk ($ Estimate)
              2. 🛑 Operational Impact
              3. 🚦 Go/No-Go Recommendation
              
              Use emojis. Keep it short.
              `
            }
          ]
        }
      ]
    });

    return response.text || "⚠️ **Analysis Failed**";
  } catch (err) {
    console.error("❌ Gemini Impact Error:", err);
    return "⚠️ **Analysis Failed** (AI Service Error)";
  }
}