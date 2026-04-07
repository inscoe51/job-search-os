export const applicationStatusValues = [
  "new",
  "analyzing",
  "apply_now",
  "hold_for_networking",
  "hold_for_variant",
  "applied",
  "follow_up_due",
  "interviewing",
  "offer",
  "passed",
  "closed_not_selected",
  "withdrawn"
] as const;

export const networkingStatusValues = [
  "not_started",
  "researching_contact",
  "message_sent",
  "connection_pending",
  "conversation_started",
  "no_response",
  "not_applicable"
] as const;

export type ApplicationStatus = (typeof applicationStatusValues)[number];
export type NetworkingStatus = (typeof networkingStatusValues)[number];

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  new: "New",
  analyzing: "Analyzing",
  apply_now: "Apply now",
  hold_for_networking: "Hold for networking",
  hold_for_variant: "Hold for variant",
  applied: "Applied",
  follow_up_due: "Follow-up due",
  interviewing: "Interviewing",
  offer: "Offer",
  passed: "Passed",
  closed_not_selected: "Closed not selected",
  withdrawn: "Withdrawn"
};

export const networkingStatusLabels: Record<NetworkingStatus, string> = {
  not_started: "Not started",
  researching_contact: "Researching contact",
  message_sent: "Message sent",
  connection_pending: "Connection pending",
  conversation_started: "Conversation started",
  no_response: "No response",
  not_applicable: "Not applicable"
};

export const applicationStatusOptions = applicationStatusValues.map((value) => ({
  value,
  label: applicationStatusLabels[value]
})) as ReadonlyArray<{
  value: ApplicationStatus;
  label: string;
}>;

export const networkingStatusOptions = networkingStatusValues.map((value) => ({
  value,
  label: networkingStatusLabels[value]
})) as ReadonlyArray<{
  value: NetworkingStatus;
  label: string;
}>;

export const trackerStatusModel = {
  applicationStatuses: applicationStatusValues,
  networkingStatuses: networkingStatusValues,
  applicationStatusLabels,
  networkingStatusLabels,
  applicationStatusOptions,
  networkingStatusOptions
} as const;

export function getApplicationStatusLabel(value: ApplicationStatus): string {
  return trackerStatusModel.applicationStatusLabels[value];
}

export function getNetworkingStatusLabel(value: NetworkingStatus): string {
  return trackerStatusModel.networkingStatusLabels[value];
}
