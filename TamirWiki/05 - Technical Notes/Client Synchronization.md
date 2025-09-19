---
tags: technical/engine
status: wip
related_notes:
  - "[[Game Engine & Main Loop]]"
---

# 🔄 Client Synchronization

## 1. Overview
Client synchronization is the process of updating every player's game client with the current state of the world. This happens at the end of every [[Game Engine & Main Loop|game tick]] and is broken into three distinct phases: **Pre-Update**, **Update**, and **Post-Update**.

## 2. Update Phases

### Pre-Update Phase (Input & Movement)
This phase prepares mobs for the main update block by processing their movement for the current tick.

-   **`PlayerPreUpdateTask`**:
    -   Processes all queued packets sent from the client to the server (`processClientPackets`).
    -   Processes player-specific events (`Events::process`).
    -   Calculates the player's next movement step based on their walking queue (`movement.processNextMovement()`).
-   **`NpcPreUpdateTask`**:
    -   Calculates the NPC's next movement step (`movement.processNextMovement()`).

### Update Phase (Sending Data to Client)
This phase is responsible for creating and sending the main update packets to the player's client, which tells the client where to draw other players and NPCs.

-   **`PlayerUpdateTask`**: Compiles and sends the `SendPlayerUpdate` packet, which contains all the information about the player's appearance and the appearance of other nearby players.
-   **`NpcUpdateTask`**: Compiles and sends the `SendNpcUpdate` packet, which contains all the information about the state of nearby NPCs.

### Post-Update Phase (Cleanup)
This phase resets the state of all mobs, so they are ready for the next game tick.

-   **`PlayerPostUpdateTask`**:
    -   Clears all update flags (like appearance changes, animations, graphics, etc.).
    -   Resets the player's animation and graphic slots.
    -   Sends any remaining queued packets from the server to the client (`processServerPacketQueue`).
-   **`NpcPostUpdateTask`**:
    -   Clears all of the NPC's update flags and resets its state for the next tick.