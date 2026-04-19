"use client";

import { useState } from "react";
import { ToastForm } from "@/app/_components/toast-form";
import {
  getDefaultFormSchema,
  opportunityFieldTypes,
  opportunityKinds,
  type Opportunity,
  type OpportunityField,
  type OpportunityFieldOption,
  type OpportunityFormMode,
  type OpportunityKind,
} from "@/lib/opportunities";

type OpportunityEditorProps = {
  action: string;
  opportunity?: Opportunity | null;
};

const defaultField = (): OpportunityField => ({
  id: `field_${Math.random().toString(36).slice(2, 8)}`,
  type: "text",
  label: "New field",
  required: false,
  placeholder: "",
  helpText: "",
  options: [],
});

function serializeOptions(options: OpportunityFieldOption[] | undefined) {
  return (options ?? [])
    .map((option) =>
      [option.id, option.label, option.startsAt || "", option.endsAt || ""]
        .filter(Boolean)
        .join(" | "),
    )
    .join("\n");
}

function parseOptions(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [id, label, startsAt, endsAt] = line.split("|").map((part) => part.trim());
      return {
        id: id || label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        label: label || id,
        startsAt: startsAt || undefined,
        endsAt: endsAt || undefined,
      };
    })
    .filter((option) => option.id && option.label);
}

export function OpportunityEditor({
  action,
  opportunity,
}: OpportunityEditorProps) {
  const [kind, setKind] = useState<OpportunityKind>(
    opportunity?.kind || "custom",
  );
  const [formMode, setFormMode] = useState<OpportunityFormMode>(
    opportunity?.form_mode || "structured",
  );
  const [fields, setFields] = useState<OpportunityField[]>(
    opportunity?.form_schema.fields || getDefaultFormSchema("custom").fields,
  );

  const syncKind = (nextKind: OpportunityKind) => {
    setKind(nextKind);
    if (
      formMode === "content" ||
      nextKind === "volunteer_signup" ||
      nextKind === "event_signup"
    ) {
      setFields(getDefaultFormSchema(nextKind).fields);
    }
  };

  const syncFormMode = (nextMode: OpportunityFormMode) => {
    setFormMode(nextMode);
    if (nextMode === "content") {
      setFields(getDefaultFormSchema(kind).fields);
      return;
    }

    if (fields.length === 0) {
      setFields(getDefaultFormSchema(kind).fields);
    }
  };

  const updateField = (index: number, patch: Partial<OpportunityField>) => {
    setFields((current) =>
      current.map((field, fieldIndex) =>
        fieldIndex === index ? { ...field, ...patch } : field,
      ),
    );
  };

  return (
    <ToastForm
      action={action}
      method="post"
      className="opportunity-admin-editor"
      pendingMessage={opportunity ? "Saving opportunity..." : "Creating opportunity..."}
      invalidMessage="Complete the required opportunity fields before saving."
      toastScope="opportunity-editor"
    >
      <input
        type="hidden"
        name="formSchemaJson"
        value={JSON.stringify({ fields })}
        readOnly
      />

      <div className="card admin-panel">
        <div className="admin-editor-grid">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              name="title"
              required
              defaultValue={opportunity?.title || ""}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Slug</label>
            <input
              name="slug"
              defaultValue={opportunity?.slug || ""}
              placeholder="leave blank to auto-generate"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Summary</label>
          <textarea
            name="summary"
            required
            rows={3}
            defaultValue={opportunity?.summary || ""}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            required
            rows={6}
            defaultValue={opportunity?.description || ""}
            className="form-input"
          />
        </div>

        <div className="admin-editor-grid">
          <div className="form-group">
            <label className="form-label">Kind</label>
            <select
              name="kind"
              value={kind}
              onChange={(event) => syncKind(event.target.value as OpportunityKind)}
              className="form-input"
            >
              {opportunityKinds.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Form Mode</label>
            <select
              name="formMode"
              value={formMode}
              onChange={(event) =>
                syncFormMode(event.target.value as OpportunityFormMode)
              }
              className="form-input"
            >
              <option value="structured">structured</option>
              <option value="content">content</option>
            </select>
          </div>
        </div>

        <div className="admin-editor-grid">
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              defaultValue={opportunity?.status || "draft"}
              className="form-input"
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="closed">closed</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Visibility</label>
            <select
              name="visibility"
              defaultValue={opportunity?.visibility || "public"}
              className="form-input"
            >
              <option value="public">public</option>
              <option value="private">private</option>
            </select>
          </div>
        </div>

        <div className="admin-editor-grid">
          <div className="form-group">
            <label className="form-label">CTA Label</label>
            <input
              name="ctaLabel"
              defaultValue={opportunity?.cta_label || "Apply now"}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              name="location"
              defaultValue={opportunity?.location || ""}
              className="form-input"
            />
          </div>
        </div>

        <div className="admin-editor-grid">
          <div className="form-group">
            <label className="form-label">Opens At</label>
            <input
              type="datetime-local"
              name="opensAt"
              defaultValue={toDateInputValue(opportunity?.opens_at)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Closes At</label>
            <input
              type="datetime-local"
              name="closesAt"
              defaultValue={toDateInputValue(opportunity?.closes_at)}
              className="form-input"
            />
          </div>
        </div>

        <div className="admin-editor-grid">
          <div className="form-group">
            <label className="form-label">Sort Order</label>
            <input
              name="sortOrder"
              type="number"
              defaultValue={String(opportunity?.sort_order ?? 0)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Success Message</label>
            <input
              name="successMessage"
              defaultValue={
                opportunity?.success_message ||
                "Thanks. Your response has been received."
              }
              className="form-input"
            />
          </div>
        </div>

        <label className="admin-checkbox">
          <input
            type="checkbox"
            name="published"
            defaultChecked={Boolean(opportunity?.published)}
          />
          Visible on the public opportunities board
        </label>

        <div className="form-group">
          <label className="form-label">Admin Notes</label>
          <textarea
            name="adminNotes"
            rows={3}
            defaultValue={opportunity?.admin_notes || ""}
            className="form-input"
          />
        </div>

        {formMode === "structured" ? (
          <div className="opportunity-builder">
            <div className="opportunity-builder-header">
              <div>
                <h3>Form Fields</h3>
                <p className="admin-muted">
                  Build the mini-form members will fill out for this opportunity.
                </p>
              </div>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setFields((current) => [...current, defaultField()])}
              >
                Add field
              </button>
            </div>

            {fields.length === 0 ? (
              <div className="card admin-empty-state">
                No structured fields yet.
              </div>
            ) : (
              <div className="opportunity-builder-list">
                {fields.map((field, index) => (
                  <div key={field.id} className="card opportunity-builder-card">
                    <div className="admin-editor-grid">
                      <div className="form-group">
                        <label className="form-label">Field Label</label>
                        <input
                          value={field.label}
                          onChange={(event) =>
                            updateField(index, { label: event.target.value })
                          }
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Field ID</label>
                        <input
                          value={field.id}
                          onChange={(event) =>
                            updateField(index, { id: event.target.value })
                          }
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="admin-editor-grid">
                      <div className="form-group">
                        <label className="form-label">Field Type</label>
                        <select
                          value={field.type}
                          onChange={(event) =>
                            updateField(index, {
                              type: event.target.value as OpportunityField["type"],
                            })
                          }
                          className="form-input"
                        >
                          {opportunityFieldTypes.map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Placeholder</label>
                        <input
                          value={field.placeholder || ""}
                          onChange={(event) =>
                            updateField(index, { placeholder: event.target.value })
                          }
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Help Text</label>
                      <input
                        value={field.helpText || ""}
                        onChange={(event) =>
                          updateField(index, { helpText: event.target.value })
                        }
                        className="form-input"
                      />
                    </div>

                    {field.type === "select" ||
                    field.type === "multi_select" ||
                    field.type === "date_slot_group" ? (
                      <div className="form-group">
                        <label className="form-label">Options</label>
                        <textarea
                          rows={4}
                          value={serializeOptions(field.options)}
                          onChange={(event) =>
                            updateField(index, {
                              options: parseOptions(event.target.value),
                            })
                          }
                          className="form-input"
                        />
                        <p className="admin-muted">
                          One per line. Format: <code>id | label</code> or{" "}
                          <code>id | label | startsAt | endsAt</code>.
                        </p>
                      </div>
                    ) : null}

                    <div className="admin-actions">
                      <label className="admin-checkbox">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(event) =>
                            updateField(index, { required: event.target.checked })
                          }
                        />
                        Required
                      </label>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() =>
                          setFields((current) =>
                            current.filter((_, fieldIndex) => fieldIndex !== index),
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="card opportunity-content-note">
            <h3>Built-in content submission form</h3>
            <p>
              Public applicants will get the standard long-form project or dev
              log intake based on the selected opportunity kind.
            </p>
          </div>
        )}

        <div className="admin-actions">
          <button type="submit" className="btn-primary submit-button">
            {opportunity ? "Save opportunity" : "Create opportunity"}
          </button>
        </div>
      </div>
    </ToastForm>
  );
}

function toDateInputValue(value?: string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 16);
}
