import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ scanId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { scanId } = await params;

    if (!scanId) {
      return NextResponse.json({ error: "scanId is required" }, { status: 400 });
    }

    // Ensure analysis belongs to user
    const analysis = await prisma.analysis.findFirst({
      where: {
        id: scanId,
        repository: {
          userId: userId
        }
      },
      select: {
        id: true,
        status: true,
        riskScore: true,
        issuesFound: true,
        createdAt: true
      }
    });

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error fetching analysis status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}