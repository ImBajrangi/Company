# Fix Git Push: Large Files

The user is unable to push to the remote repository because of large video files (>100MB) that were committed. We need to remove these files from the git history before the push will succeed.

## Plan
1.  Identify the commits containing the large files.
2.  Use `git reset --soft` to undo the commits while keeping changes.
3.  Unstage/Remove the large SVG/MOV/Video files from git tracking.
4.  Add them to .gitignore to prevent recurrence.
5.  Re-commit the valid changes.
6.  Push successfully.
