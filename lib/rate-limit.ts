const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 6;

type Bucket = {
  count: number;
  expiresAt: number;
};

const buckets = new Map<string, Bucket>();

export const getRequestIp = (request: Request) => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
};

export const rateLimitSubmission = (key: string) => {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.expiresAt < now) {
    buckets.set(key, {
      count: 1,
      expiresAt: now + WINDOW_MS,
    });
    return { ok: true, remaining: MAX_REQUESTS - 1 };
  }

  if (existing.count >= MAX_REQUESTS) {
    return { ok: false, remaining: 0 };
  }

  existing.count += 1;
  buckets.set(key, existing);

  return { ok: true, remaining: MAX_REQUESTS - existing.count };
};
