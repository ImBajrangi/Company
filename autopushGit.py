import subprocess
import time
import os
import signal
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from threading import Timer

IGNORED_EXTENSIONS = {".swp", ".tmp", ".log"}
IGNORED_DIRS = {".vscode", "__pycache__"}

# Keep track of subprocesses to terminate them on exit
active_processes = []

def safe_run(cmd):
    """Run subprocess safely and track it."""
    try:
        process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        active_processes.append(process)
        stdout, stderr = process.communicate()
        active_processes.remove(process)
        return process.returncode, stdout.decode(), stderr.decode()
    except Exception as e:
        print("⚠️ Subprocess error:", e)
        return 1, "", str(e)

class AutoPush(FileSystemEventHandler):
    def __init__(self):
        self.timer = None
        self.delay = 5
        self.stopped = False

    def on_any_event(self, event):
        if self.stopped or event.is_directory:
            return

        # Skip ignored files and folders
        if any(part in IGNORED_DIRS for part in event.src_path.split(os.sep)):
            return
        if any(event.src_path.endswith(ext) for ext in IGNORED_EXTENSIONS):
            return

        # Debounce commits
        if self.timer:
            self.timer.cancel()
        self.timer = Timer(self.delay, self.commit_and_push)
        self.timer.start()

    def commit_and_push(self):
        if self.stopped:
            return
        print("🔄 Change detected, committing & pushing...")

        safe_run(["git", "add", "."])
        code, out, _ = safe_run(["git", "commit", "-m", "Auto update"])

        if "nothing to commit" in out:
            print("⚙️ No new changes to commit.")
            return

        code, out, err = safe_run(["git", "pull", "--rebase"])
        if code != 0:
            print("⚠️ Pull (rebase) failed:", err)
            return

        code, out, err = safe_run(["git", "push"])
        if code != 0:
            print("❌ Push failed:", err)
        else:
            print("✅ Changes pushed to GitHub.")

def stop_all_processes(observer, handler):
    print("\n🛑 Stopping auto-push...")
    handler.stopped = True
    if handler.timer:
        handler.timer.cancel()
    for process in list(active_processes):
        try:
            process.terminate()
        except Exception:
            pass
    observer.stop()
    observer.join()
    print("✅ Clean shutdown complete. No more git commands will run.")

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
        stop_all_processes(observer, handler)