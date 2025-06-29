
import os
from cryptography.fernet import Fernet

VAULT_KEY = Fernet.generate_key()
fernet = Fernet(VAULT_KEY)

def trigger_lockdown():
    sensitive_dir = './logs'
    for fname in os.listdir(sensitive_dir):
        path = os.path.join(sensitive_dir, fname)
        if os.path.isfile(path):
            with open(path, 'rb') as f:
                data = f.read()
            with open(path + '.vault', 'wb') as f:
                f.write(fernet.encrypt(data))
            os.remove(path)
    return "System locked down, files secured."
