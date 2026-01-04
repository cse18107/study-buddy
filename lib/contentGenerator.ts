
export const generateClassroomHtml = (content: string) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>My HTML document</title>
</head>
<body>
  ${content}
</body>
</html>

<style>
  :root {
    --bg: #ffffff;
    --text: #111827;
    --muted: #6b7280;
    --divider: #e5e7eb;

    --lvl1: #2563eb;
    --lvl2: #16a34a;
    --lvl3: #ea580c;
    --lvl4: #9333ea;
    --lvl5: #db2777;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 2rem 1rem;
    background: var(--bg);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: var(--text);
    line-height: 1.6;
  }

  .page {
    max-width: 900px;
    margin: auto;
  }

  /* Topic block */
  .topic-block {
    margin-bottom: 2rem;
  }

  /* Topic title */
  .topic-title {
    margin: 0;
    padding-bottom: 0.5rem;
    font-weight: 600;
    border-bottom: 1px solid var(--divider);
  }

  h2.topic-title { font-size: 1.45rem; color: var(--lvl1); }
  h3.topic-title { font-size: 1.25rem; color: var(--lvl2); }
  h4.topic-title { font-size: 1.1rem; color: var(--lvl3); }
  h5.topic-title { font-size: 1rem; color: var(--lvl4); }

  /* Description */
  .topic-description {
    margin: 0.75rem 0;
    font-size: 0.9rem;
    color: var(--muted);
  }

  /* Bullet points */
  .topic-points {
    padding-left: 1.1rem;
    margin: 0;
  }

  .topic-points li {
    margin-bottom: 0.35rem;
    font-size: 0.88rem;
  }

  /* Footer */
  .footer-note {
    margin-top: 2rem;
    text-align: center;
    font-size: 0.75rem;
    color: #9ca3af;
  }
</style>

<script>
console.log("Hello World!");
</script>`;
};
