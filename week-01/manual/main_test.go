package main

import "testing"

func TestRequiredCases(t *testing.T) {
	tests := []struct {
		name  string
		input string
		want  string
	}{
		{
			name:  "A",
			input: "85, 23, 45, 90, 92",
			want:  "Number of valid marks: 5\nAverage: 67.00\nHighest: 92\nLowest: 23 \nPass rate: 60.0%\n",
		},
		{
			name:  "B",
			input: "88, 47, -5, 101, abc, 73, 50, , 100",
			want:  "Number of valid marks: 5\nAverage: 71.60\nHighest: 100\nLowest: 47 \nPass rate: 80.0%\n",
		},
		{
			name:  "C",
			input: "10, 20, 30",
			want:  "Number of valid marks: 3\nAverage: 20.00\nHighest: 30 \nLowest: 10 \nPass rate: 0.0%\n",
		},
		{
			name:  "D",
			input: "abc, , xyz",
			want:  "No valid marks found.\n",
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if got := report(test.input); got != test.want {
				t.Fatalf("report(%q) = %q, want %q", test.input, got, test.want)
			}
		})
	}
}
