import workflowRulesJson from "@/data/foundation/05_workflow_rules.json";
import { trackerStatusModel } from "@/lib/domain/tracker-status";
import {
  workflowRulesSchema,
  type WorkflowRulesData
} from "@/lib/validation/schemas";

let cached: WorkflowRulesData | null = null;

function assertStatusModelMatches(data: WorkflowRulesData) {
  const appStatuses = data.statusModel.applicationStatuses.join("|");
  const expectedAppStatuses = trackerStatusModel.applicationStatuses.join("|");
  const networkingStatuses = data.statusModel.networkingStatuses.join("|");
  const expectedNetworkingStatuses =
    trackerStatusModel.networkingStatuses.join("|");

  if (appStatuses !== expectedAppStatuses) {
    throw new Error("Workflow application statuses drifted from tracker model.");
  }

  if (networkingStatuses !== expectedNetworkingStatuses) {
    throw new Error("Workflow networking statuses drifted from tracker model.");
  }
}

export function loadWorkflowRules(): WorkflowRulesData {
  if (!cached) {
    cached = workflowRulesSchema.parse(workflowRulesJson);
    assertStatusModelMatches(cached);
  }

  return cached;
}
