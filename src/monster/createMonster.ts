import { randomUUID } from 'crypto'
import { defaultCharacter } from '../character/defaultCharacter'
import { Monster } from './Monster'
import store from '@adventure-bot/store'
import { monsterCreated } from '@adventure-bot/store/slices/characters'
import { selectMonsterById } from '@adventure-bot/store/selectors'
import { MonsterKind } from './names/getRandomMonsterName'

export const createMonster = (
  monster: Partial<Monster> & { name: string; kind: MonsterKind }
): Monster => {
  const newMonster: Monster = {
    ...defaultCharacter,
    id: monster?.id ?? randomUUID(),
    ...monster,
    isMonster: true,
  }
  store.dispatch(monsterCreated(newMonster))
  console.log(`created monster ${newMonster.id}`)
  return selectMonsterById(store.getState(), newMonster.id) ?? newMonster
}
