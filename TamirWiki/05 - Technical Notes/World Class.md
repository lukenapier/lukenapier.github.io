---
tags: technical/world

status: complete

related_notes:

- "[[Game Engine & Main Loop]]"
    
- "[[Entity System]]"
    
---
---

# 🌎 The World Class

The `World.java` class acts as the central hub for the entire game world. It is a singleton, meaning there is only one instance of it running at any time. It is responsible for managing all major aspects of the game state.

## Core Responsibilities

- **Entity Management**: The `World` class holds the master lists for all active players (`players`) and NPCs (`npcs`) in the game. These are stored in `MobList` collections, which are optimized for concurrent access.
    
- **Login & Logout Queues**: It manages the `loginQueue` and `logoutQueue`. As described in the [[Game Engine & Main Loop]], these queues are processed at the start of each game tick to add new players to the world or safely remove those who have logged out.
    
- **Global Tasks & Events**: The `World` class has a task scheduler (`World.schedule(...)`) that allows for delayed actions to be executed. This is used for everything from object respawns to timed server messages.
    
- **Object & Item Management**: It keeps track of all spawned `GameObject`s and `GroundItem`s. This includes handling their registration, deregistration, and processing events related to them.
    
- **Global Messaging**: Provides methods to send messages to all online players (`World.sendMessage(...)`).
    
- **Region Management**: Holds the instance of the `RegionManager`, which is responsible for loading and managing map data and pathfinding.