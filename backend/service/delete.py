from flask import jsonify


def delete_user(request, container):
    request_json = request.get_json()
    user_id = request_json.get('id')

    if not user_id:
        return jsonify({"error": "user id is required"}), 400

    user = container.document(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.delete()
    return jsonify({"success": True}), 200
