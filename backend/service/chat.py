from flask import jsonify
import uuid
from datetime import datetime


def store_message(request, messages_container):
    data = request.get_json()
    sender = data.get("sender")
    receiver = data.get("receiver")
    message = data.get("message")
    return store_single_receiver(sender, receiver, message, messages_container)


def store_messages(request, messages_container):
    data = request.get_json()
    sender = data.get("sender")
    receivers = data.get("receivers")
    message = data.get("message")

    for receiver in receivers:
        store_single_receiver(sender, receiver, message, messages_container)


def store_single_receiver(sender, receiver, message, messages_container):
    if not sender or not receiver or not message:
        return jsonify({"error": "Missing sender, receiver, or message"}), 400

    message_id = str(uuid.uuid4())
    message_data = {
        "id": message_id,
        "sender": sender,
        "receiver": receiver,
        "message": message,
        "timestamp": datetime.utcnow()
    }

    messages_container.document(message_id).set(message_data)
    response = {
        "status": "success",
        "message": "Message stored successfully"
    }
    return jsonify(response), 200
