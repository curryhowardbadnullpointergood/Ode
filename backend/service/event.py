from flask import jsonify
import uuid
import openai
from backend.service.user import get_user_by_user_id


def create_event(request, container, user_container):
    request_json = request.get_json()
    admin = request_json.get('admin')
    information = request_json.get('information')
    picture = request_json.get('picture')
    genres = request_json.get('genres', [])

    user_list = user_container.where(field_path='username', op_string='==', value=admin).stream()
    user = next(user_list, None)
    if not user:
        return jsonify({"error": "Invalid user"}), 401

    description = get_description(information)

    event_id = str(uuid.uuid4())
    new_event = container.document(event_id)
    data = {
        'id': event_id,
        'admin': admin,
        'users': [],
        'information': description,
        'picture': picture,
        'genres': genres
    }
    new_event.set(data)
    response = {
        "status": "success",
        "message": "Event is created successfully",
        "data": {'id': event_id}
    }

    return jsonify(response), 201


def get_users_by_event_id(event_id, container):
    event_list = container.where(field_path='id', op_string='==', value=event_id).stream()
    event = next(event_list, None)
    if event is None:
        return jsonify({'error': 'Event not found'}), 404

    event_data = event.to_dict()
    user_list = event_data.get('users')
    return user_list


def get_events_by_user_id(user_id, container):
    events_query = container.where('users', 'array_contains', user_id).stream()
    return events_query


def get_event_ids_by_user_id(user_id, container):
    events_query = get_events_by_user_id(user_id, container)
    events_data = []
    event_ids = []
    for doc in events_query:
        data = doc.to_dict()
        events_data.append(data)

        # Extract the 'id' field from each event (if it exists)
        if "id" in data:
            event_ids.append(data["id"])
    return event_ids


def report_user(request, database):
    request_json = request.get_json()
    username = request_json.get('username')
    users = request_json.get('list')

    if not username:
        return jsonify({"error": "Username (admin) is required"}), 400
    if not users or not isinstance(users, list):
        return jsonify({"error": "A list of users is required"}), 400

    return create_container("report", username, users, database)


def block_user(request, database):
    request_json = request.get_json()
    username = request_json.get('username')
    users = request_json.get('list')

    if not username:
        return jsonify({"error": "Username (admin) is required"}), 400
    if not users or not isinstance(users, list):
        return jsonify({"error": "A list of users is required"}), 400

    return create_container("block", username, users, database)


def create_container(container_name, username, users, database):
    user_container = database.collection('users')
    user_list = user_container.where(field_path='username', op_string='==', value=username).stream()
    user = next(user_list, None)
    if not user:
        return jsonify({"error": "Invalid user"}), 401

    container = database.collection(container_name)
    admin_doc = container.document(f"{username}_{container_name}")
    users_collection = admin_doc.collection("users")

    for user in users:
        existing_docs = list(
            users_collection.where('username', '==', user).stream()
        )
        if existing_docs:
            continue

        doc_id = str(uuid.uuid4())
        doc_ref = users_collection.document(doc_id)
        doc_ref.set({'username': user})

    response = {
        "status": "success",
        "message": "Users are blocked successfully",
        "data": {}
    }

    return jsonify(response), 200


def view_event(request, container):
    request_json = request.get_json()
    event_id = request_json.get('event_id')

    if not event_id:
        return jsonify({"error": "Need an event id"}), 400

    event_data = get_event_by_event_id(event_id, container)
    if not event_data:
        return jsonify({"error": "No event found"}), 404

    response = {
        "status": "success",
        "message": "Event data retrieved successfully",
        "data": event_data
    }

    return jsonify(response), 200


def get_event_by_event_id(event_id, container):
    event_list = container.where(field_path='id', op_string='==', value=event_id).stream()
    event = next(event_list, None)
    if not event:
        return None
    event_data = event.to_dict()
    return event_data


def filter_by_genre(request, container):
    request_json = request.get_json()
    genre = request_json.get('genre')

    if not genre:
        return jsonify({"error": "Genre is required"}), 400

    events = container.where('genres', 'array_contains', genre).stream()
    filtered_events = [event.to_dict() for event in events]

    return jsonify({
        "status": "success",
        "data": filtered_events
    }), 200


def subscribing_event(request, database):
    request_json = request.get_json()
    user_id = request_json.get('user_id')
    event_id = request_json.get('event_id')
    event_container = database.collection('events')
    user_container = database.collection('users')

    # Get event data
    event = get_event_by_event_id(event_id, event_container)
    if not event:
        return jsonify({"error": "No event found"}), 404

    # Check Block Container
    user_data = get_user_by_user_id(user_id, user_container)
    if not user_data:
        return jsonify({"error": "Invalid user"}), 401

    admin = event.get('admin')
    if not admin:
        return jsonify({"error": "Event admin not found"}), 400

    block_container = database.collection("block")
    admin_doc = block_container.document(f"{admin}_block")
    users_collection = admin_doc.collection("users")
    blocked_query = users_collection.where('username', '==', user_data['username']).stream()
    blocked_doc = next(blocked_query, None)
    if blocked_doc:
        return jsonify({"error": "You are blocked from this event"}), 403

    # get
    user_list = get_users_by_event_id(event_id, event_container)
    if user_id not in user_list:
        user_list.append(user_id)

        event_container.document(event_id).update({'users': user_list})

    # return the latest version to frontend
    updated_event = get_event_by_event_id(event_id, event_container)

    response = {
        "status": "success",
        "message": "User subscribed to event successfully",
        "data": updated_event
    }
    return jsonify(response), 200


openai.api_key = "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"


def get_description(event_description):
    # Example using OpenAI ChatCompletion
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "user",
                "content": f"Generate a concise notification for the following event: {event_description}"
            }
        ]
    )
    return response["choices"][0]["message"]["content"]
