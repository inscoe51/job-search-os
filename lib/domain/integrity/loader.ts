import integrityJson from "@/data/foundation/07_integrity_rules.json";
import {
  integrityRulesSchema,
  type IntegrityRulesData
} from "@/lib/validation/schemas";

let cached: IntegrityRulesData | null = null;

export function loadIntegrityRules(): IntegrityRulesData {
  if (!cached) {
    cached = integrityRulesSchema.parse(integrityJson);
  }

  return cached;
}
