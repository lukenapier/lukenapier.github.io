---
tags: content/skill
status: base
skill_id: 6
skill_type: combat
related_skills:
  - "[[Runecrafting]]"
---

# 🪄 Magic

## 1. Core Philosophy & Vision
Magic is a combat skill that allows players to cast a wide array of spells for combat, utility, and teleportation. It is one of the three sides of the combat triangle.

## 2. Spellbooks
Players can access three different spellbooks, each offering a unique set of spells.

-   **[[Modern Spellbook]]**: A versatile spellbook with combat, utility, and a wide range of teleports.
-   **[[Ancient Magicks]]**: A combat-focused spellbook with powerful multi-target and single-target spells.
-   **[[Lunar Spellbook]]**: A utility-focused spellbook with many non-combat and support spells.

## 3. Non-Combat Spells
Magic offers many useful non-combat spells across the spellbooks.

### Alchemy
-   **[[Low Level Alchemy]]** (Level 21)
-   **[[High Level Alchemy]]** (Level 55)

### Enchantment
-   **[[Bolt Enchanting]]**: Enchants various bolts with magical properties. (e.g., Opal, Ruby, Diamond)
-   **[[Jewellery Enchanting]]**: Enchants sapphire through zenyte jewellery.

### Utility
-   **[[Bones to Bananas]]** (Level 15)
-   **[[Bones to Peaches]]** (Level 60)
-   **[[Superheat Item]]** (Level 43)
-   **[[Vengeance]]** (Level 94, Lunar)

### Teleportation
-   A wide variety of teleports are available on all spellbooks, detailed in `MagicTeleports.java`.

## 4. Implementation Notes
-   `Magic.java` is a utility class, while `SpellCasting.java` handles the execution of non-combat spells.
-   The `spell` package contains the implementation for each individual spell.
-   `Spellbook.java` enum defines the three available spellbooks and their interface IDs.
-   `RunePouch.java` manages the logic for storing runes.