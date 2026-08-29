import app from './src/app.js';
import { env } from './src/config/env.js';
import { closeConnection, verifyConnection } from './src/db/connection.js';

const server = app.listen(env.port, async () => {
  try { await verifyConnection(); console.log(`SkillGraph API listening on port ${env.port}`); }
  catch (error) { console.error('Database connection failed:', error.message); }
});

async function shutdown(signal) {
  console.log(`${signal}: closing server`);
  server.close(async () => { await closeConnection(); process.exit(0); });
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
