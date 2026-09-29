import React from "react";
import { useColors, Figure, FigureSvg, Sym, MONO, buttonStyle, readoutStyle, labelStyle } from "@course";
import { timingRun } from "@course/logic";

/* Three clocks on one threaded region (note 06; L6 slides 16-20, book §2.6.4).
   Each thread runs 2 s of its own code and 0.25 s in the kernel, on its own core.
   Toggle a 1.5 s wait on thread B (blocked on a message, asleep, off the CPU). The
   readout is what a stopwatch, `time prog` and clock() would each report. The point
   is the gap: clock() adds the threads' CPU time together, so it grows with the
   thread count while the stopwatch does not, and it never sees time spent waiting. */

const X0 = 110, PX = 64, ROW = 30, TOP = 30;
const USER = 2, SYS = 0.25, WAIT = 1.5;

export default function TimingClocks() {
  const C = useColors();
  const [threads, setThreads] = React.useState(4);
  const [waits, setWaits] = React.useState(false);
  const r = timingRun({ threads, user: USER, sys: SYS, wait: waits ? [0, WAIT] : [] });
  const W = X0 + 4 * PX + 40;
  const H = TOP + threads * ROW + 46;
  const f = (v) => v.toFixed(2);

  return (
    <Figure
      title="A timeline of several threads, each running its own code and some kernel time, with an optional wait on one thread, and the times a stopwatch, the time command and clock() would report for it."
      caption="Slide 18's `time prog` prints real (the wall clock), user and sys, and slide 20 warns that for a multithreaded program clock() returns the CPU time of all threads added together. Add threads and clock() climbs while the stopwatch stays put: it measures work done, not time elapsed. Turn on the wait and the stopwatch moves while clock() does not, because a blocked thread is asleep and uses no CPU (book §2.6.4). That is why reported parallel run-times are wall-clock times, taken from a barrier to the last thread's finish."
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
        <span style={labelStyle(C)}>threads</span>
        {[1, 2, 4].map((n) => (
          <button key={n} type="button" style={buttonStyle(C, threads === n)} aria-pressed={threads === n}
            onClick={() => setThreads(n)}>{n}</button>
        ))}
        <button type="button" style={buttonStyle(C, waits, threads < 2)} disabled={threads < 2} aria-pressed={waits}
          onClick={() => setWaits((w) => !w)}>thread B waits for a message</button>
      </div>
      <FigureSvg viewBox={`0 0 ${W} ${H}`} maxWidth={560} align="left"
        ariaLabel={`${threads} threads. ${r.threads.map((t, i) => `Thread ${"ABCD"[i]}: ${t.user} s user, ${t.sys} s sys${t.wait ? `, ${t.wait} s waiting` : ""}`).join("; ")}. Wall clock ${f(r.real)} s, clock() ${f(r.clock)} s.`}>
        <defs>
          <pattern id="tcsys" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="5" height="5" fill={C.bg} />
            <line x1="0" y1="0" x2="0" y2="5" stroke={C.muted} strokeWidth="2" />
          </pattern>
        </defs>
        {[0, 1, 2, 3, 4].map((s) => (
          <g key={s}>
            <line x1={X0 + s * PX} y1={TOP - 6} x2={X0 + s * PX} y2={TOP + threads * ROW} stroke={C.border} strokeWidth="1" />
            <Sym x={X0 + s * PX} y={TOP + threads * ROW + 14} text={`${s} s`} size={11} fill={C.muted} anchor="middle" />
          </g>
        ))}
        {r.threads.map((t, i) => {
          const y = TOP + i * ROW;
          // user work, split around the wait: the thread blocks halfway through
          const half = t.wait ? USER / 2 : USER;
          const segs = [
            { x: 0, w: half, kind: "user" },
            ...(t.wait ? [{ x: half, w: t.wait, kind: "wait" }, { x: half + t.wait, w: USER - half, kind: "user" }] : []),
            { x: t.user + t.wait, w: t.sys, kind: "sys" },
          ];
          return (
            <g key={i}>
              <Sym x={X0 - 12} y={y + 15} text={`thread ${"ABCD"[i]}`} size={12} fill={C.fg} anchor="end" />
              {segs.map((s, k) => s.kind === "user"
                ? <rect key={k} x={X0 + s.x * PX} y={y + 3} width={s.w * PX} height={ROW - 10} rx={2} fill={C.T[i]} opacity={0.85} />
                : s.kind === "sys"
                  ? <rect key={k} x={X0 + s.x * PX} y={y + 3} width={s.w * PX} height={ROW - 10} fill="url(#tcsys)" stroke={C.muted} strokeWidth="1" />
                  : <g key={k}>
                      <line x1={X0 + s.x * PX} y1={y + 3 + (ROW - 10) / 2} x2={X0 + (s.x + s.w) * PX} y2={y + 3 + (ROW - 10) / 2} stroke={C.muted} strokeWidth="1.4" strokeDasharray="3 3" />
                      <Sym x={X0 + (s.x + s.w / 2) * PX} y={y + 26} text="asleep, waiting" size={10.5} fill={C.muted} anchor="middle" />
                    </g>)}
            </g>
          );
        })}
        <line x1={X0 + r.real * PX} y1={TOP - 12} x2={X0 + r.real * PX} y2={TOP + threads * ROW} stroke={C.fg} strokeWidth="1.4" strokeDasharray="6 3" />
        <Sym x={X0 + r.real * PX} y={TOP - 15} text="last thread done" size={11} fill={C.fg} anchor="middle" />
        <Sym x={X0} y={TOP + threads * ROW + 32} text="start (after a barrier)" size={11} fill={C.muted} />
      </FigureSvg>

      <div style={{ ...labelStyle(C), display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 14, height: 12, background: C.T[0], opacity: 0.85, borderRadius: 2, display: "inline-block" }} />user CPU time</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><svg width="14" height="12" aria-hidden="true"><rect width="14" height="12" fill="url(#tcsys)" stroke={C.muted} /></svg>system CPU time</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><svg width="16" height="12" aria-hidden="true"><line x1="0" y1="6" x2="16" y2="6" stroke={C.muted} strokeWidth="1.4" strokeDasharray="3 3" /></svg>blocked, no CPU</span>
      </div>
      <p style={{ ...readoutStyle(C), margin: 0, whiteSpace: "pre-wrap", fontFamily: MONO }}>
        {`stopwatch        ${f(r.real)} s\ntime prog: real  ${f(r.real)} s\n           user  ${f(r.user)} s\n           sys   ${f(r.sys)} s\nclock()          ${f(r.clock)} s  (${threads} thread${threads > 1 ? "s" : ""})`}
      </p>
    </Figure>
  );
}
