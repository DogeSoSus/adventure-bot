import { CommandInteraction, MessageEmbed } from 'discord.js'

import { getCharacter } from '@adventure-bot/character/getCharacter'
import { gpGainField } from '@adventure-bot/character/gpGainField'
import { LootResult } from '@adventure-bot/character/loot/loot'

export function lootResultEmbed({
  result,
  interaction,
}: {
  result: LootResult
  interaction: CommandInteraction
}): MessageEmbed {
  const embed = new MessageEmbed({
    timestamp: result.timestamp,
    fields: [gpGainField(interaction, result.goldTaken)],
  })
  const looter = getCharacter(result.looterId)
  const lootee = getCharacter(result.targetId)
  if (looter && lootee) {
    embed.setTitle(`${looter.name} looted ${lootee.name} `)
    embed.setImage(lootee.profile)
    embed.setThumbnail(looter.profile)
  }
  result.itemsTaken.forEach((item) =>
    embed.addField(item.name, item.description)
  )
  return embed
}
