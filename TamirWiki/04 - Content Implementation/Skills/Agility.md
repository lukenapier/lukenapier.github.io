---
tags: content/skill
status: base
skill_id: 16
skill_type: support
related_skills: []
---

# 🏃 Agility

## 1. Core Philosophy & Vision
Agility in Tamir is a skill that allows players to traverse the world more effectively by overcoming obstacles and using shortcuts. It involves completing courses to gain experience and agility tickets, which can be exchanged for rewards.

## 2. Agility Courses
Below are the defined agility courses in Tamir. Each course has a set of obstacles that must be completed in order to receive a completion reward.

### Courses
-   **[[Gnome Agility Course]]**
-   **[[Barbarian Outpost Agility Course]]**
-   **[[Wilderness Agility Course]]**
-   **[[Seers' Village Rooftop Course]]**
-   **[[Ardougne Rooftop Course]]**

## 3. Rewards
Players can exchange Agility tickets for various rewards.
-   **Experience:** Tickets can be exchanged for direct Agility experience.
-   **Items:**
    -   [[Agility Cape]]
    -   [[Pirate's Hook]]
    -   Other items as defined in `Agility.java`.

## 4. Implementation Notes
-   The core logic for handling obstacles is in `ObstacleInteraction.java`.
-   Specific obstacle types and their animations are defined in the `com.osroyale.content.skill.impl.agility.obstacle.impl` package.
-   Course completion flags are managed via player attributes, as seen in `ObstacleInteraction.java` (e.g., `AGILITY_FLAGS`).