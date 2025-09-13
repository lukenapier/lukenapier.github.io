# Change Log
All notable changes to this project will be documented in this file.

## [unreleased] - yyyy-mm-dd - Woodcutting Rework pt2
A continuation of work on the *Woodcutting Rework* project.
### Added
* added axeman’s folly and axeman’s folly m to Forester’s Grove Token Exchange (cost of 25/250)
* added new potion types to PotionData:
    * WEAK_SKILL(3, 0),
    * NORMAL_SKILL(5, .10F),
    * SUPER_SKILL(7, .20F),
    * EXTREME_SKILL(10, .20F)
* added axeman folly and matured variant to `PotionData` using `normal_skill` and `extreme_skill` boosts, and a guaranteed Spirit of the Grove spawn.
* added Extreme Woodcutting potion to PotionData. TODO client sided changes and server sided-data changes for the items (currently uses null IDs).
* added extreme wc potions to ItemDefinitions client sided.
* added `::grovetier (number)` command to change grovetier.
* added GroveForesterDialogue, including options to upgrade the tier of the grove and to open the grove token exchange.
* to upgrade the grove tier, you must have completed x% of achievements (25/50/80/99%) and spend a certain amount of grove tokens.
* added woodcutting capes and hood (costs 1m gp) to grove equipment shop.
* added mahogany trees and logs

### Changed
* removed wilderness requirements from looting bag
    * changed spirit of the grove loot to be a guaranteed item.
* updated woodcutting skill guide
* changed woodcutting tutor to be the main shop npc, and the forester to be the grove token npc.
* updated the grove map, looks nicer now. more makeup to come in the future
* big rewrite of Woodcutting Bonuses System.
* gave all trees MUCH more health, making logs a lot slower to obtain.
* SIGNIFICANTLY boosted the critical hit chance with felling axes.from 1-5% up to 55-75%
### Fixed
* updated PlayerAssistant skillRestore() method to include all skills instead of just combat skills.
* added grovetier to player persist file and db scripts.
* fixed a bug where when your inventory was empty you would stop chopping, but left it where if you drop an item you’ll continue chopping.





## [0.0.3] - 2025-09-11 - Woodcutting Rework pt 1
There has been much time, and many changes in between. MANY of the updates are undocumented. Again, I need to
stress that this entire process has been a massive learning experience for me. Hopefully going forward, using this document, I will be able to track my updates much better and more clearly.

With that being said, this update is mainly focused on The Woodcutting Rework!

### Added
* added new region "The grove" (Contains every type of tree choppable in Tamir).
* added new npc "Ed Wood". (He transports the player to and from the grove)
* new npc "Friendly Forester". Contains 2 new shops.
    * added generic woodcutting axe shop, contains bronze-rune.
* added grove token shop, and grove token currency
    * contains Lumberjack outfit pieces
    * Felling Axe Handle
* Added Spirit of the Grove events
    * occasionally occur while woodcutting, give loot and 'blessing of the grove'
* Added 'Blessing of the Grove' Woodcutting buff which gives increased damage, crtical hits, auto banks logs, gives extra grove tokens, improves chop speed and improves progress towards your next log.
* Added achievement section for Woodcutting achievements.
* added `::wcbonuses` command to display wc bonuses
### Changed
* rebalanced old and added "new" trees
    * added redwoods/celastrus/and crystal as 'regular' choppable trees
* rebalanced old and added "new" axes, including felling axes and the ability to create them.
* changed woodcutting to be more like "do damage to a tree based on your level", allowing for 'critical swings', slowing down log rates but keeping xp rates.
* heavily buffed wc outfit effects
* made bird's nests stackable and go straight to inventory
* changed clue scrolls to be caskets for rewards isntead of clues directly
* removed trees getting chopped down (temporary)
* random events no longer teleport you for ignoring them
### Fixed











## [0.0.2] - 2025-07-30
Update 2: Galvek, Gauntlet, various other updates
### Added
* started work on gauntlet
    * no prep, only boss fight
    * standard attacks mage/range, changes every 4
    * changes prayer every 6th hit taken
    * floor tile special: the floors flash a warning color before changing to damaging tiles
    * tornadoes special: the hunllef periodically summons tornadoes that chase the player around the room.
    * the lower health, the more tornadoes
    * collection log (bowfa, blade of saeldor, crystal armor, pet tbd)
    * teleport
* added Galvek boss fight;
    *  Standard attacks with mage/range/melee - 100%
    *  dragonfire attack + pink dragonfire attack -100%
    *  fire trap attack - 90% (need to set proper locations)
    *  Gust of wind attack - 100%
    *  tsunami attack - 100%
    *  Earth stun attack - 100%
    *  phase transitions - 90% (need to fix anims)
    *  -dded teleport to interface, as well as collection log (drops dragon hunter crossbow, which will not be rewarded from Chambers)
### Changed
* started reworking smithing requirements
    * all items are unlocked when that tier is unlocked (for example, mith bars are at level 30 so mith platelegs are also level 30)
* added more to skillzone
    * flax field and spinning wheel, altar, and a useless lectern
* fixed super antifires
* added widget to display antifire cooldown (functionality was already there, just wasn't used)
### Fixed

## [0.0.1] - 2025-07-23
This update is my first time working with a 317, after about a few months of playing with 718s and learning the absolute basics.
Now,
### Added
* added coal fragments:
    *   use hammer on piece of coal to recieve 10 coal fragments.
    *   coal fragments are used in place of coal when smelting.
*   added custom mining objects and items
*   objects(11378 > light anima rock, 2449 > dark anima rock, 28596 > dragonite rock)

*   added 'Seren Mining' prestige perk, 50% chance to bank ores

*   added ::skillz fully custom skill zone (will eventually become the new home)
*   added a slightly broken xp tracker plugin
*   changed starter bank to be much more humble
*   added thieving on an afk timer
### Changed
* changed starter bank to be much more humble
* edited edgeville and surrounding regions
* updated mining skill guide
*   updated pickaxe speeds and tiers
*   changed base xp rates to 10x
### Fixed




## [unreleased] - yyyy-mm-dd
Here we would have the update steps for 1.2.4 for people to follow.
### Added
### Changed
### Fixed
