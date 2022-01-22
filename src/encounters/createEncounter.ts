import { randomUUID } from 'crypto'

import { Character } from '@adventure-bot/character'
import { Encounter } from '@adventure-bot/encounters'
import { Monster } from '@adventure-bot/monster'
import store from '@adventure-bot/store'
import { encounterCreated } from '@adventure-bot/store/slices/encounters'

export function createEncounter({
  monster,
  player,
}: {
  monster: Monster
  player: Character
}): Encounter {
  const encounter: Encounter = {
    characterId: player.id,
    monsterId: monster.id,
    date: new Date().toString(),
    id: randomUUID(),
    playerAttacks: [],
    monsterAttacks: [],
    rounds: 1,
    outcome: 'in progress',
  }
  store.dispatch(encounterCreated(encounter))
  return encounter
}
