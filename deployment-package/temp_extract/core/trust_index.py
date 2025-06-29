
import hashlib

def verify_trust(ip, ua):
    fid = hashlib.sha256(f"{ua}_{ip}".encode()).hexdigest()
    return fid
