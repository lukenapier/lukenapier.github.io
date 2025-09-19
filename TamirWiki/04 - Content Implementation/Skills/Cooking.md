---
tags: content/skill
status: base
skill_id: 7
skill_type: artisan
related_skills:
  - "[[Fishing]]"
---

# 🍳 Cooking

## 1. Core Philosophy & Vision
Cooking is a fundamental skill that allows players to turn raw food into edible, healing items. The success of cooking is dependent on the player's Cooking level and the type of food being cooked.

## 2. Cookable Foods
The following is a list of all cookable fish and other foods in Tamir.
| Raw Item | Cooked Item | Burnt Item | Level Req | No Burn Level | Experience |
|---|---|---|---|---|---|
| [[Raw Shrimp]] | [[Shrimp]] | [[Burnt Shrimp]] | 1 | 34 | 30.0 |
| [[Sardine]] | [[Cooked Sardine]] | [[Burnt Sardine]] | 1 | 38 | 40.0 |
| [[Anchovies]] | [[Cooked Anchovies]] | [[Burnt Anchovies]] | 1 | 34 | 30.0 |
| [[Herring]] | [[Cooked Herring]] | [[Burnt Herring]] | 5 | 41 | 50.0 |
| [[Mackerel]] | [[Cooked Mackerel]] | [[Burnt Mackerel]] | 10 | 45 | 60.0 |
| [[Trout]] | [[Cooked Trout]] | [[Burnt Trout]] | 15 | 50 | 70.0 |
| [[Cod]] | [[Cooked Cod]] | [[Burnt Cod]] | 18 | 52 | 75.0 |
| [[Pike]] | [[Cooked Pike]] | [[Burnt Pike]] | 20 | 53 | 80.0 |
| [[Salmon]] | [[Cooked Salmon]] | [[Burnt Salmon]] | 25 | 58 | 90.0 |
| [[Slimy Eel]] | [[Cooked Slimy Eel]] | [[Burnt Slimy Eel]] | 28 | 58 | 95.0 |
| [[Tuna]] | [[Cooked Tuna]] | [[Burnt Tuna]] | 30 | 65 | 100.0 |
| [[Karambwan]] | [[Cooked Karambwan]] | [[Burnt Karambwan]] | 30 | 200 | 190.0 |
| [[Rainbow Fish]] | [[Cooked Rainbow Fish]] | [[Burnt Rainbow Fish]] | 35 | 60 | 110.0 |
| [[Cave Eel]] | [[Cooked Cave Eel]] | [[Burnt Cave Eel]] | 38 | 40 | 115.0 |
| [[Lobster]] | [[Cooked Lobster]] | [[Burnt Lobster]] | 40 | 74 | 120.0 |
| [[Bass]] | [[Cooked Bass]] | [[Burnt Bass]] | 43 | 80 | 130.0 |
| [[Swordfish]] | [[Cooked Swordfish]] | [[Burnt Swordfish]] | 45 | 86 | 140.0 |
| [[Lava Eel]] | [[Cooked Lava Eel]] | [[Burnt Lava Eel]] | 53 | 53 | 30.0 |
| [[Monkfish]] | [[Cooked Monkfish]] | [[Burnt Monkfish]] | 62 | 92 | 150.0 |
| [[Shark]] | [[Cooked Shark]] | [[Burnt Shark]] | 80 | 99 | 210.0 |
| [[Sea Turtle]] | [[Cooked Sea Turtle]] | [[Burnt Sea Turtle]] | 82 | 150 | 212.0 |
| [[Cavefish]] | [[Cooked Cavefish]] | [[Burnt Cavefish]] | 88 | 150 | 214.0 |
| [[Manta Ray]] | [[Cooked Manta Ray]] | [[Burnt Manta Ray]] | 91 | 150 | 216.0 |
| [[Dark Crab]] | [[Cooked Dark Crab]] | [[Burnt Dark Crab]] | 90 | 185 | 225.0 |

## 3. Implementation Notes
-   The `Cooking.java` class handles the main logic for the skill.
-   The `CookData.java` enum contains all the data for cookable items.
-   The success formula for cooking is located in the `Cooking.java` class and is influenced by the player's Cooking level, the `noBurn` level of the food, and if the player has the [[Cooking Cape]] or [[Cooking Gauntlets]].