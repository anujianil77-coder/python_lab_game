# Python Lab — Learn, Code, Build

Static site: HTML/CSS/JS + Pyodide (Python in the browser, inside a Web Worker) + CodeMirror.

## Run locally
Web Workers need http, not file://:

    cd python-lab
    python -m http.server 8000      # open http://localhost:8000

## Add a topic
Add a new key to `LESSONS` in `data/lessons.js` (same shape as `loops`). The app currently shows the first topic.

## Publish on GitHub Pages
    git init && git add . && git commit -m "Python Lab: loops"
    git branch -M main
    git remote add origin https://github.com/<you>/python-lab.git
    git push -u origin main
Then: repo Settings → Pages → Deploy from branch → `main` / root.

## Notes
- Tests run the student's program with fixed input lines and compare printed output exactly, so use `input()` without prompt text.
- Programs are stopped after 5 seconds (infinite-loop protection).
- Progress lives in localStorage: per browser, no sync.
