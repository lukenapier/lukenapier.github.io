---
tags: technical/core

status: complete

related_notes:

- "[[Item System]]"
    
- "[[NPCs]]"
    
- "[[Region and Pathfinding]]"
    
---
# 🗄️ Cache File System

## 1. Overview

The Cache File System is the server's low-level I/O (Input/Output) system responsible for reading the game's asset data from the local disk. The "cache" is a collection of files (`.dat2`, `.idx*`) that contains all the definitions for every single piece of content in the game world, such as items, NPCs, objects, maps, and animations.

Essentially, this system acts as a bridge between the raw, compressed data files provided by the client and the usable Java objects (`ItemDefinition`, `NpcDefinition`, etc.) that the server's game logic relies on.

## 2. File Structure on Disk

The cache is physically stored as a set of files, typically named `main_file_cache.*`.

- **`main_file_cache.dat2`**: This is the main data file. It contains all the actual game asset data, compressed and packed together. It can be thought of as a massive library of information.
    
- **`main_file_cache.idx*`**: These are the **index files** (e.g., `.idx0`, `.idx1`, `.idx2`). Each index file corresponds to a specific category of data. They act as a "table of contents" for the `.dat2` file, telling the server exactly where to look to find a specific piece of data.
    

|              |                                |
| ------------ | ------------------------------ |
| **Index ID** | **Content**                    |
| 0            | Models (3D)                    |
| 1            | Animations                     |
| 2            | Configs (Items, NPCs, Objects) |
| 3            | Interfaces                     |
| 4            | Sound Effects                  |
| 5            | Maps & Regions                 |

## 3. The Data Reading Process

When the server needs to load a definition for the first time, it follows a precise, multi-step process to retrieve it from the cache files.

1. **Initiation (`Cache.java`)**: When the server starts, it initializes the `Cache` and creates a `FileSystem` object, which opens the `.dat2` and all `.idx` files, preparing them for reading.
    
2. **Requesting Data**: A request is made for a specific definition (e.g., `GameObjectDefinition.forId(2097)` for an anvil).
    
3. **Finding the Index (`Index.java`)**: The `FileSystem` looks into the appropriate index file (in this case, `idx2` for object configs). The index tells it the **size** of the data chunk and the **starting sector** (the block number) where this data is located within the `.dat2` file.
    
4. **Reading Sectors (`Sector.java`)**: The server reads the raw, compressed block of data (a "sector") from the `.dat2` file. If the data is larger than one sector, it follows a pointer to the next sector until all the data for that entry has been read.
    
5. **Reconstructing the Archive (`Archive.java`)**: The data from the sectors is combined to form a single, compressed `Archive`. An archive is like a `.zip` file that can contain multiple files within it (for example, the "object definitions" archive contains the data for every object in the game).
    
6. **Decompression (`CompressionUtil.java`)**: The archive's data is decompressed using either **GZIP** or **BZIP2** algorithms to get the raw, uncompressed byte data.
    
7. **Decoding (`decoder` package)**: This raw byte data is passed to a specific decoder. For an anvil, this would be the `ObjectDefinitionDecoder`. The decoder uses a `Buffer` to read the data byte-by-byte.
    
8. **Creating the Definition Object**: The decoder interprets the sequence of bytes according to the client's data structure to populate the fields of a `GameObjectDefinition` object (e.g., its name "Anvil", its size, its interaction options, etc.).
    
9. **Caching in Memory**: The newly created `GameObjectDefinition` object is stored in a static array in memory. The next time the server needs the definition for an anvil, it will retrieve it instantly from this array instead of reading it from the disk again.
    

## 4. Key Decoders

The `fs/cache/decoder` package contains the logic for interpreting the raw byte data for different types of content.

- **`ObjectDefinitionDecoder`**: Decodes game objects (scenery, furniture, etc.).
    
- **`CacheNpcDefinition`**: Decodes NPCs.
    
- **`AnimationDefinitionDecoder`**: Decodes animations.
    
- **`RegionDecoder` / `MapDefinitionDecoder`**: Decode map files and region data, which includes object spawns and collision data. See [[Region and Pathfinding]].