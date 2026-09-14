package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	input := strings.Join(os.Args[1:], " ")
	fmt.Print(report(input))
}

func report(input string) string {
	marks := validMarks(input)
	if len(marks) == 0 {
		return "No valid marks found.\n"
	}

	sum := 0
	highest, lowest := marks[0], marks[0]
	passing := 0
	for _, mark := range marks {
		sum += mark
		if mark > highest {
			highest = mark
		}
		if mark < lowest {
			lowest = mark
		}
		if mark >= 50 {
			passing++
		}
	}

	average := float64(sum) / float64(len(marks))
	passRate := float64(passing) / float64(len(marks)) * 100

	return fmt.Sprintf("number of valid marks: %d\nAverage: %.2f\nHighest mark: %d\nLowest: %d\nPass rate: %.1f%%\n",
		len(marks), average, highest, lowest, passRate)
}

func validMarks(input string) []int {
	var marks []int
	for _, token := range strings.Split(input, ",") {
		token = strings.TrimSpace(token)
		mark, err := strconv.Atoi(token)
		if err != nil || mark < 0 || mark > 100 {
			continue
		}
		marks = append(marks, mark)
	}
	return marks
}
