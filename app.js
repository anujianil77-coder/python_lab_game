// Wires the page together: tabs, editor, run/check buttons, XP.
const T = Object.values(LESSONS)[0];            // the current topic
const TASKS = [...T.exercises, T.project];
const STAGES = ["Learn", "Explore", "Practice", "Build", "Code"];
const $ = id => document.getElementById(id);
const FREE = '# Free coding: change me and press Run!\nfor i in range(3):\n    print("Python Lab", i)\n';
let stage = "Learn", task = null, hints = {};

const cm = CodeMirror.fromTextArea($("editor"), { mode: "python", theme: "dracula", lineNumbers: true, indentUnit: 4,
  extraKeys: { Tab: c => c.replaceSelection("    ") } });

function drawHeader() {
  const d = Progress.data, n = TASKS.filter(t => d.done[t.id]).length;
  $("xp").textContent = d.xp + " XP";
  $("bar").style.width = (100 * n / TASKS.length) + "%";
  $("pct").textContent = n + "/" + TASKS.length;
  $("badges").textContent = d.badges.includes(T.badge.id) ? T.badge.icon + " " + T.badge.name : "";
}
const drawTabs = () => $("tabs").innerHTML = STAGES.map(s => `<button class="${s === stage ? "on" : ""}" data-stage="${s}">${s}</button>`).join("");
const drawPanel = () => $("panel").innerHTML = LessonEngine.render(stage, T, { hints, task, done: Progress.data.done });

function openTask(t, code) {
  task = t;
  cm.setValue(code ?? (t ? t.starter : FREE));
  $("stdin").value = t?.sample || "";
  $("task-title").textContent = t ? t.title : "Free coding";
  $("check").hidden = !t;
  $("out").textContent = ""; $("feedback").innerHTML = "";
}
function setStage(s) {
  stage = s;
  if (s === "Code") openTask(null);
  if (s === "Practice" && !T.exercises.includes(task)) openTask(T.exercises[0]);
  if (s === "Build") openTask(T.project);
  drawTabs(); drawPanel();
}
const busy = b => ["run", "check"].forEach(id => $(id).disabled = b);

document.addEventListener("click", e => {
  const b = e.target.closest("[data-act],[data-stage]"); if (!b) return;
  if (b.dataset.stage) return setStage(b.dataset.stage);
  const act = b.dataset.act, t = TASKS.find(x => x.id === b.dataset.id);
  if (act === "open") { openTask(t); drawPanel(); }
  if (act === "hint") { hints[t.id] = (hints[t.id] || 0) + 1; drawPanel(); }
  if (act === "try") openTask(null, b.dataset.code);
  if (act === "try-range") openTask(null, $("rcode").textContent + "\n");
});
document.addEventListener("input", e => {
  if (!e.target.classList.contains("rg")) return;
  const v = LessonEngine.rangeView(+$("r-a").value, +$("r-b").value, +$("r-c").value);
  $("boxes").innerHTML = v.html; $("rcode").textContent = v.code;
});

$("run").onclick = async () => {
  busy(true); $("out").textContent = "Running…";
  const r = await PythonRunner.run(cm.getValue(), $("stdin").value === "" ? [] : $("stdin").value.split("\n"));
  $("out").textContent = (r.out + (r.error ? "\n" + r.error : "")).trim() || "(no output)";
  busy(false);
};
$("clear").onclick = () => { $("out").textContent = ""; $("feedback").innerHTML = ""; };
$("reset").onclick = () => openTask(task);
$("wipe").onclick = () => { if (confirm("Erase all XP and progress?")) { Progress.reset(); hints = {}; drawHeader(); drawPanel(); } };

$("check").onclick = async () => {
  busy(true); $("feedback").textContent = "Running tests…";
  const res = await Challenge.check(task, cm.getValue());
  const fails = res.filter(r => !r.ok), total = task.tests.length, esc = LessonEngine.esc;
  if (!fails.length && res.length === total) {
    let msg = `✅ All ${total} tests passed!`, d = Progress.data;
    if (!d.done[task.id]) {
      d.done[task.id] = true; d.xp += task.xp; msg += ` +${task.xp} XP`;
      if (task === T.project) { d.badges.push(T.badge.id); msg += ` · Badge unlocked: ${T.badge.icon} ${T.badge.name}`; }
      Progress.save(); drawHeader(); drawPanel();
    } else msg += " (XP already earned)";
    if (task === T.project) msg += `<br>Skills learned: ${T.skills.join(", ")}<br>${esc(T.next)}`;
    else msg += "<br>Nice! Open the next challenge in the Practice or Build tab.";
    $("feedback").innerHTML = `<div class="ok">${msg}</div>`;
  } else {
    const f = fails[0];
    $("feedback").innerHTML = `<div class="bad">❌ ${res.length - fails.length}/${total} tests passed.<br>Failed test — input: <code>${esc(f.t.input.join(", ") || "(none)")}</code>
      <br>Expected:<pre>${esc(f.t.expected)}</pre>${f.r.error ? "Error:" : "Your output:"}<pre>${esc(f.r.error || f.r.out || "(nothing)")}</pre><small>Stuck? Reveal a hint on the left.</small></div>`;
  }
  busy(false);
};

PythonRunner.onReady(() => $("loading").hidden = true);
drawHeader(); setStage("Learn");
