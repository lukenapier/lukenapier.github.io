import batteries from "@/data/batteries.json";
import deckData from "@/data/decks.json";
import driveKits from "@/data/driveKits.json";
import escs from "@/data/escs.json";
import remotes from "@/data/remotes.json";
import trucks from "@/data/trucks.json";
import wheels from "@/data/wheels.json";
import type { CatalogData, Deck } from "@/types";

export function getCatalog(): CatalogData {
  const decks: Deck[] = deckData.map((deck) => ({
    ...deck,
    category: "deck",
  }));

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
