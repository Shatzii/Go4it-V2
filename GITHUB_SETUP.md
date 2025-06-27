# GitHub Repository Setup for Go4It Sports V2

## Repository Configuration

### Repository Name: `Go4it-V2`
### URL: `https://github.com/Shatzii/Go4it-V2`

## Git Setup Commands

Run these commands in your VS Code terminal to set up the repository:

```bash
# Configure Git user (if not already done)
git config --global user.name "Space Pharaoh"
git config --global user.email "media@shatzii.com"

# Initialize repository (if needed)
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: Go4It Sports V2 with subscription licensing system

- Complete sports analytics platform for neurodivergent student athletes
- Subscription-based licensing model ($47-$297/month)
- Self-hosted deployment with license validation
- AI-powered GAR analysis and StarPath progression
- Support for flag football, soccer, basketball, track & field
- Real-time performance tracking and ADHD-optimized UI
- Self-hosted AI models for cost-effective analysis
- Complete documentation and deployment guides"

# Add remote repository
git remote add origin git@github.com:Shatzii/Go4it-V2.git

# Push to GitHub
git push -u origin main
```

## Repository Structure

```
Go4it-V2/
├── README.md                           # Complete project overview
├── .gitignore                          # Git ignore rules
├── .env.example                        # Environment template
├── package.json                        # Node.js dependencies
├── next.config.js                      # Next.js configuration
├── tailwind.config.js                  # Tailwind CSS config
├── drizzle.config.ts                   # Database configuration
├── 
├── app/                                # Next.js app directory
├── components/                         # React components
├── lib/                                # Utility libraries
├── shared/                             # Shared schemas and types
├── server/                             # Backend server code
│   ├── license-manager.js              # Subscription validation
│   ├── middleware/license-middleware.js # Feature gating
│   └── routes.ts                       # Protected API routes
├── 
├── license-server/                     # License validation server
│   ├── api/server.js                   # License API
│   ├── portal/index.html               # Customer portal
│   ├── database/schema.sql             # License database
│   └── docker-compose.yml              # Deployment config
├── 
├── self-hosted-packages/               # Customer deployment packages
│   ├── go4it-sports-starter.zip        # $47/month tier
│   ├── go4it-sports-professional.zip   # $97/month tier
│   └── go4it-sports-enterprise.zip     # $297/month tier
├── 
├── docs/                               # Documentation
│   ├── SUBSCRIPTION_DEPLOYMENT_GUIDE.md
│   ├── BUSINESS_MODEL_TRANSITION.md
│   ├── SERVER_REQUIREMENTS_GUIDE.md
│   ├── COPILOT_BUILD_PROMPT.md
│   └── SUBSCRIPTION_LICENSING_MODEL.md
└── 
└── scripts/                            # Utility scripts
    ├── create-self-hosted-package.js
    ├── create-license-server.js
    └── deployment helpers
```

## Repository Features

### Branches
- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: Feature development branches

### Issues & Projects
- Feature requests
- Bug reports
- License management issues
- Deployment support

### Actions & CI/CD
- Automated testing
- License server deployment
- Package generation
- Documentation updates

### Security
- Dependabot security updates
- Secret scanning
- Code scanning

## Commercial License

This repository contains commercial software licensed under a subscription model:

- Source code is visible for transparency
- Modifications allowed for licensed customers only
- Redistribution prohibited without explicit permission
- License validation required for all deployments

## Support & Contact

For licensing, deployment, or technical support:
- **Customer Portal**: https://licensing.go4itsports.com
- **Email**: support@go4itsports.com
- **Documentation**: Available in `/docs` directory

---

This repository represents the complete Go4It Sports V2 platform with subscription-based licensing, ready for commercial deployment and customer self-hosting.