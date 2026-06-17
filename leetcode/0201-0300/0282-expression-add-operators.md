# 0282. Expression Add Operators

---
编号: 282
题目: Expression Add Operators
难度: 困难
标签: [数学, 字符串, 回溯]
来源链接: https://leetcode.com/problems/expression-add-operators/
---

## 题目描述

给定一个仅包含数字 `0-9` 的字符串 `num` 和一个目标值整数 `target` ，在 `num` 的数字之间添加 **二元 **运算符（不是一元）`+`、`-` 或 `*` ，返回 **所有** 能够得到 `target` 的表达式。

注意，返回表达式中的操作数 **不应该** 包含前导零。

**注意**，一个数字可以包含多个数位。

**示例 1:**

```text
输入: num = "123", target = 6
输出: ["1+2+3", "1*2*3"]
解释: “1*2*3” 和 “1+2+3” 的值都是6。
```

**示例 2:**

```text
输入: num = "232", target = 8
输出: ["2*3+2", "2+3*2"]
解释: “2*3+2” 和 “2+3*2” 的值都是8。
```

**示例 3:**

```text
输入: num = "3456237490", target = 9191
输出: []
解释: 表达式 “3456237490” 无法得到 9191 。
```

**提示：**

- `1 <= num.length <= 10`

- `num` 仅含数字

- `-2^31 <= target <= 2^31 - 1`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学, 字符串, 回溯」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
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
// Expression Add Operators：DFS 枚举每个数字段前放置的运算符。
// 关键点：用 prev 记录上一段带符号乘数，遇到乘法时回滚后重算优先级。
func addOperators(num string, target int) []string {
	ans := []string{}

	var dfs func(pos int, prev int64, curr int64, path string)
	dfs = func(pos int, prev int64, curr int64, path string) {
		if pos == len(num) {
			if curr == int64(target) {
				ans = append(ans, path)
			}
			return
		}

		var value int64
		for i := pos; i < len(num); i++ {
			// 多位数字不能以 0 开头，例如 "05" 不是合法数字段。
			if i > pos && num[pos] == '0' {
				break
			}
			value = value*10 + int64(num[i]-'0')
			part := num[pos : i+1]

			if pos == 0 {
				dfs(i+1, value, value, part)
			} else {
				dfs(i+1, value, curr+value, path+"+"+part)
				dfs(i+1, -value, curr-value, path+"-"+part)
				dfs(i+1, prev*value, curr-prev+prev*value, path+"*"+part)
			}
		}
	}

	dfs(0, 0, 0, "")
	return ans
}
```

### Java

```java
import java.util.*;
// Expression Add Operators：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    private List<String> ans;
    private String num;
    private int target;

    public List<String> addOperators(String num, int target) {
        ans = new ArrayList<>();
        this.num = num;
        this.target = target;
        dfs(0, 0, 0, "");
        return ans;
    }

    private void dfs(int u, long prev, long curr, String path) {
        if (u == num.length()) {
            if (curr == target) ans.add(path);
            return;
        }
        for (int i = u; i < num.length(); i++) {
            if (i != u && num.charAt(u) == '0') {
                break;
            }
            long next = Long.parseLong(num.substring(u, i + 1));
            if (u == 0) {
                dfs(i + 1, next, next, path + next);
            } else {
                dfs(i + 1, next, curr + next, path + "+" + next);
                dfs(i + 1, -next, curr - next, path + "-" + next);
                dfs(i + 1, prev * next, curr - prev + prev * next, path + "*" + next);
            }
        }
    }
}
```

### Python

```python
# Expression Add Operators：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def addOperators(self, num: str, target: int) -> List[str]:
        ans = []

        def dfs(u, prev, curr, path):
            if u == len(num):
                if curr == target:
                    ans.append(path)
                return
            for i in range(u, len(num)):
                if i != u and num[u] == '0':
                    break
                next = int(num[u : i + 1])
                if u == 0:
                    dfs(i + 1, next, next, path + str(next))
                else:
                    dfs(i + 1, next, curr + next, path + "+" + str(next))
                    dfs(i + 1, -next, curr - next, path + "-" + str(next))
                    dfs(
                        i + 1,
                        prev * next,
                        curr - prev + prev * next,
                        path + "*" + str(next),
                    )

        dfs(0, 0, 0, "")
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。
