from flask import jsonify
import datetime

def create_profile(request, container):
    request_json = request.get_json()
    username = request_json.get("username")
    name = request_json.get("name")
    profile_picture = request_json.get("profile_picture")
    interests = request_json.get("interests", [])

    INTERESTS = ["rock", "pop", "jazz", "classical", "electronic", "hip-hop", "metal", "indie", "folk",
                 "r&b", "opera", "piano", "musical theatre", "strings", "guitar", "drums", "bass", "vocals",
                 "production", "composition"]


    if not username or not name or not profile_picture:
        return jsonify({"error": "Username, name, and profile picture are required"}), 400

    user_query = container.where("username", "==", username).stream()
    user_doc = next(user_query, None)

    if not user_doc:
        return jsonify({"error": "User with the provided username does not exist"}), 404

    profile_data = {
        "name": name,
        "profile_picture": profile_picture,  # Store Base64-encoded string
        "interests": list(set(interests) & set(INTERESTS)),
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
            "interests": interests
        },
    }
    return jsonify(response), 201


def view_interests(request, container):
    request_json = request.get_json()
    username = request_json.get("username")

    user = next(container.where("username", "==", username).stream(), None)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_data = user.to_dict()
    interests = user_data.get('interests', [])

    return jsonify({
        "status": "success",
        "data": {"interests": interests}
    }), 200