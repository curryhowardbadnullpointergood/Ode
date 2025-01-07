from flask import jsonify
import hashlib


def login_user(request, container):
    request_json = request.get_json()

    username = request_json.get('username')
    organisation = request_json.get('organisation')
    password = request_json.get('password')
    user_list = []

    if not username and not organisation or not password:
        return jsonify({"error": "Username and password are required"}), 200
    if container.id == "users":
        user_list = container.where(field_path='username', op_string='==', value=username).stream()
    elif container.id == "admins":
        user_list = container.where(field_path='organisation', op_string='==', value=organisation).stream()
    user = next(user_list, None)
    if not user:
        return jsonify({"error": "Invalid username or password1"}), 200
        # return jsonify({"error": user_list}), 200

    user_data = user.to_dict()
    hash_password = hashlib.sha256(password.encode()).hexdigest()
    if user_data['password'] != hash_password:
        return jsonify({"error": "Invalid username or password2"}), 200

    response = {
        "status": "success",
        "message": "Login successful",
        "user_id": user.id,
        "data": user_data
    }

    return jsonify(response), 200
