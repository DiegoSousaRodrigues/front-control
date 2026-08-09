import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

function readProjectFile(path: string) {
  return readFileSync(fileURLToPath(new URL(`../${path}`, import.meta.url)), 'utf8')
}

describe('sensitive logging policy', () => {
  it('does not install or import axios-logger', () => {
    const packageJson = JSON.parse(readProjectFile('package.json')) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }

    expect(dependencies).not.toHaveProperty('axios-logger')
    expect(readProjectFile('src/utils/api.ts')).not.toContain('axios-logger')
  })

  it.each([
    'src/utils/api.ts',
    'src/services/login.ts',
    'src/contexts/AuthContext.tsx',
    'src/utils/queryFetch.ts',
    'src/components/FormProduct/FormProduct.tsx',
    'pages/api/product/index.ts',
  ])('does not use console logging in sensitive request path %s', (file) => {
    expect(readProjectFile(file)).not.toMatch(/console\.(?:debug|error|info|log|warn)\s*\(/)
  })
})
