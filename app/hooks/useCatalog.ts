import { useMemo } from "react";
import { getComponents, getMicrocontrollers } from "@/lib/catalog";
import type { Component, Microcontroller } from "@/types";

interface CatalogData {
  microcontrollers: Microcontroller[];
  components: Component[];
}

export function useCatalog(): CatalogData {
  return useMemo(
    () => ({
      microcontrollers: getMicrocontrollers(),
      components: getComponents(),
    }),
    []
  );
}
