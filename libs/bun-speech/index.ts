import { Chalk } from 'chalk'

const chalk = new Chalk()

const baseColor = "#f472b5"

/**
 * The voice of the bun, the bun talk.
 */

function presentation(speech: string, description?: string) {
  console.log(`${chalk.hex(baseColor)(`🐰 ${speech}`)}`, `${chalk.gray(description ? `- ${description}` : '')}`)
}

function info(text: string) {
  console.log(`${chalk.hex(baseColor)('<·>')}`, `${chalk.gray(text)}`)
}

type ListParams = {
  title: string
  items: Record<string, string>
}

function list(props: ListParams) {
  const { title, items } = props

  console.log(`${chalk.hex(baseColor)(`${title}`)}`)

  Object.keys(items).forEach((key) => {
    console.log(`  ${chalk.hex(baseColor)('>')}`, `${key}: ${chalk.gray(items[key])}`)
  })
}

function speech(speech: string) {
  console.log(`🐰 ${speech}`)
}

function command(command: string, params: string[]) {
  console.log(`${chalk.hex(baseColor)(`bun ${command}`)}`, params.join(' '))
}

export const BunSpeech = {
  presentation,
  info,
  list,
  speech,
  command
}