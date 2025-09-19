---
tags: design/player

status: wip

related_notes:

- "[[Entity System]]"
    
- "[[Item System]]"
    
- "[[Combat System]]"
---

# 👤 Player Character

The `Player.java` class is one of the most complex and central classes in the entire source code. It extends `Mob` and represents a human-controlled character in the game. It holds references to nearly every system a player interacts with.

## Core Player Components

- **Session (`GameSession`)**: The network connection between the server and the player's client.
    
- **Serialization (`PlayerSerializer`)**: Handles saving and loading player data to and from a persistent source (JSON files in this case).
    

### Gameplay Systems

- **`inventory` (`Inventory.java`)**: Manages the 28-slot player inventory.
    
- **`bank` (`Bank.java`)**: Manages the player's bank, including tabs, placeholders, and the bank pin system.
    
- **`equipment` (`Equipment.java`)**: Manages the 14 items the player has equipped. It also calculates equipment bonuses.
    
- **`prayer` (`PrayerBook.java`)**: Manages the player's prayer book, active prayers, and prayer point drain.
    
- **`slayer` (`Slayer.java`)**: Manages all slayer-related data, including the current task, points, and blocked tasks.
    
- **`spellbook` (`Spellbook.java`)**: Tracks the player's current spellbook (Modern, Ancients, Lunar).
    
- **`right` (`PlayerRight.java`)**: Manages the player's rights (e.g., Moderator, Administrator, Donator).
    
- **`relations` (`PlayerRelation.java`)**: Manages the friends and ignore lists.
    
- **`settings` (`Settings.java`)**: Manages all player-configurable settings, such as brightness, audio, and chat effects.
    

### Interaction & State

- **`interfaceManager` (`InterfaceManager.java`)**: Manages all the game interfaces (windows, overlays) that are open on the player's screen.
    
- **`dialogueFactory`**: A system for creating and displaying dialogues with NPCs and objects.
    
- **`action`**: The player's current queued action (e.g., skilling, combat).
    
- **`attributes`**: A flexible map to store temporary data about a player's state (e.g., that they are in a minigame, or have a specific flag set).
    

### Combat

- **`getStrategy()`**: Determines which combat strategy ([[PlayerMeleeStrategy]], [[PlayerRangedStrategy]], or [[PlayerMagicStrategy]]) the player should use based on their equipped weapon and attack style.
    
- **Special Attacks**: Manages the special attack energy and execution via `CombatSpecial.java`.
    
- **Death**: The `PlayerDeath.java` class handles the entire death sequence, including item protection and respawning.