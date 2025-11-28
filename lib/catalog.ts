import { z } from "zod";

import batteries from "@/data/batteries.json";
import deckData from "@/data/decks.json";
import driveKits from "@/data/driveKits.json";
import escs from "@/data/escs.json";
import remotes from "@/data/remotes.json";
import trucks from "@/data/trucks.json";
import wheels from "@/data/wheels.json";
import type { CatalogData, Deck } from "@/types";

const numeric = z.preprocess((value) => {
  if (value === null || value === undefined || value === "") return undefined;
  const coerced = Number(value);
  return Number.isNaN(coerced) ? undefined : coerced;
}, z.number());

const deckSchema = z.object({
  id: z.string(),
  brand: z.string(),
  name: z.string(),
  style: z.string(),
  lengthCm: numeric,
  widthCm: numeric.optional(),
  wheelbaseMinCm: numeric.optional(),
  wheelbaseMaxCm: numeric.optional(),
  flex: z.union([z.number(), z.string()]).optional(),
  weightDeckOnlyLb: numeric.optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  vendorName: z.string().catch(""),
  productUrl: z.string().url().optional(),
  priceCurrency: z.string().default("USD"),
  priceValue: numeric.default(0),
  lastVerifiedAt: z.string().optional(),
});

function normalizeDeck(entry: unknown): Deck | undefined {
  const parsed = deckSchema.safeParse(entry);

  if (!parsed.success) {
    return undefined;
  }

  const productUrl = parsed.data.productUrl ?? "";
  const vendorName = parsed.data.vendorName || "Unknown vendor";

  return {
    ...parsed.data,
    productUrl,
    vendorName,
    category: "deck",
  } satisfies Deck;
}

export function getCatalog(): CatalogData {
  const decks: Deck[] = Array.isArray(deckData)
    ? deckData
        .map((deck) => normalizeDeck(deck))
        .filter((deck): deck is Deck => Boolean(deck))
    : [];

  return {
    decks,
    trucks,
    wheels,
    batteries,
    escs,
    driveKits,
    remotes,
  } as CatalogData;
}
