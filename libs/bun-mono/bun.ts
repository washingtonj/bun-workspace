await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './dist',
  target: 'bun',
  minify: true
});