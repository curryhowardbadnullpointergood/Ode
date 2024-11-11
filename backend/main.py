from flask import Flask, jsonify, request
from firebase_admin import firestore, credentials
import os
from dotenv import load_dotenv
import firebase_admin
from service.register import register_user
from service.edit import edit_user

app = Flask(__name__)
load_dotenv()
cred = credentials.Certificate(os.environ.get('GOOGLE_APPLICATION_CREDENTIALS'))
firebase_admin.initialize_app(cred)
database = firestore.client()
users_container = database.collection('users')


@app.route('/user/<path:subpath>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def user_register(subpath):
    method = request.method
    # Call different functions based on the path
    if subpath == "register" and method == 'POST':
        return register_user(request, users_container)
    elif subpath == "login":
        return
    elif subpath == "edit" and method == 'PUT':
        return edit_user(request, users_container)
    else:
        return jsonify({"error": f"Unknown action: {subpath}"}), 404


# use python3 main.py
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
