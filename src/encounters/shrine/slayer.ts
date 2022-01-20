import { randomUUID } from 'crypto'
import { CommandInteraction } from 'discord.js'
import { Shrine } from '../../shrines/Shrine'
import { shrineEmbeds } from './shrineEmbeds'
import { applyShrine } from './applyShrine'
import { getAsset } from '../../utils/getAsset'
import { createEffect } from '../../statusEffects'

export const slayerShrine = async (
  interaction: CommandInteraction
): Promise<void> => {
  const shrine: Shrine = {
    id: randomUUID(),
    name: "Slayer's Shrine",
    description: `This shrine fills you with an instincts of a hunter!`,
    image: getAsset('fantasy', 'characters', 'hidden hunter').s3Url,
    color: 'GREY',
    effect: createEffect('slayer'),
  }

  applyShrine({ shrine, interaction })

  interaction.editReply({
    embeds: shrineEmbeds({ shrine, interaction }),
  })
}
