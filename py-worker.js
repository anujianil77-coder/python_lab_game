// Runs Python in a Web Worker so an infinite loop can be killed without freezing the page.
importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");
let py;
const ready = loadPyodide().then(p => { py = p; postMessage({ type: "ready" }); });

onmessage = async (e) => {
  await ready;
  const { code, stdin } = e.data;
  const lines = [...stdin];
  let out = "", error = null;
  py.setStdout({ batched: s => { out += s + "\n"; } });
  py.setStderr({ batched: s => { out += s + "\n"; } });
  py.setStdin({ stdin: () => (lines.length ? lines.shift() : undefined) }); // undefined = no more input
  const globals = py.globals.get("dict")(); // fresh namespace for every run
  try {
    py.runPython(code, { globals });
  } catch (err) {
    const m = String(err.message || err).trim().split("\n");
    const i = m.findIndex(l => l.includes('File "<exec>"'));
    error = (i >= 0 ? m.slice(i) : m.slice(-3)).join("\n");
    if (error.includes("EOFError")) error += "\n(Your program asked for more input than was provided in the Program input box.)";
  }
  globals.destroy();
  postMessage({ type: "result", out: out.slice(0, 20000), error });
};
