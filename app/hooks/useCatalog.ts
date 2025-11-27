import { useMemo } from "react";
import { getCatalog } from "@/lib/catalog";
import type { CatalogData } from "@/types";

export function useCatalog(): CatalogData {
  return useMemo(() => getCatalog(), []);
}
