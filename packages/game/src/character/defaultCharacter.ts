import { Character } from '@adventure-bot/game/character'

export const defaultCharacter: Omit<Character, 'id' | 'name'> = {
  ac: 10,
  attackBonus: 1,
  cooldowns: {},
  damageBonus: 0,
  damageMax: 4,
  dragonSlaying: 0,
  equipment: {},
  gold: 0,
  haste: 0,
  hp: 10,
  inventory: [],
  lockpicking: 0,
  maxHP: 10,
  monsterDamageMax: 0,
  profile: '',
  quests: {},
  statusEffects: [],
  xp: 0,
  xpValue: 10,
}
