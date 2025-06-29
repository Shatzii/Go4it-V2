
from functools import wraps
from flask import session, redirect

def secure_route(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if 'user' not in session:
            return redirect('/login')
        return func(*args, **kwargs)
    return wrapper
