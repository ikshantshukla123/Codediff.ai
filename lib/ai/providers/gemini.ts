import { GoogleGenAI } from "@google/genai";

// 1. Types
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

// 2. The Bug Hunter (No changes here, this works)
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
                  { "type": "Data Leak", "line": 15, "description": "Logging Credit Card CVV", "severity": "HIGH" }
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

// 3. The Impact Analyzer (THIS IS THE UPGRADE)
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
              You are a Chief Risk Officer (CRO) at a major Fintech bank.
              You are writing a blocking review for a Pull Request.

              **INPUT DATA:**
              - Bugs Found: ${JSON.stringify(bugs)}
              - Code Context: ${diffContext.substring(0, 5000)}

              **REQUIRED OUTPUT FORMAT (Markdown):**
              
              # 🛡️ CodeDiff Security Audit
              > **Status:** [Pass/Fail]
              > **Risk Score:** [0-100]/100

              ## 💰 Financial Exposure Calculation
              *(Calculate specific potential losses based on the bug type. Be concrete.)*
              * **Regulatory Fines:** [Estimate GDPR/PCI fines, e.g., "$50,000 per violation"]
              * **Potential Fraud Loss:** [Estimate based on race conditions, e.g., "Unlimited double-spend risk"]
              * **Total Liability:** [Sum it up]

              ## 🔍 Technical Findings
              | Severity | Bug Type | File/Line | Remediation |
              |----------|----------|-----------|-------------|
              | [High/Med] | [Name] | [Line #] | [Specific fix, e.g. "Use atomic transactions"] |

              ## 🚦 Executive Recommendation
              [Clear 2-sentence summary. If failed, explicitly state "DO NOT MERGE".]

              **TONE:** Clinical, Professional, Serious. No shouting caps. Use numbers.
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