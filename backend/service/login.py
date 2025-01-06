from flask import jsonify
import hashlib


def login_user(request, container, admin_container):
    request_json = request.get_json()
    username = request_json.get('username')
    password = request_json.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 200

    user_list = container.where(field_path='username', op_string='==', value=username).stream()
    user = next(user_list, None)
    if not user:
        admin_list = admin_container.where(field_path='organisation', op_string='==', value=username).stream()
        user = next(admin_list, None)
    if not user:
        return jsonify({"error": "Invalid username or password"}), 200

    user_data = user.to_dict()
    hash_password = hashlib.sha256(password.encode()).hexdigest()
    if user_data['password'] != hash_password:
        return jsonify({"error": "Invalid username or password"}), 200

    response = {
        "status": "success",
        "message": "Login successful",
        "user_id": user.id,
        "data": user_data
    }

    return jsonify(response), 200
