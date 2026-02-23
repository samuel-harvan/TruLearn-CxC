import os
import uuid
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

from gemini_service import (
    summarize_pdf,
    generate_questions,
    generate_variation_question
)
from ml_service import evaluate_depth

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Enable CORS for frontend
CORS(app, resources={
    r"/api/*": {
        "origins": [o for o in [
            "http://localhost:5173",
            "http://localhost:3000",
            "https://trulearn-cxc.vercel.app",
            os.environ.get("FRONTEND_URL"),
        ] if o],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
}, supports_credentials=True)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
ALLOWED_EXTENSIONS = {"pdf"}

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 20 * 1024 * 1024  # 20 MB

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

#in memory storage (database might be added later) 
pdf_storage = {}
question_storage = {}


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/", methods=["GET"])
def index():
    """API welcome page"""
    return jsonify({
        "message": "🎓 Welcome to TruLearn API",
        "tagline": "Think Smarter, Learn Harder",
        "endpoints": {
            "health": "/api/health",
            "upload_pdf": "/api/upload-reference",
            "generate_questions": "/api/questions/generate",
            "generate_variation": "/api/questions/variation"
        }
    })

# for testing purposes
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "ok",
        "service": "TruLearn API (Flask)",
        "gemini": "✅"
    })


@app.route("/api/upload-reference", methods=["POST"])
def upload_pdf():
    """Upload PDF, extract text, identify concept."""
    
    if "pdf" not in request.files:
        return jsonify({"error": "No file uploaded. Use 'pdf' as the field name."}), 400

    file = request.files["pdf"]
    
    if file.filename == "":
        return jsonify({"error": "No file selected."}), 400

    if not allowed_file(str(file.filename)):
        return jsonify({"error": "Only PDF files are allowed."}), 400

    filename = secure_filename(str(file.filename))
    unique_name = f"{uuid.uuid4().hex}_{filename}"
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], unique_name)
    
    try:
        file.save(filepath)

        print(f"\n📄 Processing PDF: {filename}")
        print(f"📍 File saved to: {filepath}")

        # Summarize PDF and extract concept with Gemini call
        print("🔄 Calling summarize_pdf...")
        result = summarize_pdf(filepath)
        summary = result["summary"]
        concept = result["concept"]
        print(f"✅ Generated summary ({len(summary)} chars)")
        print(f"✅ Identified concept: {concept}")

        # Store for later use
        pdf_storage[filename] = {
            'summary': summary,
            'concept': concept,
            'uploaded_at': time.time()
        }

        return jsonify({
            "text": summary[:1000],
            "concept": concept,
            "filename": filename,
            "full_summary_length": len(summary)
        })

    except Exception as e:
        import traceback
        print(f"❌ Error processing PDF: {e}")
        print(f"🔍 Full traceback:")
        traceback.print_exc()
        return jsonify({"error": f"Error processing PDF: {str(e)}"}), 500
        
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)


@app.route("/api/questions/generate", methods=["POST"])
def generate_quiz_questions():
    """
    Generate 10 questions with intelligent distribution.
    Analyzes PDF content to determine optimal MC vs open-ended split.
    """
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400
    
    concept = data.get("concept")
    reference_text = data.get("reference_text")
    filename = data.get("filename")  # To retrieve stored summary
    difficulty = data.get("difficulty", "medium")  # Extract difficulty, default to medium

    # Validate difficulty parameter
    if difficulty not in ["easy", "medium", "hard"]:
        difficulty = "medium"

    if not concept:
        return jsonify({"error": "Concept is required"}), 400

    try:
        print(f"\n🤖 Generating questions for concept: {concept}")
        print(f"🎯 Difficulty level: {difficulty.upper()}")
        start_time = time.time()

        # Prefer full stored summary over truncated reference_text
        if filename and filename in pdf_storage:
            summary = pdf_storage[filename]['summary']
        elif reference_text:
            summary = reference_text
        else:
            summary = f"Generate questions about the concept: {concept}"

        # Generate questions with smart distribution and specified difficulty
        questions = generate_questions(summary, concept, difficulty)
        
        # Store questions for later variation generation
        question_storage[concept] = {
            'questions': questions,
            'summary': summary,
            'generated_at': time.time()
        }
        
        generation_time = time.time() - start_time
        print(f"✅ Generated {len(questions)} questions in {generation_time:.2f}s")
        
        return jsonify({
            "questions": questions,
            "generation_time": generation_time,
            "model_used": "gemini-2.5-flash"
        })
        
    except Exception as e:
        print(f"❌ Error generating questions: {e}")
        return jsonify({"error": f"Error generating questions: {str(e)}"}), 500


@app.route("/api/questions/variation", methods=["POST"])
def generate_question_variation():
    """
    Generate a variation of a question when student needs more practice.
    Used when detection score indicates insufficient understanding.
    """
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400
    
    original_question = data.get("original_question")
    previous_answer = data.get("previous_answer")
    concept = data.get("concept")
    
    if not all([original_question, previous_answer, concept]):
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        print(f"\n🔄 Generating variation for question {original_question.get('id')}")
        
        # Get stored summary
        summary = ""
        if concept in question_storage:
            summary = question_storage[concept]['summary']
        
        # Generate variation
        variation = generate_variation_question(
            original_question,
            previous_answer,
            summary
        )
        
        print(f"✅ Generated variation question")
        
        return jsonify({
            "question": variation,
            "is_variation": True
        })
        
    except Exception as e:
        print(f"❌ Error generating variation: {e}")
        return jsonify({"error": f"Error generating variation: {str(e)}"}), 500


@app.route("/api/answers", methods=["POST"])
def submit_answer():
    """Submit student answer"""
    data = request.get_json()
    
    return jsonify({
        "answer_id": int(time.time() * 1000),
        "status": "submitted",
        "message": "Answer submitted successfully"
    })


@app.route("/api/answers/<int:answer_id>/detect", methods=["POST"])
def run_detection(answer_id):
    """
    Evaluate the depth of understanding in a student's open-ended answer.
    Uses a fine-tuned NLI cross-encoder (nli-deberta-v3-base) where:
      - comprehension   → deep understanding (explains why, makes connections)
      - neutral      → shallow/memorized (recites a definition, no elaboration)
      - contradiction → factually incorrect
    """
    data = request.get_json()

    if not data:
        return jsonify({"error": "No JSON data provided"}), 400

    answer_text = data.get("answer_text", "")
    sample_answer = data.get("sample_answer", "")
    correct_answer = data.get("correct_answer", "")
    question_type = data.get("question_type", "")

    if not answer_text:
        return jsonify({"error": "answer_text is required"}), 400

    try:
        if question_type == "multiple_choice" and correct_answer:
            # MCQ: simple letter comparison, no depth evaluation needed
            is_correct = answer_text.strip().upper() == correct_answer.strip().upper()
            depth_result = {
                "label": "comprehension" if is_correct else "contradiction",
                "depth_score": 1.0 if is_correct else 0.0,
                "scores": {},
            }
        else:
            # Open-ended: evaluate depth of understanding with NLI model
            depth_result = evaluate_depth(answer_text, sample_answer) if sample_answer else {
                "label": "neutral",
                "depth_score": 0.0,
                "scores": {},
            }

        nli_label = depth_result["label"]
        depth_score = depth_result["depth_score"]

        # Map NLI label → detection type
        # comprehension   = deep understanding (student explains reasoning, not just a definition)
        # neutral      = shallow (correct but memorized recitation with no depth)
        # contradiction = factually wrong
        if nli_label == "comprehension":
            detection_type = "deep"
            needs_practice = False
        elif nli_label == "contradiction":
            detection_type = "incorrect"
            needs_practice = True
        else:
            detection_type = "shallow"
            needs_practice = True

        reason_map = {
            "deep": "Strong understanding — answer demonstrates reasoning and depth beyond a surface definition.",
            "shallow": "Surface-level answer — correct but reads like a memorized definition. Try explaining the 'why' behind the concept.",
            "incorrect": "Answer contains factual errors or contradicts the expected response.",
        }

        return jsonify({
            "id": int(time.time() * 1000),
            "answer_id": answer_id,
            "detection_type": detection_type,
            "needs_more_practice": needs_practice,
            "depth_score": depth_score,
            "depth_evaluation": depth_result,
            "evidence": {
                "depth_score": depth_score,
                "response_time": data.get("response_time_seconds", 45),
                "reason": reason_map.get(detection_type, "Unable to classify response"),
            },
            "detected_at": time.strftime('%Y-%m-%dT%H:%M:%SZ')
        })

    except Exception as e:
        print(f"Error in detection: {e}")
        return jsonify({"error": f"Error running detection: {str(e)}"}), 500


if __name__ == "__main__":
    print("\n" + "="*60)
    print("🚀 Starting TruLearn API Server (Flask)")
    print("="*60)
    print("📍 Running on: http://localhost:5001")
    print("📖 Features:")
    print("   • Smart question distribution (analyzes content)")
    print("   • Question variations for practice")
    print("   • Memorization detection")
    print("="*60 + "\n")

    app.run(debug=True, port=5001, host="0.0.0.0")