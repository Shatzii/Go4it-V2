
from datetime import datetime

def log_event(user, event):
    with open('./logs/audit.log', 'a') as f:
        f.write(f"{datetime.now()} - {user}: {event}\n")
