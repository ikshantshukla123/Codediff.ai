import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Shield,
  AlertTriangle,
  Zap,
  TrendingUp,
  Code,
  DollarSign,
  Lock,
  Brain,
  GitBranch,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Hero Section */}
      <section className="relative border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#262626] bg-[#111111] text-sm text-[#a1a1aa] mb-4">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Fintech Security Auditor</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
              Don&apos;t Just Find Bugs.
              <br />
              <span className="text-[#a1a1aa]">Prove Vulnerabilities.</span>
              <br />
              <span className="text-white">Predict Breaks.</span>
              <br />
              <span className="text-white">Calculate Loss.</span>
            </h1>

            <p className="text-xl text-[#a1a1aa] max-w-2xl mx-auto leading-relaxed">
              CodeDiff AI doesn&apos;t just tell you &quot;here&apos;s a bug.&quot; We prove financial vulnerabilities,
              predict architecture breaks, and save you time fix code. Making technical debt visible,
              predictable, and fixable.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <SignedOut>
                <Link href="/sign-in">
                  <Button variant="primary" size="lg">
                    Get Started Free
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button variant="primary" size="lg">
                    Go to Dashboard
                  </Button>
                </Link>
              </SignedIn>
              <Link href={process.env.NEXT_PUBLIC_GITHUB_INSTALL_URL || "#"}>
                <Button variant="outline" size="lg">
                  Connect GitHub
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-16 border-t border-[#262626]">
              <div>
                <div className="text-3xl font-bold text-white mb-1">$0</div>
                <div className="text-sm text-[#a1a1aa]">Cost to Start</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-sm text-[#a1a1aa]">Free Models</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-[#a1a1aa]">AI Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-24 border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
            <h2 className="text-3xl font-bold text-white">
              The Fintech Security Problem
            </h2>
            <p className="text-lg text-[#a1a1aa]">
              Current tools tell you what&apos;s wrong <span className="text-white">now</span>.
              We predict what will break in <span className="text-white">3 months</span> and fix it automatically.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Financial Leakage</h3>
                <p className="text-[#a1a1aa] text-sm leading-relaxed">
                  Race conditions in payment processing can lead to double-spending.
                  A single bug could cost $10,000+ in financial losses.
                </p>
              </div>
            </Card>

            <Card>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Compliance Violations</h3>
                <p className="text-[#a1a1aa] text-sm leading-relaxed">
                  Hardcoded API keys, unencrypted PII, and PCI-DSS violations can result in
                  massive regulatory fines and loss of customer trust.
                </p>
              </div>
            </Card>

            <Card>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Technical Debt</h3>
                <p className="text-[#a1a1aa] text-sm leading-relaxed">
                  Architecture patterns that work today become distributed monoliths in 6 months.
                  By then, it&apos;s too expensive to fix.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-24 border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
            <h2 className="text-3xl font-bold text-white">
              Beyond Detection: Proof, Prediction, Prevention
            </h2>
            <p className="text-lg text-[#a1a1aa]">
              We don&apos;t just find vulnerabilities. We prove them, predict future breaks, and automatically fix them.
            </p>
          </div>

          <div className="space-y-8">
            {/* Feature 1: Vulnerability Prover */}
            <Card className="border-l-4 border-l-red-500">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white">Live Vulnerability Proving</h3>
                  </div>
                  <p className="text-[#a1a1aa] leading-relaxed">
                    Not just detection—<span className="text-white">live exploit demonstration</span>.
                    We create isolated sandboxes, generate exploit payloads, and record proof of vulnerability.
                    See exactly how your code can be exploited before it&apos;s too late.
                  </p>
                  <ul className="space-y-2 text-sm text-[#a1a1aa]">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>Browser-based sandbox (zero server costs)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>Interactive proof videos in PR comments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>One-click auto-fix generation</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6 font-mono text-xs text-[#a1a1aa]">
                  <div className="space-y-2">
                    <div className="text-red-400">{'// SQL Injection Proof'}</div>
                    <div>{'const exploit = `\' OR \'1\'=\'1`;'}</div>
                    <div className="text-emerald-400">{'// Result: Data exposed'}</div>
                    <div className="text-yellow-400">{'// Impact: $10,000 potential loss'}</div>
                    <div className="pt-4 border-t border-[#262626]">
                      <div className="text-white">Auto-Fix Available</div>
                      <div className="text-emerald-400">→ Use parameterized queries</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Feature 2: Predictive Oracle */}
            <Card className="border-l-4 border-l-blue-500">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6 order-2 md:order-1">
                  <div className="space-y-4">
                    <div className="text-sm text-[#a1a1aa]">Prediction Timeline</div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <div className="flex-1">
                          <div className="text-white text-sm">Distributed Monolith Risk</div>
                          <div className="text-xs text-[#a1a1aa]">3-6 months • 92% confidence</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <div className="flex-1">
                          <div className="text-white text-sm">Performance Degradation</div>
                          <div className="text-xs text-[#a1a1aa]">2-4 months • 78% confidence</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <div className="flex-1">
                          <div className="text-white text-sm">Dependency Conflict</div>
                          <div className="text-xs text-[#a1a1aa]">1-3 months • 65% confidence</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 order-1 md:order-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white">Predictive Architecture Oracle</h3>
                  </div>
                  <p className="text-[#a1a1aa] leading-relaxed">
                    Predicts future problems <span className="text-white">before they happen</span>.
                    Analyzes your codebase against 1000+ OSS projects to identify patterns that lead to
                    architecture breaks. Get prevention roadmaps, not post-mortems.
                  </p>
                  <ul className="space-y-2 text-sm text-[#a1a1aa]">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>Pattern matching against known anti-patterns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>Timeline visualization of predicted issues</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>Automated refactoring roadmap</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Feature 3: Auto-Healing */}
            <Card className="border-l-4 border-l-emerald-500">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white">Auto-Healing Pipeline</h3>
                  </div>
                  <p className="text-[#a1a1aa] leading-relaxed">
                    Not just comments—<span className="text-white">actual fixes</span>.
                    We generate multiple fix candidates, test them in sandboxes, and create
                    comprehensive fix PRs with tests, documentation, and rollback plans.
                  </p>
                  <ul className="space-y-2 text-sm text-[#a1a1aa]">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>Multiple fix candidates tested in sandbox</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>Automatic fix PR creation with tests</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>Emergency auto-merge for critical issues</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6 font-mono text-xs">
                  <div className="space-y-3">
                    <div className="text-[#a1a1aa">{'// Before'}</div>
                    <div className="text-red-400">balance = balance + amount;</div>
                    <div className="pt-3 border-t border-[#262626] text-[#a1a1aa]">{'// After (Auto-Fixed)'}</div>
                    <div className="text-emerald-400">{'await db.transaction(async (tx) => {'}</div>
                    <div className="text-emerald-400 ml-4">{'  await tx.update(balance, amount);'}</div>
                    <div className="text-emerald-400">{'});'}</div>
                    <div className="pt-3 border-t border-[#262626] text-emerald-400">
                      ✓ Fix PR #42 created
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Feature 4: Codebase DNA */}
            <Card className="border-l-4 border-l-purple-500">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6 order-2 md:order-1">
                  <div className="space-y-4">
                    <div className="text-sm text-[#a1a1aa] mb-4">Codebase Health Score</div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white">Genetic Fitness</span>
                          <span className="text-emerald-400">87/100</span>
                        </div>
                        <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: '87%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white">Mutation Rate</span>
                          <span className="text-yellow-400">12%</span>
                        </div>
                        <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500" style={{ width: '12%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white">Inbreeding Risk</span>
                          <span className="text-red-400">High</span>
                        </div>
                        <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                          <div className="h-full bg-red-500" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 order-1 md:order-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <Code className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white">Codebase DNA Sequencer</h3>
                  </div>
                  <p className="text-[#a1a1aa] leading-relaxed">
                    Genetic analysis of your codebase health. Extract unique fingerprints,
                    detect genetic defects, calculate evolutionary fitness, and predict breakpoints.
                    Understand your codebase like never before.
                  </p>
                  <ul className="space-y-2 text-sm text-[#a1a1aa]">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>Unique genetic fingerprint per codebase</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>Health diagnostics and mutation tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>Optimal evolution path recommendations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Economic Value Section */}
      <section className="py-24 border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
            <h2 className="text-3xl font-bold text-white">
              Economic Security: Quantify the Value
            </h2>
            <p className="text-lg text-[#a1a1aa]">
              Every vulnerability detected isn&apos;t just a bug—it&apos;s potential financial loss prevented.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <div className="w-16 h-16 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-red-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">$10,000+</div>
              <div className="text-sm text-[#a1a1aa] mb-4">High Severity Issues</div>
              <p className="text-xs text-[#a1a1aa]">
                SQL injection, race conditions, and payment logic flaws can lead to significant financial losses.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-16 h-16 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">$1,000+</div>
              <div className="text-sm text-[#a1a1aa] mb-4">Medium Severity Issues</div>
              <p className="text-xs text-[#a1a1aa]">
                Inefficient queries, unencrypted data, and compliance risks can result in operational costs.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-16 h-16 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">$52,000</div>
              <div className="text-sm text-[#a1a1aa] mb-4">Total Saved (Example)</div>
              <p className="text-xs text-[#a1a1aa]">
                Real-time tracking of potential capital risk prevented across all your repositories.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Fintech Compliance Section */}
      <section className="py-24 border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Automated PCI-DSS Auditor</h2>
              </div>
              <p className="text-lg text-[#a1a1aa] leading-relaxed">
                CodeDiff AI is your automated compliance officer. We strictly flag any code that logs
                variables named <code className="text-white bg-[#1a1a1a] px-2 py-0.5 rounded">cvv</code>,
                <code className="text-white bg-[#1a1a1a] px-2 py-0.5 rounded">password</code>,
                <code className="text-white bg-[#1a1a1a] px-2 py-0.5 rounded">token</code>, or
                <code className="text-white bg-[#1a1a1a] px-2 py-0.5 rounded">pan</code>.
              </p>
              <p className="text-[#a1a1aa] leading-relaxed">
                Making the financial ecosystem safer for everyone. We&apos;re not just finding bugs—we&apos;re preventing regulatory fines and protecting customer trust.
              </p>
              <ul className="space-y-3 text-sm text-[#a1a1aa]">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Detect hardcoded API keys (Stripe/Razorpay)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Flag unencrypted PII (Personally Identifiable Information)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Check for PCI-DSS violations in data logging</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Identify race conditions in database transactions</span>
                </li>
              </ul>
            </div>
            <Card className="bg-[#0a0a0a]">
              <div className="space-y-4">
                <div className="text-sm text-[#a1a1aa] mb-4">Compliance Score</div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white">PCI-DSS Compliance</span>
                      <span className="text-emerald-400">92/100</span>
                    </div>
                    <div className="h-3 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white">Data Encryption</span>
                      <span className="text-emerald-400">98/100</span>
                    </div>
                    <div className="h-3 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white">API Key Security</span>
                      <span className="text-yellow-400">75/100</span>
                    </div>
                    <div className="h-3 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#262626]">
                  <div className="text-xs text-[#a1a1aa] mb-1">Issues Found</div>
                  <div className="text-2xl font-bold text-white">3 Critical</div>
                  <div className="text-sm text-[#a1a1aa] mt-1">12 Warnings</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl font-bold text-white">
            Ready to Make Your Codebase Secure?
          </h2>
          <p className="text-xl text-[#a1a1aa]">
            Start detecting, proving, and fixing vulnerabilities in minutes.
            No credit card required. 100% free to start.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                  Get Started Free
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                  Go to Dashboard
                </Button>
              </Link>
            </SignedIn>
            <Link href={process.env.NEXT_PUBLIC_GITHUB_INSTALL_URL || "#"}>
              <Button variant="outline" size="lg" icon={<GitBranch className="w-5 h-5" />}>
                Connect GitHub
              </Button>
            </Link>
          </div>
          <p className="text-sm text-[#a1a1aa] pt-4">
            Trusted by developers building secure fintech applications
          </p>
        </div>
      </section>

    </div>
  );
}
