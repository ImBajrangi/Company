import subprocess
import time
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from threading import Timer

IGNORED_EXTENSIONS = {".swp", ".tmp", ".log", ".env"}
IGNORED_DIRS = {".vscode", "__pycache__"}




class AutoPush(FileSystemEventHandler):
    def __init__(self):
        self.timer = None
        self.delay = 5  # seconds to wait after last change

    def on_any_event(self, event):
        if event.is_directory:
            return

        # Skip ignored dirs and files
        if any(part in IGNORED_DIRS for part in event.src_path.split(os.sep)):
            return
        if any(event.src_path.endswith(ext) for ext in IGNORED_EXTENSIONS):
            return

        # Debounce to avoid rapid commits
        if self.timer:
            self.timer.cancel()
        self.timer = Timer(self.delay, self.commit_and_push)
        self.timer.start()

    def commit_and_push(self):
        print("🔄 Change detected, committing & pushing...")

        # Stage changes
        subprocess.run(["git", "add", "."], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        # Commit changes
        commit = subprocess.run(
            ["git", "commit", "-m", "Auto update"],
            capture_output=True, text=True
        )

        if "nothing to commit" in commit.stdout:
            print("⚙️ No new changes to commit.")
            return

        # Pull with rebase before pushing
        pull = subprocess.run(["git", "pull", "--rebase"], capture_output=True, text=True)
        if pull.returncode != 0:
            print("⚠️ Pull (rebase) failed:", pull.stderr)
            return

        # Push changes
        push = subprocess.run(["git", "push"], capture_output=True, text=True)
        if push.returncode != 0:
            print("❌ Push failed:", push.stderr)
        else:
            print("✅ Changes pushed to GitHub.")

if __name__ == "__main__":
    observer = Observer()
    observer.schedule(AutoPush(), ".", recursive=True)
    observer.start()
    print("🚀 Auto-push is running... Press Ctrl+C to stop.")
    try:
        while True:
            time.sleep(2)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()