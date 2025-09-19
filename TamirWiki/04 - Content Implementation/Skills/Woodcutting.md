---
tags: content/skill
status: wip
skill_id: 8
related_skills:
  - "[[Firemaking]]"
  - "[[Fletching]]"
  - "[[Construction]]"
---
---
tags: content/skill
status: complete
skill_id: 8
skill_type: gathering
related_skills:
  - "[[Firemaking]]"
  - "[[Fletching]]"
---

# 🌲 Woodcutting

## 1. Core Philosophy & Vision
Woodcutting is a gathering skill where players chop down trees to obtain logs. These logs are essential for Firemaking and Fletching. The skill has been enhanced with custom mechanics to make it more engaging.

## 2. Trees
| Tree Type          | Level Req | Chop Exp | Log Exp |
| ------------------ | --------- | -------- | ------- |
| [[Normal Tree]]    | 1         | 15.0     | 25.0    |
| [[Oak Tree]]       | 15        | 25.0     | 37.5    |
| [[Willow Tree]]    | 30        | 30.0     | 67.5    |
| [[Maple Tree]]     | 45        | 35.0     | 100.0   |
| [[Mahogany Tree]]  | 50        | 35.0     | 200.0   |
| [[Yew Tree]]       | 60        | 45.0     | 275.0   |
| [[Magic Tree]]     | 70        | 60.0     | 300.0   |
| [[Celastrus Tree]] | 80        | 60.0     | 400.0   |
| [[Crystal Tree]]   | 85        | 60.0     | 400.0   |
| [[Redwood Tree]]   | 90        | 60.0     | 600.0   |

## 3. Axes
A better axe increases the damage dealt to the tree's "progress" bar, resulting in faster log collection.
| Axe | Level Req | Damage | Crit Chance Bonus |
|---|---|---|---|
| [[Bronze Axe]] | 1 | 10 | 0% |
| [[Iron Axe]] | 10 | 20 | 0% |
| [[Steel Axe]] | 20 | 30 | 0% |
| [[Mithril Axe]] | 30 | 40 | 0% |
| [[Adamant Axe]] | 40 | 50 | 0% |
| [[Rune Axe]] | 50 | 60 | 0% |
| [[Dragon Axe]] | 60 | 100 | 0% |
| [[Crystal Axe]] | 70 | 120 | 0% |
| [[Infernal Axe]] | 80 | 130 | 0% |
| [[3rd Age Axe]] | 90 | 200 | 0% |
| [[Rune Felling Axe]] | 50 | 70 | 55% |
| [[Dragon Felling Axe]] | 60 | 120 | 55% |
| [[Crystal Felling Axe]] | 70 | 150 | 55% |
| [[3rd Age Felling Axe]] | 90 | 220 | 75% |

## 4. Custom Mechanics
-   **Critical Swings:** Based on Woodcutting level, players have a chance to deal a critical swing for increased damage to the tree's health.
-   **Bird Nests:** A chance to receive a bird nest containing rings or seeds.
-   **Spirit of the Grove:** A random event where a spirit appears. Interacting with it grants a temporary "Grove Blessing," bonus experience, and a tiered loot reward.
-   **Grove Blessing:** A temporary buff that provides various bonuses such as increased damage, faster chopping, and a chance to bank logs.

## 5. Implementation Notes
-   `Woodcutting.java` is the main skill handler.
-   `WoodcuttingAction.java` contains the core chopping loop, including the custom damage and progress system.
-   `TreeData.java` and `AxeData.java` store all the relevant stats for trees and axes.
-   `SpiritOfTheGrove.java` and `GroveTier.java` manage the random event and its associated rewards and buffs.