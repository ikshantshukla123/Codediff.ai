import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Enhanced Prisma client with better connection handling
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  transactionOptions: {
    maxWait: 10000, // 10 seconds
    timeout: 30000, // 30 seconds
    isolationLevel: 'ReadCommitted',
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Database warming function
export async function warmDatabase(): Promise<boolean> {
  try {
    console.log('🔥 Warming database connection...');
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database warmed successfully');
    return true;
  } catch (error) {
    console.log('❌ Database warming failed:', error);
    return false;
  }
}

// Enhanced retry function with exponential backoff
export async function retryDatabaseOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 5,
  baseDelay = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Try to warm the database on first retry
      if (attempt === 2) {
        await warmDatabase();
      }

      return await operation();
    } catch (error: any) {
      const isLastAttempt = attempt === maxRetries;
      const isDatabaseError = error.code?.startsWith('P');

      if (isLastAttempt || !isDatabaseError) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
      console.log(`🔄 Database retry ${attempt}/${maxRetries} (${error.code}). Waiting ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

// Test connection function
export async function testDatabaseConnection() {
  try {
    await prisma.$connect()
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

// Graceful disconnect
export async function disconnectDatabase() {
  await prisma.$disconnect()
}

// Export as default and named export
export default prisma