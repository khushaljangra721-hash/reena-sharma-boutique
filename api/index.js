import app, { ensureInitialized } from '../server/server.js';

export default async function handler(req, res) {
  try {
    await ensureInitialized();
  } catch (err) {
    console.error('Serverless handler init error:', err);
  }
  return app(req, res);
}
