#!/bin/bash

# Ensure we're on the develop branch
git checkout develop

# Get the current version from package.json
current_version=$(node -p "require('./package.json').version")

# Prompt for the new version
read -p "Enter new version (current is $current_version): " new_version

# Update package.json
npm version $new_version --no-git-tag-version

git add package.json package-lock.json
git commit -m "Bump version to $new_version"

# Start a new release branch
git flow release start $new_version

# Commit the version change
git add package.json
git commit -m "Bump version to $new_version"

# Finish the release
git flow release finish $new_version

# Push changes and tags
git push origin develop
git push origin main
git push --tags
