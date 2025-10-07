import subprocess, time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from threading import Timer
import os

IGNORED_EXTENSIONS = {".swp", ".tmp", ".log"}
IGNORED_DIRS = {".vscode", "__pycache__"}

class AutoPush(FileSystemEventHandler):
    def __init__(self):
        self.timer = None
        self.delay = 5  # seconds after last change

    def on_any_event(self, event):
        # Skip directories
        if event.is_directory:
            return

        # Skip ignored dirs and file types
        if any(part in IGNORED_DIRS for part in event.src_path.split(os.sep)):
            return
        if any(event.src_path.endswith(ext) for ext in IGNORED_EXTENSIONS):
            return

        # Debounce rapid changes
        if self.timer:
            self.timer.cancel()
        self.timer = Timer(self.delay, self.commit_and_push)
        self.timer.start()

    def commit_and_push(self):
        print("🔄 Change detected, committing & pushing...")
        subprocess.run(["git", "push"])
        subprocess.run(["git", "commit", "-m", "Auto update"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        subprocess.run(["git", "push"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
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