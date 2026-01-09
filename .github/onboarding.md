# Team Onboarding Checklist

Welcome to the Company development team! Follow these steps to get your environment ready.

### 1. Access & Security
- [ ] Send your GitHub username to @ImBajrangi.
- [ ] Confirm invitation to the repository.
- [ ] Set up 2FA on your GitHub account.

### 2. Environment Setup
- [ ] Install [Git](https://git-scm.com/).
- [ ] (Recommended) Install [VS Code](https://code.visualstudio.com/).
- [ ] Configure Git name and email:
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  ```

### 3. Local Repository Clone (Space Optimized)
- [ ] Run the optimized clone command:
  ```bash
  git clone --filter=blob:none --no-checkout https://github.com/ImBajrangi/Company.git
  ```
- [ ] Initialize sparse-checkout:
  ```bash
  git sparse-checkout init --cone
  ```

### 4. Workflow Drill
- [ ] Read [CONTRIBUTING.md](../CONTRIBUTING.md) carefully.
- [ ] Create a "test" branch: `git checkout -b test/onboarding-check`.
- [ ] Add your name to the `team-members.txt` (if it exists) or create a small doc.
- [ ] Push and open a PR to test the workflow.

### 5. Final Confirmation
- [ ] Understands the `main` branch protection.
- [ ] Knows how to use `git sparse-checkout add <folder>` to get project files.
