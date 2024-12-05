import uuid
from flask import jsonify


def store_image(request, bucket):
    request_json = request.get_json()
    file_path = request_json.get('file_path')
    destination_blob_name = f'{str(uuid.uuid4())}.jpg'

    """Uploads a file to Firebase Storage and returns its public URL."""

    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(file_path)

    blob.make_public()

    response = {
        'status': 'success',
        'public_url': blob.public_url
    }

    return jsonify(response), 200

