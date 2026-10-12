// KFL tools — manifest resolution shared by grid/generate.mjs and grid/audit.mjs,
// so the generator and the auditor can never disagree about inheritance.
//
// Breakpoints inherit unspecified fields from the previous one; the first one
// inherits the Swiss grid reference defaults (12 / 20 / 40 / 1440). Region spans
// and optional starts inherit down the breakpoint list the same way; a start of
// "auto" (the default) lets the region flow, a number pins its first track so
// empty tracks before it are declared, not nudged. A region without `spans` has no
// span map: use it for regions of a data-grid="local" layout (a rail, an inspector)
// and for specimen blocks whose spans vary; the audit checks only its track edges
// and declared min/max.
export const SWISS_DEFAULTS = { columns: 12, gutter: 20, margin: 40, container: 1440 };

export function resolveManifest(manifest, fail) {
  const int = (v, def, min, max, label) => {
    if (v === undefined) return def;
    const n = Number(v);
    if (!Number.isInteger(n) || n < min || n > max) fail(`${label} must be an integer in [${min}, ${max}]`);
    return n;
  };
  const num = (v, def, label) => {
    if (v === undefined) return def;
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0) fail(`${label} must be a non-negative number`);
    return n;
  };

  const bps = [];
  const ids = new Set();
  let prev = SWISS_DEFAULTS;
  for (const bp of manifest.breakpoints ?? []) {
    const id = String(bp.id ?? `bp${bps.length}`);
    if (ids.has(id)) fail(`duplicate breakpoint "${id}"`);
    ids.add(id);
    if (bps.length && !(bp.minWidth > bps[bps.length - 1].minWidth)) fail(`breakpoint "${id}": minWidth must be strictly ascending`);
    const r = {
      id,
      minWidth: num(bp.minWidth, undefined, `minWidth@${id}`),
      columns: int(bp.columns, prev.columns, 1, 24, `columns@${id}`),
      gutter: num(bp.gutter, prev.gutter, `gutter@${id}`),
      margin: num(bp.margin, prev.margin, `margin@${id}`),
      container: num(bp.container, prev.container, `container@${id}`),
      rationale: bp.rationale,
    };
    if (!Number.isFinite(r.minWidth)) fail(`breakpoint "${id}": minWidth is required`);
    bps.push(r);
    prev = r;
  }
  if (!bps.length) fail('manifest.breakpoints must not be empty');

  const regions = [];
  const roles = new Set();
  for (const region of manifest.regions ?? []) {
    if (!region.role) fail('every region needs a "role"');
    if (typeof region.role !== 'string' || !/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(region.role)) fail('region role must be a CSS-safe identifier');
    if (roles.has(region.role)) fail(`duplicate region "${region.role}"`);
    roles.add(region.role);
    const local = region.spans === undefined;
    const spans = {};
    const starts = {};
    if (local && region.starts !== undefined) fail(`local region "${region.role}" cannot declare starts; it has no page span`);
    if (!local) {
      let prevSpan;
      let prevStart = 'auto';
      for (const bp of bps) {
        const s = int(region.spans[bp.id] ?? prevSpan, undefined, 1, 24, `region "${region.role}" spans@${bp.id}`);
        if (s === undefined) fail(`region "${region.role}" needs spans.${bp.id}`);
        if (s > bp.columns) fail(`region "${region.role}" spans ${s} columns at "${bp.id}" but that breakpoint has ${bp.columns}`);
        const raw = region.starts?.[bp.id] ?? prevStart;
        const st = raw === 'auto' ? 'auto' : int(raw, undefined, 1, 24, `region "${region.role}" starts@${bp.id}`);
        if (st !== 'auto' && st + s - 1 > bp.columns) fail(`region "${region.role}" starts at track ${st} with span ${s} at "${bp.id}", past its ${bp.columns} columns`);
        spans[bp.id] = s;
        starts[bp.id] = st;
        prevSpan = s;
        prevStart = st;
      }
    }
    regions.push({ ...region, local, spans, starts });
  }
  return { bps, regions };
}

// The breakpoint active at a viewport width (the first one covers anything narrower).
export function breakpointAt(bps, width) {
  return [...bps].reverse().find((b) => width >= b.minWidth) ?? bps[0];
}
