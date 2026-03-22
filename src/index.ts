export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/ping') {
      return Response.json({ ok: true });
    }

    if (url.pathname === '/kv') {
      const value = await env.CACHE.get('test-key');
      return Response.json({ value });
    }

    return new Response('Not Found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;
