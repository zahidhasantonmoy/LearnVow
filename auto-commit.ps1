# Auto commit and push script for Windows

# Get status
git status

# Add all changes
git add .

# Commit with timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "Auto commit: $timestamp"

# Push to main branch
git push origin main