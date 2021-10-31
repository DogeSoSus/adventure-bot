import { randomUUID } from "crypto";

type Character = {
  id: string;
  hp: number;
  maxHP: number;
  ac: number;
  lastAction?: Date;
  level: number;
  attackBonus: number;
};
type DB = {
  characters: Map<string, Character>;
};
const db: DB = { characters: new Map() };

export const getHP = (characterId: string): number =>
  getCharacter(characterId).hp;
export const getMaxHP = (characterId: string): number =>
  getCharacter(characterId).maxHP;

export const levelup = (characterId: string): void => {
  const character = getCharacter(characterId);
  db.characters.set(characterId, {
    ...character,
    maxHP: character.maxHP + 1,
    hp: character.hp + 1,
  });
};

export const getCharacter = (id: string): Character => {
  const character = db.characters.get(id);
  if (!character) {
    return createCharacter({ id });
  }
  return character;
};

export const setCooldown = (characterId: string): Character => {
  const character = getCharacter(characterId);
  db.characters.set(characterId, { ...character, lastAction: new Date() });
  return character;
};

export const createCharacter = (character?: Partial<Character>): Character => {
  const newCharacter: Character = {
    ...character,
    id: character?.id || randomUUID(),
    hp: 10,
    ac: 10,
    maxHP: 10,
    level: 1,
    attackBonus: 1,
  };
  db.characters.set(newCharacter.id, newCharacter);
  console.log(`created ${newCharacter.id}`);
  return newCharacter;
};

export const adjustHP = (characterId: string, amount: number): Character => {
  const character = getCharacter(characterId);

  let newHp = character.hp + amount;
  if (newHp < 0) newHp = 0;
  if (newHp > character.maxHP) newHp = character.maxHP;

  db.characters.set(characterId, {
    ...character,
    hp: newHp,
  });
  return getCharacter(characterId);
};

export const isCharacterOnCooldown = (characterId: string): boolean => {
  const cooldown = 60000;
  const character = getCharacter(characterId);
  return Boolean(
    character.lastAction &&
      cooldown > Date.now() - character.lastAction.valueOf()
  );
};

type AttackResult =
  | { outcome: "hit"; damage: number }
  | { outcome: "miss" }
  | { outcome: "cooldown" };

const d20 = () => Math.ceil(Math.random() * 20);

export const attack = (
  attackerId: string,
  defenderId: string
): AttackResult => {
  const attacker = getCharacter(attackerId);
  const defender = getCharacter(defenderId);
  if (isCharacterOnCooldown(attackerId)) {
    return { outcome: "cooldown" };
  }
  db.characters.set(attackerId, { ...attacker, lastAction: new Date() });
  if (d20() + attacker.attackBonus > defender.ac) {
    const damageAmount = Math.ceil(Math.random() * 6);
    adjustHP(defenderId, -damageAmount);
    return { outcome: "hit", damage: damageAmount };
  }
  return { outcome: "miss" };
};

type TrapResult = { outcome: "hit"; damage: number } | { outcome: "miss" };

export const trap = (characterId: string): TrapResult => {
  if (Math.random() > 0.5) {
    const damageAmount = Math.ceil(Math.random() * 6);
    adjustHP(characterId, -damageAmount);
    return { outcome: "hit", damage: damageAmount };
  }
  return { outcome: "miss" };
};

type HealResult =
  | { outcome: "healed"; amount: number }
  | { outcome: "cooldown" };

export const heal = (initiatorId: string, targetId: string): HealResult => {
  const healer = getCharacter(initiatorId);
  if (isCharacterOnCooldown(initiatorId)) {
    return { outcome: "cooldown" };
  }
  db.characters.set(initiatorId, { ...healer, lastAction: new Date() });
  const amount = Math.ceil(Math.random() * 6);
  adjustHP(targetId, amount);
  return { outcome: "healed", amount };
};
