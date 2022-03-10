import { TemplateEffect } from '@adventure-bot/game/statusEffects'

export const protectedEffect: TemplateEffect = {
  name: 'Protected',
  modifiers: {
    ac: 2,
  },
  duration: 60 * 60000,
  buff: true,
  debuff: false,
}
