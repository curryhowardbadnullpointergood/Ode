from flask import jsonify
import uuid


def send_friend_request(request, container):
    request_json = request.get_json()
    request_sender = request.get_json("request_sender")
    request_receiver = request.get_json("request_receiver")

    if not request_sender or not request_receiver:
        return jsonify({"error": "Both sender and receiver required"}), 400


    query = "SELECT * FROM c WHERE c.request_sender=@request_sender AND c.request_receiver=@request_receiver AND c.status='pending'"
    existing_request = list(container.query_items(query, parameters=[
        {"name": "@request_sender", "value": request_sender},
        {"name": "@request_receiver", "value": request_receiver}
    ]))

    if existing_request:
        return jsonify({"error": "Friend request already exists"}), 409

    friend_request = {
        "id": str(uuid.uuid4()),
        "request_sender": request_sender,
        "request_receiver": request_receiver,
        "status": "pending"
    }

    container.create_item(friend_request)
    return jsonify({"success": True, "request": friend_request}), 201


def receive_friend_request(request, container):
    request_json = request.get_json()
    request_id = request_json.get('id')
    action = request_json.get('action')

    if not request_id or action not in ['accept', 'reject']:
        return jsonify({"error": "Request ID and valid action are required"}), 400

    friend_request = container.read_item(item=request_id, partition_key=request_id)

    if not friend_request:
        return jsonify({"error": "Friend request not found"}), 404

    friend_request['status'] = 'accepted' if action == 'accept' else 'rejected'
    container.replace_item(item=friend_request['id'], body=friend_request)

    return jsonify({"success": True, "request": friend_request}), 200

def add_friend(request_sender, request_receiver, container):
    request_sender_data = container.read_item(item=request_sender, partition_key=request_sender)
    if "friends" not in request_sender_data:
        request_sender_data["friends"] = []
    request_sender_data["friends"].append(request_receiver)
    container.replace_item(item=request_sender, body=request_receiver_data)

    request_receiver_data = container.read_item(item=request_receiver, partition_key=request_receiver)
    if "friends" not in request_receiver_data:
        request_receiver_data["friends"] = []
    request_receiver_data["friends"].append(request_sender)
    container.replace_item(item=request_receiver, body=request_receiver_data)


def view_friend_requests(request, container):
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    incoming_requests = list(container.query_items(
        query="SELECT * FROM c WHERE c.request_receiver=@user_id AND c.status='pending'",
        parameters=[{"name": "@user_id", "value": user_id}]
    ))

    outgoing_requests = list(container.query_items(
        query="SELECT * FROM c WHERE c.request_sender=@user_id AND c.status='pending'",
        parameters=[{"name": "@user_id", "value": user_id}]
    ))

    return jsonify({
        "incoming_requests": incoming_requests,
        "outgoing_requests": outgoing_requests
    }), 200
