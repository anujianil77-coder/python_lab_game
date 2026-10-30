// Saves XP, finished tasks and badges in this browser only.
const Progress = (() => {
  const KEY = "pythonlab.progress.v1";
  let data; try { data = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
  data = data || { xp: 0, done: {}, badges: [] };
  return {
    data,
    save() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} },
    reset() { data.xp = 0; data.done = {}; data.badges = []; this.save(); }
  };
})();
