"""Analyze marks and return the requested statistics."""

def analyze_marks(marks, pass_mark=50):
    if not marks:
        raise ValueError("marks cannot be empty")
    if any(not isinstance(mark, (int, float)) for mark in marks):
        raise ValueError("all marks must be numeric")
    if any(mark < 0 or mark > 100 for mark in marks):
        raise ValueError("marks must be between 0 and 100")

    return {
        "average": sum(marks) / len(marks),
        "highest": max(marks),
        "lowest": min(marks),
        "pass_rate": sum(mark >= pass_mark for mark in marks) / len(marks) * 100,
    }
