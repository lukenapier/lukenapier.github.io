---
tags: content/skill
status: base
skill_id: 21
skill_type: gathering
related_skills: []
---

# 🐾 Hunter

## 1. Core Philosophy & Vision
Hunter is a gathering skill that involves tracking and trapping various creatures around the world. It provides unique resources and is a skill based on patience and placement.

## 2. Hunter Techniques
Different creatures require different hunting methods.

### Net Trapping (Butterflies & Implings)
-   Requires a [[Butterfly Net]].
-   Requires [[Impling Jars]] or [[Butterfly Jars]].
-   **Creatures:**
    -   [[Butterflies]]
    -   [[Implings]]

### Bird Snaring
-   Requires a [[Bird Snare]].
-   **Creatures:** [[Crimson Swift]], [[Golden Warbler]], etc.

### Box Trapping
-   Requires a [[Box Trap]].
-   **Creatures:** [[Chinchompa]], [[Red Chinchompa]].

### Birdhouses
-   Requires creating and placing [[Birdhouses]] on Fossil Island.
-   A passive method of training Hunter. Requires seeds as bait.

## 3. Hunter Creatures
A full list of all creatures that can be caught.

| Creature | Level Req | Experience | Method |
|---|---|---|---|
| [[Crimson Swift]] | 1 | 3254 | Bird Snare |
| [[Golden Warbler]] | 5 | 3744 | Bird Snare |
| ...and so on for all birds... | | | |
| [[Ruby Harvest]] | 15 | 24 | Net Trapping |
| [[Sapphire Glacialis]] | 25 | 34 | Net Trapping |
| ...and so on for all butterflies... | | | |
| [[Baby Impling]] | 1 | 25 | Net Trapping |
| [[Young Impling]] | 22 | 65 | Net Trapping |
| ...and so on for all implings... | | | |
| [[Chinchompa]] | 53 | - | Box Trap |
| [[Red Chinchompa]] | 63 | - | Box Trap |

## 4. Implementation Notes
-   `Hunter.java` is the main skill handler.
-   `TrapManager.java` handles the logic for laying, catching, and dismantling traps (`SnareTrap`, `BoxTrap`).
-   `Netting.java` handles the action of catching net-based creatures.
-   The `birdhouse` package contains all logic for the birdhouse training method.