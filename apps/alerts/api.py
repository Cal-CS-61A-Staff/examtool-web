from os import getenv
from typing import TYPE_CHECKING

import requests
from flask import abort

if TYPE_CHECKING:
    from google.cloud import firestore


def get_email_from_secret(secret):
    ret = requests.get("https://okpy.org/api/v3/user/", params={"access_token": secret})
    if ret.status_code != 200:
        abort(401)
    return ret.json()["data"]["email"]


def is_admin(email, course):
    if getenv("ENV") == "dev":
        return True
    return requests.post(
        "https://auth.apps.cs61a.org/admins/is_admin",
        json={
            "client_name": getenv("AUTH_CLIENT_NAME"),
            "secret": getenv("AUTH_CLIENT_SECRET"),
            "email": email,
            "course": course,
        },
    ).json()


def process_ok_exam_upload(db: firestore.Client, data, secret):
    """
    data: {
        "exam_name": string,
        "students": [
            {
                "email": string,
                "questions": [
                    {
                        "student_question_name": string,
                        "canonical_question_name": string,
                        "student_question_text": string,
                    }
                ],
                "start_time": int,
                "end_time": int,
            }
        ]
        "questions": [
            {
                "question_name": string,
                "canonical_question_text": string,
            }
        ],
    }
    """
    course = data["exam_name"].split("-")[0]
    email = get_email_from_secret(secret)
    if not is_admin(email, course):
        abort(403)
    db.collection("exams").document(data["exam_name"]).set(data["questions"])
    ref = db.collection("roster").document(data["exam-name"]).collection("students")
    batch = db.batch()
    cnt = 0
    for document in ref.stream():
        batch.delete(document.reference)
        cnt += 1
        if cnt > 400:
            batch.commit()
            batch = db.batch()
            cnt = 0
    batch.commit()

    batch = db.batch()
    cnt = 0
    for student in data["students"]:
        doc_ref = ref.document(student["email"])
        batch.set(doc_ref, student)
        cnt += 1
        if cnt > 400:
            batch.commit()
            batch = db.batch()
            cnt = 0
    batch.commit()
