from os import getenv

from flask import jsonify
from google.cloud import firestore
from google.cloud import texttospeech

# this can be public
CLIENT_ID = "713452892775-59gliacuhbfho8qvn4ctngtp3858fgf9.apps.googleusercontent.com"

DEV_EMAIL = getenv("DEV_EMAIL", "exam-test@berkeley.edu")


def update_cache():
    global main_html, main_js
    with open("static/index.html") as f:
        main_html = f.read()

    with open("static/main.js") as f:
        main_js = f.read()


update_cache()


def index(request):
    try:
        if getenv("ENV") == "dev":
            update_cache()

        db = firestore.Client()

        if request.path.endswith("main.js"):
            return main_js

        if request.path == "/":
            return main_html

        if request.path.endswith("demo_get_audio"):
            text = "Hello, world!"

            client = texttospeech.TextToSpeechClient()
            synthesis_input = texttospeech.SynthesisInput({"text": "Hello, World!"})
            voice = texttospeech.VoiceSelectionParams(
                {
                    "name": "en-US-Wavenet-B",
                    "language_code": "en-US",
                }
            )
            audio_config = texttospeech.AudioConfig(
                {"audio_encoding": texttospeech.AudioEncoding.MP3}
            )

            response = client.synthesize_speech(
                input=synthesis_input, voice=voice, audio_config=audio_config
            )

            return jsonify(
                {
                    "success": True,
                    "text": text,
                    "audio": response,
                }
            )

    except Exception as e:
        print(e)
        print(dict(request.json))
        return jsonify({"success": False})

    return request.path
