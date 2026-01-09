import { NextRequest, NextResponse } from 'next/server';
import { prisma, retryDatabaseOperation, warmDatabase } from '@/lib/prisma';

export async function GET() {
  try {
    // Attempt database operations with retry and warming
    const result = await retryDatabaseOperation(async () => {
      await prisma.$queryRaw`SELECT 1`;

      const [repositoryCount, analysisCount] = await Promise.all([
        prisma.repository.count(),
        prisma.analysis.count()
      ]);

      return { repositoryCount, analysisCount };
    });

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      stats: {
        repositories: result.repositoryCount,
        analyses: result.analysisCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Database health check failed:', error);

    return NextResponse.json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      code: error.code,
      suggestion: 'Database may be sleeping. Try warming it up with a retry.',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// POST endpoint to manually warm the database
export async function POST() {
  try {
    const warmed = await warmDatabase();

    if (warmed) {
      return NextResponse.json({
        status: 'success',
        message: 'Database warmed successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        status: 'failed',
        message: 'Failed to warm database',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}