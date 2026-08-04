import type { ResumeContent } from "@/features/resume/schema";

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function resumeHtmlTemplate(label: string, content: ResumeContent): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${escapeHtml(label)}</title>
<style>
  @page { margin: 36px; }
  body { font-family: -apple-system, "Helvetica Neue", Arial, sans-serif; color: #111; font-size: 11pt; line-height: 1.5; }
  h1 { font-size: 18pt; margin: 0 0 4px; }
  h2 { font-size: 11pt; text-transform: uppercase; letter-spacing: 0.04em; color: #555; margin: 20px 0 8px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
  p { margin: 0 0 8px; }
  ul { margin: 0 0 8px; padding-left: 18px; }
  .skills { display: flex; flex-wrap: wrap; gap: 6px; }
  .skill { border: 1px solid #ccc; border-radius: 999px; padding: 2px 10px; font-size: 9.5pt; }
  .experience { margin-bottom: 14px; }
  .experience .title { font-weight: 700; }
  .experience .company { color: #555; }
</style>
</head>
<body>
  <h1>${escapeHtml(label)}</h1>
  <p>${escapeHtml(content.summary)}</p>

  ${
    content.skills.length > 0
      ? `<h2>Skills</h2><div class="skills">${content.skills.map((s) => `<span class="skill">${escapeHtml(s)}</span>`).join("")}</div>`
      : ""
  }

  ${
    content.experiences.length > 0
      ? `<h2>Experience</h2>${content.experiences
          .map(
            (e) => `<div class="experience">
              <p><span class="title">${escapeHtml(e.title)}</span> — <span class="company">${escapeHtml(e.company)}</span></p>
              ${e.bullets.length > 0 ? `<ul>${e.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
            </div>`
          )
          .join("")}`
      : ""
  }
</body>
</html>`;
}
