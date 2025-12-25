# Contributing to AI Unlock Gallery

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Code of Conduct

### Our Standards
- Be respectful and professional
- Focus on constructive feedback
- Prioritize user safety and privacy
- Follow responsible disclosure for security issues

### Scope
This project deals with adult content. Contributors must:
- Be 18+ years old
- Understand the sensitive nature of the project
- Maintain professional discourse
- Respect content policies

## How to Contribute

### Reporting Bugs
1. Check existing issues first
2. Use the bug report template
3. Include reproduction steps
4. Provide environment details
5. Add screenshots if applicable

### Suggesting Features
1. Check existing feature requests
2. Use the feature request template
3. Explain the use case
4. Consider security implications
5. Discuss implementation approach

### Security Vulnerabilities
**Do not** create public issues for security vulnerabilities.

Instead:
1. Email maintainers directly
2. Provide detailed description
3. Wait for acknowledgment
4. Allow time for fix
5. Coordinate disclosure

## Development Setup

### Prerequisites
- Node.js 18+
- MongoDB
- Git

### Local Setup
```bash
# Clone the repository
git clone https://github.com/brocketdesign/ai-unlock-gallery.git
cd ai-unlock-gallery

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Add your API keys to .env.local

# Run development server
npm run dev
```

### Project Structure
```
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/          # API routes
│   │   ├── sign-in/      # Auth pages
│   │   └── ...
│   ├── components/       # React components
│   │   ├── games/        # Mini-game components
│   │   └── ui/           # UI components
│   ├── lib/              # Utility functions
│   ├── models/           # Mongoose models
│   ├── store/            # Zustand stores
│   └── types/            # TypeScript types
├── public/               # Static assets
└── ...
```

## Coding Standards

### TypeScript
- Use TypeScript for all new code
- Define proper types (avoid `any`)
- Use interfaces for object shapes
- Export types when needed

### React Components
- Use functional components
- Use hooks appropriately
- Keep components focused
- Extract reusable logic

### Styling
- Use Tailwind CSS
- Follow existing patterns
- Maintain responsive design
- Use semantic HTML

### API Routes
- Validate all inputs
- Handle errors properly
- Use proper HTTP status codes
- Document responses

## Testing

### Before Submitting
- [ ] Test locally
- [ ] Check TypeScript compilation
- [ ] Run linter
- [ ] Test all affected features
- [ ] Test on mobile

### Manual Testing
```bash
# Type check
npx tsc --noEmit

# Lint
npm run lint

# Build
npm run build
```

## Pull Request Process

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Changes
- Follow coding standards
- Keep commits focused
- Write clear commit messages
- Update documentation

### 3. Commit Guidelines
```bash
# Good commit messages
git commit -m "Add rate limiting to image generation API"
git commit -m "Fix scratch card not detecting completion"
git commit -m "Update README with deployment instructions"

# Use conventional commits
feat: Add new feature
fix: Bug fix
docs: Documentation
style: Formatting
refactor: Code restructuring
test: Testing
chore: Maintenance
```

### 4. Push Changes
```bash
git push origin feature/your-feature-name
```

### 5. Create Pull Request
- Use the PR template
- Link related issues
- Describe changes clearly
- Add screenshots for UI changes
- Request review

### 6. Review Process
- Address review comments
- Update as needed
- Maintain discussion
- Be patient and professional

## Priority Areas

### High Priority
- Security improvements
- Privacy enhancements
- Performance optimization
- Bug fixes
- Documentation

### Medium Priority
- New features
- UI improvements
- Code refactoring
- Test coverage

### Low Priority
- Code style
- Minor optimizations
- Nice-to-haves

## Specific Contribution Ideas

### Security
- Add rate limiting
- Improve input validation
- Enhance error handling
- Add security headers
- Implement CSRF protection

### Features
- Additional mini-games
- User preferences
- Image filters
- Gallery organization
- Social features (carefully)

### Performance
- Image optimization
- Caching strategies
- Database query optimization
- Bundle size reduction
- Loading states

### Documentation
- API documentation
- Code comments
- Usage examples
- Video tutorials
- Troubleshooting guides

## What We're NOT Looking For

- Features that compromise privacy
- Removal of age verification
- Public image sharing
- Features that enable abuse
- Content that violates ToS

## Review Criteria

### Code Quality
- Follows project standards
- Well-tested
- Documented
- Maintainable
- Secure

### Functionality
- Works as intended
- Handles edge cases
- Good error handling
- User-friendly
- Accessible

### Impact
- Addresses real need
- Benefits users
- Doesn't break existing features
- Performance conscious
- Security minded

## Getting Help

### Resources
- Check documentation
- Review existing code
- Ask in discussions
- Read related issues

### Communication
- Be clear and specific
- Provide context
- Be respectful
- Be patient

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in commits
- Appreciated!

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to AI Unlock Gallery! 🎉
