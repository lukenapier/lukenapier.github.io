---
tags: technical/world

status: complete

related_notes:

- "[[Player Character]]"
    
- "[[NPCs]]"
    
- "[[Combat System]]"
---

# 🧬 Entity System

The Entity System is the foundational structure for all dynamic objects in the game world, specifically Players and NPCs.

## 1. `Entity.java`

This is the absolute base class. It defines the most fundamental properties that anything in the game world must have:

- **`EntityType`**: An enum (`PLAYER` or `NPC`).
    
- **`Position`**: The `x`, `y`, and `height` coordinates of the entity.
    
- **Index**: A unique identifier for the entity within its respective list (player list or NPC list).
    
- **Registration Status**: A boolean (`isRegistered`) to track if it's currently active in the world.
    

## 2. `Mob.java` (Mobile Entity)

`Mob` extends `Entity` and adds all the properties and methods related to movement and combat. This is the superclass for both `Player` and `Npc`.

### Key Components of a `Mob`:

- **`movement` (`Movement.java`)**: Manages the walking queue and processes the mob's movement from point A to point B each tick. See [[Region and Pathfinding]].
    
- **`combat` (`Combat.java`)**: The core of all combat interactions. It holds the mob's combat strategy, handles targeting, and initiates combat actions. See [[Combat System]].
    
- **`skills` (`SkillManager.java`)**: Manages all 23 skills, including their level, experience, and any temporary boosts or drains.
    
- **Update Flags (`UpdateFlag`)**: A system used to efficiently tell the client what aspects of a mob have changed. When a flag is set (e.g., `UpdateFlag.APPEARANCE` or `UpdateFlag.ANIMATION`), a specific block of data is sent to the client during the [[Client Synchronization]] phase.
    
- **`locking` (`Locking.java`)**: A system to prevent a mob from performing certain actions (walking, combat, all actions) for a set duration. This is used for stunning, skill actions, and preventing glitches.
    
- **Health & Hitpoints**: Manages the mob's current and maximum health, regeneration, and the process of taking damage through `Hit` objects.
    
- **Position & Facing**: Tracks the mob's current position and the direction it is facing.