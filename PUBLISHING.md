# Publishing to npm

This guide explains how to publish the UI Theme Library to npm.

## Prerequisites

1. **npm account**: Create an account at [npmjs.com](https://www.npmjs.com/)
2. **Login**: Run `npm login` in your terminal
3. **Package name**: Make sure the package name in `package.json` is unique (or use a scoped package like `@ippis/ui-theme-library`)

## Pre-publishing Checklist

- [ ] Update version number in `package.json`
- [ ] Update `README.md` with correct repository URLs
- [ ] Update `package.json` repository, bugs, and homepage URLs
- [ ] Test the build: `npm run build:lib`
- [ ] Verify the `dist` folder contains all necessary files
- [ ] Check that `.npmignore` is properly configured

## Build the Library

Before publishing, build the library:

```bash
npm run build:lib
```

This will:
- Compile TypeScript
- Bundle the library code
- Generate type definitions
- Output to the `dist` folder

## Update Package Information

1. **Update repository URLs** in `package.json`:
   ```json
   {
     "repository": {
       "type": "git",
       "url": "https://github.com/gannza/app-layout-theme.git"
     },
     "bugs": {
       "url": "https://github.com/gannza/app-layout-theme/issues"
     },
     "homepage": "https://github.com/gannza/app-layout-theme#readme"
   }
   ```

2. **Choose a package name**:
   - The package name is `@ippis/app-layout-theme` (scoped package)

## Version Management

Follow [Semantic Versioning](https://semver.org/):

- **Patch** (1.0.1): Bug fixes
- **Minor** (1.1.0): New features (backward compatible)
- **Major** (2.0.0): Breaking changes

Update version:
```bash
npm version patch  # for 1.0.0 -> 1.0.1
npm version minor  # for 1.0.0 -> 1.1.0
npm version major  # for 1.0.0 -> 2.0.0
```

## Publishing

### Dry Run (Test)

Test what will be published without actually publishing:

```bash
npm publish --dry-run
```

### Publish to npm

```bash
npm publish
```
```
git add .
git commit -m "update shell theme and docs"
npm version patch
```
For scoped packages (required for @ippis scope):
```bash
npm publish --access public
```

### Publish Beta/Alpha Versions

```bash
npm version 1.0.0-beta.1
npm publish --tag beta
```

Users can install with:
```bash
npm install @ippis/app-layout-theme@beta
```

## Post-Publishing

1. **Create a Git tag**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Create a GitHub release** with release notes

3. **Update documentation** if needed

## Updating the Package

1. Make your changes
2. Update version: `npm version patch|minor|major`
3. Build: `npm run build:lib`
4. Publish: `npm publish`

## Troubleshooting

### "Package name already exists"
- Use a scoped package: `@ippis/app-layout-theme`
- Or choose a different name

### "You must verify your email"
- Check your email and verify your npm account

### "Insufficient permissions"
- Make sure you're logged in: `npm whoami`
- For scoped packages, ensure you have access to the organization

### Build errors
- Check that all dependencies are installed: `npm install`
- Verify TypeScript configuration
- Check that all imports are correct

## Unpublishing

⚠️ **Warning**: Unpublishing can break other projects. Only do this within 72 hours of publishing.

```bash
npm unpublish @ippis/app-layout-theme@1.0.0
```

To unpublish all versions:
```bash
npm unpublish @ippis/app-layout-theme --force
```



### Publish to the private registry

```bash
# First time — log in
npm login --registry http://172.27.8.68:4873/

# Bump the version
npm version patch   # or minor / major

# Build and publish
npm run build
npm publish
```

