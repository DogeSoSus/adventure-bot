import { Quest } from '@adventure-bot/quest/Quest'
import { progressBar } from '@adventure-bot/utils/progress-bar'

export const questProgressBar = (quest: Quest): string =>
  progressBar(quest.progress / quest.totalRequired)
