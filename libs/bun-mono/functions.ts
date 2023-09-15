import fs from 'fs'

export function getWorkspaces (): string[] {
  const rootPackageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'))

  const workspaces: string[] = rootPackageJson.workspaces

  if (workspaces === undefined) {
    throw new Error('No workspaces defined in the root package.json. Please define them to use bun-mono.')
  }

  return workspaces
}

export function getPackages (workspaces: string[] = getWorkspaces()): string[] {
  const packages = workspaces.reduce<string[]>((prev, workspace) => {
    const workspaceName = workspace.replace('/*', '')
    const workspacePackages = fs.readdirSync(workspaceName)

    workspacePackages.forEach((workspacePackage) => {
      prev.push(`${workspaceName}/${workspacePackage}`)
    })

    return prev
  }, [])

  return packages.sort()
}

interface PackagesInfo {
  name: string
  commands: string[]
}

export function getPackagesInfo (packages: string[] = getPackages()): Record<string, PackagesInfo> {
  const commandsByPackage = packages.reduce<Record<string, PackagesInfo>>((prev, pkg) => {
    const pkgJson = JSON.parse(fs.readFileSync(`${pkg}/package.json`, 'utf8'))

    prev[pkg] = {
      name: `${pkgJson.name}@${pkgJson.version}`,
      commands: []
    }

    if (pkgJson.scripts !== undefined) {
      const pkgCommands = Object.keys(pkgJson.scripts)

      prev[pkg].commands = pkgCommands
    }

    return prev
  }
  , {})

  return commandsByPackage
}
