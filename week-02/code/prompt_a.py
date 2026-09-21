def analyze_student_marks(marks):
    if not marks:
        return None
    return {
        "average": sum(marks) / len(marks),
        "highest": max(marks),
        "lowest": min(marks),
    }
