/* Registration dates from RDAP, the free public successor to WHOIS. The
   registry for each ending comes from IANA's bootstrap file; rdap.org would
   do the lookup for us but refuses requests from servers. */

let bootstrap: Promise<Map<string, string>> | null = null;

function registries(): Promise<Map<string, string>> {
  bootstrap ??= fetch('https://data.iana.org/rdap/dns.json')
    .then((r) => r.json())
    .then((j: { services: [string[], string[]][] }) => {
      const map = new Map<string, string>();
      for (const [tlds, urls] of j.services) for (const t of tlds) map.set(t, urls[0]);
      return map;
    })
    .catch(() => {
      bootstrap = null;
      return new Map<string, string>([['uk', 'https://rdap.nominet.uk/uk/']]);
    });
  return bootstrap;
}

export interface DomainInfo {
  expires: string | null;
  registered: string | null;
  registrar: string | null;
}

export async function lookupDomain(hostname: string): Promise<DomainInfo> {
  const empty = { expires: null, registered: null, registrar: null };
  // RDAP wants the registered domain, not www. or a subdomain. Good enough for
  // the .co.uk / .com / .uk sites this is aimed at.
  const parts = hostname.replace(/^www\./, '').split('.');
  const twoLevel = /^(co|org|me|ltd|plc|net|ac|gov)\.uk$/.test(parts.slice(-2).join('.'));
  const domain = parts.slice(twoLevel ? -3 : -2).join('.');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8_000);
  try {
    const tld = domain.split('.').pop()!;
    const base = (await registries()).get(tld);
    if (!base) return empty;
    const res = await fetch(`${base.replace(/\/?$/, '/')}domain/${domain}`, {
      signal: controller.signal,
      headers: { Accept: 'application/rdap+json' },
    });
    if (!res.ok) return empty;
    const json = await res.json();
    const date = (action: string) =>
      (json.events ?? []).find((e: { eventAction: string }) => e.eventAction === action)?.eventDate ?? null;
    const registrar =
      (json.entities ?? [])
        .find((e: { roles?: string[] }) => e.roles?.includes('registrar'))
        ?.vcardArray?.[1]?.find((v: unknown[]) => v[0] === 'fn')?.[3] ?? null;
    return { expires: date('expiration'), registered: date('registration'), registrar };
  } catch {
    return empty;
  } finally {
    clearTimeout(timer);
  }
}
