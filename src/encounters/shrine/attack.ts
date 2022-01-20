import { randomUUID } from 'crypto'
import { CommandInteraction } from 'discord.js'
import { Shrine } from '../../shrines/Shrine'
import { shrineEmbeds } from './shrineEmbeds'
import { applyShrine } from './applyShrine'
import { getAsset } from '../../utils/getAsset'
import { createEffect } from '../../statusEffects/createEffect'

export const attackShrine = async (
  interaction: CommandInteraction
): Promise<void> => {
  const shrine: Shrine = {
    id: randomUUID(),
    name: 'Shrine of Agression',
    description: `This shrine fills you with a rage!`,
    image: getAsset('fantasy', 'places', 'magical obelisk with a fiery aura')
      .s3Url,
    color: 'RED',
    effect: createEffect('aggression'),
  }

  applyShrine({ shrine, interaction })

  interaction.editReply({
    embeds: shrineEmbeds({ shrine, interaction }),
  })
}
