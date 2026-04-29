import type { ReactNode } from "react";

type AdminSectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function AdminSectionHeader({
  eyebrow,
  title,
  description,
  actions,
}: AdminSectionHeaderProps) {
  return (
    <header className="admin-page-header">
      <div className="admin-page-title-block">
        {eyebrow ? <p className="admin-eyebrow">{eyebrow}</p> : null}
        <h1 className="section-heading no-margin">{title}</h1>
        {description ? <p className="admin-subtitle">{description}</p> : null}
      </div>
      {actions ? <div className="admin-toolbar-actions">{actions}</div> : null}
    </header>
  );
}
