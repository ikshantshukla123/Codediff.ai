import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const skip = (page - 1) * limit;

  const [repos, total] = await Promise.all([
    prisma.repository.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        createdAt: true,
        analyses: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            riskScore: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.repository.count({
      where: { userId }
    })
  ]);

  return Response.json({
    repositories: repos,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      current: page
    }
  });
}
