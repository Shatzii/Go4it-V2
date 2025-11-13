# Deploying Go4it-V2 on Replit

This guide describes a pragmatic approach to running the Go4it-V2 Next.js app on Replit (recommended for small previews or development). Large production builds are memory-intensive — for reliable production deployments prefer a CI runner or a hosting platform with >=16GB RAM.

Quick steps (recommended):

- Option A (recommended): Build on CI or locally, commit the `.next` production output (or artifact) to the repo or store it as an artifact, then use Replit to run the prebuilt app with `npm run start:production`.
- Option B (try on Replit): Let the Replit instance install production deps and attempt the build. If the build is killed due to memory limits, use the prebuilt artifact approach.

Files added for Replit
- `.replit` — tells Replit to run `.replit/run.sh`.
- `.replit/run.sh` — installs production dependencies, attempts `npm run build:production` and then starts the app via `npm run start:production`.

Practical tips to reduce memory/CPU usage on Replit

- Skip type-checking during build: `build:production` already sets `SKIP_TYPE_CHECK=true` in package.json. Keep type-checking in CI instead.
- Install only production dependencies: `npm ci --omit=dev` (done in run script).
- Increase Node heap only if the environment allows it: `NODE_OPTIONS='--max-old-space-size=2048'` (set in run script). Replit may enforce limits—tune this down if the process is killed.
- Avoid running full production builds on Replit for large repos. Prebuild on CI or local machine and upload artifacts.
- Use incremental TypeScript builds (if you run type-checks) and avoid monolithic global type-check on small machines.

Commands you can run locally to prepare artifacts for Replit

```bash
# Build locally (recommended) and commit the `.next` folder to a branch that Replit will use
npm ci
npm run build:production

# Then push the built artifacts (careful: .next can be large) or upload them to a storage bucket
git add .next && git commit -m "Prebuilt next artifacts for replit" && git push
```

If you want me to prepare a GitHub Actions workflow that builds artifacts and deploys to Replit (or uploads the built `.next` to a release artifact), I can add that next.
