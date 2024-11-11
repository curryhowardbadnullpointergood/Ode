from datetime import datetime
from flask import jsonify
import uuid
import hashlib


def register_user(request, container):
    request_json = request.get_json()
    username = request_json.get("username")
    password = request_json.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user_list = container.where(field_path='username', op_string='==', value=username).stream()
    if any(user.id for user in user_list):
        return jsonify({"error": "Username already exists"}), 400

    user_id = str(uuid.uuid4())
    new_user = container.document(user_id)
    hash_password = hashlib.sha256(password.encode()).hexdigest()
    time = datetime.utcnow().isoformat()
    new_user.set({
        'username': username,
        'password': hash_password,
        'created_time': time,
        'edit_time': time
    })

    response = {
        "status": "success",
        "message": "User registered successfully",
        "data": {"user_id": user_id, "create_time": time, "edit_time": time}
    }
    return jsonify(response), 201
