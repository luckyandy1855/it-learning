# 0004. Median of Two Sorted Arrays

---
编号: 4
题目: Median of Two Sorted Arrays
难度: 困难
标签: [数组, 二分查找, 分治]
来源链接: https://leetcode.com/problems/median-of-two-sorted-arrays/
---

## 题目描述

给定两个已按升序排列的整数数组 `nums1` 和 `nums2`，找出这两个数组合并后的**中位数**。

要求算法的时间复杂度为 O(log(m+n))。

题目保证：

- `nums1` 和 `nums2` 均已排好序。
- 两个数组不能同时为空。

### Example 1

```text
Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000
Explanation: 合并后为 [1,2,3]，中位数为 2。
```

### Example 2

```text
Input: nums1 = [1,2], nums2 = [3,4]
Output: 2.50000
Explanation: 合并后为 [1,2,3,4]，中位数为 (2+3)/2 = 2.5。
```

### 约束条件

- `nums1.length == m`，`nums2.length == n`
- `0 <= m <= 1000`，`0 <= n <= 1000`
- `1 <= m + n <= 2000`
- `-10^6 <= nums1[i], nums2[i] <= 10^6`

## 思路分析

### 突破口

O(log) 复杂度 → 必须用二分。核心思路：对**较短数组**做二分，找到一个划分点，使得两个数组各自分成左右两半，整体左半部分的最大值 ≤ 整体右半部分的最小值。

### 思路拆解

1. **暴力解**：合并两个数组后直接取中位数，O((m+n)log(m+n)) 或 O(m+n)。不满足题目要求。

2. **问题转化**：中位数将合并数组一分为二，左右各占一半。等价于：在两个有序数组中各选一个划分点 `i`、`j`（`i+j = (m+n+1)/2`），满足 `nums1[i-1] <= nums2[j]` 且 `nums2[j-1] <= nums1[i]`。

3. **优化方向**：对较短数组（设为 `nums1`）的划分点 `i` 做二分搜索，`j` 由 `i` 决定。若 `nums1[i-1] > nums2[j]`，说明 `i` 太大，向左二分；反之向右。

4. **实现要点**：边界处理较多——数组为空、划分点在边界时（`i=0` 或 `i=m`），需用 `-∞`/`+∞` 填充。奇偶总长度对应取中位数的方式不同。

### 示意图

```text
nums1 = [1, 3, 8]       m=3
nums2 = [2, 4, 5, 6]    n=4
总长 = 7（奇数），中位数 = 第 4 小的数

寻找划分点，使左半恰好有 (7+1)/2 = 4 个元素：
i=1（nums1 左1个），j=3（nums2 左3个）
nums1: [1 | 3, 8]
nums2: [2, 4, 5 | 6]

检查：
  左max = max(nums1[0], nums2[2]) = max(1, 5) = 5
  右min = min(nums1[1], nums2[3]) = min(3, 6) = 3
  5 > 3 → i 太大，向左二分

i=0（nums1 左0个），j=4（nums2 左4个）
nums1: [ | 1, 3, 8]
nums2: [2, 4, 5, 6 | ]

检查：
  左max = max(-∞, nums2[3]) = 6
  右min = min(nums1[0], +∞) = 1
  6 > 1 → i 还是太大，不对

正确 i=2，j=2：
nums1: [1, 3 | 8]
nums2: [2, 4 | 5, 6]
  左max = max(3, 4) = 4
  右min = min(8, 5) = 5
  4 <= 5 ✓  → 中位数 = left_max = 4
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 合并后取中位数 | O(m+n) | O(m+n) |
| 二分划分点 | O(log(min(m,n))) | O(1) |

## 代码实现

### Go

```go
// findMedianSortedArrays 用二分法在两个有序数组中找中位数
// 参数：nums1, nums2 两个升序整数数组
// 返回：合并后的中位数（float64）
func findMedianSortedArrays(nums1 []int, nums2 []int) float64 {
    // 保证 nums1 是较短的数组，减少二分范围
    if len(nums1) > len(nums2) {
        nums1, nums2 = nums2, nums1
    }
    m, n := len(nums1), len(nums2)
    half := (m + n + 1) / 2 // 左半部分元素个数（向上取整，兼容奇偶）

    lo, hi := 0, m
    for lo <= hi {
        i := (lo + hi) / 2 // nums1 划分点：左侧有 i 个元素
        j := half - i       // nums2 划分点：左侧有 j 个元素

        // 取左右边界值，越界时用极值填充
        nums1LeftMax := math.MinInt64
        if i > 0 {
            nums1LeftMax = nums1[i-1]
        }
        nums1RightMin := math.MaxInt64
        if i < m {
            nums1RightMin = nums1[i]
        }
        nums2LeftMax := math.MinInt64
        if j > 0 {
            nums2LeftMax = nums2[j-1]
        }
        nums2RightMin := math.MaxInt64
        if j < n {
            nums2RightMin = nums2[j]
        }

        if nums1LeftMax > nums2RightMin {
            // nums1 左侧选多了，i 向左缩小
            hi = i - 1
        } else if nums2LeftMax > nums1RightMin {
            // nums2 左侧选多了（等价于 nums1 左侧选少了），i 向右扩大
            lo = i + 1
        } else {
            // 找到合法划分
            leftMax := max(nums1LeftMax, nums2LeftMax)
            if (m+n)%2 == 1 {
                return float64(leftMax)
            }
            rightMin := min(nums1RightMin, nums2RightMin)
            return float64(leftMax+rightMin) / 2.0
        }
    }
    return 0.0 // 题目保证有解，不会到达这里
}

func max(a, b int) int {
    if a > b {
        return a
    }
    return b
}
func min(a, b int) int {
    if a < b {
        return a
    }
    return b
}
```

### Java

```java
class Solution {
    /**
     * 用二分法在两个有序数组中找中位数。
     *
     * @param nums1 升序整数数组
     * @param nums2 升序整数数组
     * @return 两数组合并后的中位数
     */
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // 保证 nums1 是较短数组，减少二分范围
        if (nums1.length > nums2.length) {
            int[] tmp = nums1; nums1 = nums2; nums2 = tmp;
        }
        int m = nums1.length, n = nums2.length;
        int half = (m + n + 1) / 2;

        int lo = 0, hi = m;
        while (lo <= hi) {
            int i = (lo + hi) / 2;
            int j = half - i;

            int n1L = (i > 0) ? nums1[i - 1] : Integer.MIN_VALUE;
            int n1R = (i < m) ? nums1[i]     : Integer.MAX_VALUE;
            int n2L = (j > 0) ? nums2[j - 1] : Integer.MIN_VALUE;
            int n2R = (j < n) ? nums2[j]     : Integer.MAX_VALUE;

            if (n1L > n2R) {
                hi = i - 1; // nums1 划分点左移
            } else if (n2L > n1R) {
                lo = i + 1; // nums1 划分点右移
            } else {
                int leftMax = Math.max(n1L, n2L);
                if ((m + n) % 2 == 1) return leftMax;
                return (leftMax + Math.min(n1R, n2R)) / 2.0;
            }
        }
        return 0.0;
    }
}
```

### Python

```python
class Solution:
    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:
        """
        用二分法在两个有序数组中找中位数，时间复杂度 O(log(min(m,n)))。

        参数:
            nums1, nums2: 两个升序整数数组
        返回:
            合并后的中位数
        """
        # 保证 nums1 是较短数组
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1
        m, n = len(nums1), len(nums2)
        half = (m + n + 1) // 2

        lo, hi = 0, m
        while lo <= hi:
            i = (lo + hi) // 2
            j = half - i

            n1l = nums1[i - 1] if i > 0 else float('-inf')
            n1r = nums1[i]     if i < m else float('inf')
            n2l = nums2[j - 1] if j > 0 else float('-inf')
            n2r = nums2[j]     if j < n else float('inf')

            if n1l > n2r:
                hi = i - 1
            elif n2l > n1r:
                lo = i + 1
            else:
                left_max = max(n1l, n2l)
                if (m + n) % 2 == 1:
                    return float(left_max)
                return (left_max + min(n1r, n2r)) / 2.0

        return 0.0
```

## 踩坑记录

- **边界越界**：当 `i=0`（nums1 左半为空）或 `i=m`（nums1 右半为空）时，对应的边界值应用 `-∞`/`+∞` 填充，否则数组访问越界。
- **必须对较短数组二分**：若对较长数组做二分，`j = half - i` 可能变成负数，导致 nums2 划分点越界。
- **奇偶长度不同**：总长为奇数时，中位数是左半最大值；偶数时是左半最大值和右半最小值的均值。用 `(m+n+1)/2` 统一定义左半大小，自然处理奇偶两种情况。
