import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.tsx',
    translations: 'src/translations/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'styled-components',
    '@a-little-world/little-world-design-system',
    '@a-little-world/little-world-design-system-core',
  ],
  treeshake: true,
  target: 'es2019',
}) 