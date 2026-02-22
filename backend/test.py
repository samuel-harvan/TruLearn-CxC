from ml_service import evaluate_depth

result = evaluate_depth(
    student_answer="Plants use sunlight to make food.",
    sample_answer="Photosynthesis converts sunlight, water, and CO2 into glucose and oxygen using chlorophyll."
)

print(result)
