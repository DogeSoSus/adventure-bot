export const stats = [
  'ac',
  'attackBonus',
  'damageBonus',
  'damageMax',
  'dragonSlaying',
  'haste',
  'maxHP',
  'monsterDamageMax',
] as const

export type Stat = typeof stats[number]

export type Stats = {
  /**
   * cooldown reduction, 0-100 as a percent of reduction
   * @example 5m cooldown with 50 haste = 2:30 cooldown
   */
  haste: number
} & {
  [key in Stat]: number
}

export const statTitles: { [key in Stat]: string } = {
  ac: 'Armor',
  attackBonus: 'Attack Bonus',
  damageBonus: 'Damage Bonus',
  damageMax: 'Damage',
  dragonSlaying: 'Dragon Slaying',
  haste: 'Haste',
  maxHP: 'Max Health',
  monsterDamageMax: 'Monster Slaying',
}
