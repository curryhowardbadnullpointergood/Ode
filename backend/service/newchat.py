from flask import Flask, request, jsonify
import uuid
from datetime import datetime

def store_message(request, firestore):
    data = request.get_json()
    sender = data.get("sender")
    receiver = data.get("receiver")
    message = data.get("message")
    image = None
    group_id = None
    timestamp = datetime.utcnow()
    return store_single_receiver(sender, receiver, message, image, group_id, timestamp, firestore)

def store_messages(request, firestore):
    data = request.get_json()
    sender = data.get("sender")
    receivers = data.get("receivers")
    message = data.get("message")
    image = data.get("image")
    group_id = data.get("group_id")
    timestamp = datetime.utcnow()

    for receiver in receivers:
        store_single_receiver(sender, receiver, message, image, group_id, timestamp, firestore)

    response = {
        "status": "success",
        "message": "Message stored successfully"
    }
    return jsonify(response), 200


def store_images(request, firestore, bucket):
    file = request.files['file']
    sender = request.form['sender']
    receiver = request.form['receiver']
    message = None
    group_id = None
    timestamp = datetime.utcnow()


    filename = f"{uuid.uuid4()}.{file.filename.split('.')[-1]}"
    blob = bucket.blob(filename)
    blob.upload_from_file(file)
    blob.make_public()
    download_url = blob.public_url

    return store_single_receiver(sender, receiver, message, download_url, group_id, timestamp, firestore)
     
    
def store_single_receiver(sender, receiver, message, image, group_id, timestamp, firestore):
    
        db = firestore.client()
        chat_id = generate_chat_id(sender, receiver)

        chat_ref = db.collection("chats").document(chat_id)
        message_id = str(uuid.uuid4())
        message_data = {
            "id": message_id,
            "sender": sender,
            "receiver": receiver,
            "message": message,
            "image": image,
            "group_id": group_id,
            "timestamp": timestamp
        }

        if not chat_ref.get().exists:
            chat_ref.set({
                "messages": [],
            })

        chat_ref.update({
            "messages": firestore.ArrayUnion([message_data])
        })
    
        sender_chat_ref = db.collection("userChats").document(sender)
        sender_chat_ref.set({
            f"{chat_id}": {
                "lastMessage": {"message": message},
                "date": timestamp,
                "userInfo": {
                    "displayName": receiver,
                    "sender": sender
                },
                "image": image
            }
        }, merge=True)
     
        receiver_chat_ref = db.collection("userChats").document(receiver)
        receiver_chat_ref.set({
            f"{chat_id}": {
                "lastMessage": {"message": message},
                "date": timestamp,
                "userInfo": {
                    "displayName": sender,
                    "sender": sender
                },
                "image": image
            }
        }, merge=True)

        return jsonify({"status": "success", "message": "Message sent successfully!"}), 200

def generate_chat_id(uid1, uid2):
    return f"{uid1}_{uid2}" if uid1 > uid2 else f"{uid2}_{uid1}"

