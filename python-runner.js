// Talks to the worker. run() resolves with {out, error, timeout}.
const PythonRunner = (() => {
  let worker, isReady = false, onReadyFn = () => {}, pending = null;
  function start() {
    isReady = false;
    worker = new Worker("js/py-worker.js");
    worker.onmessage = (e) => {
      if (e.data.type === "ready") { isReady = true; onReadyFn(); }
      else if (pending) { const p = pending; pending = null; p(e.data); }
    };
  }
  const waitReady = () => new Promise(res => { const t = setInterval(() => { if (isReady) { clearInterval(t); res(); } }, 100); });
  async function run(code, stdin = [], ms = 5000) {
    await waitReady();
    return new Promise(resolve => {
      const timer = setTimeout(() => {
        pending = null; worker.terminate(); start(); // kill the runaway program, boot a fresh Python
        resolve({ out: "", timeout: true, error: "⏱ Stopped after 5 seconds. Does your loop condition ever become False?" });
      }, ms);
      pending = (r) => { clearTimeout(timer); resolve(r); };
      worker.postMessage({ code, stdin });
    });
  }
  start();
  return { run, onReady(fn) { onReadyFn = fn; if (isReady) fn(); } };
})();
