# Contributing to Company

To maintain high code quality and repository security, strictly follow this guide.

## 💾 1. Local Setup (Storage Optimized)

Because our repository is large, use **Blobless Clones** to save space on your Mac.

```bash
# Clone only the structure (no blobs, no checkout)
git clone --filter=blob:none --no-checkout https://github.com/ImBajrangi/Company.git
cd Company

# Initialize sparse-checkout to work only on specific folders
git sparse-checkout init --cone

# Check out the root files
git checkout main

# To work on a specific folder (e.g., 'Projects')
git sparse-checkout add Projects
```

---

## 🌿 2. Branching Strategy

**CRITICAL:** Never commit directly to `main`. It is protected and requires reviewer approval.

1.  **Sync Local:** `git pull origin main`
2.  **Create Branch:** `git checkout -b feature/your-task-name`
3.  **Work & Commit:** `git commit -m "feat: add descriptive message"`
4.  **Push Branch:** `git push origin feature/your-task-name`

---

## 📑 3. Pull Request (PR) Policy

Once your branch is pushed:
1.  Go to the GitHub repository.
2.  Open a **Pull Request** comparing `feature/your-task-name` → `main`.
3.  **Reviewer:** Assign `@ImBajrangi`.
4.  **Wait for Approval:** Do not merge until approved and checked by @ImBajrangi.

---

## 🗒️ 4. Commit Convention

Use clear prefixes:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation updates
- `style:` for UI/CSS changes without logic shifts

---

## 👨‍💻 Onboarding Checklist

- [ ] Repository cloned using the optimized method.
- [ ] Understands not to touch `main`.
- [ ] SSH/HTTPS keys authorized by @ImBajrangi.
- [ ] Ready to create first feature branch.
