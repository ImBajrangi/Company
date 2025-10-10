import subprocess
import time
import os
import signal
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from threading import Timer

# --- CONFIG ---
ENABLE_GIT = True   # 🚦 Set this to False to stop all git commands entirely
IGNORED_EXTENSIONS = {".swp", ".tmp", ".log"}
IGNORED_DIRS = {".vscode", "__pycache__"}

class AutoPush(FileSystemEventHandler):
    def __init__(self):
        self.timer = None
        self.delay = 2  # seconds
        self.stopped = False

    def on_any_event(self, event):
        if self.stopped or event.is_directory:
            return
        if any(part in IGNORED_DIRS for part in event.src_path.split(os.sep)):
            return
        if any(event.src_path.endswith(ext) for ext in IGNORED_EXTENSIONS):
            return

        if self.timer:
            self.timer.cancel()
        self.timer = Timer(self.delay, self.commit_and_push)
        self.timer.start()

    def commit_and_push(self):
        if self.stopped or not ENABLE_GIT:
            print("🚫 Git disabled or stopped — no push will occur.")
            return

        print("🔄 Change detected, committing & pushing...")

        # Safe wrapper for subprocess calls
        def safe_run(cmd):
            try:
                return subprocess.run(cmd, capture_output=True, text=True)
            except Exception as e:
                print(f"⚠️ Command failed: {cmd}\nError: {e}")
                return None

        safe_run(["git", "add", "."])
        commit = safe_run(["git", "commit", "-m", "Auto update"])
        if not commit or "nothing to commit" in commit.stdout:
            print("⚙️ No new changes to commit.")
            return

        pull = safe_run(["git", "pull", "--rebase"])
        if not pull or pull.returncode != 0:
            print("⚠️ Pull failed, skipping push.")
            return

        push = safe_run(["git", "push"])
        if not push or push.returncode != 0:
            print("❌ Push failed.")
        else:
            print("✅ Changes pushed to GitHub.")

def stop_autopush(observer, handler):
    print("\n🛑 Stopping auto-push safely...")
    handler.stopped = True
    if handler.timer:
        handler.timer.cancel()
    observer.stop()
    observer.join()
    print("✅ Auto-push stopped — no more git activity will occur.")

if __name__ == "__main__":
    handler = AutoPush()
    observer = Observer()
    observer.schedule(handler, ".", recursive=True)
    observer.start()
    print("🚀 Auto-push is running... Press Ctrl+C to stop.")
    try:
        while True:
            time.sleep(2)
    except KeyboardInterrupt:
        stop_autopush(observer, handler)