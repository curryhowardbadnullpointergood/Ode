import os
from datetime import datetime
from flask import jsonify, session, redirect
import uuid
import hashlib

from google_auth_oauthlib.flow import InstalledAppFlow
from service.calendar import verify_user_email, get_authorisation_from_user, get_authorisation_from_admin, get_service

from service.calendar import USER_SCOPES, ADMIN_SCOPES


def register_user(request, container):
    """
    GAE registration function for user registration
    """
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    request_json = request.get_json()
    username = request_json.get("username")
    password = request_json.get("password")
    confirmed_password = request_json.get("confirmed_password")
    email = request_json.get("email_address")

    if password != confirmed_password:
        return jsonify({"error": "Passwords do not match"}), 202

    if not username or not password or not email:
        return jsonify({"error": "Username, password and email address are required"}), 202

    user_list = container.where(field_path='username', op_string='==', value=username).stream()
    if any(user.id for user in user_list):
        return jsonify({"error": "Username already exists"}), 202

    import base64
    import json

    state_data = {
        "type": "user",
        "data": request_json
    }

    state = base64.urlsafe_b64encode(
        json.dumps(state_data).encode()
    ).decode()

    endpoint = os.environ.get('BACKEND_ENDPOINT')
    redirect_uri = endpoint + '/oauth2callback'

    flow = InstalledAppFlow.from_client_secrets_file(
        os.environ.get("GOOGLE_OAUTH_CREDENTIALS"),
        USER_SCOPES,
        redirect_uri=redirect_uri,
    )

    auth_url, _ = flow.authorization_url(
        access_type='offline',
        state=state
    )
    print(f'Authorization URL: {auth_url}')

    return jsonify({'auth_url': auth_url}), 200


def register_admin(request, container):
    """
    GAE registration function for admin registration
    """
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    request_json = request.get_json()
    organisation = request_json.get("organisation")
    password = request_json.get("password")
    confirmed_password = request_json.get("confirmed_password")
    email = request_json.get("email_address")

    if password != confirmed_password:
        return jsonify({"error": "Passwords do not match"}), 202

    if not organisation or not password or not email:
        return jsonify({"error": "Username, password and email address are required"}), 202

    user_list = container.where(field_path='organisation', op_string='==', value=organisation).stream()
    if any(user.id for user in user_list):
        return jsonify({"error": "Organisation is already registered"}), 202

    import base64
    import json

    state_data = {
        "type": "admin",
        "data": request_json
    }

    state = base64.urlsafe_b64encode(
        json.dumps(state_data).encode()
    ).decode()

    endpoint = os.environ.get('BACKEND_ENDPOINT')
    redirect_uri = endpoint + '/oauth2callback'

    flow = InstalledAppFlow.from_client_secrets_file(
        os.environ.get("GOOGLE_OAUTH_CREDENTIALS"),
        ADMIN_SCOPES,
        redirect_uri=redirect_uri,
    )

    auth_url, _ = flow.authorization_url(
        access_type='offline',
        state=state
    )
    print(f'Authorization URL: {auth_url}')
    return jsonify({'auth_url': auth_url}), 200


def register_user_callback(request, container, data):
    """
    GAE registration function on callback for user registration
    """
    print("Registering user callback")

    endpoint = os.environ.get('BACKEND_ENDPOINT')
    redirect_uri = endpoint + '/oauth2callback'

    flow = InstalledAppFlow.from_client_secrets_file(
        os.environ.get("GOOGLE_OAUTH_CREDENTIALS"),
        USER_SCOPES,
        redirect_uri=redirect_uri
    )
    flow.fetch_token(authorization_response=request.url)
    creds = flow.credentials

    if 'error' in request.args:
        return jsonify({"error": "Email permission is required. Please authorize access to your email by checking the box."}), 202

    if 'https://www.googleapis.com/auth/calendar.readonly' not in creds.scopes:
        return jsonify({"error": "Calendar permission is required"}), 202

    username = data.get("username")
    password = data.get("password")
    email = data.get("email_address")

    user_id = str(uuid.uuid4())
    new_user = container.document(user_id)
    hash_password = hashlib.sha256(password.encode()).hexdigest()
    time = datetime.utcnow().isoformat()

    flag = verify_user_email(email, creds)
    if not flag:
        return jsonify({"error": "Email address does not match the authorized Google account."}), 202

    new_user.set({
        'username': username,
        'password': hash_password,
        'email_address': email,
        'bio': "",
        'name': "",
        'friends': [],
        'profile_picture': "",
        'interests': [],
        'events_interested': [],
        'google_calendar_credentials': creds.to_json(),  # creds.to_json()
        'created_time': time,
        'edit_time': time
    })

    response = {
        "status": "success",
        "message": "User registered successfully",
        "data": {"user_id": user_id, "create_time": time, "edit_time": time}
    }
    print(response)
    return jsonify(response), 201


def register_admin_callback(request, container, data):
    """
    GAE registration function on callback for admin registration
    """
    print("Registering organiser callback")
    endpoint = os.environ.get('BACKEND_ENDPOINT')
    redirect_uri = endpoint + '/oauth2callback'
    flow = InstalledAppFlow.from_client_secrets_file(
        os.environ.get("GOOGLE_OAUTH_CREDENTIALS"),
        ADMIN_SCOPES,
        redirect_uri=redirect_uri
    )
    flow.fetch_token(authorization_response=request.url)
    creds = flow.credentials

    if 'error' in request.args:
        return jsonify({"error": "Email permission is required. Please authorize access to your email by checking the box."}), 202

    if 'https://www.googleapis.com/auth/calendar' not in creds.scopes:
        return jsonify({"error": "Calendar permission is required"}), 202

    organisation = data.get("organisation")
    password = data.get("password")
    email = data.get("email_address")

    admin_id = str(uuid.uuid4())
    new_admin = container.document(admin_id)
    hash_password = hashlib.sha256(password.encode()).hexdigest()
    time = datetime.utcnow().isoformat()

    flag = verify_user_email(email, creds)
    if not flag:
        return jsonify({"error": "Email address does not match the authorized Google account."}), 202

    new_admin.set({
        'organisation': organisation,
        'password': hash_password,
        'email_address': email,
        'bio': "",
        'name': "",
        'profile_picture': "",
        'events_created': [],
        'google_calendar_credentials': creds.to_json(),  # creds.to_json()
        'created_time': time,
        'edit_time': time
    })

    response = {
        "status": "success",
        "message": "Admin registered successfully",
        "data": {"user_id": admin_id, "create_time": time, "edit_time": time}
    }
    return jsonify(response), 201
