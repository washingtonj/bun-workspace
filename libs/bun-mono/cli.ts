import { execSync } from 'child_process'
import { BunSpeech } from 'bun-speech'
import { getPackagesInfo } from './functions'

export function infoCLI(): void {
  const commands = getPackagesInfo()

  console.clear()
  BunSpeech.presentation('Bun Mono', 'The monorepo manager using bun package manager.')
  BunSpeech.info('You can also run any command from bun using or the commands listed below.')
  console.log('\n')

  Object.keys(commands).forEach((key) => {
    BunSpeech.list({
      title: key,
      items: {
        name: commands[key].name,
        commands: commands[key].commands.join(', ')
      }
    })

    console.log('\n')
  })

  console.log('\n')

  const examplePackage = Object.keys(commands)[0]
  const exampleCommand = commands[examplePackage].commands[0]

  BunSpeech.speech('To run a package command use the following syntax:')
  BunSpeech.command('bun-mono', ['<package-path>', '<command>'])
  BunSpeech.info(`e.g: bun-mono ${examplePackage} ${exampleCommand}`)
  console.log('\n')

  process.exit(0)
}

export function runCommandCLI(command: string, packagePath: string): void {
  const splitedCommand = command.split(' ')

  BunSpeech.presentation('Bun Mono', "Let's run a command, Fast like a habbit.")
  BunSpeech.info(`running ${command} in ${packagePath}`)
  console.log('\n')

  try {
    execSync(`cd ${packagePath} && bun ${command}`, { stdio: 'inherit' })

    if (splitedCommand.includes('add') || splitedCommand.includes('install') || splitedCommand.includes('rm')) {
  
      console.log('\n')
      BunSpeech.info('Remapping dependencies')
      execSync('rm -rf bun.lockb', { stdio: 'inherit' })
      execSync('bun install', { stdio: 'inherit' })
    }  

    process.exit(0)
  } catch (error) { }
}
