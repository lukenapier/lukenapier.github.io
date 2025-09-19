---
tags: design/item

status: complete

related_notes:

- "[[Player Character]]"
---

# 💎 Item System

The item system is the backbone of the server's economy and player progression. It's built around a few key classes.

## 1. `Item.java`

This is the fundamental class for all items. It is a simple object that contains two pieces of information:

- **`id`**: The unique identifier for the item.
    
- **`amount`**: The quantity of the item (for stackable items).
    

## 2. `ItemDefinition.java`

Similar to `NpcDefinition`, this class is the blueprint for an item, loaded from the server cache. It contains all the static data for a given item ID:

- **Name**: The in-game name of the item.
    
- **Examine Text**: The text that appears when a player examines the item.
    
- **Stackable**: Whether the item can be stacked in a single inventory slot.
    
- **Noted/Noteable**: Whether the item is a banknote or can be turned into one.
    
- **Value**: The high and low alchemy values, as well as the store price.
    
- **Equipment Bonuses**: An array of all the combat bonuses the item provides when equipped.
    

## 3. `ItemContainer.java`

This is a powerful and flexible class that represents any collection of items. It's the base for the inventory, bank, equipment, and trade screens.

### Key Features of `ItemContainer`:

- **Capacity**: The maximum number of item slots it can hold.
    
- **Stacking Policy**: Can be configured to always stack items, never stack, or stack only if the item definition says it should.
    
- **Listeners**: Other parts of the code can "listen" to an `ItemContainer`. When an item is added or removed, the container notifies its listeners, who can then perform an action. This is how the client's inventory interface is updated when a change happens on the server.
    

### Major Implementations:

- **`Inventory.java`**: A 28-slot container for the player's main inventory.
    
- **`Equipment.java`**: A 14-slot container for equipped items. It has a special listener that recalculates player bonuses whenever an item is equipped or unequipped.
    
- **`Bank.java`**: A much larger container that also handles features like placeholders, tabs, and searching.
    
- **`PriceChecker.java`**: The container for the price checker interface.
    
- **`TradeSession.java`**: Both players in a trade have an `ItemContainer` to hold their offered items.