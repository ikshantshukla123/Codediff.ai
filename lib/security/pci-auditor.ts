// lib/security/pci-auditor.ts

function isLuhnValid(cardNumber: string): boolean {
  let sum = 0;
  let shouldDouble = false;
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i));
    if (shouldDouble) {
      if ((digit *= 2) > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export class PCIAuditor {
  async audit(code: string) {
    const violations = [];

    // 1. Detect Real Credit Card Numbers (PCI Req 3.4)
    const potentialCards = code.match(/\b(?:\d[ -]*?){13,16}\b/g) || [];
    for (const card of potentialCards) {
      const cleanCard = card.replace(/\D/g, '');
      // Only flag if it passes the mathematical "Luhn Check" (Proof it's real)
      if (cleanCard.length >= 13 && isLuhnValid(cleanCard)) {
        violations.push({
          type: "PCI_COMPLIANCE_FAIL",
          severity: "HIGH" as const,
          title: "Unencrypted PAN Data",
          description: `Hardcoded valid credit card detected (ends in ${cleanCard.slice(-4)}). Violates PCI-DSS Req 3.4.`,
          file: "unknown",
          line: 0,
          recommendation: "Remove hardcoded credit card numbers and implement secure tokenization",
          fineRisk: 50000
        });
      }
    }

    // 2. Detect Sensitive Logging (PCI Req 3.2)
    const sensitiveKeywords = ['cvv', 'pan', 'track2', 'pin', 'password', 'secret'];
    const logPattern = new RegExp(`console\\.(log|info|error|warn)\\s*\\(.*?(${sensitiveKeywords.join('|')}).*?\\)`, 'gi');

    let match;
    while ((match = logPattern.exec(code)) !== null) {
      violations.push({
        type: "PCI_LOGGING_FAIL",
        severity: "HIGH" as const,
        title: "Sensitive Data Logging",
        description: `Logging sensitive variable '${match[2]}' is strictly prohibited by PCI-DSS Req 3.2.`,
        file: "unknown",
        line: 0,
        recommendation: "Remove sensitive data from log statements and use secure logging practices",
        fineRisk: 25000
      });
    }

    return violations;
  }
}