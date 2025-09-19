---
tags: content/skill
status: base
skill_id: 20
skill_type: artisan
related_skills:
  - "[[Magic]]"
---

# 🌀 Runecrafting

## 1. Core Philosophy & Vision
Runecrafting is the artisan skill of creating runes for the Magic skill. Players take rune essence to various altars scattered across the world to imbue them with magical energy.

## 2. Runecrafting Altars
Each type of rune is crafted at its own specific altar.
| Rune | Level Req | Experience per Essence |
|---|---|---|
| [[Air Rune]] | 1 | 6.0 |
| [[Mind Rune]] | 1 | 6.5 |
| [[Water Rune]] | 5 | 7.0 |
| [[Earth Rune]] | 9 | 7.5 |
| [[Fire Rune]] | 14 | 8.0 |
| [[Body Rune]] | 20 | 8.5 |
| [[Cosmic Rune]] | 27 | 10.0 |
| [[Chaos Rune]] | 35 | 10.5 |
| [[Nature Rune]] | 44 | 11.0 |
| [[Law Rune]] | 54 | 10.5 |
| [[Death Rune]] | 65 | 12.0 |
| [[Blood Rune]] | 77 | 12.5 |
| [[Astral Rune]] | 82 | 21.5 |
| [[Soul Rune]] | 90 | 29.7 |
| [[Wrath Rune]] | 95 | 52.5 |

### Ournia Altar
-   The Ournia Altar (ZMI Altar) allows players to craft a random assortment of runes from their inventory of essence, providing bonus runes.

## 3. Multiple Runes
As a player's Runecrafting level increases, they will begin to craft multiple runes per essence. The level requirements for multiple runes are defined in the `multiplier` array within `RunecraftData.java`.

## 4. Rune Pouches
Players can use rune pouches to carry additional essence, allowing for more runes to be crafted per trip.
| Pouch | Level Req | Capacity |
|---|---|---|
| [[Small Pouch]] | 1 | 3 |
| [[Medium Pouch]] | 25 | 6 |
| [[Large Pouch]] | 50 | 9 |
| [[Giant Pouch]] | 75 | 12 |

## 5. Implementation Notes
-   `Runecraft.java` is the main class for the skill.
-   `RunecraftData.java` contains the data for each rune, including level requirements, experience, and multiple rune levels.
-   `RunecraftTeleport.java` defines the locations for the various altar teleports (mysterious ruins).
-   `RunecraftPouch.java` and `RunecraftPouchData.java` manage the logic for the rune pouches.