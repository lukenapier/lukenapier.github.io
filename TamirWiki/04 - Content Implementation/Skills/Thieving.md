---
tags: content/skill
status: wip
skill_id: 17
skill_type: gathering
related_skills: []
---

# 🤫 Thieving

## 1. Core Philosophy & Vision
Thieving is a gathering skill focused on stealing from NPCs and market stalls. It's a high-risk, high-reward skill that can be a great source of money and unique items.

## 2. Thieving Methods

### Pickpocketing
Players can attempt to pickpocket various NPCs around the world. Failing a pickpocket attempt will result in the player being stunned and taking damage.
-   A full list of pickpocketable NPCs, their level requirements, and potential loot is in `PickpocketData.java`.
-   **Example NPCs:** [[Man]], [[Farmer]], [[Guard]], [[Knight]], [[Hero]].

### Stall Thieving
Players can steal from market stalls. Stealing from a stall has a chance to fail, which will temporarily stun the player.
-   A full list of stalls, their level requirements, and loot is in `StallData.java`.
-   **Example Stalls:** [[Food Stall]], [[General Stall]], [[Crafting Stall]], [[Gem Stall]].

### Wall Safes
-   Requires level 50 Thieving.
-   Located in the Rogues' Den.
-   Has a chance to fail and trigger a trap, dealing damage.

## 3. Implementation Notes
-   `Thieving.java` is the main class for the skill.
-   `PickpocketAction.java` and `PickpocketData.java` handle all NPC pickpocketing.
-   `StallData.java` contains the data for market stalls. The stall thieving action is handled directly within `Thieving.java`.
-   `WallSafe.java` contains the logic for the wall safe minigame.