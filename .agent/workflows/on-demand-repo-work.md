---
description: On-demand workflow for working on repositories without wasting storage
---

# 🗑️ On-Demand "Clean Slate" Workflow

Use this workflow to work on any repository while maintaining maximum free storage on your Mac.

## 1. Local Activation (On-Demand)
When a task starts, I will:
- Use **Blobless Clone** (`--filter=blob:none`) to minimize history size.
- Use **Sparse Checkout** to only download the specific files needed for the task.
- Set the directory as the **Active Workspace**.

## 2. Professional Execution
- Create a **Feature Branch**.
- Complete the coding/fixes.
- **Push** the branch to GitHub.
- Open a **Pull Request (PR)**.

## 3. Storage Reclamation (The Cleanup)
After the changes are safely on GitHub:
1. I will verify the code is successfully pushed.
2. **I will ask you: "Is it okay to delete this local folder to free up space?"**
3. Upon your approval, I will run:
   ```bash
   rm -rf /path/to/repo/folder
   ```

## 🚀 Repositories to handle this way:
- **Company**
- **Python**
- **Sant-Vaani**
- **Data-Science**
- **foody_vrinda_app**

---
*This ensures your Mac stays fast and your code stays safe on GitHub.*
