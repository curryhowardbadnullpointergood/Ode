from flask_socketio import SocketIO
from flask import Flask, jsonify, request
from flask_cors import CORS
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
from service.event import report_user, block_user, create_event, get_users_by_event_id

load_dotenv()
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
cred = credentials.Certificate(os.environ.get('GOOGLE_APPLICATION_CREDENTIALS'))
firebase_admin.initialize_app(cred)
print("Firebase initialized successfully")
database = firestore.client()
users_container = database.collection('users')
organiser_container = database.collection('organisers')
event_container = database.collection('events')
users_to_sockets = {}
sockets_to_users = {}


@app.route('/user/<path:action>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def user_controller(action):
    user_process(action, users_container)


@app.route('/organiser/<path:action>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def organiser_controller(action):
    user_process(action, organiser_container)


@app.route('/event/<path:action>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def event_controller(action):
    method = request.method
    if action == "create" and method == 'POST':
        return create_event(request, event_container, users_container)
    elif action == "block" and method == 'POST':
        return block_user(request, database)
    elif action == "report" and method == 'POST':
        return report_user(request, database)


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
    else:
        return jsonify({"error": f"Unknown action: {action}"}), 404


@socketio.on('connect')
def handle_connect():
    socket_id = request.sid
    print(f'Client connected with socket ID: {socket_id}')


@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')


@socketio.on('group_chat')
def handle_group_chat(message, event_id):
    print(message)
    users = get_users_by_event_id(event_id, event_container)
    for user in users:
        socket = users_to_sockets[user]
        socketio.emit('group_chat', message, to=socket)


@socketio.on('chat')
def handle_message(message, target):
    print(message)
    socket = users_to_sockets[target]
    socketio.emit('chat', message, to=socket)


@socketio.on('join')
def handle_join(user_id):
    users_to_sockets[user_id] = request.sid
    sockets_to_users[request.sid] = user_id
    print(f"User {user_id} joined with Socket ID {request.sid}")


# use python3 main.py
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
