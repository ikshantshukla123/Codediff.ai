// lib/security/input-validator.ts

export class InputValidator {
  
  static validateCodeInput(code: string): { valid: boolean; error?: string; sanitized?: string } {
    // Size limits
    if (!code || typeof code !== 'string') {
      return { valid: false, error: 'Code input must be a non-empty string' };
    }

    if (code.length > 100000) { // 100KB limit
      return { valid: false, error: 'Code input too large (max 100KB)' };
    }

    // Security patterns to block
    const dangerousPatterns = [
      /eval\s*\(/gi,                    // eval() calls
      /Function\s*\(/gi,                // Function() constructor
      /process\.exit/gi,                // Process termination
      /require\s*\(\s*['"]child_process/gi, // Child process spawning
      /fs\.readFile|fs\.writeFile/gi,   // File system access
      /import\s*\(\s*['"][^'"]*\.\.\/\.\./gi, // Directory traversal
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        return { valid: false, error: 'Code contains potentially dangerous patterns' };
      }
    }

    // Sanitize but preserve structure for analysis
    const sanitized = code
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control chars
      .trim();

    return { valid: true, sanitized };
  }

  static validateRepositoryName(name: string): boolean {
    if (!name || typeof name !== 'string') return false;
    
    // GitHub repo format: owner/repo
    const repoPattern = /^[a-zA-Z0-9\-_.]{1,100}\/[a-zA-Z0-9\-_.]{1,100}$/;
    return repoPattern.test(name);
  }

  static validatePRNumber(prNumber: any): boolean {
    const num = parseInt(prNumber);
    return !isNaN(num) && num > 0 && num < 100000;
  }
}