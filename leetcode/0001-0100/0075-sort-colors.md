# 0075. Sort Colors

---
编号: 75
题目: Sort Colors
难度: 中等
标签: [数组, 双指针, 排序]
来源链接: https://leetcode.com/problems/sort-colors/
---

## 题目描述

给定一个数组 `nums`，其中每个元素的值为 `0`、`1` 或 `2`，分别代表红色、白色和蓝色。要求**原地**将数组排序，使得相同颜色相邻，顺序为红、白、蓝（即 `[0, ..., 1, ..., 2]`）。

不允许使用库的排序函数。进阶：只扫描一遍，O(1) 额外空间。

### Example 1

```text
Input: nums = [2,0,2,1,1,0]
Output: [0,0,1,1,2,2]
```

### Example 2

```text
Input: nums = [2,0,1]
Output: [0,1,2]
```

### 约束条件

- `n == nums.length`
- `1 <= n <= 300`
- `nums[i]` 只有 `0`、`1`、`2`

## 思路分析

### 突破口

荷兰国旗算法（Dutch National Flag）：三指针一次扫描，维护 `lo`（0 区末尾）、`mid`（当前扫描）、`hi`（2 区首部）。

### 思路拆解

1. **三指针定义**：
   - `[0, lo-1]`：全是 0
   - `[lo, mid-1]`：全是 1
   - `[mid, hi]`：待分类
   - `[hi+1, n-1]`：全是 2

2. **扫描 mid 到 hi**：
   - `nums[mid] == 0` → 与 `lo` 交换，`lo++, mid++`
   - `nums[mid] == 1` → `mid++`
   - `nums[mid] == 2` → 与 `hi` 交换，`hi--`（`mid` 不动，因为换来的元素未检查）

### 示意图

```text
[2, 0, 2, 1, 1, 0]
lo=0, mid=0, hi=5

mid=0: nums[0]=2 → swap(0,5): [0,0,2,1,1,2], hi=4
mid=0: nums[0]=0 → swap(0,0): [0,0,2,1,1,2], lo=1,mid=1
mid=1: nums[1]=0 → swap(1,1): lo=2,mid=2
mid=2: nums[2]=2 → swap(2,4): [0,0,1,1,2,2], hi=3
mid=2: nums[2]=1 → mid=3
mid=3: nums[3]=1 → mid=4
mid(4) > hi(3), 结束
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 荷兰国旗（一次扫描） | O(n) | O(1) |

## 代码实现

### Go

```go
// sortColors 原地将 0/1/2 数组按颜色排序（荷兰国旗算法）
func sortColors(nums []int) {
    lo, mid, hi := 0, 0, len(nums)-1

    for mid <= hi {
        switch nums[mid] {
        case 0:
            nums[lo], nums[mid] = nums[mid], nums[lo]
            lo++
            mid++
        case 1:
            mid++
        case 2:
            nums[mid], nums[hi] = nums[hi], nums[mid]
            hi-- // mid 不移动，因为换来的元素未分类
        }
    }
}
```

### Java

```java
class Solution {
    /**
     * 原地将 0/1/2 数组按颜色排序（荷兰国旗算法）。
     */
    public void sortColors(int[] nums) {
        int lo = 0, mid = 0, hi = nums.length - 1;

        while (mid <= hi) {
            if (nums[mid] == 0) {
                int tmp = nums[lo]; nums[lo] = nums[mid]; nums[mid] = tmp;
                lo++; mid++;
            } else if (nums[mid] == 1) {
                mid++;
            } else {
                int tmp = nums[hi]; nums[hi] = nums[mid]; nums[mid] = tmp;
                hi--;
            }
        }
    }
}
```

### Python

```python
class Solution:
    def sortColors(self, nums: list[int]) -> None:
        """
        原地将 0/1/2 数组按颜色排序（荷兰国旗算法，一次扫描）。
        """
        lo, mid, hi = 0, 0, len(nums) - 1

        while mid <= hi:
            if nums[mid] == 0:
                nums[lo], nums[mid] = nums[mid], nums[lo]
                lo += 1; mid += 1
            elif nums[mid] == 1:
                mid += 1
            else:
                nums[mid], nums[hi] = nums[hi], nums[mid]
                hi -= 1  # mid 不递增，换来的值未检查
```

## 踩坑记录

- **遇到 2 时 `mid` 不递增**：将 `hi` 位置的值换到 `mid`，该值未被分类，需要在下一轮继续处理；而遇到 0 时换来的 `lo` 位置一定是 1（`[lo, mid-1]` 全为 1），可以安全递增 `mid`。
- **循环条件 `mid <= hi`**：`mid > hi` 时 `[mid, hi]` 区间为空，扫描完成。
- **两次计数法（简单替代）**：先统计 0、1、2 各多少个，再填入数组——两次扫描 O(n)，O(1) 空间，比三指针更容易理解，但不满足题目"一次扫描"的进阶要求。
