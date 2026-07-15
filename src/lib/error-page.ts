export function renderErrorPage(): string {
  return `<!doctype html><html><head><meta charset="utf-8"><title>Error — TruHub Lab</title>
<style>body{margin:0;background:#030712;color:#e5e7eb;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh}
.box{max-width:420px;text-align:center;padding:2rem;border:1px solid #1f2937;border-radius:12px;background:#0b1220}
h1{margin:0 0 .5rem;font-size:1.25rem}p{color:#94a3b8;margin:0 0 1rem}a{color:#38bdf8}</style></head>
<body><div class="box"><h1>Something went wrong</h1><p>The simulator hit an unexpected error.</p><a href="/">Reload TruHub Lab</a></div></body></html>`;
}
