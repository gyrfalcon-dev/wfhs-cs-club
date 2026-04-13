import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const joinTable = process.env.SUPABASE_JOIN_TABLE ?? "join_submissions";
const contentBucket = process.env.SUPABASE_CONTENT_BUCKET ?? "content-media";

function buildSetupHint(details: string) {
  return `${details} Run supabase/schema.sql against your Supabase project and verify .env.local has the required SUPABASE_* keys.`;
}

function getSupabaseConfig() {
  if (!supabaseUrl) {
    throw new Error(
      "Missing SUPABASE_URL. Add it to .env.local before using the Supabase-backed content admin.",
    );
  }

  if (!supabaseServiceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Add it to .env.local before using the Supabase-backed content admin.",
    );
  }

  return {
    contentBucket,
    joinTable,
    supabaseServiceRoleKey,
    supabaseUrl,
  };
}

let serviceClient: SupabaseClient | undefined;

export function getServiceSupabase() {
  if (!serviceClient) {
    const { supabaseServiceRoleKey, supabaseUrl } = getSupabaseConfig();
    serviceClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return serviceClient;
}

export function getContentBucket() {
  return getSupabaseConfig().contentBucket;
}

export function getJoinTable() {
  return getSupabaseConfig().joinTable;
}

export function getContentTableNames() {
  return {
    devLogs: "dev_logs",
    events: "events",
    projects: "projects",
  } as const;
}

export function formatSupabaseSetupError(resource: string, message: string) {
  if (message.includes("relation") && message.includes("does not exist")) {
    return buildSetupHint(
      `Missing Supabase table for ${resource}. ${message}.`,
    );
  }

  if (message.includes("Bucket not found")) {
    return buildSetupHint(
      `Missing Supabase storage bucket for ${resource}. ${message}.`,
    );
  }

  return `${message}. Check your Supabase schema, storage bucket, and environment variables.`;
}

export type JoinSubmission = {
  email: string;
  experience: string;
  grade: string;
  message: string;
  name: string;
};

export async function insertJoinSubmission(submission: JoinSubmission) {
  const supabase = getServiceSupabase();
  const { error } = await supabase.from(joinTable).insert(submission);

  if (error) {
    throw new Error(
      formatSupabaseSetupError(`join table "${joinTable}"`, error.message),
    );
  }
}

export async function uploadContentAsset(file: File, folder = "general") {
  if (file.size === 0) {
    return null;
  }

  const supabase = getServiceSupabase();
  const bucket = getContentBucket();
  const extension = file.name.includes(".")
    ? file.name.split(".").pop()
    : "bin";
  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const fileName = `${Date.now()}-${crypto.randomUUID()}-${safeName || "upload"}.${extension}`;
  const filePath = `${folder}/${fileName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(bucket).upload(filePath, buffer, {
    cacheControl: "3600",
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    throw new Error(
      formatSupabaseSetupError(`storage bucket "${bucket}"`, error.message),
    );
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}
