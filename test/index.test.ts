import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

describe('Worker', () => {
  it('responds to /ping', async () => {
    const request = new Request('https://example.com/ping');
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env as Env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  it('returns 404 for unknown paths', async () => {
    const request = new Request('https://example.com/unknown');
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env as Env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(404);
  });
});
