from flask import jsonify
import datetime
from firebase_admin import firestore

def create_profile(request, container):
    request_json = request.get_json()
    username = request_json.get("username")
    name = request_json.get("name")
    bio = request_json.get("bio")
    profile_picture = request_json.get("profile_picture")
    interests = request_json.get("interests", [])
    friends = request_json.get("friends", [])

    INTERESTS = ["rock", "pop", "jazz", "classical", "electronic", "hip-hop", "metal", "indie", "folk",
                 "r&b", "opera", "piano", "musical theatre", "strings", "guitar", "drums", "bass", "vocals",
                 "production", "composition"]


    #if not username or not name or not profile_picture:
        #return jsonify({"error": "Username, name, and profile picture are required"}), 400

    user_query = container.where("username", "==", username).stream()
    user_doc = next(user_query, None)

    if not user_doc:
        return jsonify({"error": "User with the provided username does not exist"}), 202 
    
    # need to know the current profile first
    user_data = user_doc.to_dict()

    profile_data_1 = {}

    profile_data_1["bio"] = user_data["bio"] if bio is None else bio
    profile_data_1["name"] = user_data["name"] if name is None else name
    profile_data_1["profile_picture"] = user_data["profile_picture"] if profile_picture is None else profile_picture # Store Base64-encoded string
    profile_data_1["interests"] = user_data["interests"] if interests is None else list(set(interests) & set(INTERESTS))
    
    profile_data_1["profile_created_time"] = datetime.datetime.utcnow().isoformat()
   
        

    container.document(user_doc.id).update(profile_data_1)

    response = {
        "status": "success",
        "message": "Profile created successfully",
        "data": {
            "username": username,
            "name": name,
            "profile_picture": "Uploaded",
            "profile_created_time": profile_data_1["profile_created_time"],
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

def view_user(request, container):
    request_json = request.get_json()
    username = request_json.get("username")

    user = next(container.where("username", "==", username).stream(), None)
    if not user:
        return jsonify({"error": "User not found"}), 202 

    user_data = user.to_dict()
    interests = user_data.get('interests', [])

    return jsonify({
        "status": "success",
        "data": user_data
    }), 200

def add_friend_profile(request, container):
    request_json = request.get_json()
    username = request_json.get("username")
    friends = request_json.get("friends")

    user_query = container.where("username", "==", username).stream()
    user_doc = next(user_query, None)

    user_query2 = container.where("username", "==", friends).stream()
    user_doc2 = next(user_query2, None)

    if not user_doc:
        return jsonify({"error": "User with the provided username does not exist"}), 202 
    
    if not user_doc2:
        return jsonify({"error": "User with the provided username does not exist"}), 202 
    
    user_data = user_doc.to_dict()

    if user_data["friends"] == []:
        container.document(user_doc.id).update({
            "friends" : [friends]
        })
    else:
        container.document(user_doc.id).update({ # Strange behaviour here
            "friends" : firestore.ArrayUnion([friends]) 
        })
    
    return jsonify({
        "status": "success",
        "data": user_data
    }), 200

