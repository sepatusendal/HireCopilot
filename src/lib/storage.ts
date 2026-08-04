import { createClient } from "@supabase/supabase-js";

const BUCKET = "documents";

let client: ReturnType<typeof createClient> | undefined;
function getClient() {
  client ??= createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  return client;
}

/**
 * Uploads a file to the "documents" bucket in Supabase Storage and returns
 * its public URL. The bucket must exist and be set to public (or fronted by
 * signed URLs, if this is ever made multi-tenant) — see README setup steps.
 */
export async function uploadDocument(path: string, buffer: Buffer, contentType: string): Promise<string> {
  const supabase = getClient();
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, { contentType, upsert: true });
  if (error) {
    throw new Error(`Failed to upload to Supabase Storage: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
