module.exports = {
  root: './frontend',
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
  },
  plugins: [
    require('vite-plugin-windicss')(),
  ],
};