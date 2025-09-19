---
tags: content/skill
status: wip
skill_id: 13
skill_type: artisan
related_skills:
  - "[[Mining]]"
---

# 🔨 Smithing

## 1. Core Philosophy & Vision
Smithing is an artisan skill that complements Mining. Players use a furnace to smelt ores into metal bars, and then use those bars at an anvil with a hammer to create armour and weapons.

## 2. Smelting
Players smelt ores into bars at a furnace. Some bars, like Steel and higher, require coal as a secondary ingredient.
| Bar | Level Req | Experience | Ores Required |
|---|---|---|---|
| [[Bronze Bar]] | 1 | 6.25 | 1 [[Tin Ore]], 1 [[Copper Ore]] |
| [[Iron Bar]] | 10 | 12.5 | 1 [[Iron Ore]] |
| [[Silver Bar]] | 20 | 13.67 | 1 [[Silver Ore]] |
| [[Steel Bar]] | 20 | 17.5 | 1 [[Iron Ore]], 20 Coal Fragments |
| [[Gold Bar]] | 40 | 22.5 | 1 [[Gold Ore]] |
| [[Mithril Bar]] | 30 | 30.0 | 1 [[Mithril Ore]], 40 Coal Fragments |
| [[Adamantite Bar]] | 40 | 37.5 | 1 [[Adamantite Ore]], 60 Coal Fragments |
| [[Runite Bar]] | 50 | 50.0 | 1 [[Runite Ore]], 80 Coal Fragments |
| [[Dragonite Bar]] | 60 | 80.0 | 1 [[Dragonite Ore]], 100 Coal Fragments |

## 3. Forging (Smithing at an Anvil)
Players can smith bars into a variety of items. Each item has a level requirement and a required number of bars.

### Item Categories
-   **[[Bronze Smithing Table]]**
-   **[[Iron Smithing Table]]**
-   **[[Steel Smithing Table]]**
-   **[[Mithril Smithing Table]]**
-   **[[Adamant Smithing Table]]**
-   **[[Runite Smithing Table]]**

### Special Smithing
-   **[[Dragonfire Shield]]**: Level 85 Smithing, requires [[Draconic Visage]] and [[Anti-dragon Shield]].
-   **[[Dragonfire Ward]]**: Level 90 Smithing, requires [[Skeletal Visage]] and [[Anti-dragon Shield]].
-   **[[Godsword Blade]]**: Level 80 Smithing, requires all three [[Godsword Shards]].

## 4. Implementation Notes
-   `Smithing.java` is the main skill handler.
-   `Smelting.java` and `SmeltingData.java` manage the furnace-based smelting process.
-   `SmithingArmour.java` and `SmithingTable.java` manage the anvil-based forging process.