import time
import subprocess

class Sentinel:
    def __init__(self, retry_on_fail=True, snapshot_dir="/var/snapshots", notify_on_disaster=None):
        self.retry = retry_on_fail
        self.snapshot_dir = snapshot_dir
        self.notify = notify_on_disaster

    def monitor(self):
        print("👁️  Sentinel Monitoring Enabled")
        while True:
            result = subprocess.run(["pgrep", "-f", "ai_orchestrator.py"], capture_output=True)
            if result.returncode != 0:
                print("❌ AI Orchestrator not running.")
                if self.retry:
                    print("🔁 Retrying AI Orchestrator...")
                    subprocess.Popen(["python3", "ai/ai_orchestrator.py"])
            time.sleep(10)
