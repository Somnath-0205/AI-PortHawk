from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
from scanner import scan_target
from assistant import ask_ai
from gemini_ai import ask_gemini
from flask import send_file
from report_generator import generate_report


app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def home():
    return {"meassage":"Backend connect successfully"}


@app.route("/scan", methods=["POST"])
def scan():
    data = request.get_json()
    target = data.get("target")
    print("Target Received :", target)
    def send_progress(data):
        socketio.emit("scan_progress", data)

    result = scan_target(target, progress_callback=send_progress)
    return jsonify(result)

@app.route("/assistant", methods=["POST"])
def assistant():

    data = request.get_json()

    question = data.get("question")

    scan_result = data.get("scan_result", [])

    threat_score = data.get("threat_score", 0)

    vulnerabilities = data.get("vulnerabilities", [])

    answer = ask_gemini(

        question,

        scan_result,

        threat_score,

        vulnerabilities

    )

    return jsonify({
        "answer": answer
    })

@app.route("/generate-report", methods=["POST"])
def report():

    data = request.get_json()

    filename = generate_report(data)

    return send_file(
        filename,
        as_attachment=True
    )

if __name__ == "__main__":
    socketio.run(app, debug=True)