function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function coverLetterHtmlTemplate(label: string, content: string): string {
  const paragraphs = content
    .split(/\n{2,}/)
    .map((p) => `<p>${escapeHtml(p.trim()).replace(/\n/g, "<br/>")}</p>`)
    .join("");

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${escapeHtml(label)}</title>
<style>
  @page { margin: 48px; }
  body { font-family: -apple-system, "Helvetica Neue", Arial, sans-serif; color: #111; font-size: 11.5pt; line-height: 1.6; }
  p { margin: 0 0 12px; }
</style>
</head>
<body>
  ${paragraphs}
</body>
</html>`;
}
