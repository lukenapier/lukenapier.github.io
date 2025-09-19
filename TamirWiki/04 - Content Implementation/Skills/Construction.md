---
tags: content/skill
status: base
skill_id: 22
skill_type: artisan
related_skills:
  - "[[Smithing]]"
  - "[[Crafting]]"
  - "[[Woodcutting]]"
---

# 🏗️ Construction

## 1. Core Philosophy & Vision
Construction allows players to build and customize their own Player-Owned House (POH). This skill serves as a major gold sink and provides players with useful utilities and a space to call their own.

## 2. Buildable Maps (House Styles)
Players can choose from different styles for their house, each with its own level requirement and cost.
| Map Name | Level Req | Cost |
|---|---|---|
| [[Small Cave]] | 0 | 0 |
| [[Throne Room]] | 90 | 15,000,000 |

## 3. Buildable Objects
Objects are categorized by their type and location within the house. Each object has a level requirement, experience reward, and a list of required materials.

### Object Categories
-   **[[Construction - Main Objects]]**
-   **[[Construction - Skill Objects]]**
-   **[[Construction - Miscellaneous Objects]]**
-   **[[Construction - NPCs]]**

## 4. Servants
Players can hire servants to assist them in their house.
-   **Rick** (Level 20)
-   **Maid** (Level 25)
-   **Cook** (Level 30)
-   **Butler** (Level 40)
-   **Demon Butler** (Level 50)

## 5. Implementation Notes
-   The `House.java` class manages the core POH functionality, including entering, leaving, and building.
-   `BuildableObject.java` contains the enum with all constructible objects and their data.
-   The `BuildableInterface.java` class handles the player-facing interface for selecting what to build.