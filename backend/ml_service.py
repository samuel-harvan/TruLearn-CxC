from sentence_transformers import CrossEncoder

# Lazy-loaded model — only initialized on first use to reduce startup memory
_nli_model = None

# Labels must match the order the model outputs scores
NLI_LABELS = ["contradiction", "entailment", "neutral"]


def _get_nli_model():
    global _nli_model
    if _nli_model is None:
        print("Loading depth evaluation model...")
        _nli_model = CrossEncoder("cross-encoder/nli-deberta-v3-base")
    return _nli_model


def evaluate_depth(student_answer: str, sample_answer: str) -> dict:
    """Evaluate the depth of understanding in a student's answer.

    Uses a fine-tuned NLI cross-encoder where the labels represent:
      - entailment:   Deep understanding — student explains reasoning, makes
                      connections, expands beyond a surface definition.
      - contradiction: Factually wrong — student's answer contradicts or
                      misrepresents the concept.
      - neutral:      Shallow/memorized — student recites a definition without
                      demonstrating genuine comprehension.

    Runs inference in both directions for a more robust signal:
      forward  (student → sample): does the student answer support the expected?
      backward (sample → student): does the expected answer support the student?
    """
    model = _get_nli_model()

    pairs = [
        (student_answer, sample_answer),  # forward: student → sample
        (sample_answer, student_answer),  # backward: sample → student
    ]
    all_scores = model.predict(pairs)

    forward_scores = all_scores[0]
    backward_scores = all_scores[1]

    forward_label = NLI_LABELS[forward_scores.argmax()]
    backward_label = NLI_LABELS[backward_scores.argmax()]

    forward_dict = {label: round(float(s), 4) for label, s in zip(NLI_LABELS, forward_scores)}
    backward_dict = {label: round(float(s), 4) for label, s in zip(NLI_LABELS, backward_scores)}

    # Combined label: contradiction wins if either direction shows it.
    # Entailment requires both directions to agree.
    # Otherwise treat as neutral (shallow).
    if forward_label == "contradiction" or backward_label == "contradiction":
        combined_label = "contradiction"
    elif forward_label == "entailment" and backward_label == "entailment":
        combined_label = "entailment"
    else:
        combined_label = "neutral"

    # Depth score: average entailment probability across both directions
    depth_score = round(
        (float(forward_scores[1]) + float(backward_scores[1])) / 2, 4
    )

    return {
        "label": combined_label,
        "depth_score": depth_score,
        "scores": {
            "forward": forward_dict,
            "backward": backward_dict,
        },
    }
