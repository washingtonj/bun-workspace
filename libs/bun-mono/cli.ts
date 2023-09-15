import { getPackagesInfo } from './functions'
import { execSync } from 'child_process'

export function infoCLI (): void {
  const commands = getPackagesInfo()

  console.log('\n')
  console.log('🐰 Bun Mono')
  console.log('\x1b[2m%s\x1b[0m', 'You can also run any command from bun using or the commands listed below.')
  console.log('\x1b[35m%s\x1b[0m', '------------------------', '\n')

  Object.keys(commands).forEach((key) => {
    console.log('\x1b[33m%s\x1b[0m', `📦 ${key}`)
    console.log('\x1b[36m%s\x1b[0m', `    name: ${commands[key].name}`)
    console.log('\x1b[36m%s\x1b[0m', `    commands: ${commands[key].commands.join(', ')}`)
    console.log('\n')
  })

  const examplePackage = Object.keys(commands)[0]
  const exampleCommand = commands[examplePackage].commands[0]

  console.log('To run a package command use the following syntax:')
  console.log('\x1b[35m%s\x1b[0m', 'bun-mono', '\x1b[2m%s\x1b[0m', '<package-path>', '\x1b[2m%s\x1b[0m', '<command>')
  console.log('\x1b[2m%s\x1b[0m', `e.g: bun-mono ${examplePackage} ${exampleCommand}`)
  console.log('To run a bun command use the following syntax:')
  console.log('\x1b[35m%s\x1b[0m', 'bun-mono', '\x1b[2m%s\x1b[0m', '<package-path> "<command>"')
  console.log('\x1b[2m%s\x1b[0m', `e.g: bun-mono ${examplePackage} "add zod"`)
  console.log('\n')

  process.exit(0)
}

export function runCommandCLI (command: string, packagePath: string): void {
  let message = 'Can you see the bun?'

  const splitedCommand = command.split(' ')

  if (splitedCommand.includes('add') || splitedCommand.includes('install')) {
    message = 'Installing dependencies hm?'
  }

  console.clear()

  console.log(`🐰 Bun Mono - ${message}`, '\n')
  console.log('\x1b[35m>\x1b[0m', `\x1b[2mRunning ${command} in ${packagePath}\x1b[0m`)

  // run command with stdio but without stderr to avoid errors
  try {
    execSync(`cd ${packagePath} && bun ${command}`, { stdio: 'inherit' })

    process.exit(0)
  } catch (error) {}
}
