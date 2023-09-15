#!/usr/bin/env node

import { infoCLI, runCommandCLI } from './cli'
import { argv } from 'process'

const packagePath = argv[2]
const command = argv[3]

if (packagePath === undefined || command === undefined) {
  infoCLI()
  process.exit(1)
}

runCommandCLI(command, packagePath)
