# Create a simple test case for dial.rotate
import unittest
from challenge import Dial

class TestDial(unittest.TestCase):
    def setUp(self):
        self.dial = Dial()

    def test_rotate_left_within_bounds(self):
        result = self.dial.rotate("L10")
        self.assertEqual(self.dial.zero_count_part_one, 0)
        self.assertEqual(self.dial.zero_count_part_two, 0)

    def test_rotate_right_within_bounds(self):
        result = self.dial.rotate("R20")
        self.assertEqual(self.dial.zero_count_part_one, 0)
        self.assertEqual(self.dial.zero_count_part_two, 0)

    def test_rotate_to_zero_part_one(self):
        self.dial.current_position = 10
        result = self.dial.rotate("L10")
        self.assertEqual(self.dial.zero_count_part_one, 1)
        self.assertEqual(self.dial.zero_count_part_two, 1)

    def test_rotate_beyond_bounds_right(self):
        self.dial.current_position = 90
        result = self.dial.rotate("R20")
        self.assertEqual(self.dial.zero_count_part_one, 0)
        self.assertEqual(self.dial.zero_count_part_two, 1)

    def test_rotate_negative_beyond_bounds_left(self):
        self.dial.current_position = 10
        result = self.dial.rotate("L20")
        self.assertEqual(self.dial.zero_count_part_one, 0)
        self.assertEqual(self.dial.zero_count_part_two, 1)

    def test_rotate_multiple_full_rotations_right_from_zero(self):
        self.dial.current_position = 0
        result = self.dial.rotate("R250")
        self.assertEqual(self.dial.zero_count_part_one, 0)
        self.assertEqual(self.dial.zero_count_part_two, 2)

    def test_rotate_multiple_full_rotations_right(self):
        self.dial.current_position = 10
        result = self.dial.rotate("R250")
        self.assertEqual(self.dial.zero_count_part_one, 0)
        self.assertEqual(self.dial.zero_count_part_two, 2)

    def test_rotate_multiple_full_rotations_left_from_zero(self):
        self.dial.current_position = 0
        result = self.dial.rotate("L250")
        self.assertEqual(self.dial.zero_count_part_one, 0)
        self.assertEqual(self.dial.zero_count_part_two, 2)

    def test_rotate_multiple_full_rotations_left(self):
        self.dial.current_position = 10
        result = self.dial.rotate("L250")
        self.assertEqual(self.dial.zero_count_part_one, 0)
        self.assertEqual(self.dial.zero_count_part_two, 3)

    def test_rotate_multiple_full_rotations_with_zero_landing(self):
        self.dial.current_position = 10
        result = self.dial.rotate("R300")
        self.assertEqual(self.dial.zero_count_part_one, 0)
        self.assertEqual(self.dial.zero_count_part_two, 3)

    def test_rotate_multiple_full_rotations_with_zero_landing_left(self):
        self.dial.current_position = 10
        result = self.dial.rotate("L300")
        self.assertEqual(self.dial.zero_count_part_one, 0)
        self.assertEqual(self.dial.zero_count_part_two, 3)

    def test_rotate_multiple_full_rotations_left_from_50(self):
        self.dial.current_position = 50
        result = self.dial.rotate("L250")
        self.assertEqual(self.dial.zero_count_part_one, 1)
        self.assertEqual(self.dial.zero_count_part_two, 3)

    def test_rotate_to_zero_from_zero(self):
        self.dial.current_position = 0
        result = self.dial.rotate("L500")
        self.assertEqual(self.dial.zero_count_part_one, 1)
        self.assertEqual(self.dial.zero_count_part_two, 5)

    def test_rotate_to_zero_multiple_times(self):
        self.dial.current_position = 0
        result = self.dial.rotate("R100")
        self.assertEqual(self.dial.zero_count_part_one, 1)
        self.assertEqual(self.dial.zero_count_part_two, 1)

        result = self.dial.rotate("R100")
        self.assertEqual(self.dial.zero_count_part_one, 2)
        self.assertEqual(self.dial.zero_count_part_two, 2)

if __name__ == '__main__':
    unittest.main()
