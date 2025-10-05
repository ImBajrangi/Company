from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import subprocess, time, os

class AutoPush(FileSystemEventHandler):
    def on_any_event(self, event):
        if event.is_directory:
            return
        print("🔄 Change detected, committing & pushing...")
        subprocess.run(["git", "add", "."], stdout=subprocess.DEVNULL)
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