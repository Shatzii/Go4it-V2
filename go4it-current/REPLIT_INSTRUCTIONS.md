# Replit deployment notes

1) Replit uses `replit.nix` to provide native packages. The `.replit` file will run `npm run build` and then `npm run start` using the `PORT` environment variable supplied by Replit.

2) If Next build fails on Replit due to native modules, run `npm install --omit=optional` locally or configure a custom Nix derivation. We already moved known linux-only packages to `optionalDependencies` in the developer workflow; ensure the repo lockfile used by Replit is generated on Linux if you want deterministic installs.

3) To preview locally (Linux-like environment) use Docker:

   docker build -t go4it .
   docker run -p 5000:5000 go4it

4) Common quick fixes:

- Ensure `NODE_ENV=production` for builds in CI.
- Use `npm ci` in CI for deterministic installs.
