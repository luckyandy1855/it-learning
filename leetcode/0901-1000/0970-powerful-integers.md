# 0970. Powerful Integers

---
编号: 970
题目: Powerful Integers
难度: 中等
标签: [哈希表, 数学, 枚举]
来源链接: https://leetcode.com/problems/powerful-integers/
---

## 题目描述

给定三个整数 `x` 、 `y` 和* *`bound`* *，返回 *值小于或等于 `bound` 的所有 **强整数** 组成的列表* 。

如果某一整数可以表示为 `x^i + y^j` ，其中整数 `i >= 0` 且 `j >= 0`，那么我们认为该整数是一个 **强整数** 。

你可以按 **任何顺序** 返回答案。在你的回答中，每个值 **最多** 出现一次。

**示例 1：**

```text
输入：x = 2, y = 3, bound = 10
输出：[2,3,4,5,7,9,10]
解释：
2 = 20 + 30
3 = 21 + 30
4 = 20 + 31
5 = 21 + 31
7 = 22 + 31
9 = 23 + 30
10 = 20 + 32
```

**示例 2：**

```text
输入：x = 3, y = 5, bound = 15
输出：[2,4,6,8,10,14]
```

**提示：**

- `1 <= x, y <= 100`

- `0 <= bound <= 10^6`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「哈希表, 数学, 枚举」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

根据题目描述，一个强整数可以表示成 $x^i + y^j$，其中 $i \geq 0$, $j \geq 0$。

题目需要我们找出所有不超过 $bound$ 的强整数，我们注意到 $bound$ 的取值范围不超过 $10^6$，而 $2^{20} = 1048576 \gt 10^6$。因此，如果 $x \geq 2$，那么 $i$ 最大不超过 $20$，才有可能使得 $x^i + y^j \leq bound$ 成立。同理，如果 $y \geq 2$，那么 $j$ 最大不超过 $20$。

因此我们可以使用双重循环，枚举所有可能的 $x^i$ 和 $y^j$，分别记为 $a$ 和 $b$，并保证 $a + b \leq bound$，此时 $a + b$ 即为一个强整数。我们使用哈希表存储所有满足条件的强整数，最后将哈希表中的所有元素转换成答案列表返回即可。

> 注意，如果 $x=1$ 或者 $y=1$，那么 $a$ 或者 $b$ 的值恒等于 $1$，对应的循环只需要执行一次即可退出。

时间复杂度 $O(\log^2 bound)$，空间复杂度 $O(\log^2 bound)$。

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
// Powerful Integers：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func powerfulIntegers(x int, y int, bound int) (ans []int) {
	s := map[int]struct{}{}
	for a := 1; a <= bound; a *= x {
		for b := 1; a+b <= bound; b *= y {
			s[a+b] = struct{}{}
			if y == 1 {
				break
			}
		}
		if x == 1 {
			break
		}
	}
	for x := range s {
		ans = append(ans, x)
	}
	return ans
}
```

### Java

```java
// Powerful Integers：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<Integer> powerfulIntegers(int x, int y, int bound) {
        Set<Integer> ans = new HashSet<>();
        for (int a = 1; a <= bound; a *= x) {
            for (int b = 1; a + b <= bound; b *= y) {
                ans.add(a + b);
                if (y == 1) {
                    break;
                }
            }
            if (x == 1) {
                break;
            }
        }
        return new ArrayList<>(ans);
    }
}
```

### Python

```python
# Powerful Integers：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def powerfulIntegers(self, x: int, y: int, bound: int) -> List[int]:
        ans = set()
        a = 1
        while a <= bound:
            b = 1
            while a + b <= bound:
                ans.add(a + b)
                b *= y
                if y == 1:
                    break
            if x == 1:
                break
            a *= x
        return list(ans)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。
