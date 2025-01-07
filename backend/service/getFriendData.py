from flask import jsonify
import hashlib

def getFriendData(request, container):
    request_json = request.get_json()
    username = request_json.get('username')
    friends = request_json.get('friends', [])
    field = request_json.get('field')
    list_of_field = []
    for fri in friends:
        user_list = container.where(field_path='username', op_string='==', value=fri).stream()
        user = next(user_list, None)
        if not user: 
            return jsonify({"error": "Invalid username or password1"}), 200 
        user_data = user.to_dict()
        list_of_field.append(user_data[field])

    response = {
        "status": "success",
        "message": "Login successful",
        "data" : list_of_field
    }

    return jsonify(response), 200