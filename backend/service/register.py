from datetime import datetime
from flask import jsonify
import uuid
import hashlib


def register_user(request, container):
    request_json = request.get_json()
    username = request_json.get("username")
    password = request_json.get("password")
    confirmed_password = request_json.get("confirmed_password")
    email = request_json.get("email_address")

    if password != confirmed_password:
        return jsonify({"error": "Passwords do not match"}), 202 

    if not username or not password or not email:
        return jsonify({"error": "Username, password and email address are required"}), 202 

    user_list = container.where(field_path='username', op_string='==', value=username).stream()
    if any(user.id for user in user_list):
        return jsonify({"error": "Username already exists"}), 202 

    user_id = str(uuid.uuid4())
    new_user = container.document(user_id)
    hash_password = hashlib.sha256(password.encode()).hexdigest()
    time = datetime.utcnow().isoformat()
    new_user.set({
        'username': username,
        'password': hash_password,
        'email_address': email,
        'bio' : "",
        'name' : "",
        'friends' : [],
        'profile_picture' : "",
        'interests' : [],
        'events_interested' : [],
        'created_time': time,
        'edit_time': time
    })

    response = {
        "status": "success",
        "message": "User registered successfully",
        "data": {"user_id": user_id, "create_time": time, "edit_time": time}
    }
    return jsonify(response), 201


def register_admin(request, container):
    request_json = request.get_json()
    organisation = request_json.get("organisation")
    password = request_json.get("password")
    confirmed_password = request_json.get("confirmed_password")
    email = request_json.get("email_address")

    if password != confirmed_password:
        return jsonify({"error": "Passwords do not match"}), 202

    if not organisation or not password or not email:
        return jsonify({"error": "Username, password and email address are required"}), 202

    user_list = container.where(field_path='organisation', op_string='==', value=organisation).stream()
    if any(user.id for user in user_list):
        return jsonify({"error": "Organisation is already registered"}), 202

    admin_id = str(uuid.uuid4())
    new_admin = container.document(admin_id)
    hash_password = hashlib.sha256(password.encode()).hexdigest()
    time = datetime.utcnow().isoformat()
    new_admin.set({
        'organisation': organisation,
        'password': hash_password,
        'email_address': email,
        'bio' : "",
        'name' : "",
        'profile_picture' : "",
        'events_created' : [],
        'created_time': time,
        'edit_time': time
    })

    response = {
        "status": "success",
        "message": "User registered successfully",
        "data": {"user_id": admin_id, "create_time": time, "edit_time": time}
    }
    return jsonify(response), 201
