import Link from "next/link";
import { ArrowLeft, Shield, Calculator, Brain, Code, CheckCircle, AlertTriangle, Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-[#262626] bg-black/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="text-[#a1a1aa] hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-white text-black">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-[#a1a1aa]">Technical Documentation</span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white">How CodeDiff AI Works</h1>
            <p className="text-xl text-[#a1a1aa] max-w-3xl">
              Complete technical methodology behind our deterministic security analysis.
              No AI hallucinations, only mathematical proofs and real attack simulations.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">

        {/* Section 1: The Scoring Algorithm */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <Calculator className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold text-white">1. The Scoring Algorithm (The Math)</h2>
          </div>

          <Card className="bg-[#111111] border border-[#262626] p-8">
            <h3 className="text-xl font-semibold text-white mb-6">Deterministic Risk Calculation</h3>

            <div className="space-y-6">
              <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6">
                <h4 className="text-lg font-semibold text-green-400 mb-3">Base Formula</h4>
                <div className="font-mono text-sm text-[#a1a1aa] bg-black/50 p-4 rounded border border-[#262626]">
                  <div>riskScore = min(</div>
                  <div className="ml-4">(totalBugs × 10) +</div>
                  <div className="ml-4">(highSeverityBugs × 20),</div>
                  <div className="ml-4">100</div>
                  <div>)</div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
                  <div className="text-red-400 font-semibold">Score &gt; 70</div>
                  <div className="text-sm text-[#a1a1aa]">VULNERABLE</div>
                  <div className="text-xs text-red-300 mt-2">Critical security issues that require immediate attention</div>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
                  <div className="text-yellow-400 font-semibold">Score 40-70</div>
                  <div className="text-sm text-[#a1a1aa]">WARNING</div>
                  <div className="text-xs text-yellow-300 mt-2">Moderate risks that should be addressed</div>
                </div>
                <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                  <div className="text-green-400 font-semibold">Score &lt; 40</div>
                  <div className="text-sm text-[#a1a1aa]">SECURE</div>
                  <div className="text-xs text-green-300 mt-2">No significant security issues detected</div>
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6">
                <h4 className="text-lg font-semibold text-blue-400 mb-3">Attack Proof Override</h4>
                <p className="text-[#a1a1aa] mb-3">
                  If our Attack Simulator successfully proves a vulnerability (SQL injection, logic bypass, etc.),
                  the risk score is automatically set to <span className="text-red-400 font-semibold">100</span> regardless of the base calculation.
                </p>
                <div className="font-mono text-sm text-red-400 bg-black/50 p-3 rounded border border-red-700/30">
                  if (attackResult?.success) riskScore = 100;
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 2: Financial Risk Estimation */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">2. Financial Risk Estimation</h2>
          </div>

          <Card className="bg-[#111111] border border-[#262626] p-8">
            <h3 className="text-xl font-semibold text-white mb-6">PCI-DSS Compliance Fine Structure</h3>

            <div className="space-y-6">
              <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6">
                <h4 className="text-lg font-semibold text-red-400 mb-4">Regulatory Fine Ranges</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-red-900/20 border border-red-700/30 rounded">
                    <div>
                      <div className="font-semibold text-red-400">Extreme Risk (SQL Injection + Critical Vulns)</div>
                      <div className="text-sm text-[#a1a1aa]">PCI-DSS Level 1 Violations</div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 font-bold">$100K - $5M</div>
                      <div className="text-xs text-red-300">+ Fraud Risk: $1M - $50M</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-yellow-900/20 border border-yellow-700/30 rounded">
                    <div>
                      <div className="font-semibold text-yellow-400">High Risk (Race Conditions + High Severity)</div>
                      <div className="text-sm text-[#a1a1aa]">PCI-DSS Level 2-3 Violations</div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold">$50K - $1M</div>
                      <div className="text-xs text-yellow-300">+ Fraud Risk: $500K - $10M</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-blue-900/20 border border-blue-700/30 rounded">
                    <div>
                      <div className="font-semibold text-blue-400">Moderate Risk (Score &gt; 40)</div>
                      <div className="text-sm text-[#a1a1aa]">PCI-DSS Level 4 Violations</div>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-400 font-bold">$10K - $100K</div>
                      <div className="text-xs text-blue-300">+ Fraud Risk: $100K - $1M</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 3: Deterministic Engines */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <Brain className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">3. Deterministic Engines (No Hallucinations)</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* PCI Auditor */}
            <Card className="bg-[#111111] border border-[#262626] p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-white">PCI Auditor</h3>
              </div>

              <p className="text-[#a1a1aa] mb-4">
                Uses the <strong>Luhn Algorithm</strong> to mathematically verify credit card numbers.
                Zero false positives - only flags actual valid card numbers.
              </p>

              <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-green-400 mb-2">Luhn Check Implementation</h4>
                <div className="font-mono text-xs text-[#a1a1aa] space-y-1">
                  <div>function isLuhnValid(cardNumber) {'{'}</div>
                  <div className="ml-2">let sum = 0, shouldDouble = false;</div>
                  <div className="ml-2">for (let i = cardNumber.length - 1; i &gt;= 0; i--) {'{'}</div>
                  <div className="ml-4">let digit = parseInt(cardNumber[i]);</div>
                  <div className="ml-4">if (shouldDouble &amp;&amp; (digit *= 2) &gt; 9) digit -= 9;</div>
                  <div className="ml-4">sum += digit; shouldDouble = !shouldDouble;</div>
                  <div className="ml-2">{'}'}</div>
                  <div className="ml-2">return sum % 10 === 0;</div>
                  <div>{'}'}</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-[#a1a1aa]">Detects PCI-DSS Req 3.4 violations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-[#a1a1aa]">Mathematical verification (no guessing)</span>
                </div>
              </div>
            </Card>

            {/* Attack Simulator */}
            <Card className="bg-[#111111] border border-[#262626] p-6">
              <div className="flex items-center gap-3 mb-4">
                <Code className="w-5 h-5 text-red-400" />
                <h3 className="text-lg font-semibold text-white">Attack Simulator</h3>
              </div>

              <p className="text-[#a1a1aa] mb-4">
                Uses <strong>AST (Abstract Syntax Tree)</strong> parsing to inject SQL payloads safely.
                If the parser accepts our injection, the code is provably vulnerable.
              </p>

              <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-red-400 mb-2">Double-Tap Strategy</h4>
                <div className="font-mono text-xs text-[#a1a1aa] space-y-1">
                  <div>// Original: SELECT * FROM users WHERE id = ${'{'} userId {'}'}</div>
                  <div className="text-yellow-400">// Attack 1: "' OR '1'='1"</div>
                  <div className="text-red-400">// Result: SELECT * FROM users WHERE id = 1 OR '1'='1</div>
                  <div></div>
                  <div className="text-yellow-400">// Attack 2: "OR 1=1"</div>
                  <div className="text-red-400">// Result: SELECT * FROM users WHERE id = 1 OR 1=1</div>
                  <div></div>
                  <div className="text-green-400">// If AST parser accepts = VULNERABLE ✓</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-red-400" />
                  <span className="text-[#a1a1aa]">Real SQL injection testing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-red-400" />
                  <span className="text-[#a1a1aa]">Syntax-level vulnerability proof</span>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Section 4: Glossary */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">4. Glossary of Terms</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-[#111111] border border-[#262626] p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-3">Luhn Check</h3>
              <p className="text-[#a1a1aa] text-sm leading-relaxed">
                A mathematical algorithm used to validate credit card numbers. Created by IBM researcher Hans Luhn,
                it uses a checksum formula to verify that a sequence of digits is a valid payment card number,
                preventing false positives in credit card detection.
              </p>
            </Card>

            <Card className="bg-[#111111] border border-[#262626] p-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">AST Parsing</h3>
              <p className="text-[#a1a1aa] text-sm leading-relaxed">
                Abstract Syntax Tree parsing converts code into a structured tree representation,
                allowing us to analyze and modify SQL queries programmatically. We use this to test
                if our injection payloads create valid SQL syntax, proving vulnerability existence.
              </p>
            </Card>

            <Card className="bg-[#111111] border border-[#262626] p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-3">SQL Injection</h3>
              <p className="text-[#a1a1aa] text-sm leading-relaxed">
                A code injection technique where malicious SQL statements are inserted into application entry points.
                Our simulator tests for this by injecting payloads like "' OR '1'='1" to bypass authentication logic
                and gain unauthorized database access.
              </p>
            </Card>

            <Card className="bg-[#111111] border border-[#262626] p-6">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3">PCI-DSS</h3>
              <p className="text-[#a1a1aa] text-sm leading-relaxed">
                Payment Card Industry Data Security Standard - a comprehensive set of security requirements
                for organizations that handle credit card data. Violations can result in fines ranging from
                $10K to $5M+ depending on the merchant level and severity of non-compliance.
              </p>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12">
          <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-700/30 p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Secure Your Codebase?</h3>
            <p className="text-[#a1a1aa] mb-6 max-w-2xl mx-auto">
              Our deterministic approach provides mathematical certainty, not AI guesswork.
              Get proven vulnerability detection with zero false positives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-in">
                <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Get Started Free
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="border border-[#262626] text-white px-6 py-3 rounded-lg font-semibold hover:border-[#404040] transition-colors">
                  View Dashboard
                </button>
              </Link>
            </div>
          </Card>
        </section>

      </div>
    </div>
  );
}