---
tags: design/npc

status: complete

related_notes:

- "[[Entity System]]"
    
- "[[Combat System]]"
---

# 👺 Non-Player Characters (NPCs)

The `Npc.java` class extends `Mob` and represents any non-player character in the game, from monsters to shopkeepers.

## 1. Core NPC Components

- **Definition (`NpcDefinition.java`)**: This is the blueprint for an NPC. It is loaded from the server's cache and contains all the static data for a specific NPC ID, including:
    
    - Name
        
    - Combat Level
        
    - Size
        
    - Attackable status
        
    - Default stats (Hitpoints, Attack, Defence, etc.)
        
- **Movement**: NPCs have a `walkingRadius` that defines how far they can wander from their original spawn point. Their movement is handled by the `Movement.java` class, just like players.
    
- **Combat Strategy (`CombatStrategy`)**: This is the most important part of an NPC's combat behavior. Every NPC has a combat strategy that defines how it attacks.
    
    - **Basic Strategies**: Simple NPCs use `NpcMeleeStrategy`, `NpcRangedStrategy`, or `NpcMagicStrategy`.
        
    - **Custom Boss Strategies**: Complex bosses (like [[Zulrah]], [[Cerberus]], [[Vorkath]], etc.) have their own unique strategy classes in the `npc.boss` package. These classes contain custom attack rotations, special moves, and phase changes.
        
- **Drops (`NpcDropManager.java`)**: The `NpcDropManager` loads all NPC drop tables from JSON files. When an NPC dies, this manager is called to roll for loot based on the NPC's ID. The system supports multiple drop tables (common, rare, etc.) and weighted chances.
    
- **Death (`NpcDeath.java`)**: This class handles the death animation, drop table rolling, and respawn timer for the NPC.