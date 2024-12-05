from flask import jsonify
import datetime

def create_profile(request, container):
    request_json = request.get_json()
    username = request_json.get("username")
    name = request_json.get("name")
    profile_picture = request_json.get("profile_picture")  


    if not username or not name or not profile_picture:
        return jsonify({"error": "Username, name, and profile picture are required"}), 400

    user_query = container.where("username", "==", username).stream()
    user_doc = next(user_query, None)

    if not user_doc:
        return jsonify({"error": "User with the provided username does not exist"}), 404

    profile_data = {
        "name": name,
        "profile_picture": profile_picture,  # Store Base64-encoded string
        "profile_created_time": datetime.datetime.utcnow().isoformat(),
    }
    container.document(user_doc.id).update(profile_data)

    response = {
        "status": "success",
        "message": "Profile created successfully",
        "data": {
            "username": username,
            "name": name,
            "profile_picture": "Uploaded",
            "profile_created_time": profile_data["profile_created_time"],
        },
    }
    return jsonify(response), 201
