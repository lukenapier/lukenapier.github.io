---
tags: content/skill
status: base
skill_id: 5
skill_type: combat
related_skills: []
---

# 🙏 Prayer

## 1. Core Philosophy & Vision
Prayer is a combat skill that allows players to use a variety of overhead protection prayers and temporary boosts by consuming prayer points. It is a vital skill for combat, offering defensive and offensive advantages.

## 2. Training Methods
Prayer is trained by burying bones or scattering ashes. Experience can be significantly increased by using bones on an altar.

### Bone Burying / Ash Scattering
| Item                      | Experience |
| ------------------------- | ---------- |
| [[Bones]]                 | 4.5        |
| [[Wolf Bones]]            | 4.5        |
| [[Bat Bones]]             | 4.5        |
| [[Big Bones]]             | 15.0       |
| [[Babydragon Bones]]      | 30.0       |
| [[Dragon Bones]]          | 72.0       |
| [[Wyvern Bones]]          | 72.0       |
| [[Lava Dragon Bones]]     | 85.0       |
| [[Dagannoth Bones]]       | 125.0      |
| [[Superior Dragon Bones]] | 150.0      |
| [[Fiendish Ashes]]        | 10.0       |
| [[Vile Ashes]]            | 25.0       |
| [[Malicious Ashes]]       | 65.0       |
| [[Abyssal Ashes]]         | 85.0       |
| [[Infernal Ashes]]        | 110.0      |

### Altar Sacrifice
Using bones on a Gilded Altar provides a **180%** experience boost.

## 3. Implementation Notes
-   `BoneSacrifice.java` handles all prayer-related actions, including burying, scattering, and altar usage.
-   `BoneData.java` and `AshData.java` contain the data for all items that grant Prayer experience.
-   The experience modifier for using an altar is defined within the `sacrifice` action in `BoneSacrifice.java`.