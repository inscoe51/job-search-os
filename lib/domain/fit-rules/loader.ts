import fitRulesJson from "@/data/foundation/03_fit_rules.json";
import { fitRulesSchema, type FitRulesData } from "@/lib/validation/schemas";

let cached: FitRulesData | null = null;

export function loadFitRules(): FitRulesData {
  if (!cached) {
    cached = fitRulesSchema.parse(fitRulesJson);
  }

  return cached;
}
