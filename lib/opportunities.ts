import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { createEntry, slugify, type ContentInput } from "@/lib/content-store";
import { createSupabaseAdminClient } from "@/lib/supabase/client";

export const opportunityKinds = [
  "project_showcase",
  "devlog_submission",
  "volunteer_signup",
  "event_signup",
  "custom",
] as const;

export const opportunityFieldTypes = [
  "text",
  "textarea",
  "email",
  "checkbox",
  "select",
  "multi_select",
  "date_slot_group",
] as const;

export type OpportunityKind = (typeof opportunityKinds)[number];
export type OpportunityFieldType = (typeof opportunityFieldTypes)[number];
export type OpportunityFormMode = "content" | "structured";
export type OpportunityStatus = "draft" | "published" | "closed";
export type OpportunityVisibility = "public" | "private";
export type OpportunityResponseStatus =
  | "new"
  | "reviewed"
  | "converted"
  | "archived";

export type OpportunityFieldOption = {
  id: string;
  label: string;
  startsAt?: string | null;
  endsAt?: string | null;
};

export type OpportunityField = {
  id: string;
  type: OpportunityFieldType;
  label: string;
  required: boolean;
  helpText?: string;
  placeholder?: string;
  options?: OpportunityFieldOption[];
};

export type OpportunityFormSchema = {
  fields: OpportunityField[];
};

export type Opportunity = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  kind: OpportunityKind;
  form_mode: OpportunityFormMode;
  status: OpportunityStatus;
  visibility: OpportunityVisibility;
  cta_label: string;
  location: string | null;
  opens_at: string | null;
  closes_at: string | null;
  sort_order: number;
  published: boolean;
  form_schema: OpportunityFormSchema;
  success_message: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  response_count?: number;
};

export type OpportunityResponse = {
  id: string;
  opportunity_id: string;
  submitted_at: string;
  name: string;
  email: string;
  status: OpportunityResponseStatus;
  payload: Record<string, unknown>;
  source_metadata: Record<string, unknown>;
};

export type OpportunityInput = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  kind: OpportunityKind;
  formMode: OpportunityFormMode;
  status: OpportunityStatus;
  visibility: OpportunityVisibility;
  ctaLabel: string;
  location?: string | null;
  opensAt?: string | null;
  closesAt?: string | null;
  sortOrder?: number;
  published: boolean;
  formSchema: OpportunityFormSchema;
  successMessage: string;
  adminNotes?: string | null;
};

export type OpportunityResponseInput = {
  opportunityId: string;
  name: string;
  email: string;
  payload: Record<string, unknown>;
  sourceMetadata?: Record<string, unknown>;
};

const opportunityFormSchema = z.object({
  fields: z.array(
    z.object({
      id: z.string().trim().min(1).max(60),
      type: z.enum(opportunityFieldTypes),
      label: z.string().trim().min(1).max(120),
      required: z.boolean().default(false),
      helpText: z.string().trim().max(240).optional(),
      placeholder: z.string().trim().max(240).optional(),
      options: z
        .array(
          z.object({
            id: z.string().trim().min(1).max(60),
            label: z.string().trim().min(1).max(120),
            startsAt: z.string().trim().max(80).optional(),
            endsAt: z.string().trim().max(80).optional(),
          }),
        )
        .optional(),
    }),
  ),
});

const adminOpportunitySchema = z.object({
  title: z.string().trim().min(3).max(120),
  slug: z.string().trim().max(80).optional().default(""),
  summary: z.string().trim().min(8).max(280),
  description: z.string().trim().min(20).max(8000),
  kind: z.enum(opportunityKinds),
  formMode: z.enum(["content", "structured"]),
  status: z.enum(["draft", "published", "closed"]).default("draft"),
  visibility: z.enum(["public", "private"]).default("public"),
  ctaLabel: z.string().trim().min(2).max(40).default("Apply now"),
  location: z.string().trim().max(160).optional().default(""),
  opensAt: z.string().trim().optional().default(""),
  closesAt: z.string().trim().optional().default(""),
  sortOrder: z.coerce.number().int().min(-999).max(999).default(0),
  published: z.boolean().default(false),
  formSchemaJson: z.string().trim().default("{\"fields\":[]}"),
  successMessage: z.string().trim().min(8).max(240),
  adminNotes: z.string().trim().max(2000).optional().default(""),
});

const contentOpportunityFieldLabels = {
  project_showcase: "Project showcase",
  devlog_submission: "Dev log submission",
  volunteer_signup: "Volunteer signup",
  event_signup: "Event signup",
  custom: "Opportunity",
} satisfies Record<OpportunityKind, string>;

const selectOpportunityFields =
  "id, slug, title, summary, description, kind, form_mode, status, visibility, cta_label, location, opens_at, closes_at, sort_order, published, form_schema, success_message, admin_notes, created_at, updated_at";

const getClient = () => {
  if (!isSupabaseConfigured) {
    return null;
  }

  return createSupabaseAdminClient();
};

function parseFormSchema(value: unknown): OpportunityFormSchema {
  const parsed = opportunityFormSchema.safeParse(value);
  if (!parsed.success) {
    return { fields: [] };
  }

  return {
    fields: parsed.data.fields.map((field) => ({
      ...field,
      helpText: field.helpText || undefined,
      placeholder: field.placeholder || undefined,
      options: field.options?.map((option) => ({
        id: option.id,
        label: option.label,
        startsAt: option.startsAt || undefined,
        endsAt: option.endsAt || undefined,
      })),
    })),
  };
}

function normalizeOpportunity(record: OpportunityInput) {
  return {
    slug: record.slug.trim(),
    title: record.title.trim(),
    summary: record.summary.trim(),
    description: record.description.trim(),
    kind: record.kind,
    form_mode: record.formMode,
    status: record.status,
    visibility: record.visibility,
    cta_label: record.ctaLabel.trim(),
    location: record.location?.trim() || null,
    opens_at: record.opensAt || null,
    closes_at: record.closesAt || null,
    sort_order: record.sortOrder ?? 0,
    published: record.published,
    form_schema: record.formSchema,
    success_message: record.successMessage.trim(),
    admin_notes: record.adminNotes?.trim() || null,
  };
}

function mapOpportunity(row: Record<string, unknown>): Opportunity {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    summary: String(row.summary ?? ""),
    description: String(row.description ?? ""),
    kind: row.kind as OpportunityKind,
    form_mode: row.form_mode as OpportunityFormMode,
    status: row.status as OpportunityStatus,
    visibility: row.visibility as OpportunityVisibility,
    cta_label: String(row.cta_label ?? "Apply now"),
    location: row.location ? String(row.location) : null,
    opens_at: row.opens_at ? String(row.opens_at) : null,
    closes_at: row.closes_at ? String(row.closes_at) : null,
    sort_order: Number(row.sort_order ?? 0),
    published: Boolean(row.published),
    form_schema: parseFormSchema(row.form_schema),
    success_message: String(row.success_message ?? "Thanks. Your response has been received."),
    admin_notes: row.admin_notes ? String(row.admin_notes) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    response_count:
      typeof row.response_count === "number"
        ? row.response_count
        : row.response_count
          ? Number(row.response_count)
          : undefined,
  };
}

function mapOpportunityResponse(row: Record<string, unknown>): OpportunityResponse {
  return {
    id: String(row.id),
    opportunity_id: String(row.opportunity_id),
    submitted_at: String(row.submitted_at),
    name: String(row.name),
    email: String(row.email),
    status: row.status as OpportunityResponseStatus,
    payload:
      row.payload && typeof row.payload === "object"
        ? (row.payload as Record<string, unknown>)
        : {},
    source_metadata:
      row.source_metadata && typeof row.source_metadata === "object"
        ? (row.source_metadata as Record<string, unknown>)
        : {},
  };
}

function formatFieldValue(value: FormDataEntryValue | null, type: OpportunityFieldType) {
  if (type === "checkbox") {
    return value === "on";
  }

  if (type === "multi_select" || type === "date_slot_group") {
    return [];
  }

  return String(value || "").trim();
}

export function getOpportunityKindLabel(kind: OpportunityKind) {
  return contentOpportunityFieldLabels[kind];
}

export function isOpportunityOpen(opportunity: Opportunity) {
  if (!opportunity.published || opportunity.status !== "published") {
    return false;
  }

  const now = Date.now();
  if (opportunity.opens_at && new Date(opportunity.opens_at).getTime() > now) {
    return false;
  }

  if (opportunity.closes_at && new Date(opportunity.closes_at).getTime() < now) {
    return false;
  }

  return true;
}

export function getDefaultFormSchema(kind: OpportunityKind): OpportunityFormSchema {
  if (kind === "volunteer_signup") {
    return {
      fields: [
        {
          id: "grade",
          type: "select",
          label: "Grade",
          required: true,
          options: [
            { id: "9", label: "9th" },
            { id: "10", label: "10th" },
            { id: "11", label: "11th" },
            { id: "12", label: "12th" },
          ],
        },
        {
          id: "selected_slots",
          type: "date_slot_group",
          label: "Volunteer time slots",
          required: true,
          options: [
            { id: "slot-1", label: "Tuesday 3:00 PM - 4:30 PM" },
            { id: "slot-2", label: "Thursday 3:00 PM - 4:30 PM" },
          ],
        },
        {
          id: "notes",
          type: "textarea",
          label: "Anything we should know?",
          required: false,
          placeholder: "Transportation limits, arrival constraints, prior experience...",
        },
      ],
    };
  }

  if (kind === "event_signup") {
    return {
      fields: [
        {
          id: "selected_slots",
          type: "date_slot_group",
          label: "Choose the session(s) that work",
          required: true,
          options: [
            { id: "session-a", label: "Session A" },
            { id: "session-b", label: "Session B" },
          ],
        },
        {
          id: "questions",
          type: "textarea",
          label: "Questions or accessibility notes",
          required: false,
        },
      ],
    };
  }

  return { fields: [] };
}

export async function listPublishedOpportunities() {
  const client = getClient();
  if (!client) return [];

  const { data: responseRows } = await client
    .from("opportunity_responses")
    .select("opportunity_id");

  const responseCounts = (responseRows ?? []).reduce<Record<string, number>>(
    (accumulator, row) => {
      const key = String((row as { opportunity_id: string }).opportunity_id);
      accumulator[key] = (accumulator[key] ?? 0) + 1;
      return accumulator;
    },
    {},
  );

  const { data, error } = await client
    .from("opportunities")
    .select(selectOpportunityFields)
    .eq("published", true)
    .eq("visibility", "public")
    .order("sort_order", { ascending: true })
    .order("opens_at", { ascending: true, nullsFirst: true });

  if (error) {
    console.error("Supabase listPublishedOpportunities failed", error);
    return [];
  }

  return (data ?? []).map((row) =>
    mapOpportunity({
      ...(row as Record<string, unknown>),
      response_count: responseCounts[String((row as { id: string }).id)] ?? 0,
    }),
  );
}

export async function getPublishedOpportunityBySlug(slug: string) {
  const client = getClient();
  if (!client) return null;

  const { data, error } = await client
    .from("opportunities")
    .select(selectOpportunityFields)
    .eq("slug", slug)
    .eq("published", true)
    .eq("visibility", "public")
    .maybeSingle();

  if (error) {
    console.error(`Supabase getPublishedOpportunityBySlug(${slug}) failed`, error);
    return null;
  }

  return data ? mapOpportunity(data as Record<string, unknown>) : null;
}

export async function listAdminOpportunities() {
  const client = getClient();
  if (!client) return [];

  const { data: responseRows } = await client
    .from("opportunity_responses")
    .select("opportunity_id");

  const responseCounts = (responseRows ?? []).reduce<Record<string, number>>(
    (accumulator, row) => {
      const key = String((row as { opportunity_id: string }).opportunity_id);
      accumulator[key] = (accumulator[key] ?? 0) + 1;
      return accumulator;
    },
    {},
  );

  const { data, error } = await client
    .from("opportunities")
    .select(selectOpportunityFields)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) =>
    mapOpportunity({
      ...(row as Record<string, unknown>),
      response_count: responseCounts[String((row as { id: string }).id)] ?? 0,
    }),
  );
}

export async function getOpportunityById(id: string) {
  const client = getClient();
  if (!client) return null;

  const { data, error } = await client
    .from("opportunities")
    .select(selectOpportunityFields)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapOpportunity(data as Record<string, unknown>) : null;
}

export async function getOpportunityBySlug(slug: string) {
  const client = getClient();
  if (!client) return null;

  const { data, error } = await client
    .from("opportunities")
    .select(selectOpportunityFields)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapOpportunity(data as Record<string, unknown>) : null;
}

export async function createOpportunity(input: OpportunityInput) {
  const client = getClient();
  if (!client) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await client
    .from("opportunities")
    .insert(normalizeOpportunity(input))
    .select(selectOpportunityFields)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapOpportunity(data as Record<string, unknown>);
}

export async function updateOpportunity(id: string, input: OpportunityInput) {
  const client = getClient();
  if (!client) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await client
    .from("opportunities")
    .update(normalizeOpportunity(input))
    .eq("id", id)
    .select(selectOpportunityFields)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapOpportunity(data as Record<string, unknown>);
}

export async function listOpportunityResponses(opportunityId: string) {
  const client = getClient();
  if (!client) return [];

  const { data, error } = await client
    .from("opportunity_responses")
    .select("id, opportunity_id, submitted_at, name, email, status, payload, source_metadata")
    .eq("opportunity_id", opportunityId)
    .order("submitted_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapOpportunityResponse(row as Record<string, unknown>));
}

export async function listRecentOpportunityResponses(limit = 8) {
  const client = getClient();
  if (!client) return [];

  const { data, error } = await client
    .from("opportunity_responses")
    .select("id, opportunity_id, submitted_at, name, email, status, payload, source_metadata")
    .order("submitted_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapOpportunityResponse(row as Record<string, unknown>));
}

export async function createOpportunityResponse(input: OpportunityResponseInput) {
  const client = getClient();
  if (!client) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await client
    .from("opportunity_responses")
    .insert({
      opportunity_id: input.opportunityId,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      payload: input.payload,
      source_metadata: input.sourceMetadata ?? {},
    })
    .select("id, opportunity_id, submitted_at, name, email, status, payload, source_metadata")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapOpportunityResponse(data as Record<string, unknown>);
}

export async function updateOpportunityResponseStatus(
  id: string,
  status: OpportunityResponseStatus,
) {
  const client = getClient();
  if (!client) {
    throw new Error("Supabase is not configured.");
  }

  const { error } = await client
    .from("opportunity_responses")
    .update({ status })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getOpportunityResponseById(id: string) {
  const client = getClient();
  if (!client) return null;

  const { data, error } = await client
    .from("opportunity_responses")
    .select("id, opportunity_id, submitted_at, name, email, status, payload, source_metadata")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapOpportunityResponse(data as Record<string, unknown>) : null;
}

export function parseOpportunityAdminForm(formData: FormData) {
  const raw = {
    title: String(formData.get("title") || ""),
    slug: String(formData.get("slug") || ""),
    summary: String(formData.get("summary") || ""),
    description: String(formData.get("description") || ""),
    kind: String(formData.get("kind") || ""),
    formMode: String(formData.get("formMode") || ""),
    status: String(formData.get("status") || "draft"),
    visibility: String(formData.get("visibility") || "public"),
    ctaLabel: String(formData.get("ctaLabel") || "Apply now"),
    location: String(formData.get("location") || ""),
    opensAt: String(formData.get("opensAt") || ""),
    closesAt: String(formData.get("closesAt") || ""),
    sortOrder: String(formData.get("sortOrder") || "0"),
    published: String(formData.get("published") || "") === "on",
    formSchemaJson: String(formData.get("formSchemaJson") || "{\"fields\":[]}"),
    successMessage: String(formData.get("successMessage") || ""),
    adminNotes: String(formData.get("adminNotes") || ""),
  };

  const parsed = adminOpportunitySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false as const,
      error:
        parsed.error.issues[0]?.message ||
        "Please check the opportunity form and try again.",
    };
  }

  const schemaData = (() => {
    try {
      return JSON.parse(parsed.data.formSchemaJson);
    } catch {
      return null;
    }
  })();

  if (!schemaData && parsed.data.formMode === "structured") {
    return {
      ok: false as const,
      error: "Structured form configuration is not valid JSON.",
    };
  }

  if (
    parsed.data.formMode === "content" &&
    parsed.data.kind !== "project_showcase" &&
    parsed.data.kind !== "devlog_submission"
  ) {
    return {
      ok: false as const,
      error: "Content-mode opportunities only support project showcase or dev log submissions.",
    };
  }

  const formSchema =
    parsed.data.formMode === "structured"
      ? parseFormSchema(schemaData)
      : getDefaultFormSchema(parsed.data.kind);

  if (
    parsed.data.formMode === "structured" &&
    formSchema.fields.length === 0 &&
    parsed.data.kind !== "custom"
  ) {
    return {
      ok: false as const,
      error: "Structured opportunities need at least one configured field.",
    };
  }

  const slug = parsed.data.slug || slugify(parsed.data.title);

  return {
    ok: true as const,
    values: {
      slug,
      title: parsed.data.title,
      summary: parsed.data.summary,
      description: parsed.data.description,
      kind: parsed.data.kind,
      formMode: parsed.data.formMode,
      status: parsed.data.status,
      visibility: parsed.data.visibility,
      ctaLabel: parsed.data.ctaLabel,
      location: parsed.data.location || null,
      opensAt: parsed.data.opensAt || null,
      closesAt: parsed.data.closesAt || null,
      sortOrder: parsed.data.sortOrder,
      published:
        parsed.data.published || parsed.data.status === "published",
      formSchema,
      successMessage: parsed.data.successMessage,
      adminNotes: parsed.data.adminNotes || null,
    } satisfies OpportunityInput,
  };
}

export function parseOpportunityResponseForm(
  opportunity: Opportunity,
  formData: FormData,
) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const honey = String(formData.get("clubWebsite") || "").trim();

  if (honey) {
    return {
      ok: true as const,
      values: {
        name,
        email,
        payload: {},
      },
    };
  }

  if (!name || !email) {
    return {
      ok: false as const,
      error: "Name and email are required.",
    };
  }

  const payload: Record<string, unknown> = {};

  if (opportunity.form_mode === "content") {
    if (opportunity.kind === "project_showcase") {
      const title = String(formData.get("projectTitle") || "").trim();
      const summary = String(formData.get("projectSummary") || "").trim();
      const stack = String(formData.get("projectStack") || "").trim();
      const body = String(formData.get("projectBody") || "").trim();

      if (!title || !summary || !body) {
        return {
          ok: false as const,
          error: "Project title, summary, and details are required.",
        };
      }

      payload.projectTitle = title;
      payload.projectSummary = summary;
      payload.projectStack = stack
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      payload.projectBody = body;
      payload.githubUrl = String(formData.get("githubUrl") || "").trim();
      payload.demoUrl = String(formData.get("demoUrl") || "").trim();
    } else if (opportunity.kind === "devlog_submission") {
      const title = String(formData.get("devlogTitle") || "").trim();
      const summary = String(formData.get("devlogSummary") || "").trim();
      const body = String(formData.get("devlogBody") || "").trim();

      if (!title || !summary || !body) {
        return {
          ok: false as const,
          error: "Dev log title, summary, and update details are required.",
        };
      }

      payload.devlogTitle = title;
      payload.devlogSummary = summary;
      payload.devlogBody = body;
      payload.projectLink = String(formData.get("projectLink") || "").trim();
    }

    return {
      ok: true as const,
      values: { name, email, payload },
    };
  }

  for (const field of opportunity.form_schema.fields) {
    const key = `field:${field.id}`;
    let value: unknown;

    if (field.type === "multi_select" || field.type === "date_slot_group") {
      value = formData
        .getAll(key)
        .map((entry) => String(entry).trim())
        .filter(Boolean);
    } else {
      value = formatFieldValue(formData.get(key), field.type);
    }

    const isEmpty =
      value === "" ||
      value === false ||
      (Array.isArray(value) && value.length === 0);

    if (field.required && isEmpty) {
      return {
        ok: false as const,
        error: `${field.label} is required.`,
      };
    }

    payload[field.id] = value;
  }

  return {
    ok: true as const,
    values: { name, email, payload },
  };
}

export async function convertResponseToDraftContent(responseId: string) {
  const response = await getOpportunityResponseById(responseId);
  if (!response) {
    throw new Error("Opportunity response not found.");
  }

  const opportunity = await getOpportunityById(response.opportunity_id);
  if (!opportunity) {
    throw new Error("Opportunity not found.");
  }

  let contentInput: ContentInput | null = null;

  if (opportunity.kind === "project_showcase") {
    contentInput = {
      type: "project",
      title: String(response.payload.projectTitle || `${response.name}'s project`),
      slug: slugify(String(response.payload.projectTitle || `${response.name}-project`)),
      summary: String(response.payload.projectSummary || ""),
      body: String(response.payload.projectBody || ""),
      status: "draft",
      authorName: response.name,
      authorEmail: response.email,
      projectStatus: "active",
      projectType: "project",
      stack: Array.isArray(response.payload.projectStack)
        ? response.payload.projectStack.map((value) => String(value))
        : [],
      source: "admin",
      reviewNotes: `Converted from opportunity response ${response.id}.`,
    };
  }

  if (opportunity.kind === "devlog_submission") {
    contentInput = {
      type: "devlog",
      title: String(response.payload.devlogTitle || `${response.name}'s update`),
      slug: slugify(String(response.payload.devlogTitle || `${response.name}-update`)),
      summary: String(response.payload.devlogSummary || ""),
      body: String(response.payload.devlogBody || ""),
      status: "draft",
      authorName: response.name,
      authorEmail: response.email,
      source: "admin",
      reviewNotes: `Converted from opportunity response ${response.id}.`,
    };
  }

  if (!contentInput) {
    throw new Error("Only project and devlog opportunity responses can be converted.");
  }

  const entry = await createEntry(contentInput, response.email);
  await updateOpportunityResponseStatus(response.id, "converted");
  return entry;
}
