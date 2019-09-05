list1 = [1, 2, 3, 4, 5, 6, 7, 8, 9]
idx = 0
while idx < len(list1):
    item = list1[idx]
    if 3 != item:
        list1.pop(idx)
        idx -= 1
    idx += 1
print(list1)