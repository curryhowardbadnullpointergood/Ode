from flask import Flask, jsonify, request
from firebase_admin import firestore, credentials
import os
from dotenv import load_dotenv
import firebase_admin
from service.register import register_user
from service.edit import edit_user
from service.login import login_user
from service.logout import logout_user


load_dotenv()
app = Flask(__name__)
cred = credentials.Certificate("C:/Users/user/Documents/cs/cs 3/cloud app/group project/Music-Event-App/backend/music-event-442109-firebase-adminsdk-ib5vx-0abef8c709.json")
firebase_admin.initialize_app(cred)
print("Firebase initialized successfully")
database = firestore.client()
users_container = database.collection('users')


@app.route('/user/<path:action>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def user_controller(action):
    method = request.method
    # Call different functions based on the path
    if action == "register" and method == 'POST':
        return register_user(request, users_container)
    elif action == "login" and method == 'POST':
        return login_user(request, users_container)
    elif action == "logout" and method == 'POST':
        return logout_user()
    elif action == "edit" and method == 'PUT':
        return edit_user(request, users_container)
    else:
        return jsonify({"error": f"Unknown action: {action}"}), 404


# use python3 main.py
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
