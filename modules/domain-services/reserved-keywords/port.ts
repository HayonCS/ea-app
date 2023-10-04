import * as Hexagonal from "atomic-object/hexagonal";

import { ReservedKeywords } from "domain-services/reserved-keywords";

export const ReservedKeywordsPort = Hexagonal.port<
  ReservedKeywords,
  "reservedKeywords"
>("reservedKeywords");
