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

export interface NormalizedJob {
  companyName: string;
  title: string;
  description: string;
  location: string | null;
  isRemote: boolean;
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

export async function fetchArbeitnowJobs(limit = 10): Promise<NormalizedJob[]> {
  const res = await fetch(ARBEITNOW_API_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Arbeitnow API responded with ${res.status}`);
  }

  const json: { data: ArbeitnowJob[] } = await res.json();

  return json.data.slice(0, limit).map((job) => ({
    companyName: job.company_name,
    title: job.title,
    description: stripHtml(job.description),
    location: job.location || null,
    isRemote: job.remote,
    sourceUrl: job.url,
    postedAt: new Date(job.created_at * 1000),
  }));
}
