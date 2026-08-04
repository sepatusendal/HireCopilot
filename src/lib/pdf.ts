import puppeteer from "puppeteer-core";

// @sparticuz/chromium ships a Chromium binary that works inside Vercel's
// serverless functions (Lambda-compatible). Locally there's no such binary,
// so we fall back to a real Chrome install via CHROME_EXECUTABLE_PATH (or the
// default macOS/Linux install paths) — set this in .env.local for local PDF
// testing; production (Vercel) doesn't need it.
async function resolveExecutablePath(): Promise<string> {
  if (process.env.CHROME_EXECUTABLE_PATH) return process.env.CHROME_EXECUTABLE_PATH;

  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const chromium = (await import("@sparticuz/chromium")).default;
    return chromium.executablePath();
  }

  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
  ];
  const fs = await import("node:fs");
  const found = candidates.find((p) => fs.existsSync(p));
  if (!found) {
    throw new Error(
      "No local Chrome found for PDF rendering. Set CHROME_EXECUTABLE_PATH in .env.local, or deploy to Vercel where @sparticuz/chromium is used automatically."
    );
  }
  return found;
}

export async function renderHtmlToPdf(html: string): Promise<Buffer> {
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  const chromium = isServerless ? (await import("@sparticuz/chromium")).default : null;

  const browser = await puppeteer.launch({
    executablePath: await resolveExecutablePath(),
    args: chromium?.args ?? [],
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdf = await page.pdf({ format: "a4", printBackground: true });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
