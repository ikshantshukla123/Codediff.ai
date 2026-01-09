// lib/security/attack-simulator.ts
import { Parser } from 'node-sql-parser';

export class AttackSimulator {
  private parser = new Parser();

  async simulate(code: string) {
    // 1. Enhanced Regex to capture the query structure
    const sqlPatterns = [
      /["']\s*(SELECT|INSERT|UPDATE|DELETE)\s+.*?\s*["']/gi,
      /(SELECT|INSERT|UPDATE|DELETE).*?[\+&]\s*\w+/gi,
      /`(SELECT|INSERT|UPDATE|DELETE).*?\$\{.*?\}`/gi
    ];

    let detectedSQL = null;
    
    // Find the first matching SQL pattern
    for (const pattern of sqlPatterns) {
      const match = pattern.exec(code);
      if (match) {
        detectedSQL = match[0];
        break;
      }
    }

    if (!detectedSQL) return null;

    // Clean up the query string to get a base for injection
    const originalQuery = detectedSQL
      .replace(/['"]/g, '')       // Remove Javascript quotes
      .replace(/`/g, '')          // Remove template ticks
      .replace(/\$\{.*?\}/g, '1') // Replace template vars with a dummy number "1"
      .replace(/\s\+\s\w+/g, '')  // Remove concatenation vars like " + userId"
      .trim();

    // 2. THE "DOUBLE-TAP" STRATEGY
    // We try two different payloads. If one parses, it's vulnerable.
    const payloads = [
      { name: "String Injection", query: `${originalQuery} ' OR '1'='1` },
      { name: "Numeric Injection", query: `${originalQuery} OR 1=1` } // Note: No quotes, direct logic append
    ];

    for (const attack of payloads) {
      try {
        // Attempt to parse the injected query
        this.parser.astify(attack.query);
        
        // If we get here, the parser accepted our injected logic = VULNERABLE
        return {
          success: true,
          type: "SQL_INJECTION_PROOF",
          proof: {
            target: originalQuery,
            payload: attack.name === "Numeric Injection" ? "OR 1=1" : "' OR '1'='1",
            result_query: attack.query,
            impact: "Logic Bypass (Authentication Broken)"
          }
        };
      } catch (e) {
        // If syntax error, this specific payload didn't work. Try the next one.
        continue;
      }
    }

    return null; // Both attacks failed (Code might be safe or logic too complex)
  }
}