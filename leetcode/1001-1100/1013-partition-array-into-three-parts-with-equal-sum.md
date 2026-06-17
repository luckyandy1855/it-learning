# 1013. Partition Array Into Three Parts With Equal Sum

---
编号: 1013
题目: Partition Array Into Three Parts With Equal Sum
难度: 简单
标签: [贪心, 数组]
来源链接: https://leetcode.com/problems/partition-array-into-three-parts-with-equal-sum/
---

## 题目描述

给你一个整数数组 `arr`，只有可以将其划分为三个和相等的 **非空** 部分时才返回 `true`，否则返回 `false`。

形式上，如果可以找出索引 `i + 1 < j` 且满足 `(arr[0] + arr[1] + ... + arr[i] == arr[i + 1] + arr[i + 2] + ... + arr[j - 1] == arr[j] + arr[j + 1] + ... + arr[arr.length - 1])` 就可以将数组三等分。

**示例 1：**

```text
输入：arr = [0,2,1,-6,6,-7,9,1,2,0,1]
输出：true
解释：0 + 2 + 1 = -6 + 6 - 7 + 9 + 1 = 2 + 0 + 1
```

**示例 2：**

```text
输入：arr = [0,2,1,-6,6,7,9,-1,2,0,1]
输出：false
```

**示例 3：**

```text
输入：arr = [3,3,6,5,-2,2,5,1,-9,4]
输出：true
解释：3 + 3 = 6 = 5 - 2 + 2 + 5 + 1 - 9 + 4
```

**提示：**

- `3 <= arr.length <= 5 * 10^4`

- `-10^4 <= arr[i] <= 10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先求出整个数组的和，然后判断和是否能被 3 整除，如果不能，直接返回 $\textit{false}$。

否则，我们记 $\textit{s}$ 表示每部分的和，用一个变量 $\textit{cnt}$ 记录当前已经找到的部分数，另一个变量 $\textit{t}$ 记录当前部分的和。初始时 $\textit{cnt} = 0$, $t = 0$。

然后我们遍历数组，对于每个元素 $x$，我们将 $t$ 加上 $x$，如果 $t$ 等于 $s$，说明找到了一部分，将 $\textit{cnt}$ 加一，然后将 $t$ 置为 0。

最后判断 $\textit{cnt}$ 是否大于等于 3 即可。

时间复杂度 $O(n)$，其中 $n$ 是数组 $\textit{arr}$ 的长度。空间复杂度 $O(1)$。

### 示意图

```text
输入/状态  ->  按规则更新候选状态  ->  得到答案
   |                 |                    |
  边界             不变量               返回值
```

---

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 参考解法 | 见「参考解法要点」 | 见「参考解法要点」 |

---

## 代码实现

### Go

```go
// Partition Array Into Three Parts With Equal Sum：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func canThreePartsEqualSum(arr []int) bool {
	s := 0
	for _, x := range arr {
		s += x
	}
	if s%3 != 0 {
		return false
	}
	s /= 3
	cnt, t := 0, 0
	for _, x := range arr {
		t += x
		if t == s {
			cnt++
			t = 0
		}
	}
	return cnt >= 3
}
```

### Java

```java
// Partition Array Into Three Parts With Equal Sum：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean canThreePartsEqualSum(int[] arr) {
        int s = Arrays.stream(arr).sum();
        if (s % 3 != 0) {
            return false;
        }
        s /= 3;
        int cnt = 0, t = 0;
        for (int x : arr) {
            t += x;
            if (t == s) {
                cnt++;
                t = 0;
            }
        }
        return cnt >= 3;
    }
}
```

### Python

```python
# Partition Array Into Three Parts With Equal Sum：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def canThreePartsEqualSum(self, arr: List[int]) -> bool:
        s, mod = divmod(sum(arr), 3)
        if mod:
            return False
        cnt = t = 0
        for x in arr:
            t += x
            if t == s:
                cnt += 1
                t = 0
        return cnt >= 3
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。
