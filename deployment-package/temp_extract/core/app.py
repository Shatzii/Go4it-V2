
from flask import Flask, render_template, request, redirect, session, jsonify
from core.auth import login_required
from core.sentinel_middleware import secure_route
from core.audit_log import log_event
from core.red_zone import check_red_zone
from core.alert_system import send_alert
from core.file_guard import handle_upload
from core.trust_index import verify_trust
from core.kill_switch import trigger_lockdown
from core.token_manager import validate_token

app = Flask(__name__)
app.secret_key = "REPLACE_THIS_SECRET"

@app.route('/')
@login_required
def dashboard():
    log_event(session['user'], "Accessed Dashboard")
    return render_template('dashboard.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    from core.auth import handle_login
    return handle_login(request)

@app.route('/upload', methods=['POST'])
@secure_route
def upload():
    return handle_upload(request)

@app.route('/heatmap')
@login_required
def heatmap():
    return render_template('heatmap.html')

@app.route('/api/threats')
def api_threats():
    return jsonify([
        {"ip": "192.168.1.5", "score": 3},
        {"ip": "192.168.1.22", "score": 7}
    ])

@app.route('/lockdown')
@login_required
def lockdown():
    return trigger_lockdown()
