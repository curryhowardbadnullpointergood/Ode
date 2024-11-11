from flask import Flask, jsonify, request
from service.register import register_user

app = Flask(__name__)


@app.route('/user/<path:subpath>', methods=['POST'])
def user_register(subpath):
    # Call different functions based on the path
    if subpath == "register":
        return register_user(request)
    elif subpath == "login":
        return
    else:
        return jsonify({"error": f"Unknown action: {subpath}"}), 404


# use python3 main.py
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
