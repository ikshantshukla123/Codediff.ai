// Database initialization and warming script
import { warmDatabase, retryDatabaseOperation } from './prisma';

let isWarming = false;

export async function initializeDatabase() {
  if (isWarming) return;

  isWarming = true;

  try {
    console.log('🚀 Initializing database connection...');

    // Warm up the database with retries
    const warmed = await warmDatabase();

    if (!warmed) {
      console.log('⚠️ Database warming failed, but continuing...');
    }

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    isWarming = false;
  }
}

// Auto-initialize when this module is imported
if (process.env.NODE_ENV !== 'test') {
  // Don't auto-initialize during tests
  initializeDatabase();
}