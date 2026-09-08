# Contributing to PG Finder

Thank you for your interest in contributing to PG Finder! This document provides guidelines and instructions for contributing.

## 🎯 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Report issues responsibly

## 🚀 Getting Started

### 1. Fork the Repository
```bash
# Visit https://github.com/vikashmishra1234/PG_Finder
# Click "Fork" button
```

### 2. Clone Your Fork
```bash
git clone https://github.com/YOUR_USERNAME/PG_Finder.git
cd PG_Finder
```

### 3. Add Upstream Remote
```bash
git remote add upstream https://github.com/vikashmishra1234/PG_Finder.git
```

### 4. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

## 📝 Development Workflow

### Setup Development Environment

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your database URL

# Run migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Making Changes

1. **Write Code**
   - Follow TypeScript best practices
   - Use meaningful variable names
   - Add comments for complex logic

2. **Test Locally**
   ```bash
   npm run lint
   npm run build  # Verify production build
   ```

3. **Commit with Clear Messages**
   ```bash
   git add .
   git commit -m "feat: add complaint resolution feature"
   # Use conventional commits: feat:, fix:, docs:, style:, refactor:, test:, chore:
   ```

### Pushing Changes

```bash
# Update with latest upstream changes
git fetch upstream
git rebase upstream/main

# Push to your fork
git push origin feature/your-feature-name
```

### Creating a Pull Request

1. **Go to GitHub** and create a PR from your fork to `vikashmishra1234/PG_Finder`
2. **Write a clear PR title** – e.g., "Add email verification for new users"
3. **Provide description:**
   ```markdown
   ## Description
   Brief explanation of changes

   ## Related Issues
   Closes #123

   ## Changes Made
   - Feature A
   - Bug fix B

   ## Testing
   How to test the changes

   ## Screenshots (if applicable)
   Before/after
   ```

## 📐 Code Style Guidelines

### TypeScript
```typescript
// ✅ Good
interface User {
  userId: string;
  name: string;
  email: string;
  isActive: boolean;
}

// ❌ Avoid
let user: any;
```

### React Components
```typescript
// ✅ Good
export default function PropertyCard({ property }: { property: PG }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold">{property.title}</h2>
      <p className="text-gray-600">{property.description}</p>
    </div>
  );
}

// ❌ Avoid
const PropertyCard = (props) => {
  // No type safety
};
```

### Tailwind CSS
```html
<!-- ✅ Good: Semantic & responsive -->
<div className="flex flex-col md:flex-row gap-4 p-6 md:p-8">

<!-- ❌ Avoid: Hardcoded values -->
<div style="display: flex; padding: 24px; gap: 16px;">
```

## 🧪 Testing Guidelines

### Before Submitting PR

1. **Test manually**
   ```bash
   npm run dev
   # Test all changed features in browser
   ```

2. **Check for errors**
   ```bash
   npm run lint
   npm run build
   ```

3. **Database migrations** (if schema changed)
   ```bash
   npx prisma migrate dev --name your_migration_name
   npx prisma db push
   ```

## 📋 PR Checklist

Before submitting your PR, ensure:

- [ ] Code follows project style guidelines
- [ ] TypeScript strict mode passes
- [ ] No console.log or debug statements left
- [ ] Changes are well-documented
- [ ] Commit messages are clear
- [ ] Related issues are linked
- [ ] Screenshots/videos provided (if UI changes)
- [ ] Database migrations created (if schema changes)
- [ ] Tests pass locally

## 🐛 Reporting Bugs

### Create an Issue with:

1. **Clear title** – e.g., "Login page crashes when email has special characters"
2. **Reproduction steps**
   ```
   1. Navigate to sign-up page
   2. Enter email with + symbol
   3. Click Register
   4. App crashes
   ```
3. **Expected behavior** – What should happen
4. **Actual behavior** – What actually happens
5. **Screenshots/error logs** – If applicable
6. **Environment** – OS, browser, Node version

### Good Bug Report Template
```markdown
**Describe the bug**
Brief description

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
[If applicable]

**Environment**
- OS: Windows/Mac/Linux
- Browser: Chrome/Firefox/Safari
- Node: 18.x / 20.x
```

## 💡 Feature Requests

### Suggest Improvements with:

1. **Clear title** – Concise description
2. **Use case** – Why is this needed?
3. **Proposed solution** – Your idea
4. **Alternatives considered** – Other approaches?
5. **Example code** – If helpful

## 📚 Documentation

### Update Docs When:
- Adding new features
- Changing API endpoints
- Modifying configuration
- Adding new environment variables

### Document Format:
```markdown
# Feature Name

**Description:** What it does

**Usage:**
\`\`\`bash
# Code example
\`\`\`

**API:**
- Endpoint path
- Request params
- Response format
```

## 🔗 Project Structure Reference

```
PG_Finder/
├── app/              # UI pages & routes
├── server/           # Backend logic
│   ├── actions/      # Server actions
│   ├── services/     # Business logic
│   └── repository/   # Data access
├── components/       # Reusable components
├── prisma/           # Database schema
└── lib/              # Utilities
```

## ❓ Questions?

- **Issues** – GitHub Issues for bugs/features
- **Discussions** – GitHub Discussions for Q&A
- **Email** – [contact info]

## 🙏 Thank You!

Your contributions make PG Finder better for everyone. We appreciate your time and effort!

---

**Happy coding! 🚀**
