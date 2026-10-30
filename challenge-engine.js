// Runs the student's program once per test and compares real output.
const Challenge = {
  norm: s => s.replace(/\r/g, "").split("\n").map(l => l.trimEnd()).join("\n").trim(),
  async check(task, code) {
    const results = [];
    for (const t of task.tests) {
      const r = await PythonRunner.run(code, t.input);
      results.push({ t, r, ok: !r.error && this.norm(r.out) === this.norm(t.expected) });
      if (r.timeout) break;
    }
    return results;
  }
};
