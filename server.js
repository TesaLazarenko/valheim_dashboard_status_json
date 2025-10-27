// Hono server for Valheim Status Dashboard
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';

const PORT = process.env.PORT || 3000;
const VALHEIM_SERVER_URL = process.env.VALHEIM_SERVER || "http://localhost";

const app = new Hono();

// Logging middleware
app.use('*', async (c, next) => {
  console.log(`${c.req.method} ${c.req.path}`);
  await next();
});

// API proxy route
app.get('/api/server-status', async (c) => {
  try {
    const targetUrl = `${VALHEIM_SERVER_URL}/status.json`;
    console.log(`Proxying API request to: ${targetUrl}`);

    const response = await fetch(targetUrl);
    const data = await response.text();

    return c.json(JSON.parse(data), response.status);
  } catch (error) {
    console.error('Error proxying API request:', error);
    return c.json(
      { error: 'Failed to fetch server status' },
      500
    );
  }
});

// Static file serving
app.use('/*', serveStatic({
  root: './dist',
  onNotFound: (path, c) => {
    // Handle SPA routing - serve index.html for unknown routes
    return c.redirect('/');
  }
}));

// Fallback for SPA routing
app.notFound((c) => {
  return serveStatic({
    root: './dist',
    path: '/index.html'
  })(c, () => c.text('Not Found', 404));
});

export default {
  port: PORT,
  fetch: app.fetch,
};

console.log(`🚀 Valheim Status Dashboard server running on http://localhost:${PORT}`);
console.log(`📊 Proxying API requests to: ${VALHEIM_SERVER_URL}`);