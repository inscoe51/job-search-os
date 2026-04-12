const preferredInternalLabels: Record<string, string> = {
  operations_process_coordination: "Operations / Process Coordination",
  sales_ops_process_support: "Sales Ops / Process Support",
  implementation_onboarding_coordination:
    "Implementation / Onboarding Coordination",
  enablement_support_careful: "Enablement Support",
  account_support_coordination: "Account Support / Coordination",
  marketing_ops_support_careful: "Marketing Ops Support"
};

export function formatDisplayLabel(value: string): string {
  const preferredLabel = preferredInternalLabels[value];

  if (preferredLabel) {
    return preferredLabel;
  }

  return value
    .split(/[\s_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatResumeDirectionLabel(value: string): string {
  return formatDisplayLabel(value);
}
