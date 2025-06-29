# Contributing to Go4It Sports Platform

Thank you for your interest in contributing to the Go4It Sports Platform! This project is dedicated to supporting neurodivergent student athletes, and we welcome contributions that align with this mission.

## Getting Started

### Prerequisites
- Node.js 18 or higher
- PostgreSQL database
- Git knowledge
- Understanding of React/Next.js and TypeScript

### Development Setup

1. **Fork and clone repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/go4it-sports-platform.git
   cd go4it-sports-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env.local
   # Add your configuration values
   ```

4. **Initialize database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   node server.js
   ```

## Development Guidelines

### Code Standards
- **TypeScript**: All new code must be written in TypeScript
- **ESLint**: Follow the configured ESLint rules
- **Formatting**: Use Prettier for consistent code formatting
- **Testing**: Include tests for new features

### ADHD-Friendly Development
- **Clear interfaces**: Design with neurodivergent users in mind
- **Consistent patterns**: Maintain predictable navigation and behavior
- **Accessibility**: Follow WCAG guidelines
- **Performance**: Optimize for smooth, responsive interactions

### Architecture Principles
- **Database-first**: Define schemas in `shared/schema.ts`
- **Type safety**: Use Drizzle ORM for database operations
- **Component reuse**: Build reusable components in `components/`
- **API consistency**: Follow RESTful patterns for endpoints

## Contribution Process

### 1. Issue Selection
- Browse open issues or create new ones
- Comment to claim an issue before starting work
- Ask questions if requirements are unclear

### 2. Branch Creation
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 3. Development
- Write clean, documented code
- Follow existing code patterns
- Test your changes thoroughly
- Update documentation as needed

### 4. Testing
```bash
# Run tests
npm test

# Check TypeScript
npm run type-check

# Test database operations
npm run db:push
```

### 5. Pull Request
- Create descriptive PR title and description
- Link related issues
- Include screenshots for UI changes
- Request review from maintainers

## Areas for Contribution

### High Priority
- **Accessibility improvements**: ADHD-friendly UI enhancements
- **Performance optimization**: Video processing and analysis
- **Mobile responsiveness**: Touch-friendly interfaces
- **Documentation**: User guides and API documentation

### Features Welcome
- **Analytics dashboards**: New visualization components
- **AI coaching**: Enhanced coaching algorithms
- **Sports support**: Additional sport-specific features
- **Integration**: Third-party service connections

### Bug Fixes
- Always include reproduction steps
- Test fix thoroughly before submitting
- Update tests if necessary

## Code Review Process

### Expectations
- All PRs require review from maintainers
- Be open to feedback and suggestions
- Respond to review comments promptly
- Make requested changes in additional commits

### Review Criteria
- Code quality and style
- ADHD-friendly design principles
- Performance impact
- Security considerations
- Test coverage

## Community Guidelines

### Be Inclusive
- Use inclusive language
- Welcome newcomers
- Support neurodivergent contributors
- Respect different perspectives

### Be Professional
- Constructive feedback only
- Focus on code, not individuals
- Help others learn and grow
- Maintain positive communication

## Technical Architecture

### Database Changes
- Always use Drizzle migrations
- Update schema in `shared/schema.ts`
- Test migrations thoroughly
- Document breaking changes

### API Development
- Follow RESTful conventions
- Include proper error handling
- Validate input with Zod schemas
- Document endpoints

### Frontend Development
- Use TypeScript strictly
- Follow component patterns
- Implement responsive design
- Consider ADHD-friendly UX

## Getting Help

### Resources
- **Documentation**: Check the `docs/` directory
- **Issues**: Search existing issues first
- **Discussions**: Use GitHub Discussions for questions
- **Code**: Review existing patterns in the codebase

### Contact
- Create issues for bugs or feature requests
- Use discussions for general questions
- Mention maintainers for urgent issues

## Recognition

Contributors will be recognized in:
- README acknowledgments
- Release notes
- Project documentation
- Community highlights

## License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers the project.

---

**Thank you for helping make sports analytics more accessible for neurodivergent student athletes!**