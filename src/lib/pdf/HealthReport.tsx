import path from 'node:path';
import { Document, Page, Text, View, StyleSheet, Font, Svg, Path, Circle, Image, Link } from '@react-pdf/renderer';
import type { Issue, SiteReport, Severity, CategoryId } from '@/lib/audit/types';

/* The website health report, rendered to PDF with react-pdf — plain
   JavaScript, so it prints identically on a laptop and on Vercel. Written for
   the owner of a local business, not for a developer: every finding says what
   it is, what it costs and what to do. Cover and closing page are WebMinor
   ink; the pages in between are white so they print. */

const FONT_DIR = path.join(process.cwd(), 'src/lib/pdf/fonts');
const ASSETS = path.join(process.cwd(), 'src/lib/pdf/assets');
/* The W mark and the scenes are WebMinor's own: the mark from public/images,
   the islands generated in Higgsfield against the site's diorama art so they
   read as the same world. JPEGs at ~100 KB each keep the PDF emailable. */
const ART = {
  mark: path.join(ASSETS, 'w-mark.png'),
  cover: path.join(ASSETS, 'cover.jpg'),
  fix: path.join(ASSETS, 'fix.jpg'),
  speed: path.join(ASSETS, 'speed.jpg'),
  finale: path.join(ASSETS, 'finale.jpg'),
};
Font.register({
  family: 'Grotesk',
  fonts: [
    { src: path.join(FONT_DIR, 'SpaceGrotesk-400.ttf'), fontWeight: 400 },
    { src: path.join(FONT_DIR, 'SpaceGrotesk-500.ttf'), fontWeight: 500 },
    { src: path.join(FONT_DIR, 'SpaceGrotesk-700.ttf'), fontWeight: 700 },
  ],
});
Font.register({ family: 'Mono', src: path.join(FONT_DIR, 'SpaceMono-400.ttf') });
// Long URLs must break anywhere, not overflow the page.
Font.registerHyphenationCallback((word) => (word.length > 24 ? word.split('') : [word]));

const C = {
  ink: '#0B0D10',
  ink2: '#14181E',
  paper: '#FFFFFF',
  wash: '#F4F6F8',
  line: '#E3E7EC',
  text: '#1A1F26',
  muted: '#5B6573',
  faint: '#8A94A3',
  cyan: '#40E0FF',
  teal: '#0E7C93',
  error: '#D93A3F',
  warning: '#D98A0B',
  notice: '#3570C9',
  good: '#1F9D63',
};

const SEV: Record<Severity, { label: string; color: string }> = {
  error: { label: 'Fix now', color: C.error },
  warning: { label: 'Fix soon', color: C.warning },
  notice: { label: 'Worth doing', color: C.notice },
};

const BAND: Record<SiteReport['band'], { word: string; color: string }> = {
  strong: { word: 'Strong', color: C.good },
  fair: { word: 'Fair', color: '#8BC34A' },
  weak: { word: 'Needs work', color: C.warning },
  poor: { word: 'Poor', color: C.error },
};

const scoreColor = (n: number) => (n >= 85 ? C.good : n >= 70 ? '#7CB342' : n >= 50 ? C.warning : C.error);

const s = StyleSheet.create({
  page: { fontFamily: 'Grotesk', fontSize: 10.5, color: C.text, backgroundColor: C.paper, paddingTop: 54, paddingBottom: 64, paddingHorizontal: 50, lineHeight: 1.45 },
  // Pure black, not ink: the Higgsfield scenes are on #000 and bleed edge to edge.
  dark: { backgroundColor: '#000000', color: C.paper },
  micro: { fontFamily: 'Mono', fontSize: 7.5, letterSpacing: 1.4, textTransform: 'uppercase' },
  h1: { fontSize: 30, fontWeight: 700, lineHeight: 1.1, letterSpacing: -0.6 },
  h2: { fontSize: 20, fontWeight: 700, lineHeight: 1.15, letterSpacing: -0.3, marginBottom: 6 },
  h3: { fontSize: 12.5, fontWeight: 700, lineHeight: 1.3 },
  lede: { fontSize: 11.5, color: C.muted, marginBottom: 22 },
    card: { borderWidth: 1, borderColor: C.line, borderRadius: 8, padding: 16 },
  chip: { fontFamily: 'Mono', fontSize: 6.5, letterSpacing: 1, textTransform: 'uppercase', paddingVertical: 2.5, paddingHorizontal: 6, borderRadius: 3, color: C.paper },
});

/* ── Drawing helpers ─────────────────────────────────────────────────────── */

function arc(cx: number, cy: number, r: number, from: number, to: number): string {
  const p = (a: number) => [cx + r * Math.cos(((a - 90) * Math.PI) / 180), cy + r * Math.sin(((a - 90) * Math.PI) / 180)];
  const [x1, y1] = p(from);
  const [x2, y2] = p(to);
  return `M ${x1} ${y1} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2} ${y2}`;
}

/** A 270° gauge, open at the bottom, like a dial. */
function Gauge({ score, size, track, dark }: { score: number; size: number; track: string; dark?: boolean }) {
  const r = size / 2 - 10;
  const c = size / 2;
  const end = -135 + (270 * Math.max(score, 0.5)) / 100;
  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <Svg width={size} height={size}>
        <Path d={arc(c, c, r, -135, 135)} stroke={track} strokeWidth={11} strokeLinecap="round" fill="none" />
        <Path d={arc(c, c, r, -135, end)} stroke={scoreColor(score)} strokeWidth={11} strokeLinecap="round" fill="none" />
      </Svg>
      <View style={{ position: 'absolute', top: 0, left: 0, width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: size * 0.3, fontWeight: 700, color: dark ? C.paper : C.text, lineHeight: 1 }}>{score}</Text>
        <Text style={[s.micro, { color: dark ? '#9AA3AF' : C.faint, marginTop: 6, lineHeight: 1 }]}>out of 100</Text>
      </View>
    </View>
  );
}

function Donut({ counts }: { counts: Record<Severity, number> }) {
  const total = counts.error + counts.warning + counts.notice;
  const size = 96;
  const r = 36;
  let at = 0;
  const segs = (['error', 'warning', 'notice'] as Severity[])
    .filter((k) => counts[k] > 0)
    .map((k) => {
      const sweep = (360 * counts[k]) / Math.max(total, 1);
      const seg = { k, from: at, to: at + sweep - (total > counts[k] ? 3 : 0.01) };
      at += sweep;
      return seg;
    });
  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <Svg width={size} height={size}>
        {total === 0 ? (
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={C.good} strokeWidth={12} fill="none" />
        ) : (
          segs.map((g) =>
            g.to - g.from >= 359.9 ? (
              <Circle key={g.k} cx={size / 2} cy={size / 2} r={r} stroke={SEV[g.k].color} strokeWidth={12} fill="none" />
            ) : (
              <Path key={g.k} d={arc(size / 2, size / 2, r, g.from, g.to)} stroke={SEV[g.k].color} strokeWidth={12} fill="none" />
            ),
          )
        )}
      </Svg>
      <View style={{ position: 'absolute', top: 0, left: 0, width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{total}</Text>
        <Text style={[s.micro, { color: C.faint, fontSize: 6, marginTop: 4, lineHeight: 1 }]}>{total === 1 ? 'finding' : 'findings'}</Text>
      </View>
    </View>
  );
}

function Footer({ report }: { report: SiteReport }) {
  const t = { fontFamily: 'Mono', fontSize: 7, letterSpacing: 1, color: C.faint } as const;
  return (
    <>
      <Text fixed style={[t, { position: 'absolute', bottom: 26, left: 50 }]}>{report.domain.toUpperCase()}</Text>
      <Text
        fixed
        style={[t, { position: 'absolute', bottom: 26, right: 50 }]}
        render={({ pageNumber, totalPages }) => `WEBMINOR.CO.UK   ${pageNumber} / ${totalPages}`}
      />
    </>
  );
}

/** A drawn tick — the fonts have no ✓ glyph. */
function Tick({ color = C.good }: { color?: string }) {
  return (
    <Svg width={9} height={9} style={{ marginTop: 2.5, marginRight: 7 }}>
      <Path d="M1 4.8 L3.6 7.4 L8 1.8" stroke={color} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** "/" means nothing to most people; say "homepage". */
export const place = (e: string) => e.replace(/^\/(?=\s|$)/, '/ (homepage)').replace(/ on \/$/, ' on the homepage');

function Chip({ severity }: { severity: Severity }) {
  return <Text style={[s.chip, { backgroundColor: SEV[severity].color }]}>{SEV[severity].label}</Text>;
}

const date = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

/** The WebMinor lockup — W mark and wordmark — as on the website header. */
function Lockup({ height, dark = false }: { height: number; dark?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt */}
      <Image src={ART.mark} style={{ height, width: height * 0.68, marginRight: height * 0.22 }} />
      <Text style={{ fontSize: height * 0.62, fontWeight: 700, color: dark ? C.paper : C.text, letterSpacing: -0.3 }}>
        Web<Text style={{ color: dark ? C.cyan : C.teal }}>Minor</Text>
      </Text>
    </View>
  );
}

/** Small lockup in the top-right corner of every white page. */
function PageMark() {
  return (
    <View fixed style={{ position: 'absolute', top: 26, right: 50 }}>
      <Lockup height={16} />
    </View>
  );
}

/** A scene in a black rounded tile, for the white pages. */
function Scene({ src, width, height }: { src: string; width: number; height: number }) {
  return (
    <View style={{ width, height, borderRadius: 10, overflow: 'hidden', backgroundColor: '#000' }}>
      {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt */}
      <Image src={src} style={{ width, height, objectFit: 'cover' }} />
    </View>
  );
}

/* ── Pages ───────────────────────────────────────────────────────────────── */

function Cover({ report }: { report: SiteReport }) {
  const b = BAND[report.band];
  return (
    <Page size="A4" style={[s.page, s.dark, { paddingTop: 40, paddingHorizontal: 50 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Lockup height={40} dark />
        <Text style={[s.micro, { color: '#9AA3AF' }]}>{date(report.fetchedAt)}</Text>
      </View>

      <View style={{ marginTop: 34 }}>
        <Text style={[s.micro, { color: C.cyan, marginBottom: 10 }]}>Website health report</Text>
        <Text style={[s.h1, { fontSize: report.domain.length > 26 ? 28 : 36 }]}>{report.domain}</Text>
      </View>

      {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt */}
      <Image src={ART.cover} style={{ marginHorizontal: -50, marginTop: 8, height: 318, objectFit: 'cover' }} />

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
        <Gauge score={report.score} size={138} track="#1E242C" dark />
        <View style={{ marginLeft: 28, flex: 1 }}>
          <Text style={[s.micro, { color: b.color, marginBottom: 8 }]}>{b.word}</Text>
          <Text style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.35 }}>{report.headline}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 22, borderTopWidth: 1, borderTopColor: '#1E242C', paddingTop: 16 }}>
        {[
          { n: report.pagesChecked, l: 'Pages checked', c: C.paper },
          { n: report.counts.error, l: 'Fix now', c: C.error },
          { n: report.counts.warning, l: 'Fix soon', c: C.warning },
          { n: report.counts.notice, l: 'Worth doing', c: '#6FA0EA' },
        ].map((x) => (
          <View key={x.l} style={{ flex: 1 }}>
            <Text style={{ fontSize: 24, fontWeight: 700, color: x.c, lineHeight: 1 }}>{x.n}</Text>
            <Text style={[s.micro, { color: '#9AA3AF', marginTop: 8, lineHeight: 1 }]}>{x.l}</Text>
          </View>
        ))}
      </View>

      <Text style={{ position: 'absolute', bottom: 32, left: 50, right: 50, fontSize: 8.5, color: '#7D8793', lineHeight: 1.5 }}>
        We checked {report.pagesChecked} page{report.pagesChecked === 1 ? '' : 's'} of {report.finalUrl.replace(/\/$/, '')} the way a
        search engine reads them{report.speed ? ', and ran Google’s own speed test on the homepage' : ''}. Prepared by WebMinor, Saltash ·
        01752 845258 · webminor.co.uk
      </Text>
    </Page>
  );
}

function Glance({ report }: { report: SiteReport }) {
  const untested = (id: CategoryId) => report.categories.find((c) => c.id === id)?.tested === false || (id === 'speed' && !report.speed);
  return (
    <Page size="A4" style={s.page}>
      <PageMark />
      <Text style={[s.micro, { color: C.teal, marginBottom: 8 }]}>At a glance</Text>
      <Text style={s.h2}>Where the site stands</Text>
      <Text style={s.lede}>Five things decide whether a website brings in work. Each is scored out of 100.</Text>

      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, marginRight: 26 }}>
          {report.categories.map((c) => (
            <View key={c.id} style={{ marginBottom: 15 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                <Text style={{ fontWeight: 500 }}>{c.label}</Text>
                <Text style={{ fontWeight: 700, color: untested(c.id) ? C.faint : scoreColor(c.score) }}>{untested(c.id) ? (c.id === 'speed' ? 'Not tested' : 'Not checked') : c.score}</Text>
              </View>
              <View style={{ height: 7, backgroundColor: C.wash, borderRadius: 4 }}>
                {!untested(c.id) && <View style={{ height: 7, width: `${Math.max(c.score, 2)}%`, backgroundColor: scoreColor(c.score), borderRadius: 4 }} />}
              </View>
              <Text style={{ fontSize: 8.5, color: C.faint, marginTop: 4 }}>
                {c.errors + c.warnings + c.notices === 0
                  ? untested(c.id) ? '' : 'Nothing found'
                  : [
                      c.errors && `${c.errors} to fix now`,
                      c.warnings && `${c.warnings} to fix soon`,
                      c.notices && `${c.notices} worth doing`,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                {c.id === 'speed' && !report.speed ? ' · Google’s speed test couldn’t run this time' : untested(c.id) ? ' · See “What we couldn’t check”' : ''}
              </Text>
            </View>
          ))}
        </View>
        <View style={[s.card, { width: 170, alignItems: 'center' }]}>
          <Text style={[s.micro, { color: C.faint, marginBottom: 10 }]}>What we found</Text>
          <Donut counts={report.counts} />
          <View style={{ marginTop: 12, alignSelf: 'stretch' }}>
            {(['error', 'warning', 'notice'] as Severity[]).map((k) => (
              <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: SEV[k].color, marginRight: 6 }} />
                  <Text style={{ fontSize: 9 }}>{SEV[k].label}</Text>
                </View>
                <Text style={{ fontSize: 9, fontWeight: 700 }}>{report.counts[k]}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {(report.limits ?? []).length > 0 && (
        <View style={[s.card, { backgroundColor: '#FFF8EB', borderColor: '#F3DDB0', marginTop: 10 }]}>
          <Text style={[s.micro, { color: C.warning, marginBottom: 5 }]}>What we couldn’t check</Text>
          {(report.limits ?? []).map((l) => (
            <Text key={l} style={{ fontSize: 9.5, color: C.text }}>{l}</Text>
          ))}
        </View>
      )}

      <View style={{ flexDirection: 'row', marginTop: 22 }}>
        <View style={{ flex: 1, marginRight: 16 }}>
          <Text style={[s.micro, { color: C.good, marginBottom: 8 }]}>What’s already right</Text>
          {report.passes.length === 0 ? (
            <Text style={{ color: C.muted, fontSize: 9.5 }}>Nothing we could confirm yet.</Text>
          ) : (
            report.passes.map((p) => (
              <View key={p} style={{ flexDirection: 'row', marginBottom: 6 }}>
                <Tick />
                <Text style={{ flex: 1, fontSize: 9.5 }}>{p}</Text>
              </View>
            ))
          )}
        </View>
        <View style={{ width: 170 }}>
          <Text style={[s.micro, { color: C.faint, marginBottom: 8 }]}>Your web address</Text>
          {[
            ['Registered', report.domainInfo.registered ? date(report.domainInfo.registered) : '—'],
            ['Renews by', report.domainInfo.expires ? date(report.domainInfo.expires) : '—'],
            ['Pages checked', String(report.pagesChecked)],
            ['Links followed', String(report.linksFound)],
          ].map(([k, v]) => (
            <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: C.line, paddingVertical: 5 }}>
              <Text style={{ fontSize: 9, color: C.muted }}>{k}</Text>
              <Text style={{ fontSize: 9, fontWeight: 500 }}>{v}</Text>
            </View>
          ))}
        </View>
      </View>
      <Footer report={report} />
    </Page>
  );
}

function Examples({ issue, limit }: { issue: Issue; limit: number }) {
  const shown = issue.examples.slice(0, limit);
  const more = issue.count - shown.length;
  if (!shown.length) return null;
  return (
    <View style={{ marginTop: 7 }}>
      {shown.map((e) => (
        <Text key={e} style={{ fontFamily: 'Mono', fontSize: 7.5, color: C.muted, marginBottom: 2 }}>
          {place(e)}
        </Text>
      ))}
      {more > 0 && <Text style={{ fontSize: 8, color: C.faint, marginTop: 1 }}>and {more} more</Text>}
    </View>
  );
}

function FixFirst({ report }: { report: SiteReport }) {
  const top = report.issues.slice(0, 3);
  return (
    <Page size="A4" style={s.page}>
      <PageMark />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
        <View style={{ flex: 1, paddingRight: 20 }}>
          <Text style={[s.micro, { color: C.teal, marginBottom: 8 }]}>Start here</Text>
          <Text style={s.h2}>{top.length ? 'Fix these first' : 'Nothing urgent'}</Text>
          <Text style={[s.lede, { marginBottom: 0 }]}>
            {top.length
              ? 'Of everything we found, these would make the most difference to how many people find you and get in touch.'
              : 'We didn’t find anything that needs fixing. The rest of this report shows what we checked.'}
          </Text>
        </View>
        <Scene src={ART.fix} width={170} height={120} />
      </View>
      {top.map((i, n) => (
        <View key={i.id} style={[s.card, { marginBottom: 10, paddingVertical: 12, flexDirection: 'row' }]} wrap={false}>
          <Text style={{ fontSize: 30, fontWeight: 700, color: C.line, width: 38, lineHeight: 1 }}>{n + 1}</Text>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Chip severity={i.severity} />
              {i.count > 1 && <Text style={{ fontSize: 8.5, color: C.faint, marginLeft: 8 }}>{i.count} pages</Text>}
            </View>
            <Text style={[s.h3, { marginBottom: 5 }]}>{i.title}</Text>
            <Text style={{ fontSize: 9.5, color: C.text, marginBottom: 5 }}>{i.why}</Text>
            <View style={{ flexDirection: 'row', borderLeftWidth: 2, borderLeftColor: C.teal, paddingLeft: 8 }}>
              <Text style={{ fontSize: 9.5, color: C.teal }}>
                <Text style={{ fontWeight: 700 }}>What to do: </Text>
                {i.fix}
              </Text>
            </View>
            <Examples issue={i} limit={2} />
          </View>
        </View>
      ))}
      <Footer report={report} />
    </Page>
  );
}

function Speed({ report }: { report: SiteReport }) {
  const sp = report.speed;
  if (!sp) return null;
  const bandColor = { good: C.good, ok: C.warning, poor: C.error } as const;
  const bandWord = { good: 'Good', ok: 'Could be better', poor: 'Slow' } as const;
  return (
    <Page size="A4" style={s.page}>
      <PageMark />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <View style={{ flex: 1, paddingRight: 20 }}>
          <Text style={[s.micro, { color: C.teal, marginBottom: 8 }]}>Speed on a phone</Text>
          <Text style={s.h2}>How quickly the homepage loads</Text>
          <Text style={[s.lede, { marginBottom: 0 }]}>
            Google loaded your homepage on a mid-range phone over mobile data, the way most local customers first see it.
          </Text>
        </View>
        <Scene src={ART.speed} width={170} height={120} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
        <Gauge score={sp.score} size={120} track={C.wash} />
        <View style={{ marginLeft: 24, flex: 1 }}>
          <Text style={s.h3}>Google’s speed score: {sp.score} out of 100</Text>
          <Text style={{ color: C.muted, marginTop: 4 }}>
            {sp.score >= 90
              ? 'Fast. Visitors won’t notice the wait.'
              : sp.score >= 50
                ? 'Middling. Some visitors will give up before it finishes loading.'
                : 'Slow. A good share of visitors on a phone will leave before they see anything.'}
          </Text>
        </View>
      </View>
      {sp.metrics.map((m) => (
        <View key={m.id} style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: C.line, paddingVertical: 11 }} wrap={false}>
          <View style={{ flex: 1, paddingRight: 16 }}>
            <Text style={{ fontWeight: 700, marginBottom: 2 }}>{m.label}</Text>
            <Text style={{ fontSize: 9, color: C.muted }}>{m.plain}</Text>
          </View>
          <View style={{ width: 70, alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 15, fontWeight: 700, color: bandColor[m.band] }}>{m.display}</Text>
            <Text style={{ fontSize: 7.5, color: C.faint }}>target {m.target}</Text>
          </View>
          <View style={{ width: 90, alignItems: 'flex-end', justifyContent: 'center' }}>
            <Text style={[s.chip, { backgroundColor: bandColor[m.band] }]}>{bandWord[m.band]}</Text>
          </View>
        </View>
      ))}
      <Footer report={report} />
    </Page>
  );
}

function Everything({ report }: { report: SiteReport }) {
  const order: CategoryId[] = ['found', 'pages', 'speed', 'links', 'trust'];
  return (
    <Page size="A4" style={s.page}>
      <PageMark />
      <Text style={[s.micro, { color: C.teal, marginBottom: 8 }]}>The full list</Text>
      <Text style={s.h2}>Everything we found</Text>
      <Text style={s.lede}>{`Grouped by what it affects, most serious first. Pages are shown without the domain, so /about means ${report.domain}/about.`}</Text>
      {order.map((cat) => {
        const list = report.issues.filter((i) => i.category === cat);
        const label = report.categories.find((c) => c.id === cat)!;
        return (
          <View key={cat} style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderBottomWidth: 2, borderBottomColor: C.text, paddingBottom: 5, marginBottom: 4 }} minPresenceAhead={150}>
              <Text style={{ fontSize: 13, fontWeight: 700 }}>{label.label}</Text>
              <Text style={{ fontSize: 10, fontWeight: 700, color: label.tested === false ? C.faint : scoreColor(label.score) }}>
                {label.tested === false ? (cat === 'speed' ? 'Speed test not run' : 'Not checked') : `${label.score}/100`}
              </Text>
            </View>
            {list.length === 0 && label.tested !== false && (
              <View style={{ flexDirection: 'row', paddingVertical: 8 }}>
                <Tick />
                <Text style={{ color: C.good, fontSize: 9.5 }}>Nothing to fix here.</Text>
              </View>
            )}
            {list.map((i) => (
              <View key={i.id} style={{ borderBottomWidth: 1, borderBottomColor: C.line, paddingVertical: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }} minPresenceAhead={110}>
                  <Chip severity={i.severity} />
                  <Text style={{ flex: 1, fontWeight: 700, marginLeft: 8 }}>{i.title}</Text>
                  {i.count > 1 && <Text style={{ fontSize: 8.5, color: C.faint }}>{i.count}</Text>}
                </View>
                <Text style={{ fontSize: 9.5, color: C.text }}>{i.why}</Text>
                <Text style={{ fontSize: 9.5, color: C.teal, marginTop: 3 }}>{i.fix}</Text>
                <Examples issue={i} limit={6} />
              </View>
            ))}
          </View>
        );
      })}
      <Footer report={report} />
    </Page>
  );
}

function NextSteps({ report }: { report: SiteReport }) {
  return (
    <Page size="A4" style={[s.page, s.dark, { justifyContent: 'space-between' }]}>
      <View>
        <Lockup height={40} dark />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt */}
        <Image src={ART.finale} style={{ marginHorizontal: -50, marginTop: 10, marginBottom: 6, height: 290, objectFit: 'cover' }} />
        <Text style={[s.micro, { color: C.cyan, marginBottom: 12 }]}>What happens next</Text>
        <Text style={[s.h1, { fontSize: 28, marginBottom: 20 }]}>Most of this is a day or two’s work.</Text>
        <Text style={{ fontSize: 12, color: '#C4CAD3', lineHeight: 1.6, marginBottom: 14 }}>
          If someone looks after your website, send them this report: every item says what to do. If nobody does, or you’d rather not
          deal with it, ring us and we’ll go through it with you.
        </Text>
        <Text style={{ fontSize: 12, color: '#C4CAD3', lineHeight: 1.6 }}>
          And if starting again makes more sense than patching, we design three-page websites for free. You see your home page as a
          private link before anything else is built, and hosting is £50 a month + VAT.
        </Text>
      </View>
      <View style={{ borderTopWidth: 1, borderTopColor: '#232A33', paddingTop: 20 }}>
        {[
          ['Phone', '01752 845258', 'tel:01752845258'],
          ['Email', 'hello@webminor.co.uk', 'mailto:hello@webminor.co.uk'],
          ['Web', 'webminor.co.uk', 'https://www.webminor.co.uk'],
        ].map(([k, v, href]) => (
          <View key={k} style={{ flexDirection: 'row', marginBottom: 8 }}>
            <Text style={[s.micro, { color: '#9AA3AF', width: 70, marginTop: 4 }]}>{k}</Text>
            <Link src={href} style={{ fontSize: 16, fontWeight: 700, color: C.paper, textDecoration: 'none' }}>
              {v}
            </Link>
          </View>
        ))}
        <Text style={{ fontSize: 8, color: '#6B7480', marginTop: 20, lineHeight: 1.5 }}>
          WebMinor, Unit 3, Gwel Avon Business Park, Gilston Road, Saltash, Cornwall PL12 6TW. WebMinor is a trading name of Able
          Print Limited, registered in England and Wales, company number 05143261. Report for {report.domain}, {date(report.fetchedAt)}.
          Findings reflect the site at the time of checking.
        </Text>
      </View>
    </Page>
  );
}

export default function HealthReport({ report }: { report: SiteReport }) {
  return (
    <Document title={`Website health report — ${report.domain}`} author="WebMinor" creator="WebMinor" subject={report.headline}>
      <Cover report={report} />
      <Glance report={report} />
      <FixFirst report={report} />
      <Speed report={report} />
      <Everything report={report} />
      <NextSteps report={report} />
    </Document>
  );
}
