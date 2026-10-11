def can_book(start, end, now, blocked, existing):
    if not 0 <= start < end <= 1440 or start <= now:
        return False
    if end - start > 120 or blocked:
        return False
    for existing_start, existing_end in existing:
        if start < existing_end and end > existing_start:
            return False
    return True
