---
tags: content/skill
status: base
skill_id: 19
skill_type: gathering
related_skills:
  - "[[Herblore]]"
  - "[[Cooking]]"
---

# 🌿 Farming

## 1. Core Philosophy & Vision
Farming is a gathering skill that allows players to grow a variety of plants, including herbs, allotments, flowers, and trees. It's a time-based skill that rewards patience and planning, providing essential resources for other skills.

## 2. Core Mechanics
-   **Patches:** Farming is done in designated patches across the world.
-   **Weeding:** Patches must first be cleared of weeds using a rake.
-   **Planting:** Players use a seed dibber to plant seeds in a cleared patch.
-   **Growth:** Plants grow over a set period of time. This growth can be affected by disease.
-   **Disease & Curing:** Plants can become diseased. This can be prevented by watering (for allotments/flowers) or paying a farmer. Diseased plants can be cured with [[Plant Cure]].
-   **Harvesting:** Fully grown plants can be harvested for produce.

## 3. Farming Locations
-   **[[Catherby Farming Patch]]**
-   **[[Ardougne Farming Patch]]**
-   **[[Falador Farming Patch]]**
-   **[[Phasmaty Farming Patch]]**

## 4. Plant Types
The following types of plants can be grown in Tamir. Each has its own dedicated note with specific data.

-   **[[Allotments]]** (e.g., Potatoes, Onions, Watermelons)
-   **[[Herbs]]** (e.g., Guam, Ranarr, Torstol)
-   **[[Flowers]]** (e.g., Marigold, Rosemary, Limpwurt)
-   *Trees (Future)*
-   *Fruit Trees (Future)*
-   *Bushes (Future)*

## 5. Implementation Notes
-   The `Farming.java` class manages all farming zones and player interactions.
-   Each zone (e.g., `CatherbyZone.java`) defines the patches available within it.
-   The `FarmingPatch.java` class and its subclasses (`AllotmentPatch`, `HerbPatch`, etc.) contain the core logic for a single patch's state and growth.
-   Plant data is stored in enums like `Allotment.java`, `Herb.java`, and `Flower.java`.