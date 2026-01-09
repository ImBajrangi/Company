---
description: How to work on the Company repo using a storage-optimized professional workflow
---

# 🚀 Company Repository Workflow

This workflow is designed for **Mac users with limited storage** who need to work professionally on the `Company` repository.

## 1. Entering the Workspace
Always ensure you are in the correct directory:
```bash
cd /Users/mr.bajrangi/.gemini/antigravity/scratch/Company
```

## 2. Setting Up a New Task (The Right Way)
Never work on `main`. Always create a fresh branch for every feature or fix.
```bash
# Get the latest from the cloud
git pull origin main

# Create your workspace for this specific task
git checkout -b feature/your-task-name
```

## 3. Managing Local Storage (Sparse Checkout)
If you need to work on a specific folder (e.g., `Projects`), but don't want to download 10GB of images:
```bash
# Show what's currently checked out
git sparse-checkout list

# Add a specific folder you want to work on
git sparse-checkout add Projects/FolderName

# If you are done and want to free up space
git sparse-checkout set .  # Resets to root files only
```

## 4. Saving & Sharing Your Work
Once you've made changes:
```bash
git add .
git commit -m "feat: brief description of change"
git push origin feature/your-task-name
```

## 5. Completing the Task (Pull Requests)
1. Go to [GitHub - Company Repos](https://github.com/ImBajrangi/Company)
2. You will see a button: "Compare & pull request". Click it!
3. Ensure `@ImBajrangi` is assigned as the reviewer.
4. Once merged, you can delete your local branch:
```bash
git checkout main
git branch -d feature/your-task-name
```

## 💡 Quick Tips
- **Check Status:** Use `git status` frequently to see what's happening.
- **Save Disk:** Only use `git sparse-checkout add` for the folders you actually need *today*.
- **Sync:** Always pull before you start a new branch.