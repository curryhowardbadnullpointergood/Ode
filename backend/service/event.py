from flask import jsonify
import uuid


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

