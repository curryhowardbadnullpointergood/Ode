from flask import jsonify
import openai

openai.api_key = "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"
def generate_notification(request):

    request_json = request.get_json()

    event_description = request_json.get('description')

    if not event_description:
        return jsonify({"error": "Event description is required"}), 400

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo", 
            messages=[
                {"role": "user", "content": f"Generate a concise notification for the following event: {event_description}"}
            ]
        )

        notification = response['choices'][0]['message']['content']

        return jsonify({"status": "success", "notification": notification}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to generate notification: {str(e)}"}), 500
