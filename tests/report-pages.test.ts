import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('report page protection', () => {
  it('protects both report routes with the shared SSR guard', () => {
    for (const page of ['pages/report/client-balance.tsx', 'pages/report/monthly-balance.tsx']) {
      const source = readFileSync(page, 'utf8')
      expect(source).toContain("import withLogin from '@/utils/withLogin'")
      expect(source).toContain('export const getServerSideProps = withLogin')
    }
  })
})
