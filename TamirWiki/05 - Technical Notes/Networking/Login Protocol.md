---
tags: technical/networking

status: complete

related_notes:

- "[[Networking Overview]]"
---

# 🔐 Login Protocol

The login protocol is the sequence of events that occurs when a player connects to the server and enters their credentials.

## 1. Initial Connection & Decoding

1. A new connection is accepted and a `LoginSession` is created.
    
2. The pipeline is set up with a **`LoginDecoder`**. This decoder's job is to read the raw data sent by the client and translate it into a `LoginDetailsPacket`. This packet contains the player's username, password, client version, and other client-specific information.
    
3. The `LoginDetailsPacket` is then passed to the `LoginExecutorService`.
    

## 2. Authentication & Validation (`LoginExecutorService.java`)

The `LoginExecutorService` handles the authentication process in a separate thread to prevent lagging the main [[Game Engine & Main Loop|game thread]].

1. **Credential Check**: It checks the player's username and password against the saved player files (`PlayerSerializer.load`).
    
2. **Validation**: It performs several checks:
    
    - Is the player already online?
        
    - Is the world full?
        
    - Is the player's account banned or disabled?
        
    - Is the client version correct?
        
3. **Response**: Based on the outcome, it creates a `LoginResponse` (e.g., `LoginResponse.SUCCESSFUL`, `LoginResponse.INVALID_CREDENTIALS`).
    

## 3. Encoding and Finalizing

1. The `LoginResponse` is sent back to a **`LoginResponseEncoder`** in the pipeline.
    
2. The encoder translates the response code into a format the client can understand and sends it.
    
3. If the login was successful:
    
    - The server adds the player to the `loginQueue` in the [[World Class]].
        
    - The pipeline is reconfigured for gameplay, replacing the login codecs with the in-game `GamePacketDecoder` and `GamePacketEncoder`.
        
    - The `LoginSession` is upgraded to a `GameSession`.