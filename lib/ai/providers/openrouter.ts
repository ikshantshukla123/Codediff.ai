// lib/ai/providers/openrouter.ts

// 1. Define Types (So TypeScript is happy)
interface Bug {
  type: string;
  file?: string;
  line?: number;
  description: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
}

interface BugReport {
  bugs: Bug[];
}

export async function findBugsWithOpenRouter(diff: string): Promise<BugReport> {
  // Check if key exists
  if (!process.env.OPENROUTER_API_KEY) {
    console.error("❌ FATAL: OPENROUTER_API_KEY is missing");
    return { bugs: [] };
  }

  const PROMPT = `
  You are a Senior Fintech Security Auditor. Analyze this code diff for strict logical issues:
  1. 🚨 Race Conditions (Double spending risk)
  2. 🔓 Data Leaks (Logging unencrypted secrets/PII)
  3. ⚠️ SQL Injection / Insecure Endpoints

  IMPORTANT:
- Use the file path from diff headers (lines like: "diff --git a/... b/...")
- Always include "file" in each bug if possible.
- Line number should be the NEW file line number.

  Return a JSON object ONLY in this format:
  {
    "bugs": [
      { "type": "Race Condition","file": "src/payment-service.ts", "line": 42, "description": "Update without lock", "severity": "HIGH" }
    ]
  }
  `;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
 "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

        "X-Title": "CodeDiff AI"
      },
      body: JSON.stringify({
        // Use DeepSeek V3 (Cheap & Smart)
        model: "deepseek/deepseek-chat", 
        max_tokens: 1000, // Stops the "Insufficient Credits" error
        messages: [
          { role: "system", content: PROMPT },
          { role: "user", content: diff.substring(0, 15000) }
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("❌ OpenRouter Error:", data.error);
      return { bugs: [] };
    }

    if (!data.choices || data.choices.length === 0) {
      return { bugs: [] };
    }

    // Parse the JSON string from DeepSeek
    return JSON.parse(data.choices[0].message.content);
  } catch (err) {
    console.error("OpenRouter System Error:", err);
    return { bugs: [] };
  }
}