---
tags: content/skill
status: wip
skill_id: 14
skill_type: gathering
related_skills:
  - "[[Smithing]]"
---

# ⛏️ Mining

## 1. Core Philosophy & Vision
Mining is a gathering skill where players extract ores and gems from rocks. It is the primary method of obtaining raw materials for the Smithing skill.

## 2. Mineable Rocks
| Rock Type | Level Req | Experience | Respawn Time |
|---|---|---|---|
| [[Clay]] | 1 | 5.0 | 5s |
| [[Copper Ore]] | 1 | 17.5 | 5s |
| [[Tin Ore]] | 1 | 17.5 | 5s |
| [[Iron Ore]] | 10 | 35.0 | 8s |
| [[Silver Ore]] | 20 | 40.0 | 8s |
| [[Coal]] | 30 | 50.0 | 9s |
| [[Gold Ore]] | 40 | 65.0 | 7s |
| [[Gem Rock]] | 40 | 85.0 | 2s |
| [[Mithril Ore]] | 30 | 80.0 | 9s |
| [[Adamantite Ore]] | 40 | 95.0 | 11s |
| [[Runite Ore]] | 50 | 125.0 | 13s |
| [[Rune Essence]] | 1 | 25.0 | N/A |
| [[Amethyst]] | 92 | 240.0 | 10s |
| [[Dragonite Ore]] | 60 | 175.0 | 13s |

## 3. Pickaxes
A better pickaxe increases the chance of successfully mining an ore.
| Pickaxe | Level Req | Animation |
|---|---|---|
| [[Bronze Pickaxe]] | 1 | 625 |
| [[Iron Pickaxe]] | 1 | 626 |
| [[Steel Pickaxe]] | 6 | 627 |
| [[Mithril Pickaxe]] | 21 | 629 |
| [[Adamant Pickaxe]] | 31 | 628 |
| [[Rune Pickaxe]] | 41 | 624 |
| [[Dragon Pickaxe]] | 61 | 7139 |
| [[Crystal Pickaxe]] | 71 | 8347 |
| [[Infernal Pickaxe]] | 75 | 4483 |
| [[3rd Age Pickaxe]] | 90 | 7283 |

## 4. Implementation Notes
-   `Mining.java` is the main handler for the skill.
-   `MiningAction.java` contains the core loop for the mining process.
-   `OreData.java` contains all the data for each type of rock.
-   `PickaxeData.java` contains all the data for the different pickaxes.
-   The success formula is located in `Mining.java` and depends on the player's Mining level, the rock's level, and the pickaxe used.