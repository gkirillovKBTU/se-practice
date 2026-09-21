from numbers import Real


def analyze_marks(marks, pass_mark=50):
    if not isinstance(marks, list) or len(marks) == 0:
        raise ValueError("marks must be a non-empty list")

    if isinstance(pass_mark, bool) or not isinstance(pass_mark, Real):
        raise ValueError("pass_mark must be numeric")

    validated_marks = []
    for mark in marks:
        if isinstance(mark, bool) or not isinstance(mark, Real):
            raise ValueError("each mark must be numeric")
        if mark < 0 or mark > 100:
            raise ValueError("marks must be between 0 and 100")
        validated_marks.append(mark)

    return {
        "average": sum(validated_marks) / len(validated_marks),
        "highest": max(validated_marks),
        "lowest": min(validated_marks),
        "pass_rate": round(
            sum(mark >= pass_mark for mark in validated_marks)
            / len(validated_marks)
            * 100,
            2,
        ),
    }
