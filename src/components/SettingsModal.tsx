import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

interface ButtonRow {
  type: "button";
  icon: string;
  name: string;
  desc: string;
  action: string;
}

interface SelectRow {
  type: "select";
  icon: string;
  name: string;
  desc: string;
  options: string[];
  defaultValue: string;
  key: string;
}

interface ToggleRow {
  type: "toggle";
  icon: string;
  name: string;
  desc: string;
  key: string;
  default: boolean;
}

type Row = ButtonRow | SelectRow | ToggleRow;

interface Section {
  label: string;
  rows: Row[];
}

interface SettingsModalProps {
  open?: boolean;
  onClose?: () => void;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const sections: Section[] = [
  {
    label: "Account",
    rows: [
      { type: "button", icon: "👤", name: "Profile",  desc: "alex@example.com",          action: "Edit"   },
      { type: "button", icon: "🔒", name: "Password", desc: "Last changed 3 months ago", action: "Change" },
    ],
  },
  {
    label: "Appearance",
    rows: [
      { type: "select", icon: "🎨", name: "Theme",     desc: "Choose your color scheme", options: ["System","Light","Dark"],  defaultValue: "System", key: "theme"    },
      { type: "select", icon: "🔤", name: "Font size", desc: "Adjust text size",          options: ["Small","Medium","Large"], defaultValue: "Medium", key: "fontSize" },
    ],
  },
  {
    label: "Notifications",
    rows: [
      { type: "toggle", icon: "🔔", name: "Push notifications", desc: "Alerts on new activity", key: "push",  default: true  },
      { type: "toggle", icon: "✉️", name: "Email digest",       desc: "Weekly summary",          key: "email", default: false },
      { type: "toggle", icon: "📱", name: "SMS alerts",         desc: "Critical updates only",   key: "sms",   default: true  },
    ],
  },
  {
    label: "Privacy",
    rows: [
      { type: "toggle", icon: "👁️", name: "Public profile", desc: "Others can see your activity", key: "publicProfile", default: false },
      { type: "toggle", icon: "📊", name: "Analytics",      desc: "Share usage data",              key: "analytics",     default: true  },
    ],
  },
];

// ─── Tokens (matching index.css variables) ────────────────────────────────────
const T = {
  bg:      "#07070f",
  surface: "#0e0e18",
  card:    "#13131e",
  border:  "#242438",
  accent:  "#7c6cff",
  muted:   "#7777aa",
  dim:     "#3a3a52",
  text:    "#ffffff",
  textSub: "#7777aa",
};

// ─── Initial state helpers ────────────────────────────────────────────────────

type TogglesState = Record<string, boolean>;
type SelectsState = Record<string, string>;

function buildInitialToggles(): TogglesState {
  const result: TogglesState = {};
  sections.forEach((s) =>
    s.rows.forEach((r) => {
      if (r.type === "toggle") result[r.key] = r.default;
    })
  );
  return result;
}

function buildInitialSelects(): SelectsState {
  const result: SelectsState = {};
  sections.forEach((s) =>
    s.rows.forEach((r) => {
      if (r.type === "select") result[r.key] = r.defaultValue;
    })
  );
  return result;
}

// ─── Toggle component ─────────────────────────────────────────────────────────

function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label
      aria-label={label}
      style={{ position: "relative", width: 42, height: 24, flexShrink: 0, cursor: "pointer" }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ opacity: 0, width: 0, height: 0, position: "absolute" }}
      />
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 24,
          background: checked ? T.accent : T.dim,
          border: `1px solid ${checked ? T.accent : T.border}`,
          transition: "background 0.2s, border-color 0.2s",
        }}
      >
        <span
          style={{
            position: "absolute",
            width: 16,
            height: 16,
            top: 3,
            left: 3,
            background: "#fff",
            borderRadius: "50%",
            transition: "transform 0.2s",
            transform: checked ? "translateX(18px)" : "translateX(0)",
            boxShadow: checked ? `0 0 6px ${T.accent}88` : "none",
          }}
        />
      </span>
    </label>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SettingsModal({ open = false, onClose }: SettingsModalProps) {
  const [toggles, setToggles] = useState<TogglesState>(buildInitialToggles);
  const [selects, setSelects] = useState<SelectsState>(buildInitialSelects);

  if (!open) return null;

  const handleSave = () => {
    console.log("Saved:", { toggles, selects });
    onClose?.();
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: 16,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        style={{
          background: T.card,
          border: `1px solid ${T.border}`,
          width: "min(480px, calc(100vw - 32px))",
          maxHeight: "min(90vh, 680px)",
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          borderRadius: "clamp(12px, 3vw, 20px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px 16px",
            borderBottom: `1px solid ${T.border}`,
            position: "sticky",
            top: 0,
            background: T.card,
            zIndex: 1,
          }}
        >
          <h2 id="settings-title" style={{ fontSize: 16, fontWeight: 600, margin: 0, color: T.text }}>
            Settings
          </h2>
          <button
            onClick={onClose}
            aria-label="Close settings"
            style={{
              width: 32, height: 32,
              borderRadius: 8,
              border: `1px solid ${T.border}`,
              background: T.surface,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
              color: T.muted,
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = T.accent;
              (e.currentTarget as HTMLButtonElement).style.color = T.text;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = T.border;
              (e.currentTarget as HTMLButtonElement).style.color = T.muted;
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "8px 0 16px", flex: 1 }}>
          {sections.map((section, si) => (
            <div key={section.label}>
              {si > 0 && (
                <div style={{ height: 1, background: T.border, margin: "6px 24px" }} />
              )}

              <p
                style={{
                  fontSize: 11, fontWeight: 600,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  color: T.muted, padding: "16px 24px 6px", margin: 0,
                }}
              >
                {section.label}
              </p>

              {section.rows.map((row) => (
                <div
                  key={row.name}
                  style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 24px", gap: 12,
                    borderRadius: 0,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = T.surface)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {/* Left */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      aria-hidden="true"
                      style={{
                        width: 34, height: 34, borderRadius: 9,
                        background: T.surface,
                        border: `1px solid ${T.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16, flexShrink: 0,
                      }}
                    >
                      {row.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 500, margin: 0, lineHeight: 1.3, color: T.text }}>
                        {row.name}
                      </p>
                      <p style={{ fontSize: 12, color: T.muted, margin: 0, lineHeight: 1.4 }}>
                        {row.desc}
                      </p>
                    </div>
                  </div>

                  {/* Right: control */}
                  {row.type === "toggle" && (
                    <Toggle
                      checked={toggles[row.key]}
                      onChange={() =>
                        setToggles((prev) => ({ ...prev, [row.key]: !prev[row.key] }))
                      }
                      label={`Toggle ${row.name}`}
                    />
                  )}

                  {row.type === "select" && (
                    <select
                      aria-label={row.name}
                      value={selects[row.key]}
                      onChange={(e) =>
                        setSelects((prev) => ({ ...prev, [row.key]: e.target.value }))
                      }
                      style={{
                        height: 32, padding: "0 10px",
                        borderRadius: 8,
                        border: `1px solid ${T.border}`,
                        background: T.surface,
                        fontSize: 12, fontWeight: 500,
                        cursor: "pointer", maxWidth: 130,
                        color: T.text,
                        outline: "none",
                      }}
                    >
                      {row.options.map((o: string) => (
                        <option key={o} style={{ background: T.card }}>{o}</option>
                      ))}
                    </select>
                  )}

                  {row.type === "button" && (
                    <button
                      style={{
                        height: 30, padding: "0 14px",
                        borderRadius: 8,
                        border: `1px solid ${T.border}`,
                        background: T.surface,
                        fontSize: 12, fontWeight: 500,
                        cursor: "pointer", color: T.text,
                        transition: "border-color 0.15s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = T.accent)}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = T.border)}
                    >
                      {row.action}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 24px 20px",
            borderTop: `1px solid ${T.border}`,
            display: "flex", gap: 10, justifyContent: "flex-end",
            background: T.card,
          }}
        >
          <button
            onClick={onClose}
            style={{
              height: 36, padding: "0 18px", borderRadius: 9,
              border: `1px solid ${T.border}`,
              background: T.surface,
              fontSize: 13, fontWeight: 500,
              cursor: "pointer", color: T.text,
              transition: "border-color 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = T.muted)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = T.border)}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              height: 36, padding: "0 18px", borderRadius: 9,
              border: `1px solid ${T.accent}44`,
              background: `${T.accent}22`,
              fontSize: 13, fontWeight: 600,
              cursor: "pointer", color: T.accent,
              transition: "background 0.15s, border-color 0.15s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = `${T.accent}33`;
              (e.currentTarget as HTMLButtonElement).style.borderColor = T.accent;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = `${T.accent}22`;
              (e.currentTarget as HTMLButtonElement).style.borderColor = `${T.accent}44`;
            }}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}