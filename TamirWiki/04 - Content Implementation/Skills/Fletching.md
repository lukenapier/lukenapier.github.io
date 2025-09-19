---
tags: content/skill
status: base
skill_id: 9
skill_type: artisan
related_skills:
  - "[[Woodcutting]]"
  - "[[Smithing]]"
---

# 🏹 Fletching

## 1. Core Philosophy & Vision
Fletching is an artisan skill that allows players to create ranged weapons and ammunition, such as bows, crossbows, arrows, and bolts. It is a vital skill for rangers and a good source of income.

## 2. Fletching Categories
The skill is divided into several distinct actions:

### Carving (Knife on Logs)
-   **[[Arrow Shafts]]**
-   **[[Shortbows (u)]]**
-   **[[Longbows (u)]]**
-   **[[Crossbow Stocks]]**

### Stringing (Bowstring on Unstrung Bows)
-   **[[Shortbows]]**
-   **[[Longbows]]**
-   **[[Crossbows]]**

### Feathering (Feathers on Arrow Shafts/Bolts)
-   **[[Headless Arrows]]**
-   **[[Bronze through Runite Bolts]]**
-   **[[Bronze through Dragon Darts]]**

### Tipping (Arrow/Bolt Tips on Headless Arrows/Bolts)
-   **[[Bronze through Dragon Arrows]]**
-   **[[Opal through Onyx Tipped Bolts]]**

### Creating Battlestaves
-   Attaching an orb to a [[Battlestaff]].

## 3. Implementation Notes
-   `Fletching.java` is the main class that handles the skill logic and interfaces.
-   The `impl` package contains enums for each fletching action: `Carvable.java`, `Stringable.java`, `Featherable.java`, `Arrow.java`, `Bolt.java`, and `Crossbow.java`.
-   The `Fletchable` interface provides a common structure for all fletching activities.