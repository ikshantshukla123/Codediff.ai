import { auth } from "@clerk/nextjs/server";
import { prisma, retryDatabaseOperation } from "@/lib/prisma";

// Test endpoint to add attack proof to existing analysis
export async function POST() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Find the most recent analysis for this user
    const analysis = await retryDatabaseOperation(async () => {
      return await prisma.analysis.findFirst({
        where: {
          repository: {
            userId: userId
          }
        },
        include: {
          repository: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    });

    if (!analysis) {
      return Response.json({ 
        error: 'No analyses found',
        suggestion: 'Please run a scan first'
      }, { status: 400 });
    }

    // Create attack proof data
    const attackProof = {
      success: true,
      type: "SQL_INJECTION_PROOF",
      proof: {
        target: "SELECT * FROM users WHERE id = ",
        payload: "' OR '1'='1",
        result_query: "SELECT * FROM users WHERE id = ' OR '1'='1",
        impact: "Logic Bypass (Authentication Broken)"
      }
    };

    // Update the analysis with attack proof
    const updatedAnalysis = await retryDatabaseOperation(async () => {
      return await prisma.analysis.update({
        where: { id: analysis.id },
        data: {
          attackProof: attackProof,
          riskScore: 100, // Max risk for proven attack
          status: "VULNERABLE"
        }
      });
    });

    const demoUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/${analysis.repository.id}/scan/${analysis.id}`;

    return Response.json({
      success: true,
      message: '🎉 Attack proof added to your latest analysis!',
      demoUrl,
      analysisId: analysis.id,
      repositoryName: analysis.repository.name,
      instruction: 'Visit the demo URL to see the live attack simulation!'
    });

  } catch (error: any) {
    console.error('❌ Failed to add attack proof:', error);
    return Response.json({ 
      error: 'Failed to add attack proof',
      details: error.message 
    }, { status: 500 });
  }
}