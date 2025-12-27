export async function findBugsWithDeepSeek(diff: string) {
  const PROMPT = `
  You are a Senior Fintech Security Auditor. Analyze this code diff for strict logical issues:
  1.  Race Conditions (Double spending risk)
  2. Precision Errors (Floating point math in money)
  3.  Data Leaks (Logging unencrypted secrets/PII)
  4. ⚠️ SQL Injection / Insecure Endpoints

  Return a JSON object ONLY:
  {
    "bugs": [
      { "type": "Race Condition", "line": 42, "description": "Update without lock", "severity": "HIGH" }
    ]
  }
  `;

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'system', content: PROMPT }, { role: 'user', content: diff.substring(0, 15000) }],
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (err) {
    console.error("DeepSeek Error:", err);
    return { bugs: [] };
  }
}