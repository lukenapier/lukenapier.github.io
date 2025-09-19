---
tags: content/skill
status: base
skill_id: 11
skill_type: artisan
related_skills:
  - "[[Woodcutting]]"
---

# 🔥 Firemaking

## 1. Core Philosophy & Vision
Firemaking is a simple artisan skill where players use a tinderbox to light logs, creating a fire. Fires serve as a temporary light source and a place for other players to cook food.

## 2. Lightable Logs
| Log Name | Level Req | Experience |
|---|---|---|
| [[Normal Logs]] | 1 | 150.0 |
| [[Achey Logs]] | 1 | 40.0 |
| [[Oak Logs]] | 15 | 300.0 |
| [[Willow Logs]] | 30 | 450.0 |
| [[Teak Logs]] | 35 | 105.0 |
| [[Arctic Pine Logs]] | 42 | 125.0 |
| [[Maple Logs]] | 45 | 523.0 |
| [[Mahogany Logs]] | 50 | 300.5 |
| [[Eucalyptus Logs]] | 58 | 300.5 |
| [[Yew Logs]] | 60 | 600.5 |
| [[Magic Logs]] | 75 | 690.9 |

## 3. Bonfires
Players can add logs to an existing fire to gain experience without having to move. This is a more AFK-friendly training method.

## 4. Implementation Notes
-   The `Firemaking.java` class handles all firemaking actions.
-   `FiremakingData.java` contains the data for all lightable logs.
-   The action of creating a fire is handled in `FiremakingAction.java`, which creates a temporary `GameObject` for the fire.