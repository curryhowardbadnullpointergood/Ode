from flask import jsonify
import hashlib
from datetime import datetime


def edit_user(request, container):
    request_json = request.get_json()
    username = request_json.get('username')
    password = request_json.get('password')
    user_id = request_json.get('id')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = container.document(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    hash_password = hashlib.sha256(password.encode()).hexdigest()
    time = datetime.utcnow().isoformat()
    user.set({
        'username': username,
        'password': hash_password,
        'edit_time': time
    })

    response = {
        "status": "success",
        "message": "User modified successfully",
        "data": {"edit_time": time}
    }

    return jsonify(response), 200