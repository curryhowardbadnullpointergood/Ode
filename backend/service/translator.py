# from flask import jsonify
# from dotenv import load_dotenv
# load_dotenv() 
# from google.cloud import translate_v2 as translate

# translate_client = translate.Client()

# def translate_texts(texts, target_language):

#     if not texts or not target_language:
#         return {"error": "Invalid inputs. Provide texts and target language."}, 400

#     try:
#         translations = translate_client.translate(texts, target_language=target_language)
#         translated_texts = [t['translatedText'] for t in translations]
#         return {"translated_texts": translated_texts}, 200
#     except Exception as e:
#         return {"error": str(e)}, 500
