visible_trees = 0

with open('input') as file:
  rows = file.read().splitlines()

  for x, row in enumerate(rows):
    for y, tree in enumerate([*row]):
      left = all([tree_left < tree for tree_left in [*row][0:y][::-1]])
      top = all([tree_top[y] < tree for [*tree_top] in rows[0:x][::-1]])
      
      right = all([tree_right < tree for tree_right in [*row][y+1:len(row)]])
      bottom = all([tree_bottom[y] < tree for [*tree_bottom] in rows[x+1:]])

      if left or top or right or bottom:
        visible_trees += 1

print(visible_trees)
