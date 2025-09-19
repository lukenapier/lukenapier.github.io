---
tags: content/skill
status: base
skill_id: 12
skill_type: artisan
related_skills:
  - "[[Mining]]"
---

# ✂️ Crafting

## 1. Core Philosophy & Vision
Crafting is a diverse artisan skill that allows players to create a wide variety of items, from armour and jewellery to pottery and glass. It is a key skill for creating valuable items and skilling supplies.

## 2. Crafting Categories
Crafting activities are broken down into several categories, each with its own set of items and requirements.

### Categories
-   **[[Gem Cutting]]**
-   **[[Leather & Dragonhide Crafting]]**
-   **[[Jewellery Crafting]]**
-   **[[Glassblowing]]**
-   **[[Pottery]]**
-   **[[Spinning]]**
-   **[[Tanning]]**
-   **[[Battlestaff Crafting]]**

## 3. Implementation Notes
-   The main logic is handled by `Crafting.java`.
-   Each crafting category has its own implementation file (e.g., `Gem.java`, `Hide.java`, `Jewellery.java`).
-   The `Craftable` interface and `CraftableItem` class provide the structure for all craftable items.