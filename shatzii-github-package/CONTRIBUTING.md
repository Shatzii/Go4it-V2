# Contributing to Shatzii AI Platform

Thank you for your interest in contributing to the Shatzii AI Platform! We welcome contributions from developers, AI researchers, and business automation experts who want to help build the future of autonomous business operations.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Submitting Changes](#submitting-changes)
- [AI Agent Development](#ai-agent-development)
- [Vertical Integration](#vertical-integration)
- [Testing Requirements](#testing-requirements)
- [Documentation Standards](#documentation-standards)

## Code of Conduct

### Our Pledge

We are committed to fostering an open and welcoming environment. We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behaviors include:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behaviors include:**
- Harassment, trolling, or insulting/derogatory comments
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

## Getting Started

### Prerequisites

Before contributing, ensure you have:
- Node.js 18+ installed
- PostgreSQL 14+ running locally
- Git configured with your GitHub account
- Basic understanding of TypeScript, React, and Express.js

### First-Time Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/shatzii-platform.git
   cd shatzii-platform
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/shatzii/shatzii-platform.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```
6. **Initialize database**:
   ```bash
   npm run db:push
   ```

## Development Setup

### Environment Configuration

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/shatzii_dev

# Authentication
JWT_SECRET=your-development-jwt-secret
SESSION_SECRET=your-development-session-secret

# AI Services (Optional for development)
OLLAMA_URL=http://localhost:11434
QDRANT_URL=http://localhost:6333

# Payment Processing (Use test keys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Running the Development Server

```bash
# Start the development server
npm run dev

# The application will be available at:
# Frontend: http://localhost:5000
# API: http://localhost:5000/api
```

### Development Commands

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm test

# Build for production
npm run build

# Database operations
npm run db:push      # Push schema changes
npm run db:studio    # Open database studio
```

## Contributing Guidelines

### Branch Naming Convention

Use descriptive branch names with the following prefixes:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

Examples:
- `feature/truckflow-route-optimization`
- `fix/payment-processing-error`
- `docs/api-documentation-update`

### Commit Message Format

Use clear, descriptive commit messages following this format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation changes
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance

**Examples:**
```
feat(roofing): add drone inspection scheduling
fix(auth): resolve JWT token expiration issue
docs(api): update payment processing endpoints
```

### Code Style Standards

We use ESLint and Prettier for code formatting. Ensure your code follows these standards:

```bash
# Check code style
npm run lint

# Auto-fix style issues
npm run lint:fix
```

**Key conventions:**
- Use TypeScript strict mode
- Prefer const over let
- Use meaningful variable names
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Use async/await over Promises

### Pull Request Process

1. **Create a feature branch** from `develop`:
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Add tests** for new functionality

4. **Update documentation** if needed

5. **Commit your changes** using conventional commit messages

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request** on GitHub with:
   - Clear title and description
   - Link to related issues
   - Screenshots for UI changes
   - Test results

## AI Agent Development

### Creating New AI Agents

When developing new AI agents for verticals:

1. **Agent Structure**:
   ```typescript
   // server/ai-engines/agents/your-agent.ts
   export class YourAgent implements AIAgent {
     async process(request: AIRequest): Promise<AIResponse> {
       // Agent logic here
     }
   }
   ```

2. **Register the Agent**:
   ```typescript
   // server/ai-engines/agent-manager.ts
   agentManager.registerAgent('your-vertical', new YourAgent());
   ```

3. **Add API Endpoints**:
   ```typescript
   // server/routes.ts
   app.post('/api/your-vertical/action', authenticateToken, async (req, res) => {
     // Endpoint logic
   });
   ```

### Agent Development Guidelines

- **Autonomous Operation**: Agents should operate independently
- **Error Handling**: Implement comprehensive error handling
- **Logging**: Add detailed logging for debugging
- **Performance**: Optimize for sub-second response times
- **Scalability**: Design for concurrent operation

## Vertical Integration

### Adding New Industry Verticals

To add a new industry vertical:

1. **Database Schema**: Update `shared/schema.ts` with vertical-specific tables
2. **AI Agents**: Create specialized agents for the vertical
3. **API Routes**: Add vertical-specific endpoints
4. **Frontend Components**: Build user interface components
5. **Documentation**: Update documentation and README

### Vertical Development Checklist

- [ ] Database schema defined
- [ ] AI agents implemented
- [ ] API endpoints created
- [ ] Frontend components built
- [ ] Authentication integrated
- [ ] Tests written
- [ ] Documentation updated

## Testing Requirements

### Test Coverage Standards

- **Unit Tests**: Cover individual functions and components
- **Integration Tests**: Test API endpoints and database operations
- **E2E Tests**: Test complete user workflows
- **AI Agent Tests**: Validate agent responses and performance

### Writing Tests

```typescript
// Example test structure
import { describe, it, expect, beforeEach } from 'vitest';

describe('User Authentication', () => {
  beforeEach(async () => {
    await resetTestDatabase();
  });

  it('should authenticate valid user', async () => {
    // Test implementation
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- auth.test.ts

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm run test:coverage
```

## Documentation Standards

### Code Documentation

- Add JSDoc comments for all public APIs
- Include parameter and return type descriptions
- Provide usage examples for complex functions
- Document AI agent behaviors and expected inputs/outputs

### API Documentation

Update API documentation when adding new endpoints:

```typescript
/**
 * Create a new roofing project estimate
 * @route POST /api/roofing/estimate
 * @param {Object} projectData - Project details
 * @param {string} projectData.address - Property address
 * @param {number} projectData.sqft - Square footage
 * @returns {Object} Estimate with cost breakdown
 */
```

### README Updates

When adding new features:
- Update feature lists
- Add new environment variables
- Update installation instructions
- Include new dependencies

## Review Process

### Code Review Criteria

Pull requests are reviewed for:
- **Functionality**: Does it work as intended?
- **Performance**: Is it optimized for production use?
- **Security**: Are there any security vulnerabilities?
- **Code Quality**: Does it follow our standards?
- **Tests**: Is there adequate test coverage?
- **Documentation**: Is it properly documented?

### Review Timeline

- **Initial Review**: Within 2 business days
- **Follow-up Reviews**: Within 1 business day
- **Final Approval**: When all criteria are met

## Getting Help

### Communication Channels

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For general questions and ideas
- **Pull Request Comments**: For code-specific discussions

### Development Questions

When asking for help:
1. Provide clear problem description
2. Include relevant code snippets
3. Share error messages and logs
4. Mention your environment setup

### Reporting Security Issues

For security vulnerabilities:
- **DO NOT** create public issues
- Email security@shatzii.com directly
- Include detailed vulnerability description
- Provide steps to reproduce if possible

## Recognition

### Contributor Recognition

We recognize contributors through:
- **GitHub Contributors Graph**
- **Release Notes Mentions**
- **Community Highlights**
- **Special Recognition for Major Contributions**

### Contribution Types

All contributions are valued:
- Code contributions
- Documentation improvements
- Bug reports and testing
- Feature suggestions
- Community support

---

Thank you for contributing to the Shatzii AI Platform! Together, we're building the future of autonomous business operations.

For questions about contributing, please reach out to contributors@shatzii.com or open a GitHub Discussion.

*Last Updated: June 30, 2025*