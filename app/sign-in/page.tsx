import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Github, Shield, ArrowRight, CheckCircle, Zap } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";


export default async function SignInPage() {
  const { userId } = await auth();

  // If user is already authenticated, redirect to dashboard
  if (userId) {
    redirect("/dashboard");
  }

  return (

    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">

        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-black">
              <Shield className="h-7 w-7" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">
            Welcome to CodeDiff AI
          </h1>
          <p className="text-[#a1a1aa] mt-2">
            Connect your GitHub account to start securing your codebase
          </p>
        </div>

        {/* GitHub Connection Card */}
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-6 space-y-6">

          {/* Benefits List */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-[#a1a1aa]">Analyze your repositories for security vulnerabilities</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-[#a1a1aa]">Get AI-powered security recommendations</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-[#a1a1aa]">Automated vulnerability fixes and monitoring</span>
            </div>
          </div>

          {/* GitHub Connect Button
          <Link
            href={process.env.NEXT_PUBLIC_GITHUB_INSTALL_URL || "#"}
            className="block"
          >
            <Button variant="primary" className="w-full flex items-center justify-center gap-3 py-3">
              <Github className="h-5 w-5" />
              <span>Connect with GitHub</span>
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
          </Link> */}


<SignInButton mode="modal">
  <Button
    variant="primary"
    className="w-full flex items-center justify-center gap-3 py-3"
  >
    <Github className="h-5 w-5" />
    <span>Connect with GitHub</span>
    <ArrowRight className="h-4 w-4 ml-auto" />
  </Button>
</SignInButton>

          {/* Privacy Note */}
          <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-white mb-1">Secure & Private</p>
                <p className="text-xs text-[#a1a1aa]">
                  We only access repositories you explicitly grant permission to.
                  Your code stays secure and private.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-xs text-[#a1a1aa]">
            By connecting, you agree to our Terms of Service and Privacy Policy
          </p>
          <Link href="/" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
            ← Back to homepage
          </Link>
        </div>

      </div>
    </div>
   );
}