from flask_socketio import SocketIO
from flask import Flask, jsonify, request
from flask_cors import CORS
from firebase_admin import firestore, credentials, storage
import os
from dotenv import load_dotenv
import firebase_admin
from service.register import register_user
from service.edit import edit_user
from service.login import login_user
from service.logout import logout_user
from service.delete import delete_user
from service.create_profile import create_profile
from service.event import report_user, block_user, create_event, get_users_by_event_id
from service.utils import store_image

load_dotenv()
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
cred = credentials.Certificate(os.environ.get('GOOGLE_APPLICATION_CREDENTIALS'))
firebase_admin.initialize_app(cred)
print("Firebase initialized successfully")
database = firestore.client()
bucket = storage.bucket(os.environ.get('FIREBASE_BUCKET'))
users_container = database.collection('users')
organiser_container = database.collection('organisers')
event_container = database.collection('events')
users_to_sockets = {}
sockets_to_users = {}


@app.route('/user/<path:action>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def user_controller(action):
    return user_process(action, users_container)


@app.route('/organiser/<path:action>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def organiser_controller(action):
    return user_process(action, organiser_container)


@app.route('/event/<path:action>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def event_controller(action):
    method = request.method
    if action == "create" and method == 'POST':
        return create_event(request, event_container, users_container)
    elif action == "block" and method == 'POST':
        return block_user(request, database)
    elif action == "report" and method == 'POST':
        return report_user(request, database)


@app.route('/chat/<path:action>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def chat_controller(action):
    method = request.method
    if action == "create" and method == 'POST':
        return


def user_process(action, container):
    method = request.method
    # Call different functions based on the path
    if action == "register" and method == 'POST':
        return register_user(request, container)
    elif action == "login" and method == 'POST':
        return login_user(request, container)
    elif action == "logout" and method == 'POST':
        return logout_user()
    elif action == "edit" and method == 'PUT':
        return edit_user(request, container)
    elif action == 'delete' and method == 'DELETE':
        return delete_user(request, container)
    elif action == "create_profile" and method == 'POST':
        return create_profile(request, container)
    elif action == "image" and method == 'POST':
        return store_image(request, bucket)
    else:
        return jsonify({"error": f"Unknown action: {action}"}), 404


@socketio.on('connect')
def handle_connect():
    print(f'Client connected with socket ID: {request.sid}')


# use python3 main.py
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
