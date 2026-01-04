// Simple development server for the Phaser game
import { serve } from 'bun';

const server = serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname;

    // Default to index.html
    if (path === '/') {
      path = '/index.html';
    }

    // Serve static files
    try {
      // Try to serve from public directory
      if (path === '/index.html') {
        const file = Bun.file('./public/index.html');
        return new Response(file, {
          headers: { 'Content-Type': 'text/html' },
        });
      }

      // Try to serve from dist directory for built JS
      if (path.endsWith('.js')) {
        const file = Bun.file('./dist/index.js');
        return new Response(file, {
          headers: { 'Content-Type': 'application/javascript' },
        });
      }

      // 404 for other files
      return new Response('Not found', { status: 404 });
    } catch (error) {
      return new Response('Error loading file', { status: 500 });
    }
  },
});

console.log(`🎮 Hex-A-Boom client running at http://localhost:${server.port}`);
console.log(`📁 Open http://localhost:${server.port} in your browser`);
