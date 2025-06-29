
import os
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'pdf', 'mp4', 'jpg', 'jpeg', 'png', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def handle_upload(request):
    if 'file' not in request.files:
        return "No file uploaded", 400
    file = request.files['file']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join('./logs', filename))
        return f"File uploaded: {filename}"
    return "Upload not allowed", 403
