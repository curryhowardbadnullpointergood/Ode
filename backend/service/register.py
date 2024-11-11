import os
from dotenv import load_dotenv
import firebase_admin
from flask import jsonify
from firebase_admin import firestore, credentials
import uuid
import hashlib

load_dotenv()
cred = credentials.Certificate(os.environ.get('GOOGLE_APPLICATION_CREDENTIALS'))
firebase_admin.initialize_app(cred)

database = firestore.client()

users_container = database.collection('users')


def register_user(request):
    request_json = request.get_json()
    username = request_json.get("username")
    password = request_json.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user_list = users_container.where(field_path='username', op_string='==', value=username).stream()
    if any(user.id for user in user_list):
        return jsonify({"error": "Username already exists"}), 400

    user_id = str(uuid.uuid4())
    new_user = users_container.document(user_id)
    hash_password = hashlib.sha256(password.encode()).hexdigest()
    new_user.set({
        'username': username,
        'password': hash_password
    })
    return jsonify({"code": 200, "msg": ""}), 201
