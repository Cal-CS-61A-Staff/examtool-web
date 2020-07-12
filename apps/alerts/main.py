from os import getenv

from flask import jsonify
from google.cloud import firestore

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

    except:
        print(dict(request.json))
        return jsonify({"success": False})

    return request.path
