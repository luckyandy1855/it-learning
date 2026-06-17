# 0710. Random Pick with Blacklist

---
编号: 710
题目: Random Pick with Blacklist
难度: 困难
标签: [数组, 哈希表, 数学, 二分查找, 排序, 随机化]
来源链接: https://leetcode.com/problems/random-pick-with-blacklist/
---

## 题目描述

给定一个整数 `n` 和一个 **无重复** 黑名单整数数组 `blacklist` 。设计一种算法，从 `[0, n - 1]` 范围内的任意整数中选取一个 **未加入 **黑名单 `blacklist` 的整数。任何在上述范围内且不在黑名单 `blacklist` 中的整数都应该有 **同等的可能性** 被返回。

优化你的算法，使它最小化调用语言 **内置** 随机函数的次数。

实现 `Solution` 类:

- `Solution(int n, int[] blacklist)` 初始化整数 `n` 和被加入黑名单 `blacklist` 的整数

- `int pick()` 返回一个范围为 `[0, n - 1]` 且不在黑名单 `blacklist` 中的随机整数

**示例 1：**

```text
输入
["Solution", "pick", "pick", "pick", "pick", "pick", "pick", "pick"]
[[7, [2, 3, 5]], [], [], [], [], [], [], []]
输出
[null, 0, 4, 1, 6, 1, 0, 4]

解释
Solution solution = new Solution(7, [2, 3, 5]);
solution.pick(); // 返回0，任何[0,1,4,6]的整数都可以。注意，对于每一个pick的调用，
                 // 0、1、4和6的返回概率必须相等(即概率为1/4)。
solution.pick(); // 返回 4
solution.pick(); // 返回 1
solution.pick(); // 返回 6
solution.pick(); // 返回 1
solution.pick(); // 返回 0
solution.pick(); // 返回 4
```

**提示:**

- `1 <= n <= 10^9`

- `0 <= blacklist.length <= min(10^5, n - 1)`

- `0 <= blacklist[i] < n`

- `blacklist` 中所有值都 **不同**

-  `pick` 最多被调用 `2 * 10^4` 次

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 数学, 二分查找, 排序, 随机化」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

本题先明确输入、输出和约束，再选择与数据规模匹配的数据结构或状态转移。实现时重点维护清晰的不变量，避免边界输入破坏主流程。

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
// Random Pick with Blacklist：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type Solution struct {
	d map[int]int
	k int
}

func Constructor(n int, blacklist []int) Solution {
	k := n - len(blacklist)
	i := k
	black := map[int]bool{}
	for _, b := range blacklist {
		black[b] = true
	}
	d := map[int]int{}
	for _, b := range blacklist {
		if b < k {
			for black[i] {
				i++
			}
			d[b] = i
			i++
		}
	}
	return Solution{d, k}
}

func (this *Solution) Pick() int {
	x := rand.Intn(this.k)
	if v, ok := this.d[x]; ok {
		return v
	}
	return x
}

/**
 * Your Solution object will be instantiated and called as such:
 * obj := Constructor(n, blacklist);
 * param_1 := obj.Pick();
 */
```

### Java

```java
// Random Pick with Blacklist：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private Map<Integer, Integer> d = new HashMap<>();
    private Random rand = new Random();
    private int k;

    public Solution(int n, int[] blacklist) {
        k = n - blacklist.length;
        int i = k;
        Set<Integer> black = new HashSet<>();
        for (int b : blacklist) {
            black.add(b);
        }
        for (int b : blacklist) {
            if (b < k) {
                while (black.contains(i)) {
                    ++i;
                }
                d.put(b, i++);
            }
        }
    }

    public int pick() {
        int x = rand.nextInt(k);
        return d.getOrDefault(x, x);
    }
}

/**
 * Your Solution object will be instantiated and called as such:
 * Solution obj = new Solution(n, blacklist);
 * int param_1 = obj.pick();
 */
```

### Python

```python
# Random Pick with Blacklist：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def __init__(self, n: int, blacklist: List[int]):
        self.k = n - len(blacklist)
        self.d = {}
        i = self.k
        black = set(blacklist)
        for b in blacklist:
            if b < self.k:
                while i in black:
                    i += 1
                self.d[b] = i
                i += 1

    def pick(self) -> int:
        x = randrange(self.k)
        return self.d.get(x, x)


# Your Solution object will be instantiated and called as such:
# obj = Solution(n, blacklist)
# param_1 = obj.pick()
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。
