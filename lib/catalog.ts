import components from "@/data/components.json";
import microcontrollers from "@/data/mcus.json";
import type { Component, Microcontroller } from "@/types";

export function getMicrocontrollers(): Microcontroller[] {
  return microcontrollers as Microcontroller[];
}

export function getComponents(): Component[] {
  return components as Component[];
}
