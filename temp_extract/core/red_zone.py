
attempts = {}

def check_red_zone(ip):
    attempts[ip] = attempts.get(ip, 0) + 1
    return attempts[ip] >= 5
