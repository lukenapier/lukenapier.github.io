---
tags: technical/networking

status: complete

related_notes:

- "[[Networking Overview]]"
---

# ✉️ Packet System

Packets are small bundles of data that represent a specific action or piece of information. The entire game is driven by sending and receiving packets.

## 1. Incoming Packets (Client → Server)

These represent actions taken by the player in the game client.

- **Structure**:
    
    - Each incoming packet has a unique **opcode** (a number that identifies the packet's purpose).
        
    - The data payload is read by a `PacketListener`.
        
- **Processing Flow**:
    
    1. The **`GamePacketDecoder`** reads the raw data from the connection, identifies the opcode and size, and creates a `GamePacket` object.
        
    2. This `GamePacket` is added to the player's `GameSession` queue.
        
    3. During the [[Game Engine & Main Loop|Pre-Update phase]], the server processes this queue.
        
    4. The **`PacketRepository`** is used to find the correct `PacketListener` for the packet's opcode.
        
    5. The `execute` method of the listener is called, which contains the server-side logic for that action (e.g., the `ButtonClickPacketListener` handles the logic for a player clicking a button).
        
- **Examples of Incoming Packets**:
    
    - `WalkingPacketListener`: Handles player movement.
        
    - `CommandPacketListener`: Handles commands typed by the player.
        
    - `ItemOptionPacketListener`: Handles clicking options on items.
        
    - `ButtonClickPacketListener`: Handles clicking on interface buttons.
        

## 2. Outgoing Packets (Server → Client)

These represent updates from the server that the player's client needs to know about.

- **Structure**:
    
    - Each outgoing packet is its own class (e.g., `SendMessage`, `SendItemOnInterface`).
        
    - They extend `OutgoingPacket` and implement a method to build a `PacketBuilder`.
        
    - The **`PacketBuilder`** is a utility for writing data in the correct format (bytes, strings, integers) for the client.
        
- **Processing Flow**:
    
    1. Server-side code creates an instance of an outgoing packet (e.g., `player.send(new SendMessage("Hello"))`).
        
    2. This packet is added to the player's `GameSession` outgoing packet queue.
        
    3. During the [[Game Engine & Main Loop|Post-Update phase]], the server processes this queue.
        
    4. The packet is passed to the **`GamePacketEncoder`**, which converts the `PacketBuilder` data into raw bytes and sends it over the network to the client.
        
- **Examples of Outgoing Packets**:
    
    - `SendMessage`: Sends a chat message.
        
    - `SendSkill`: Updates a skill level.
        
    - `SendAddObject`: Tells the client to spawn an object.
        
    - `SendPlayerUpdate` / `SendNpcUpdate`: The main packets for updating mob appearances and positions.