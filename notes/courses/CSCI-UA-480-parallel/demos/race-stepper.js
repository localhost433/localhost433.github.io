/* AUTO-GENERATED from race-stepper.jsx by `npm run build:artifacts`. Do not edit. */
import React from "react";
import { useColors, buttonStyle, labelStyle, MONO } from "@course";
import { raceInit, raceStep, raceRun, raceCanStep, raceNextOp, raceOps, raceEnumerate, raceDoomed, raceRandomRun, raceFailureProbability } from "@course/logic";

/* The race on x += my_val (note 04; L4 slide 7, book §2.4.3), stepped one machine
   operation at a time. The book's numbers: x starts at 0, thread 0 computes 7,
   thread 1 computes 19, so the right answer is 26. `x += my_val` is shown as the
   three operations it really is (load, add, store), because the race lives in
   the gap between the load and the store and is invisible at statement level.

   Second pass, for learning rather than for display:
   - the step log is the book's own table (Time | Core 0 | Core 1), one row per
     step with the operation in the column of the thread that moved, so the
     interleaving is visible as a shape;
   - the moment the update becomes lost is flagged when it happens: at the second
     load, when both threads hold the same old x (raceDoomed), long before the
     final store makes the damage visible;
   - "Random order" runs a fair coin-flip scheduler and keeps a tally, next to the
     exact probability computed over the whole tree of choices. */

const LINES = {
  compute: t => `my_val = Compute_val(${t});`,
  lock: () => "Lock(&add_my_val_lock);",
  load: () => "load x into a register",
  add: () => "add my_val to the register",
  store: () => "store the register into x",
  unlock: () => "Unlock(&add_my_val_lock);"
};
const BOOK_ORDER = [0, 1, 0, 1, 0, 0, 1, 1];
function describe(e) {
  switch (e.op) {
    case "compute":
      return `my_val = ${e.myVal}`;
    case "lock":
      return "takes the lock";
    case "load":
      return `loads x = ${e.reg}`;
    case "add":
      return `register = ${e.reg}`;
    case "store":
      return `stores x = ${e.x}`;
    case "unlock":
      return "releases the lock";
    default:
      return "";
  }
}

// 0.625 -> "5/8": the exact probability reads better as a fraction.
function fraction(p) {
  for (let d = 1; d <= 256; d++) {
    const n = Math.round(p * d);
    if (Math.abs(n / d - p) < 1e-9) return `${n}/${d}`;
  }
  return p.toFixed(3);
}
export default function RaceStepper() {
  const C = useColors();
  const [useLock, setUseLock] = React.useState(false);
  const [s, setS] = React.useState(() => raceInit());
  const [tally, setTally] = React.useState({
    runs: 0,
    lost: 0
  });
  const counts = React.useMemo(() => ({
    plain: raceEnumerate(),
    locked: raceEnumerate({
      useLock: true
    })
  }), []);
  const pFail = React.useMemo(() => ({
    plain: raceFailureProbability(),
    locked: raceFailureProbability({
      useLock: true
    })
  }), []);
  const reset = (lock = useLock) => setS(raceInit({
    useLock: lock
  }));
  const toggleLock = on => {
    setUseLock(on);
    reset(on);
    setTally({
      runs: 0,
      lost: 0
    });
  };
  const done = s.threads.every(t => t.done);
  const expected = s.x0 + s.threads.reduce((a, t) => a + t.val, 0);
  const ops = raceOps(s);
  const doomed = raceDoomed(s);

  // The step at which the update became lost: replay the log one step at a time.
  const doomStep = React.useMemo(() => {
    let t = raceInit({
      useLock: s.useLock
    });
    for (let i = 0; i < s.log.length; i++) {
      t = raceStep(t, s.log[i].tid);
      if (raceDoomed(t)) return i;
    }
    return -1;
  }, [s]);
  const random = () => {
    const end = raceRandomRun({
      useLock
    });
    setS(end);
    setTally(t => ({
      runs: t.runs + 1,
      lost: t.lost + (end.x !== expected ? 1 : 0)
    }));
  };
  const card = tid => {
    const th = s.threads[tid];
    const next = raceNextOp(s, tid);
    const blocked = next === "lock" && !raceCanStep(s, tid);
    return /*#__PURE__*/React.createElement("div", {
      key: tid,
      style: {
        flex: "1 1 240px",
        minWidth: 0,
        border: `1px solid ${C.border}`,
        borderLeft: `4px solid ${C.T[tid]}`,
        borderRadius: 8,
        padding: "10px 12px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 8,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("strong", {
      style: {
        fontSize: 14
      }
    }, "Thread ", tid), /*#__PURE__*/React.createElement("span", {
      style: {
        ...labelStyle(C),
        fontFamily: MONO
      }
    }, "my_val: ", th.myVal ?? "–", " \xB7 register: ", th.reg ?? "–")), /*#__PURE__*/React.createElement("ol", {
      style: {
        listStyle: "none",
        padding: 0,
        margin: "8px 0",
        fontFamily: MONO,
        fontSize: 13,
        lineHeight: 1.7
      }
    }, ops.map((op, i) => {
      const isNext = !th.done && i === th.pc;
      const past = i < th.pc;
      const inCs = op === "load" || op === "add" || op === "store";
      const head = op === "load" ? /*#__PURE__*/React.createElement("li", {
        key: "h" + i,
        "aria-hidden": "true",
        style: {
          color: C.muted,
          fontSize: 12,
          padding: "0 6px 0 26px"
        }
      }, "x += my_val, as the hardware runs it:") : null;
      return [head, /*#__PURE__*/React.createElement("li", {
        key: i,
        style: {
          display: "flex",
          gap: 8,
          color: past ? C.muted : C.fg,
          background: isNext ? C.border : "transparent",
          borderRadius: 4,
          padding: "0 6px"
        }
      }, /*#__PURE__*/React.createElement("span", {
        "aria-hidden": "true",
        style: {
          width: 12,
          color: C.muted
        }
      }, past ? "✓" : isNext ? "▶" : ""), /*#__PURE__*/React.createElement("span", {
        style: {
          paddingLeft: inCs ? 14 : 0
        }
      }, LINES[op](tid)))];
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      disabled: !raceCanStep(s, tid),
      onClick: () => setS(raceStep(s, tid)),
      style: buttonStyle(C, false, !raceCanStep(s, tid))
    }, th.done ? `Thread ${tid} is done` : blocked ? `Thread ${tid} waits for the lock` : `Step thread ${tid}`));
  };
  const lost = done && s.x !== expected;
  const c = useLock ? counts.locked : counts.plain;
  const p = useLock ? pFail.locked : pFail.plain;
  const dot = color => /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 10,
      height: 10,
      borderRadius: 5,
      background: color,
      flex: "0 0 auto"
    }
  });
  const cell = {
    padding: "3px 12px 3px 6px",
    textAlign: "left",
    fontFamily: MONO,
    fontSize: 13
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      color: C.fg
    }
  }, /*#__PURE__*/React.createElement("span", {
    "data-artifact-title": true,
    hidden: true
  }, "The race on x += my_val, one operation at a time"), /*#__PURE__*/React.createElement("h2", {
    className: "sr-only"
  }, "Step two threads through x += my_val one machine operation at a time, with or without a lock, see the moment an update is lost, and run random orders."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: labelStyle(C)
  }, "lock around x += my_val"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C, !useLock),
    "aria-pressed": !useLock,
    onClick: () => toggleLock(false)
  }, "off"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C, useLock),
    "aria-pressed": useLock,
    onClick: () => toggleLock(true)
  }, "on"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C, false, useLock),
    disabled: useLock,
    onClick: () => setS(raceRun(raceInit(), BOOK_ORDER))
  }, "The book's order"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C),
    onClick: () => setS(raceRun(raceInit({
      useLock
    }), [...ops.map(() => 0), ...ops.map(() => 1)]))
  }, "One after the other"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C),
    onClick: random
  }, "Random order"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C),
    onClick: () => reset()
  }, "Reset")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      flexWrap: "wrap",
      border: `1px solid ${doomed && !done ? C.neg : C.border}`,
      borderRadius: 8,
      padding: "8px 12px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 15
    }
  }, "shared x = ", /*#__PURE__*/React.createElement("strong", null, s.x)), useLock && /*#__PURE__*/React.createElement("span", {
    style: {
      ...labelStyle(C),
      fontFamily: MONO
    }
  }, "lock: ", s.lock === null ? "free" : `held by thread ${s.lock}`), doomed && !done && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 14
    }
  }, dot(C.neg), "Both threads loaded x = ", s.x0, " before either stored it. Whichever stores last wins: one update is already lost."), done && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 14
    }
  }, dot(lost ? C.neg : C.pos), lost ? `x = ${s.x}, but ${[s.x0, ...s.threads.map(t => t.val)].join(" + ")} = ${expected}: one thread's update was lost` : `x = ${expected}: both updates landed`)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      flexWrap: "wrap"
    }
  }, [0, 1].map(card)), s.log.length > 0 && /*#__PURE__*/React.createElement("table", {
    style: {
      borderCollapse: "collapse",
      alignSelf: "flex-start"
    },
    "aria-label": "Order of steps so far"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      color: C.muted
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      ...cell,
      fontWeight: 500
    }
  }, "Time"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...cell,
      fontWeight: 500,
      borderBottom: `2px solid ${C.T[0]}`
    }
  }, "Thread 0"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...cell,
      fontWeight: 500,
      borderBottom: `2px solid ${C.T[1]}`
    }
  }, "Thread 1"), /*#__PURE__*/React.createElement("th", {
    style: cell
  }))), /*#__PURE__*/React.createElement("tbody", null, s.log.map((e, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      background: i === doomStep ? C.border : "transparent"
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      ...cell,
      color: C.muted
    }
  }, i), /*#__PURE__*/React.createElement("td", {
    style: cell
  }, e.tid === 0 ? describe(e) : ""), /*#__PURE__*/React.createElement("td", {
    style: cell
  }, e.tid === 1 ? describe(e) : ""), /*#__PURE__*/React.createElement("td", {
    style: {
      ...cell,
      fontFamily: "inherit",
      fontSize: 12.5,
      color: C.fg
    }
  }, i === doomStep ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, dot(C.neg), "the update is lost here") : null))))), /*#__PURE__*/React.createElement("p", {
    style: {
      ...labelStyle(C),
      margin: 0,
      lineHeight: 1.55
    }
  }, useLock ? `With the lock, every one of the ${c.total} orders the lock allows ends at ${expected}. The step outside the lock (computing my_val) can still interleave; the three inside cannot, which is what makes the update atomic.` : `There are ${c.total} ways to interleave these eight steps. ${c.total - c.outcomes[expected]} of them lose an update (${c.outcomes[7]} end at 7, ${c.outcomes[19]} at 19); only the ${c.outcomes[expected]} in which one thread's load comes after the other thread's store give ${expected}.`), /*#__PURE__*/React.createElement("p", {
    style: {
      ...labelStyle(C),
      margin: 0,
      lineHeight: 1.55
    }
  }, tally.runs > 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, "Random orders so far: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: C.fg
    }
  }, tally.runs), ", of which ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: C.fg
    }
  }, tally.lost), " lost an update (", Math.round(100 * tally.lost / tally.runs), "%). ") : "Press Random order a few times. ", useLock ? "With the lock no order loses an update, so the tally stays at zero." : `A scheduler that flips a fair coin at every step loses the update with probability exactly ${fraction(p)} (${(100 * p).toFixed(1)}%). That is not ${c.total - c.outcomes[expected]}/${c.total}: the coin does not produce the ${c.total} orders equally often (each fully serial order comes up 1 time in ${2 ** ops.length}, not 1 in ${c.total}).`));
}