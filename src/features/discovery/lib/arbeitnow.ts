const ARBEITNOW_API_URL = "https://www.arbeitnow.com/api/job-board-api";

interface ArbeitnowJob {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  location: string;
  created_at: number;
}

export type WorkMode = "ONSITE" | "REMOTE" | "HYBRID";

export interface NormalizedJob {
  companyName: string;
  title: string;
  description: string;
  location: string | null;
  isRemote: boolean;
  workMode: WorkMode;
  sourceUrl: string;
  postedAt: Date;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Arbeitnow only gives a remote boolean, no hybrid distinction — hybrid is
// inferred from the listing text itself rather than left unclassified.
// Deterministic keyword match, not an AI guess, same reasoning as the ATS
// keyword analysis: a classification like this should be traceable, not a
// black-box call.
function inferWorkMode(isRemote: boolean, description: string): WorkMode {
  if (/\bhybrid\b/i.test(description)) return "HYBRID";
  if (isRemote) return "REMOTE";
  return "ONSITE";
}

export async function fetchArbeitnowJobs(limit = 10): Promise<NormalizedJob[]> {
  const res = await fetch(ARBEITNOW_API_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Arbeitnow API responded with ${res.status}`);
  }

  const json: { data: ArbeitnowJob[] } = await res.json();

  return json.data.slice(0, limit).map((job) => {
    const description = stripHtml(job.description);
    return {
      companyName: job.company_name,
      title: job.title,
      description,
      location: job.location || null,
      isRemote: job.remote,
      workMode: inferWorkMode(job.remote, description),
      sourceUrl: job.url,
      postedAt: new Date(job.created_at * 1000),
    };
  });
}
