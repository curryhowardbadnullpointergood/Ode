from flask import jsonify
import uuid
from firebase_admin import firestore
import datetime

def send_friend_request(request, container):
    try:
        request_json = request.get_json()
        request_sender = request_json.get("request_sender")
        request_receiver = request_json.get("request_receiver")

        if not request_sender or not request_receiver:
            return jsonify({"error": "Both sender and receiver required"}), 400

        existing_requests = container.collection('friend_requests').where(
            "request_sender", "==", request_sender
        ).where(
            "request_receiver", "==", request_receiver
        ).where(
            "status", "==", "pending"
        ).get()

        if len(list(existing_requests)) > 0:
            return jsonify({"error": "Friend request already exists"}), 409

        friend_request = {
            "id": str(uuid.uuid4()),
            "request_sender": request_sender,
            "request_receiver": request_receiver,
            "status": "pending",
            "timestamp": firestore.SERVER_TIMESTAMP
        }

        return jsonify({
            "success": True,
            "request": {
                "id": friend_request["id"],
                "request_sender": friend_request["request_sender"],
                "request_receiver": friend_request["request_receiver"],
                "status": friend_request["status"],
                "created_at": friend_request["created_at"]
            }
        }), 201

        container.collection('friend_requests').document(friend_request["id"]).set(friend_request)
        return jsonify({"success": True, "request": friend_request}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def receive_friend_request(request, container):
    try:
        request_json = request.get_json()
        request_id = request_json.get('id')
        action = request_json.get('action')

        if not request_id or action not in ['accept', 'reject']:
            return jsonify({"error": "Request ID and valid action required"}), 400

        request_ref = container.collection('friend_requests').document(request_id)
        friend_request = request_ref.get()

        if not friend_request.exists:
            return jsonify({"error": "Friend request not found"}), 404

        friend_request_data = friend_request.to_dict()
        friend_request_data['status'] = 'accepted' if action == 'accept' else 'rejected'
        friend_request_data['updated_at'] = datetime.datetime.now().isoformat()

        request_ref.update({
            'status': friend_request_data['status'],
            'updated_at': friend_request_data['updated_at']
        })

        if action == 'accept':
            add_friend(
                friend_request_data['request_sender'],
                friend_request_data['request_receiver'],
                container
            )

        return jsonify({
            "success": True,
            "request": friend_request_data
        }), 200
    except Exception as e:
        print(f"Error in receive_friend_request: {str(e)}")
        return jsonify({"error": str(e)}), 500

def add_friend(request_sender, request_receiver, container):
    try:
        sender_ref = container.collection('users').document(request_sender)
        sender_ref.update({
            'friends': firestore.ArrayUnion([request_receiver])
        })

        receiver_ref = container.collection('users').document(request_receiver)
        receiver_ref.update({
            'friends': firestore.ArrayUnion([request_sender])
        })
    except Exception as e:
        print(f"Error in add_friend: {str(e)}")
        raise e


def view_friend_requests(request, container):
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        incoming_requests = container.collection('friend_requests').where(
            "request_receiver", "==", user_id
        ).where(
            "status", "==", "pending"
        ).get()

        outgoing_requests = container.collection('friend_requests').where(
            "request_sender", "==", user_id
        ).where(
            "status", "==", "pending"
        ).get()

        return jsonify({
            "incoming_requests": [doc.to_dict() for doc in incoming_requests],
            "outgoing_requests": [doc.to_dict() for doc in outgoing_requests]
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500