from datetime import datetime

from flask import jsonify
import uuid
import openai
from service.user import get_user_by_user_id
from service.calendar import create_event_in_calendar, add_attendee_to_event


def create_event(request, container, admin_container):
    request_json = request.get_json()
    admin = request_json.get('admin')
    ticket_price = request_json.get('prices')
    information = request_json.get('information')
    event_name = request_json.get('name')
    location = request_json.get('location')
    start_time = request_json.get('start_time')
    end_time = request_json.get('end_time')
    picture = request_json.get('picture')
    genres = request_json.get('genres', [])
    print(request_json)

    user_list = admin_container.where(field_path='organisation', op_string='==', value=admin).stream()
    user = next(user_list, None)
    if not user:
        return jsonify({"error": "Invalid user"}), 401

    user_data = user.to_dict()
    admin_doc = admin_container.document(user.id)
    events_created = user_data['events_created']
    if event_name not in events_created:
        events_created.append(event_name)
        admin_doc.update({
            'events_created': events_created,
            'edit_time': datetime.utcnow().isoformat()
        })

    description = get_description(information)

    start_time = start_time.split('.')[0]
    calendar_start = start_time + '+00:00:00'
    end_time = end_time.split('.')[0]
    calendar_end = end_time + '+00:00:00'

    event_id = create_event_in_calendar(user_data['google_calendar_credentials'], user_data['email_address'],
                                        event_name, location, information, calendar_start, calendar_end)

    # event_id = str(uuid.uuid4())
    new_event = container.document(event_id)
    data = {
        'id': event_id,
        'name': event_name,
        'admin': admin,
        'users': [],
        'location': location,
        'ticket_price': ticket_price,
        'start_time': start_time,
        'end_time': end_time,
        'information': information,
        'description': description,
        'picture': picture,
        'genres': genres,
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
    admin_container = database.collection('admins')

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

    # get user list
    user_list = get_users_by_event_id(event_id, event_container)
    admin_data = next(admin_container.where(field_path='organisation', op_string='==', value=admin).stream(), None)
    admin_creds = admin_data.get('google_calendar_credentials')
    admin_email = admin_data.get('email_address')

    user_doc = user_container.document(user_id)
    user_interests = user_data.get('events_interested', [])
    user_interest = {'id': event_id,
                     'name': event['name']}
    if not any(interest['id'] == event_id for interest in user_interests):
        user_interests.append(user_interest)
        user_doc.update({
            'events_interested': user_interests,
            'edit_time': datetime.utcnow().isoformat()
        })

    if user_id not in user_list:
        user_list.append(user_id)
        event_container.document(event_id).update({'users': user_list})
        add_attendee_to_event(admin_creds, admin_email, event_id, user_data['email_address'])

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


def get_all_events(request, event_container):
    user_id = request.args.get('user_id')
    events = []
    for doc in event_container.stream():
        event = doc.to_dict()
        event['id'] = doc.id

        event['is_interested'] = user_id in event.get('users', [])

        events.append(event)

    return jsonify({
        "status": "success",
        "data": events
    }), 200
