
from flask import render_template, request, redirect, session
from core.red_zone import check_red_zone
from core.alert_system import send_alert

USERS = {'admin': 'admin123', 'coach': 'coach123'}

def handle_login(req):
    if req.method == 'POST':
        username = req.form['username']
        password = req.form['password']
        ip = req.remote_addr
        if USERS.get(username) == password:
            session['user'] = username
            session['role'] = 'admin' if username == 'admin' else 'coach'
            return redirect('/')
        else:
            if check_red_zone(ip):
                send_alert(f"Red Zone Triggered for IP: {ip}")
            return "Unauthorized", 403
    return render_template('login.html')

def login_required(func):
    def wrapper(*args, **kwargs):
        if 'user' not in session:
            return redirect('/login')
        return func(*args, **kwargs)
    return wrapper
