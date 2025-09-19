---
tags: technical/world

status: complete

related_notes:

- "[[Game Engine & Main Loop]]"
---

# 🗺️ Region and Pathfinding

This system governs the game map, object placement, and how players and NPCs navigate the world.

## 1. Regions (`Region.java`)

The game world is not loaded into memory all at once. Instead, it is broken down into a grid of **regions**. Each region is a 64x64 tile area of the map.

- **`RegionManager.java`**: This class is responsible for loading and unloading regions from the cache as players move around the world. A region is only loaded into memory if there is at least one player inside it. This is a crucial optimization for server performance.
    
- **Region Data**: When a `Region` is loaded, it contains all the static information for that area, including:
    
    - **Game Objects**: The default objects that belong on the map (trees, walls, doors, etc.).
        
    - **Clipping Data**: Information about which tiles are blocked and cannot be walked on.
        

## 2. Pathfinding (`pathfinding` package)

Pathfinding is the process of calculating a route from a starting position to a destination, avoiding obstacles along the way.

### Clipping & Traversal

- **`TraversalMap.java`**: This class uses the clipping data from the active `Region` to determine if a specific tile can be traversed. It checks for solid objects, NPCs, and other players to prevent walking through them. This is the foundation of pathfinding.
    

### Pathfinding Algorithms

The server uses sophisticated algorithms to find efficient paths for players and NPCs.

- **`AStarPathFinder.java`**: An advanced and efficient pathfinding algorithm (A*). It is used for longer-distance travel as it is very good at finding the optimal route quickly.
    
- **`DijkstraPathFinder.java`**: Another popular pathfinding algorithm.
    
- **`SimplePathFinder.java`**: Used for very short distances, as it is faster for simple paths.
    

The server intelligently chooses the best pathfinding algorithm based on the distance and complexity of the required path.