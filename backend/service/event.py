from flask import jsonify
import uuid



def create_event(request, container, user_container):
    request_json = request.get_json()
    admin = request_json.get('admin')
    users = request_json.get('users')
    information = request_json.get('information')
    picture = request_json.get('picture')
    genres = request_json.get('genres', [])

    user_list = user_container.where(field_path='username', op_string='==', value=admin).stream()
    user = next(user_list, None)
    if not user:
        return jsonify({"error": "Invalid user"}), 401

    event_id = str(uuid.uuid4())
    new_event = container.document(event_id)
    data = {
        'id': event_id,
        'admin': admin,
        'users': users,
        'information': information,
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


def report_user(request, database):
    request_json = request.get_json()
    username = request_json.get('username')
    users = request_json.get('list')
    container = database.collection('users')

    user_list = container.where(field_path='username', op_string='==', value=username).stream()
    user = next(user_list, None)
    if not user:
        return jsonify({"error": "Invalid user"}), 401

    container_name = f'{username}_report'
    report_container = database.collection(container_name)

    for user in users:
        new_users = list(report_container.where(field_path='username', op_string='==', value=user).stream())
        print(new_users)
        if new_users:
            break
        report_id = str(uuid.uuid4())
        new_report_user = report_container.document(report_id)
        new_report_user.set({'username': user})

    response = {
        "status": "success",
        "message": "Users are reported successfully",
        "data": {}
    }

    return jsonify(response), 200


def block_user(request, database):
    request_json = request.get_json()
    username = request_json.get('username')
    users = request_json.get('list')
    container = database.collection('users')

    user_list = container.where(field_path='username', op_string='==', value=username).stream()
    user = next(user_list, None)
    if not user:
        return jsonify({"error": "Invalid user"}), 401

    container_name = f'{username}_block'
    block_container = database.collection(container_name)

    for user in users:
        new_users = list(block_container.where(field_path='username', op_string='==', value=user).stream())
        if new_users:
            continue
        report_id = str(uuid.uuid4())
        new_block_user = block_container.document(report_id)
        new_block_user.set({'username': user})

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

    event_list = container.where(field_path='id', op_string='==', value=event_id).stream()
    event = next(event_list, None)

    if not event:
        return jsonify({"error": "No event found"}), 404
    event_data = event.to_dict()

    response = {
        "status": "success",
        "message": "Event data retrieved successfully",
        "data": event_data
    }

    return jsonify(response), 200


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
