from flask import jsonify
from service.event import get_event_by_event_id
from service.event import get_event_ids_by_user_id


def generate_notifications(request, container):
    request_json = request.get_json()
    user_id = request_json.get("id")
    if not user_id:
        return jsonify({"status": "error", "message": "User id is required!"}), 400

    # Get event IDs for this user
    event_ids = get_event_ids_by_user_id(user_id, container)
    if not event_ids:
        return jsonify({"status": "success", "events": []}), 200

    # Generate a notification for each event
    events = []
    for event_id in event_ids:
        event_notification = generate_notification(event_id, container)
        # If generate_notification returns None or something unexpected, handle it
        if not event_notification:
            continue
        events.append(event_notification)

    return jsonify({"status": "success", "events": events}), 200


def generate_notification(user_id, event_id, container):
    # get_event_by_event_id should return a dict or None
    event_data = get_event_by_event_id(event_id, container)
    if not event_data:
        # Could raise an exception or return None to indicate "not found"
        raise ValueError(f"No event found for ID: {event_id}")

    admin = event_data.get("admin")
    description = event_data.get("information")
    picture = event_data.get("picture")

    return {
        "id": user_id,
        "name": admin,
        "image": picture,
        "notification": description
    }
