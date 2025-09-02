#!/bin/bash

# Auto commit and push script

# Get status
git status

# Add all changes
git add .

# Commit with timestamp
git commit -m "Auto commit: $(date)"

# Push to main branch
git push origin main