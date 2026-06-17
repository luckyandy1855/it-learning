# 0088. Merge Sorted Array

---
编号: 88
题目: Merge Sorted Array
难度: 简单
标签: [数组, 双指针, 排序]
来源链接: https://leetcode.com/problems/merge-sorted-array/
---

## 题目描述

给定两个按**非递减顺序**排列的整数数组 `nums1` 和 `nums2`，以及两个整数 `m` 和 `n`，分别表示 `nums1` 和 `nums2` 中的元素数目。

将 `nums2` 合并到 `nums1` 中，使合并后的数组同样按**非递减顺序**排列。

注意：`nums1` 的初始长度为 `m+n`，后 `n` 个元素为 `0`（占位符，不计入有效元素）。

### Example 1

```text
Input: nums1 = [1,2,3,0,0,0], m=3, nums2 = [2,5,6], n=3
Output: [1,2,2,3,5,6]
```

### Example 2

```text
Input: nums1 = [1], m=1, nums2 = [], n=0
Output: [1]
```

### 约束条件

- `nums1.length == m + n`，`nums2.length == n`
- `0 <= m, n <= 200`
- `1 <= m + n`
- `-10^9 <= nums1[i], nums2[j] <= 10^9`

## 思路分析

### 突破口

从后往前合并：`nums1` 末尾有 `n` 个空位，从 `m+n-1` 位置开始往前填，每次取 `nums1[i]` 和 `nums2[j]` 中较大的那个。

### 思路拆解

1. **三指针**：`i = m-1`（nums1 有效末），`j = n-1`（nums2 末），`k = m+n-1`（写入位置）。

2. **从大到小填入**：取较大者写入 `nums1[k]`，对应指针前移。

3. **处理剩余 nums2**：若 `j >= 0` 时 `i` 已越界，直接将 `nums2[0..j]` 复制到 `nums1[0..j]`。

### 示意图

```text
nums1=[1,2,3,0,0,0], nums2=[2,5,6]
i=2,j=2,k=5: max(3,6)=6 → nums1[5]=6, j=1
i=2,j=1,k=4: max(3,5)=5 → nums1[4]=5, j=0
i=2,j=0,k=3: max(3,2)=3 → nums1[3]=3, i=1
i=1,j=0,k=2: max(2,2)=2 → nums1[2]=2, i=0(任取一)
i=0,j=0,k=1: max(1,2)=2 → nums1[1]=2, j=-1
j<0,结束

结果: [1,2,2,3,5,6]
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 从后向前合并 | O(m+n) | O(1) |

## 代码实现

### Go

```go
// merge 将 nums2 合并进 nums1（从后往前，O(1) 额外空间）
func merge(nums1 []int, m int, nums2 []int, n int) {
    i, j, k := m-1, n-1, m+n-1

    for i >= 0 && j >= 0 {
        if nums1[i] >= nums2[j] {
            nums1[k] = nums1[i]
            i--
        } else {
            nums1[k] = nums2[j]
            j--
        }
        k--
    }

    // 剩余 nums2 直接复制（nums1 剩余已在正确位置）
    for j >= 0 {
        nums1[k] = nums2[j]
        j--
        k--
    }
}
```

### Java

```java
class Solution {
    /**
     * 将 nums2 合并进 nums1（从后往前，O(1) 额外空间）。
     */
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1, j = n - 1, k = m + n - 1;

        while (i >= 0 && j >= 0) {
            nums1[k--] = nums1[i] >= nums2[j] ? nums1[i--] : nums2[j--];
        }
        // 剩余 nums2 复制
        while (j >= 0) nums1[k--] = nums2[j--];
    }
}
```

### Python

```python
class Solution:
    def merge(self, nums1: list[int], m: int, nums2: list[int], n: int) -> None:
        """
        将 nums2 合并进 nums1（从后往前，O(1) 额外空间）。
        """
        i, j, k = m - 1, n - 1, m + n - 1

        while i >= 0 and j >= 0:
            if nums1[i] >= nums2[j]:
                nums1[k] = nums1[i]; i -= 1
            else:
                nums1[k] = nums2[j]; j -= 1
            k -= 1

        # nums2 有剩余时复制
        while j >= 0:
            nums1[k] = nums2[j]; j -= 1; k -= 1
```

## 踩坑记录

- **从后往前而非从前往后**：从前往后合并会覆盖 nums1 中未处理的元素；从后往前利用 nums1 末尾的空位，不会产生覆盖冲突。
- **只需处理 nums2 的剩余**：若 `j < 0`（nums2 耗尽），nums1 剩余部分本就在正确位置，不需要额外处理；若 `i < 0`（nums1 耗尽），将 nums2 剩余依次填入。
- **相等时任取**：`nums1[i] >= nums2[j]` 时取 nums1 的，`nums1[i] > nums2[j]` 也可以，相等时取哪边都合法（结果都是非递减）。
