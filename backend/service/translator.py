from flask import jsonify
from dotenv import load_dotenv
from google.cloud import translate_v2 as translate
import logging
import os

load_dotenv()
translate_client = translate.Client()

# Enable logging for debugging
logging.basicConfig(level=logging.DEBUG)

def translate_texts(texts, target_language):
    if not texts or not target_language:
        logging.error("Invalid inputs: texts or target_language missing.")
        return {"error": "Invalid inputs. Provide texts and target language."}, 400

    try:
        # Handle both single string and list of strings
        if isinstance(texts, str):
            texts = [texts]

        logging.debug(f"Texts to translate: {texts}")
        logging.debug(f"Target language: {target_language}")

        translations = []
        for text in texts:
            logging.debug(f"Translating text: {text}")
            translation = translate_client.translate(text, target_language=target_language)
            translations.append(translation['translatedText'])

        logging.debug(f"Translated texts: {translations}")
        return {"translated_texts": translations}, 200

    except Exception as e:
        logging.error(f"Translation error: {str(e)}")
        return {"error": str(e)}, 500

SUPPORTED_LANGUAGES = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'zh': 'Chinese',
    'ar': 'Arabic'
}
