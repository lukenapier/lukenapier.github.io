---
tags: technical/networking

status: complete

related_notes:

- "[[Game Engine & Main Loop]]"
    
- "[[Login Protocol]]"
    
- "[[Packet System]]"
---

# 🔌 Networking Overview

The networking layer is the foundation of the server, responsible for all communication between the game client and the server. It is built using the **Netty** framework, a high-performance system for creating network applications.

## 1. Connection Pipeline (`ServerPipelineInitializer.java`)

When a player's client attempts to connect to the server, a "pipeline" of handlers is created to manage the connection. This pipeline defines how data is processed.

1. **`ChannelFilter`**: The very first handler. It acts as a security measure, filtering incoming connections to prevent common network attacks and connection flooding.
    
2. **`HAProxyMessageHandler`** (Optional): If enabled, this decodes information from a proxy, which is useful for retrieving a player's real IP address when the server is behind a proxy service like Cloudflare.
    
3. **Login/Game Codecs**: Depending on the state of the connection, the pipeline will include either the [[Login Protocol]] decoders/encoders or the in-game packet decoders/encoders.
    
4. **`ChannelHandler`**: The final handler in the pipeline. It manages the lifecycle of the connection, including when a session is activated (a player connects) and when it becomes inactive (a player disconnects).
    

## 2. Session Management (`session` package)

A **Session** represents a single, active connection from a client. The server uses two types of sessions:

- **`LoginSession`**: A temporary session created for a player who is currently on the login screen. Its only job is to handle the decoding of login credentials and respond with a login success or failure.
    
- **`GameSession`**: Once a player successfully logs in, their `LoginSession` is upgraded to a `GameSession`. This is a persistent session that handles all in-game communication (i.e., packets) until the player logs out. The `GameSession` contains queues for processing incoming and outgoing packets.
    

## 3. Packet System (`packet` package)

The core of client-server communication is the packet system. This is how actions and information are sent back and forth. This is detailed further in the **[[Packet System]]** note.