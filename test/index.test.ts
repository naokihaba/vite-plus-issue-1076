// Reproduction for https://github.com/voidzero-dev/vite-plus/issues/1076
// The `describe()` call itself triggers the crash when running `vp test`:
//   TypeError: Cannot read properties of undefined (reading 'config')
//   at initSuite → validateTags(runner.config, ...)
//
// `pnpm run test` (standard vitest) passes; `vp test` fails.
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

  it('reads from KV via /kv', async () => {
    await (env as Env).CACHE.put('test-key', 'hello');

    const request = new Request('https://example.com/kv');
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env as Env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ value: 'hello' });
  });
});
