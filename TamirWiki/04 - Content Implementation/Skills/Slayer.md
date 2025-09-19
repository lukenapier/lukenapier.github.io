---
tags: content/skill
status: base
skill_id: 18
skill_type: combat
related_skills: []
---

# ⚔️ Slayer

## 1. Core Philosophy & Vision
Slayer is a combat skill where players are assigned to kill a specific number of a certain monster by a Slayer Master. It provides access to unique monsters and powerful rewards.

## 2. Slayer Tasks
Tasks are assigned based on difficulty. A complete list of monsters for each difficulty is available in `SlayerTask.java`.
-   **Easy Tasks:** e.g., [[Sand Crab]], [[Rock Crab]], [[Crawling Hand]]
-   **Medium Tasks:** e.g., [[Fire Giant]], [[Green Dragon]], [[Bloodveld]]
-   **Hard Tasks:** e.g., [[Black Demon]], [[Hellhound]], [[Gargoyle]]
-   **Boss Tasks:** e.g., [[Kraken]], [[Zulrah]], [[Cerberus]]

## 3. Slayer Points & Rewards
Completing tasks awards Slayer Points, which can be spent on various rewards.
-   **Task Cancellation:** Cancel your current task for points.
-   **Task Blocking:** Permanently block a task from being assigned for 100 points.
-   **Unlocks:** Purchase permanent perks and access to new tasks. (e.g., [[Slayer Helmet]], [[Broad Bolts]], [[Zulrah Task]])
-   **Shop:** Purchase unique Slayer equipment and items.

## 4. Implementation Notes
-   `Slayer.java` is the main player-specific handler for the skill.
-   `SlayerTask.java` defines all possible tasks, their requirements, and locations.
-   `SlayerUnlockable.java` contains the data for all unlockable perks.
-   The `SlayerTab.java` enum manages the different panes of the Slayer interface.