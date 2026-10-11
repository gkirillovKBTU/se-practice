import unittest
from booking import can_book


class BookingTests(unittest.TestCase):
    def test_touching_end_is_allowed(self):
        result = can_book(660, 720, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_overlap_is_rejected(self):
        self.assertIs(can_book(630, 690, 540, False, [(600, 660)]), False)

    def test_blocked_room_is_rejected(self):
        self.assertIs(can_book(660, 720, 540, True, [(600, 660)]), False)

    def test_exactly_two_hours_is_allowed(self):
        self.assertIs(can_book(720, 840, 540, False, [(600, 660)]), True)

    def test_over_two_hours_is_rejected(self):
        self.assertIs(can_book(720, 841, 540, False, [(600, 660)]), False)

    def test_starting_now_is_rejected(self):
        self.assertIs(can_book(540, 570, 540, False, [(600, 660)]), False)

    def test_starting_one_minute_after_now_is_allowed(self):
        self.assertIs(can_book(541, 571, 540, False, []), True)

    def test_past_request_is_rejected(self):
        self.assertIs(can_book(500, 530, 540, False, [(600, 660)]), False)

    def test_zero_length_is_rejected(self):
        self.assertIs(can_book(700, 700, 540, False, [(600, 660)]), False)

    def test_reversed_times_are_rejected(self):
        self.assertIs(can_book(720, 700, 540, False, [(600, 660)]), False)

    def test_end_at_day_bound_is_allowed(self):
        self.assertIs(can_book(1320, 1440, 540, False, [(600, 660)]), True)

    def test_end_after_day_bound_is_rejected(self):
        self.assertIs(can_book(1380, 1441, 540, False, [(600, 660)]), False)

    def test_empty_existing_allows_valid_request(self):
        self.assertIs(can_book(600, 660, 540, False, []), True)

    def test_overlap_with_later_existing_booking_is_rejected(self):
        existing = [(600, 660), (700, 760)]
        self.assertIs(can_book(720, 780, 540, False, existing), False)

    def test_existing_list_is_unchanged(self):
        existing = [(900, 960), (600, 660), (700, 760)]
        before = list(existing)
        self.assertIs(can_book(780, 840, 540, False, existing), True)
        self.assertEqual(existing, before)

    def test_inside_existing_booking_is_rejected(self):
        self.assertIs(can_book(615, 645, 540, False, [(600, 660)]), False)

    def test_containing_existing_booking_is_rejected(self):
        self.assertIs(can_book(570, 690, 540, False, [(600, 660)]), False)

    def test_touching_start_is_allowed(self):
        self.assertIs(can_book(570, 600, 540, False, [(600, 660)]), True)
