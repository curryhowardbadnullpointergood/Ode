from flask import Flask, jsonify, request
from firebase_admin import firestore, credentials
import os
from dotenv import load_dotenv
import firebase_admin
from service.register import register_user
from service.edit import edit_user
from service.login import login_user
from service.logout import logout_user
from service.delete import delete_user
from service.create_profile import create_profile


load_dotenv()
app = Flask(__name__)
cred = credentials.Certificate(os.environ.get('GOOGLE_APPLICATION_CREDENTIALS'))
firebase_admin.initialize_app(cred)
print("Firebase initialized successfully")
database = firestore.client()
users_container = database.collection('users')
organiser_container = database.collection('organisers')


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
    elif action == 'delete' and method == 'DELETE':
        return delete_user(request, users_container)
    elif action == "create_profile" and method == 'POST':
        return create_profile(request, users_container)
    else:
        return jsonify({"error": f"Unknown action: {action}"}), 404


@app.route('/organiser/<path:action>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def organiser_controller(action):
    method = request.method
    # Call different functions based on the path
    if action == "register" and method == 'POST':
        return register_user(request, organiser_container)
    elif action == "login" and method == 'POST':
        return login_user(request, organiser_container)
    elif action == "logout" and method == 'POST':
        return logout_user()
    elif action == "edit" and method == 'PUT':
        return edit_user(request, organiser_container)
    elif action == 'delete' and method == 'DELETE':
        return delete_user(request, organiser_container)
    elif action == "create_profile" and method == 'POST':
        return create_profile(request, users_container)
    else:
        return jsonify({"error": f"Unknown action: {action}"}), 404

@app.route('/event/<path:action>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def event_controller(action):
    method = request.method
    if action == "create" and method == 'POST':
        return
    elif action == "block" and method == 'POST':
        return block_user(request, database)
    elif action == "report" and method == 'POST':
        return report_user(request, database)


@socketio.on('connect')
def handle_connect():
    print('Client connected')

# use python3 main.py
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
