import { describe, expect, it } from "vitest";

import {
  applicationStatusOptions,
  applicationStatusValues,
  getApplicationStatusLabel,
  getNetworkingStatusLabel,
  networkingStatusOptions,
  networkingStatusValues,
  trackerStatusModel
} from "@/lib/domain/tracker-status";

describe("tracker status model", () => {
  it("centralizes status arrays, labels, and option lists from one shared model", () => {
    expect(trackerStatusModel.applicationStatuses).toEqual(applicationStatusValues);
    expect(trackerStatusModel.networkingStatuses).toEqual(networkingStatusValues);
    expect(applicationStatusOptions.map((option) => option.value)).toEqual(
      applicationStatusValues
    );
    expect(networkingStatusOptions.map((option) => option.value)).toEqual(
      networkingStatusValues
    );
  });

  it("uses the central label helpers for UI rendering", () => {
    expect(getApplicationStatusLabel("hold_for_networking")).toBe(
      "Hold for networking"
    );
    expect(getNetworkingStatusLabel("researching_contact")).toBe(
      "Researching contact"
    );
  });
});
