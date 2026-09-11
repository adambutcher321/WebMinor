import { AuditError } from './types';

// Blocks obvious loopback/private/link-local/metadata targets before we ever
// fetch a visitor-supplied URL from our own server (basic SSRF guard). This is
// a hostname-level denylist, not a DNS-resolution check — good enough for a
// public marketing-site tool, not a substitute for network-level egress rules.
const BLOCKED_HOSTNAME_PATTERNS: RegExp[] = [
  /^localhost$/i,
  /\.local$/i,
  /^127\./,
  /^0\.0\.0\.0$/,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^169\.254\./, // link-local, incl. cloud metadata (169.254.169.254)
  /^\[?::1\]?$/, // IPv6 loopback
  /^\[?fc00:/i, // IPv6 unique local
  /^\[?fe80:/i, // IPv6 link-local
];

export interface NormalizedUrl {
  url: URL;
  domain: string;
}

export function normalizeAndValidateUrl(input: string): NormalizedUrl {
  const trimmed = input.trim();

  if (!trimmed) {
    throw new AuditError('Please enter a domain or website address.', 400);
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let url: URL;
  try {
    url = new URL(withProtocol);
  } catch {
    throw new AuditError(
      `"${trimmed}" doesn't look like a valid website address.`,
      400
    );
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new AuditError('Only http:// and https:// addresses are supported.', 400);
  }

  const hostname = url.hostname;

  if (!hostname || !hostname.includes('.') || hostname.length > 253) {
    throw new AuditError(
      `"${trimmed}" doesn't look like a valid website address.`,
      400
    );
  }

  if (BLOCKED_HOSTNAME_PATTERNS.some((p) => p.test(hostname))) {
    throw new AuditError('That address can’t be audited.', 400);
  }

  if (!/^[a-z0-9.-]+$/i.test(hostname)) {
    throw new AuditError(
      `"${trimmed}" doesn't look like a valid website address.`,
      400
    );
  }

  return { url, domain: hostname };
}
