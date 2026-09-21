# 1. Frozen experiment

AI assistant: Authorized configured local AI agent
Exact model name: gpt-5.6-terra
Language: Python

# 2. Prompt A

Write Python code to analyze student marks.

Result:
LOAD ERROR: AttributeError: module 'submission' has no attribute 'analyze_marks'
Totals: 0 PASS · 0 FAIL · 6 ERROR

# 3. Prompt B

You are a Python developer. Implement analyze_marks(marks, pass_mark=50).
Return average, highest, lowest, and pass_rate in a dictionary. Accept marks
from 0 to 100; raise ValueError for an empty list, non-numeric values, or
out-of-range values. Use no external libraries. Return code plus a short
explanation.

Result
========================================================================
analyze_marks harness — code/prompt_b.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.66666666666666
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks cannot be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: all marks must be numeric
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: marks must be between 0 and 100
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_b.py)
========================================================================

# 4. Prompt C

You are a Python developer. Implement analyze_marks(marks, pass_mark=50).
Return average, highest, lowest, and pass_rate in a dictionary. Accept marks
from 0 to 100; raise ValueError for an empty list, non-numeric values, or
out-of-range values. Use no external libraries. Return code plus a short
explanation.
Example: analyze_marks([40, 60, 80], 50) -> average 60, highest 80,
lowest 40, pass_rate 66.67. Include tests for: one mark, decimals, custom
pass_mark, empty list, text value, and marks below 0 or above 100. State any
remaining assumptions before the code.

Result:
ERROR: code\prompt_c.py could not be imported: SyntaxError: invalid syntax (prompt_c.py, line 1)
The file must define analyze_marks and must not crash on import.

# 5. Prompt D

You are a Python developer. Implement analyze_marks(marks, pass_mark=50) using only the Python standard library. Return a dictionary with exactly these keys: average, highest, lowest, and pass_rate. marks must be a non-empty list of numeric student marks, each inclusive from 0 to 100. Raise ValueError deliberately for an empty list, any non-numeric value, any boolean value, or any out-of-range mark. Treat integers and finite floating-point values as numeric; reject non-finite numeric values with `ValueError`. Validate the container and emptiness first, then validate pass_mark, then validate every mark's type and range before calculating results. pass_mark must be a non-boolean finite number; it may be outside 0–100 and a mark passes when mark >= pass_mark. Compute average normally, return highest and lowest values, and calculate pass_rate as 100 times the count of passing marks divided by the number of marks, rounded to two decimal places. Do not mutate the input. Return only runnable Python code with no Markdown fences, prose, tests, or external-library imports.

Result:
========================================================================
analyze_marks harness — code/prompt_d.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks must be a non-empty list
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: each mark must be numeric
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: marks must be between 0 and 100
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_d.py)
========================================================================

# 7. Scores

| Prompt | Correctness /4 | Requirement coverage /3 | Verifiability /1 | Assumptions stated /1 | Noise /1 | Total /10 |
|---|---|---|---:|---|---|--|
| A | 0 | 1 | 0 | 0 | 1 | 2 |
| B | 4 | 3 | 1 | 0 | 1 | 9 |
| C | 0 | 3 | 0 | 1 | 0 | 4 |
| D | 4 | 3 | 1 | 1 | 1 | 10 |

# 8. Conclusion

The experiment showed that detail alone did not guarantee a good submission - output-format control matters more. Prompt A was too underspecified: its file defines analyze_student_marks rather than the required analyze_marks(), so the harness reported a load `AttributeError` and all six cases were ERROR. Prompt B specified the signature, keys, validation, and pass condition well enough to pass every case. Prompt C contained stronger requirements, assumptions, and test examples, but its raw response began with plaintext and included Markdown formatting. I left raw output unedited, case 1 never ran: loading produced `SyntaxError: invalid syntax`, yielding ERROR for all six cases. Prompt D resolved that ambiguity by explicitly requesting runnable code only, no prose or extra formatting -> passed all six cases. Therefore Prompt D constrained both behavior and delivery format, resulting in the best score across all prompts
