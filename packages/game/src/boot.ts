import { REST } from '@discordjs/rest'
import crypto from 'crypto'
import { Routes } from 'discord-api-types/v9'
import { Client, Guild, Intents } from 'discord.js'
import { readFile, writeFile } from 'fs/promises'

import {
  announceCrownLoots,
  announceEffectAdded,
  announceItemsReceived,
  announceLoots,
  announceTrapAttacked,
  announceWinners,
} from '@adventure-bot/game/announcements'
import { announceNewgames } from '@adventure-bot/game/announcements/announceNewgames'
import { renderCharacterList } from '@adventure-bot/game/character'
import commands from '@adventure-bot/game/commands'
import {
  findOrCreateCategory,
  findOrCreateTextChannel,
} from '@adventure-bot/game/guild'
import store from '@adventure-bot/game/store'
import { commandUsed } from '@adventure-bot/game/store/actions'
import { dispatchScheduledActions } from '@adventure-bot/game/store/schedule/dispatchScheduledActions'

type ClientOptions = {
  type: 'discord'
  token: string
  clientId: string
  channelId: string
  onError: (e: Error) => void
}

export const createClient: (
  options: ClientOptions
) => Promise<Client> = async ({
  clientId,
  channelId,
  token,
  onError,
}: ClientOptions) => {
  await installCommands({
    clientId,
    channelId,
    token,
  })

  console.time('discord client ready')
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    ],
  })

  // fixes `TypeError: Do not know how to serialize a BigInt` for store.dispatch(commandInteraction(interaction));
  // https://github.com/GoogleChromeLabs/jsbi/issues/30#issuecomment-1006086291
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(BigInt.prototype as any).toJSON = function () {
    return this.toString()
  }

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return
    store.dispatch(commandUsed(interaction))
    console.log(`command ${interaction.commandName}`)
    console.time(interaction.commandName + ' ' + interaction.id)
    try {
      await interaction.deferReply()
      const command = commands.get(interaction.commandName)
      if (!command) {
        interaction.editReply(`Command not found ${interaction.commandName}`)
        return
      }
      await command.execute({ interaction })
    } catch (e) {
      console.error(e)
      try {
        await interaction.followUp(
          `Command \`${interaction.commandName}\` failed with error: \`${e}\``
        )
      } catch {
        console.error(`Failed to respond to interaction id ${interaction.id}`)
      }
    }
    console.timeEnd(interaction.commandName + ' ' + interaction.id)
  })
  client.on('error', onError)

  client.on('ready', async () => {
    console.log('🎉 Adventures begin!')
    console.timeEnd('discord client ready')
    announceWinners(client)
    announceItemsReceived()
    announceEffectAdded(client)
    announceCrownLoots(client)
    announceLoots(client)
    announceTrapAttacked(client)
    dispatchScheduledActions()
    announceNewgames(client)
    client.guilds.cache.forEach((guild) => {
      console.log(`guild ${guild.name}`)
      setupGuild({ guild, client })
    })
  })

  client.login(token)

  return client
}

async function setupGuild({ guild, client }: { guild: Guild; client: Client }) {
  const category = await findOrCreateCategory(guild, 'Adventure Bot')
  await findOrCreateTextChannel({
    guild,
    name: 'game',
    options: { parent: category.id },
  })
  renderCharacterList(guild)
  const botId = client.application?.id
  if (!botId) return

  guild.channels.cache.forEach((channel) => {
    if (channel.isText()) return
    console.log(`channel ${channel.name}`)
  })
}

const installCommands = async ({
  token,
  clientId,
  channelId,
}: Pick<ClientOptions, 'clientId' | 'channelId' | 'token'>) => {
  const rest = new REST({ version: '9' }).setToken(token)

  try {
    const body = Array.from(commands.values()).map(({ command }) =>
      command.toJSON()
    )
    const commandHash = crypto
      .createHash('md5')
      .update(JSON.stringify(body))
      .digest('hex')
    const priorHash = (
      await readFile('.command-hash').catch(() => '')
    ).toString()
    if (commandHash === priorHash) {
      console.log('✅ Commands are up-to-date')
      return
    }

    console.time('updating commands')
    await rest.put(Routes.applicationGuildCommands(clientId, channelId), {
      body,
    })

    writeFile('.command-hash', commandHash)

    console.timeEnd('updating commands')
  } catch (error) {
    console.log(error)
  }
}
