---
tags: technical/engine
status: complete
related_notes:
  - "[[Client Synchronization]]"
---

# ⚙️ Game Engine & Main Loop

## 1. Core Philosophy & Vision
This document outlines the server's main game loop, which is the core process that runs continuously to make the game world function. It is controlled by the `GameThread.java` class.

## 2. The Game Tick
The entire game operates on a cycle called a "tick". One game tick in this server lasts **600 milliseconds**. Every 600ms, a series of operations are performed for every player and NPC online to keep the game state updated.

## 3. The Main Cycle Sequence
Within each 600ms tick, the `GameThread.java` class executes the following sequence of events:

1.  **Login/Logout Queue:** Processes players logging in (`dequeLogins`) and logging out (`dequeLogouts`).
2.  **NPC Pre-Update:** Handles NPC movement logic (`NpcPreUpdateTask`).
3.  **Player Pre-Update:** Processes incoming packets from clients and handles player movement (`PlayerPreUpdateTask`).
4.  **World Processing:** Ticks global game processes like object and ground item timers (`world.process()`).
5.  **Entity Sequencing:** Executes actions for all NPCs (`Npc::sequence`) and players (`Player::sequence`), such as skill actions, timers, and combat.
6.  **Client Synchronization:** This is the most complex step. It gathers all the updates from the previous steps and sends them to every player's client to render. This process is detailed in the **[[Client Synchronization]]** note.
7.  **Interface Updates:** Sends any necessary interface updates to players (e.g., the information tab).

## 4. Synchronization Models
The source code supports two different models for handling client synchronization:

-   **`SequentialClientSynchronizer`**: Processes all players and NPCs one by one on a single thread. It's simpler but may be slower with many players online.
-   **`ParallelClientSynchronizer`**: Uses multiple processor cores to handle player and NPC updates simultaneously. This is more complex but offers significantly better performance.

The server is configured to use the `ParallelClientSynchronizer` if `Config.PARALLEL_GAME_ENGINE` is enabled.