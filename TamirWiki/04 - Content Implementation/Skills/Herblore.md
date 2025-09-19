---
tags: content/skill
status: base
skill_id: 15
skill_type: artisan
related_skills:
  - "[[Farming]]"
---

# 🌿 Herblore

## 1. Core Philosophy & Vision
Herblore is the artisan skill of cleaning herbs and mixing them into potions that provide temporary boosts, healing, and other unique effects. It is a crucial skill for any adventurer preparing for combat.

## 2. Herb Cleaning
The first step in Herblore is cleaning grimy herbs.
| Grimy Herb | Clean Herb | Level Req | Experience |
|---|---|---|---|
| [[Grimy Guam]] | [[Guam Leaf]] | 1 | 2.5 |
| [[Grimy Marrentill]] | [[Marrentill]] | 5 | 3.8 |
| [[Grimy Tarromin]] | [[Tarromin]] | 11 | 5.0 |
| [[Grimy Harralander]] | [[Harralander]] | 20 | 6.3 |
| [[Grimy Ranarr]] | [[Ranarr Weed]] | 25 | 7.5 |
| [[Grimy Toadflax]] | [[Toadflax]] | 30 | 8.0 |
| [[Grimy Irit]] | [[Irit Leaf]] | 40 | 8.8 |
| [[Grimy Avantoe]] | [[Avantoe]] | 48 | 10.0 |
| [[Grimy Kwuarm]] | [[Kwuarm]] | 54 | 11.3 |
| [[Grimy Snapdragon]] | [[Snapdragon]] | 59 | 11.8 |
| [[Grimy Cadantine]] | [[Cadantine]] | 65 | 12.5 |
| [[Grimy Lantadyme]] | [[Lantadyme]] | 67 | 13.1 |
| [[Grimy Dwarf Weed]] | [[Dwarf Weed]] | 70 | 13.8 |
| [[Grimy Torstol]] | [[Torstol]] | 75 | 15.0 |

## 3. Potion Making
Potions are created in two steps: creating an unfinished potion, and then adding a secondary ingredient.

### Unfinished Potions (Clean Herb + Vial of Water)
| Unfinished Potion | Herb Used | Level Req |
|---|---|---|
| [[Guam Potion (unf)]] | [[Guam Leaf]] | 1 |
| [[Marrentill Potion (unf)]] | [[Marrentill]] | 5 |
| [[Tarromin Potion (unf)]] | [[Tarromin]] | 12 |
| [[Harralander Potion (unf)]] | [[Harralander]] | 22 |
| [[Ranarr Potion (unf)]] | [[Ranarr Weed]] | 30 |
| ...and so on for all herbs. | | |

### Finished Potions (Unfinished Potion + Secondary Ingredient)
A complete list of all mixable potions.
| Potion | Unfinished Potion | Secondary Ingredient | Level Req | Experience |
|---|---|---|---|---|
| [[Attack Potion]] | [[Guam Potion (unf)]] | [[Eye of Newt]] | 1 | 25.0 |
| [[Antipoison]] | [[Marrentill Potion (unf)]] | [[Unicorn Horn Dust]] | 5 | 37.5 |
| [[Strength Potion]] | [[Tarromin Potion (unf)]] | [[Limpwurt Root]] | 12 | 50.0 |
| [[Restore Potion]] | [[Harralander Potion (unf)]] | [[Red Spiders' Eggs]] | 22 | 62.5 |
| [[Energy Potion]] | [[Harralander Potion (unf)]] | [[Chocolate Dust]] | 26 | 67.5 |
| ...and so on as defined in `FinishedPotion.java`. | | | | |

## 4. Implementation Notes
-   `Herblore.java` is the primary class for the skill.
-   `GrimyHerb.java` contains all data for cleaning herbs.
-   `UnfinishedPotion.java` and `FinishedPotion.java` store the data for all potion recipes.
-   The `Potion` interface provides a common structure for potion creation.