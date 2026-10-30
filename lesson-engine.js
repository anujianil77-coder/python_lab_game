// Turns lesson data into HTML for each stage.
const LessonEngine = (() => {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Mirrors Python's range(); capped at 30 boxes.
  function rangeView(a, b, s) {
    if (![a, b, s].every(Number.isInteger)) return { html: "<p>Use whole numbers.</p>", code: "" };
    const code = `for i in range(${a}, ${b}, ${s}):\n    print(i)`;
    if (s === 0) return { html: '<p class="bad">Python raises ValueError: step cannot be 0.</p>', code };
    const items = [];
    for (let i = a; s > 0 ? i < b : i > b; i += s) { items.push(i); if (items.length > 30) break; }
    const html = items.length ? items.slice(0, 30).map((v, n) => `<div class="box"><small>trip ${n + 1}</small>${v}</div>`).join("") + (items.length > 30 ? "…" : "")
      : "<p>0 trips: the loop body never runs.</p>";
    return { html, code };
  }

  function card(t, ctx) {
    const n = ctx.hints[t.id] || 0;
    return `<article class="card ${ctx.task === t ? "sel" : ""}"><span class="lvl">${t.level}</span> ${ctx.done[t.id] ? "✅" : ""}
      <h3>${esc(t.title)} <small class="mut">+${t.xp} XP</small></h3><p class="prompt">${esc(t.prompt)}</p>
      <button data-act="open" data-id="${t.id}">Open in editor</button>
      <button data-act="hint" data-id="${t.id}" ${n >= t.hints.length ? "disabled" : ""}>💡 Hint (${n}/${t.hints.length})</button>
      <ol>${t.hints.slice(0, n).map(h => `<li>${esc(h)}</li>`).join("")}</ol></article>`;
  }

  function render(stage, T, ctx) {
    if (stage === "Learn") {
      return `<h2>${esc(T.title)}</h2><p>${esc(T.description)}</p><h3>You will learn to…</h3><ul>${T.objectives.map(o => `<li>${esc(o)}</li>`).join("")}</ul>` +
        T.learn.map(s => `<article><h3>${esc(s.h)}</h3><p>${esc(s.p)}</p><pre>${esc(s.code)}</pre>
          <button data-act="try" data-code="${esc(s.code)}">▶ Try it in the editor</button><p class="mut">${esc(s.explain)}</p></article>`).join("");
    }
    if (stage === "Explore") {
      const v = rangeView(1, 6, 1);
      return `<h2>${esc(T.explore.title)}</h2><p>${esc(T.explore.intro)}</p>
        <div class="row"><label>start<input class="rg" id="r-a" type="number" value="1"></label><label>stop<input class="rg" id="r-b" type="number" value="6"></label><label>step<input class="rg" id="r-c" type="number" value="1"></label></div>
        <div class="boxes" id="boxes">${v.html}</div><pre id="rcode">${esc(v.code)}</pre>
        <button data-act="try-range">▶ Run this in the editor</button><p class="mut">The loop stops BEFORE the stop value. A negative step counts down.</p>`;
    }
    if (stage === "Practice") return "<h2>Practice</h2><p>Open a challenge, write code, then press “Check my solution”.</p>" + T.exercises.map(t => card(t, ctx)).join("");
    if (stage === "Build") return `<h2>Build: ${esc(T.project.title)}</h2><p>${esc(T.project.intro)}</p>` + card(T.project, ctx);
    return "<h2>Free coding</h2><p>Write anything you like in the editor. Use the Program input box to give answers to input(). Press Run as many times as you want.</p>";
  }
  return { render, rangeView, esc };
})();
