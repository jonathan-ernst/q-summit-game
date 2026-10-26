// Test-Bot: spielt die echte Engine im Zeitraffer durch. Nur zum Testen, nicht Teil des Spiels.
window.simRun = function (policy, opts = {}) {
  const realTimeout = window.setTimeout;
  window.setTimeout = (fn) => { try { fn(); } catch (e) { console.error(e); } return 0; };
  muted = true;
  const DT = opts.dt || 0.2;
  const errors = [];
  let busyUntil = 0, lastShiftMgmt = -999; window.__simDay = 0;
  const tr = { dayEnd: null, shiftLoss: 0, shiftGain: 0, late: 0, mgPlayed: 0, maxTasks: 0, events: 0, chatEvents: 0, ambient: 0 };
  const val = opt => {
    const t = { ...s.stats };
    for (const [k, v] of Object.entries(opt.fx)) t[k] = Math.max(0, Math.min(100, t[k] + v));
    return Math.min(...Object.values(t)) * 2 + Object.values(t).reduce((a, b) => a + b, 0) / 6;
  };
  function manageShifts() {
    const st = [...STATIONS].sort((a, b) => s.stats[a.stat] - s.stats[b.stat]);
    let left = ERSTI_GROUPS - 1; // eine Gruppe immer in Pause, wenn möglich
    const alloc = { pause: 1 };
    // Bedarf in 45 Minuten mitdenken
    for (const x of st) { const need = Math.max(x.demand(s.day, s.min), x.demand(s.day, s.min + 40)); const g = Math.min(need, left); alloc[x.id] = g; left -= g; }
    if (left > 0) alloc.pause += left;
    // Wenn eine Station mit niedrigem Wert leer ausgeht, Pause opfern
    for (const x of st) { const need = x.demand(s.day, s.min); if (alloc[x.id] < need && alloc.pause > 0 && s.stats.erstis > 35) { alloc.pause--; alloc[x.id]++; } }
    s.alloc = alloc;
  }
  function useActions() {
    for (const a of ACTIONS) {
      const key = `${s.day}:${a.id}`;
      if (s.actionsUsed.has(key)) continue;
      const gain = Object.entries(a.fx).find(([k, v]) => v > 0);
      const cost = Object.entries(a.fx).find(([k, v]) => v < 0);
      if (gain && s.stats[gain[0]] < 40 && (!cost || s.stats[cost[0]] > 30)) {
        s.actionsUsed.add(key); applyFx(a.fx, true); addLog("Du", a.name, a.fx);
      }
    }
  }
  function playMg(task) {
    tr.mgPlayed++;
    s.mode = "mg"; s.curMg = task;
    const tier = policy === "good" ? 1 : policy === "human" ? (Math.random() < .3 ? 0 : Math.random() < .7 ? 1 : 2) : Math.floor(Math.random() * 3);
    const res = {
      goodies: [{ participants: 10, erstis: 5 }, { erstis: -5 }, { participants: -10, erstis: -5 }],
      badges: [{ participants: 15, erstis: 5 }, { participants: 5 }, { participants: -10, partner: -5 }],
      opening_mic: [{ speaker: 15 }, { speaker: 5 }, { speaker: -5, participants: -5 }],
      pitch_mic: [{ speaker: 15 }, { speaker: 5 }, { speaker: -5, participants: -5 }],
    }[task.q.id][tier];
    mgResult("x", "Bot", "", res);
    endMg();
  }
  function botAct() {
    if (policy === "lazy") return;
    if (policy === "good" && s.min - lastShiftMgmt >= 60) { lastShiftMgmt = s.min; manageShifts(); useActions(); }
    if (policy === "human" && s.min - lastShiftMgmt >= 120) { lastShiftMgmt = s.min; manageShifts(); if (Math.random() < .5) useActions(); }
    if (s.min < busyUntil || !s.tasks.length) return;
    for (const x of s.tasks) if (x.skip === undefined) x.skip = (opts.skipRate || 0) > Math.random();
    const t = s.tasks.filter(x => !x.skip).sort((a, b) => a.deadline - b.deadline)[0];
    if (!t) return;
    const spawned = t.deadline - (t.kind === "chat" ? CHAT_TIME : t.kind === "mg" ? 70 : TASK_TIME);
    const reaction = policy === "human" ? (t.kind === "chat" ? 25 : 45) + Math.random() * 30 : t.kind === "chat" ? 12 : 30; // Spielminuten, bis der Bot da ist bzw. antwortet
    if (s.min < spawned + reaction) return;
    busyUntil = s.min + 5;
    if (t.kind === "mg") return playMg(t);
    const smart = policy === "good" || (policy === "human" && Math.random() < .65);
    const opt = smart ? (val(t.ev.a) >= val(t.ev.b) ? t.ev.a : t.ev.b) : (Math.random() < .5 ? t.ev.a : t.ev.b);
    resolveTask(t, opt);
  }
  try {
    startGame(); beginDay();
    let guard = 0;
    while (guard++ < 200000) {
      if (s.mode === "scene") {
        const nb = document.querySelector("#dialog .dlg-opt[data-next]");
        if (!$("dialog").hidden && nb) nb.click(); else if (s.mode === "scene") { update(DT); }
        continue;
      }
      if (s.mode === "screen") {
        if ($("go")) { tr.dayEnd = { ...s.stats }; beginDay(); continue; }
        break;
      }
      if (s.mode === "dialog") closeDialog();
      if (s.mode === "mg") endMg();
      if (s.day !== window.__simDay) { window.__simDay = s.day; busyUntil = 0; lastShiftMgmt = -999; }
      const before = s.log.length;
      update(DT);
      for (const l of s.log.slice(before)) if (l.who === "Schichtplan" || (l.label && l.label.startsWith("Unterbesetzt"))) for (const v of Object.values(l.fx)) v < 0 ? tr.shiftLoss += v : tr.shiftGain += v;
      tr.maxTasks = Math.max(tr.maxTasks, s.tasks.length);
      if (s.mode === "play") botAct();
    }
  } catch (e) { errors.push(String(e.stack || e)); }
  window.setTimeout = realTimeout;
  const over = $("overlay").innerText.includes("GAME OVER");
  const dead = over ? STATS.find(st => s.stats[st.key] <= 0)?.key : null;
  return { policy, over, dead, day: s.day + 1, time: fmt(s.min), score: scoreNow(), stats: { ...s.stats }, decisions: s.decisions, missed: s.missed,
    used: s.used.size, ambient: s.ambientUsed.size, shiftLoss: tr.shiftLoss, mg: tr.mgPlayed, maxTasks: tr.maxTasks, day1End: tr.dayEnd, errors };
};
window.simMany = function (policy, n, opts) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(simRun(policy, opts));
  const surv = out.filter(r => !r.over);
  const avg = k => (out.reduce((a, r) => a + r[k], 0) / n).toFixed(1);
  const deaths = {}; out.filter(r => r.over).forEach(r => deaths[r.dead + "@T" + r.day] = (deaths[r.dead + "@T" + r.day] || 0) + 1);
  const sc = surv.map(r => r.score).sort((a, b) => a - b);
  return { policy, n, survive: surv.length, deaths, scoreMin: sc[0], scoreMed: sc[sc.length >> 1], scoreMax: sc[sc.length - 1],
    decisions: avg("decisions"), missed: avg("missed"), shiftLoss: avg("shiftLoss"), events: avg("used"), ambient: avg("ambient"), maxTasks: Math.max(...out.map(r => r.maxTasks)),
    errors: [...new Set(out.flatMap(r => r.errors))].slice(0, 3) };
};
