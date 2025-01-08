import secrets

from flask_socketio import SocketIO
from flask import Flask, jsonify, request, session, redirect
from flask_cors import CORS
from firebase_admin import firestore, credentials, storage
from algoliasearch.search.client import SearchClient

import os
from dotenv import load_dotenv
import firebase_admin

from service.register import register_user, register_admin, register_user_callback, register_admin_callback
from service.edit import edit_user
from service.login import login_user
from service.logout import logout_user
from service.delete import delete_user
from service.getFriendData import getFriendData
from service.create_profile import create_profile, view_interests, view_user, add_friend_profile, view_admin, admin_profile
from service.event import report_user, block_user, create_event, get_users_by_event_id, view_event, filter_by_genre, subscribing_event, get_all_events
from service.friend_request import send_friend_request, receive_friend_request, add_friend, view_friend_requests
from service.generate_notification import generate_notifications
from service.translator import translate_texts, SUPPORTED_LANGUAGES

load_dotenv()
app = Flask(__name__)
app.secret_key = secrets.token_hex(16)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
cred = credentials.Certificate(os.environ.get('GOOGLE_APPLICATION_CREDENTIALS'))
firebase_admin.initialize_app(cred)
print("Firebase initialized successfully")
database = firestore.client()
users_container = database.collection('users')
organiser_container = database.collection('admins')
event_container = database.collection('events')
message_container = database.collection('messages')
block_container = database.collection('block')
report_container = database.collection('report')
user_location_container = database.collection('locations_user')


@app.route('/user/<path:action>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def user_controller(action):
    return user_process(action, users_container)

@app.route('/admin/<path:action>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def admin_controller(action):
    return user_process(action, database.collection('admins'))

@app.route('/organiser/<path:action>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def organiser_controller(action):
    return user_process(action, organiser_container)


@app.route('/event/<path:action>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def event_controller(action):
    method = request.method
    if action == "create" and method == 'POST':
        return create_event(request, event_container, organiser_container)
    elif action == "block" and method == 'POST':
        return block_user(request, database)
    elif action == "report" and method == 'POST':
        return report_user(request, database)
    elif action == "view" and method == 'POST':
        return view_event(request, event_container)
    elif action == "filter_genre" and method == 'POST':
        return filter_by_genre(request, event_container)
    elif action == "follow" and method == 'POST':
        return subscribing_event(request, database)
    elif action == "all" and method == 'GET':
        return get_all_events(event_container)


def user_process(action, container):
    method = request.method
    # Call different functions based on the path
    if action == "register_user" and method == 'POST':
        return register_user(request, container)
    elif action == "register_admin" and method == 'POST':
        return register_admin(request, container)
    elif action == "login" and method == 'POST':
        if container == organiser_container:
            return login_user(request, organiser_container)
        return login_user(request, users_container)
    elif action == "logout" and method == 'POST':
        return logout_user()
    elif action == "edit" and method == 'PUT':
        return edit_user(request, container)
    elif action == 'delete' and method == 'DELETE':
        return delete_user(request, container)
    elif action == "create_profile" and method == 'POST':
        return create_profile(request, container)
    elif action == "view_interests" and method == 'GET':
        return view_interests(request, container)
    elif action == "view_user" and method == "POST":
        return view_user(request, container)
    elif action == "add_friend"  and method == "POST":
        return add_friend_profile(request, container)
    elif action == "get_friend_data"  and method == "POST":
        return getFriendData(request, container) 
    elif action == "view_admin" and method == "POST":
        return view_admin(request, container)
    elif action == "admin_profile" and method == "POST":
        return admin_profile(request, container)
    else:
        return jsonify({"error": f"Unknown action: {action}"}), 404


@app.route('/friendRequest/<path:action>', methods=['GET', 'POST', 'PUT'])
def friend_request_controller(action):
    method = request.method
    if action == "send" and method == 'POST':
        return send_friend_request(request, database)
    elif action == "respond" and method == 'POST':
        return receive_friend_request(request, database)
    elif action == "view" and method == 'GET':
        return view_friend_requests(request, database)
    return jsonify({"error": f"Unknown action: {action}"}), 404


@app.route('/generate_notification/', methods=['POST'])
def notification_controller():
    return generate_notifications(request, event_container)

@app.route('/translate-<lang_code>', methods=['POST'])
def translate_specific_language(lang_code):
    try:
        if lang_code not in SUPPORTED_LANGUAGES:
            return jsonify({"error": f"Unsupported language code: {lang_code}"}), 400
        
        data = request.get_json()
        texts = data.get('texts')
        return translate_texts(texts, lang_code)
    except Exception as e:
        return jsonify({"error": f"Failed to translate: {str(e)}"}), 500

# Update the existing translate route to handle webpage content
@app.route('/translate', methods=['POST'])
def translate_controller():
    try:
        data = request.get_json()
        texts = data.get('texts')
        target_language = data.get('target_language')
        
        if not target_language:
            return jsonify({"error": "Target language is required"}), 400
            
        return translate_texts(texts, target_language)
    except Exception as e:
        return jsonify({"error": f"Failed to translate: {str(e)}"}), 500


@app.route('/oauth2callback')
def oauth2callback():
    try:
        import base64
        import json
        state = request.args.get('state', '')
        if not state:
            raise ValueError("No state parameter provided")

        try:
            state_data = json.loads(
                base64.urlsafe_b64decode(state.encode()).decode()
            )
            reg_type = state_data.get("type")
            registration_data = state_data.get("data")

            print(f"Decoded registration type: {reg_type}")
            print(f"Decoded registration data: {registration_data}")

        except Exception as decode_error:
            print(f"Error decoding state: {decode_error}")
            raise ValueError("Invalid state parameter")

        if reg_type == 'user':
            result = register_user_callback(request, users_container, registration_data)
            if result[1] == 201:
                return redirect(f'{os.environ.get("FRONTEND_REGISTER")}?success=true')
            return redirect(f'{os.environ.get("FRONTEND_REGISTER")}?error={result[0].json["error"]}')

        elif reg_type == 'admin':
            result = register_admin_callback(request, organiser_container, registration_data)
            if result[1] == 201:
                return redirect(f'{os.environ.get("FRONTEND_REGISTER")}?success=true')
            return redirect(f'{os.environ.get("FRONTEND_REGISTER")}?error={result[0].json["error"]}')
        else:
            raise ValueError(f"Invalid registration type: {reg_type}")

    except Exception as e:
        print(f"Error in oauth2callback: {str(e)}")
        error_message = str(e)
        return redirect(f'{os.environ.get("FRONTEND_REGISTER")}?error={error_message}')

@app.route('/get_friend_location', methods=['GET', 'POST', 'PUT', 'DELETE'])
def search_controller():
    request_json = request.get_json()
    friends = request_json.get('friends',[])
    list_of_location = []
    for fri in friends:
        user_ref = user_location_container.document(fri)
        user = user_ref.get()
        if not user.exists: 
            return jsonify({"error": f"User with ID {fri} does not exist"}), 404
        
        user_data = user.to_dict()
        list_of_location.append({ 
            "longitude": user_data["longitude"] ,  
            "latitude" :  user_data["latitude"] ,
            "username" : fri
        })

    response = {
        "status": "success",
        "message": "Login successful",
        "data" : list_of_location
    }

    return jsonify(response), 200

@socketio.on('connect')
def handle_connect():
    print(f'Client connected with socket ID: {request.sid}')


# use python3 main.py
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
