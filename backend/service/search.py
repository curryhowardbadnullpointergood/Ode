from flask import jsonify
import datetime

def search(request, user_container, event_container, organiser_container): # function to perform searching in different containers
    request_json = request.get_json()
    username = request_json.get("username")
    name = request_json.get("name")
    bio = request_json.get("bio")
    profile_picture = request_json.get("profile_picture")
    interests = request_json.get("interests", [])



    user_query = user_container.where("username", "==", username).stream()
    user_doc = next(user_query, None)
    user_data = user_doc.to_dict()


    
    

    response = {
        "status": "success",
        "data": {
            "result_from_user": user_data,
            "result_from_event": username,
            "result_from_organiser": username
        },
    }
    return jsonify(response), 201