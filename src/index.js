/* @flow */
import * as path from 'path'
import { findNearestPackageJsonSync } from 'find-nearest-package-json'

type AstPath = {
  node: {
    source: {
      value: string
    }
  }
}

type AstState = {
  file: {
    opts: {
      filename: string
    }
  }
}

const importAndExport =
  'ImportDeclaration|ExportAllDeclaration|ExportNamedDeclaration'

export default function() {
  return {
    visitor: {
      [importAndExport](astPath: AstPath, astState: AstState) {
        if (!astPath.node.source) {
          return
        }

        const importedPath = astPath.node.source.value
        const sourceFilePath = astState.file.opts.filename

        if (isLocalPackagePath(importedPath)) {
          return
        }

        try {
          const {
            path: packageJsonPath,
            data: packageJson
          } = findNearestPackageJsonSync(sourceFilePath)
          const localDependencies = readLocalDependencies(packageJson)
          const projectPath = path.dirname(packageJsonPath)
          const importedModuleName = importedPath.split(path.sep)[0]

          if (!(importedModuleName in localDependencies)) {
            return
          }

          const importedModuleRootPath = localDependencies[importedModuleName]
          const importedPathRelativeToProjectPath = path.join(
            importedModuleRootPath,
            ...importedPath.split(path.sep).slice(1)
          )

          astPath.node.source.value = resolveRelativePath(
            path.dirname(sourceFilePath),
            path.join(projectPath, importedPathRelativeToProjectPath)
          )
        } catch (error) {}
      }
    }
  }
}

function isLocalPackagePath(versionOrUrlOrPath: string): boolean {
  return ['file:', 'link:', '../', './', '~/', '/'].some(prefix =>
    versionOrUrlOrPath.startsWith(prefix)
  )
}

function readLocalDependencies(packageJson): { [string]: string } {
  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  }

  return Object.keys(dependencies).reduce(
    (localDependencies, name) =>
      isLocalPackagePath(dependencies[name])
        ? {
            ...localDependencies,
            [name]: parseLocalPackagePath(dependencies[name])
          }
        : localDependencies,
    {}
  )
}

function parseLocalPackagePath(localPackagePath: string): string {
  return localPackagePath.replace(/^.*?:/, '')
}

function resolveRelativePath(fromPath: string, toPath: string) {
  const relativePath = path.relative(fromPath, toPath)

  if (relativePath === '') {
    return '.'
  }

  if (relativePath === '..') {
    return '..'
  }

  return `.${path.sep}${relativePath}`
}
