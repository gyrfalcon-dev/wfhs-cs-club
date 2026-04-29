import { ToastForm } from "@/app/_components/toast-form";
import type { Opportunity } from "@/lib/opportunities";

type OpportunityResponseFormProps = {
  opportunity: Opportunity;
};

function renderField(opportunity: Opportunity) {
  if (opportunity.form_mode === "content") {
    if (opportunity.kind === "project_showcase") {
      return (
        <>
          <div className="opportunity-form-grid">
            <div className="form-group">
              <label className="form-label">Project Title</label>
              <input name="projectTitle" required className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Tech Stack</label>
              <input
                name="projectStack"
                placeholder="Next.js, Python, Scratch"
                className="form-input"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Short Summary</label>
            <textarea
              name="projectSummary"
              required
              rows={3}
              className="form-input"
            />
          </div>
          <div className="opportunity-form-grid">
            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input
                name="githubUrl"
                type="url"
                placeholder="https://github.com/..."
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Demo URL</label>
              <input
                name="demoUrl"
                type="url"
                placeholder="https://..."
                className="form-input"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Tell us about the project</label>
            <textarea
              name="projectBody"
              required
              rows={8}
              className="form-input"
            />
          </div>
        </>
      );
    }

    return (
      <>
        <div className="form-group">
          <label className="form-label">Update Title</label>
          <input name="devlogTitle" required className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Short Summary</label>
          <textarea
            name="devlogSummary"
            required
            rows={3}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Related project link (optional)</label>
          <input
            name="projectLink"
            placeholder="/projects/robot-ai"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">What changed?</label>
          <textarea
            name="devlogBody"
            required
            rows={8}
            className="form-input"
          />
        </div>
      </>
    );
  }

  return opportunity.form_schema.fields.map((field) => {
    const inputName = `field:${field.id}`;

    if (field.type === "textarea") {
      return (
        <div key={field.id} className="form-group">
          <label className="form-label">{field.label}</label>
          <textarea
            name={inputName}
            required={field.required}
            rows={4}
            placeholder={field.placeholder}
            className="form-input"
          />
          {field.helpText ? <p className="admin-muted">{field.helpText}</p> : null}
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div key={field.id} className="form-group">
          <label className="form-label">{field.label}</label>
          <select name={inputName} required={field.required} className="form-input">
            <option value="">Select one</option>
            {(field.options ?? []).map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          {field.helpText ? <p className="admin-muted">{field.helpText}</p> : null}
        </div>
      );
    }

    if (field.type === "multi_select" || field.type === "date_slot_group") {
      const isTimeSlots = field.type === "date_slot_group";
      return (
        <fieldset
          key={field.id}
          className={`opportunity-fieldset ${isTimeSlots ? "opportunity-fieldset-timeslots" : ""}`}
        >
          <legend className="form-label opportunity-fieldset-legend">{field.label}</legend>
          <div className={`opportunity-option-list ${isTimeSlots ? "opportunity-slot-list" : ""}`}>
            {(field.options ?? []).map((option) => (
              <label
                key={option.id}
                className={`opportunity-option ${isTimeSlots ? "opportunity-slot-option" : ""}`}
              >
                <input type="checkbox" name={inputName} value={option.id} />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          {field.helpText ? <p className="admin-muted">{field.helpText}</p> : null}
        </fieldset>
      );
    }

    if (field.type === "checkbox") {
      return (
        <label key={field.id} className="opportunity-inline-checkbox">
          <input type="checkbox" name={inputName} />
          <span>{field.label}</span>
        </label>
      );
    }

    return (
      <div key={field.id} className="form-group">
        <label className="form-label">{field.label}</label>
        <input
          type={field.type === "email" ? "email" : "text"}
          name={inputName}
          required={field.required}
          placeholder={field.placeholder}
          className="form-input"
        />
        {field.helpText ? <p className="admin-muted">{field.helpText}</p> : null}
      </div>
    );
  });
}

export function OpportunityResponseForm({
  opportunity,
}: OpportunityResponseFormProps) {
  return (
    <ToastForm
      action={`/api/opportunities/${opportunity.slug}/apply`}
      method="post"
      className="opportunity-form"
      pendingMessage="Sending..."
      invalidMessage="Please fill out the required fields."
      toastScope={`opportunity-${opportunity.slug}`}
    >
      <input type="hidden" name="clubWebsite" value="" />

      <div className="opportunity-form-grid">
        <div className="form-group">
          <label className="form-label">Name</label>
          <input name="name" required className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" name="email" required className="form-input" />
        </div>
      </div>

      {renderField(opportunity)}

      <button type="submit" className="btn-primary submit-button">
        {opportunity.cta_label}
      </button>
    </ToastForm>
  );
}
