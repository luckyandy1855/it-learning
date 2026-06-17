# 0800. Similar RGB Color

---
编号: 800
题目: Similar RGB Color
难度: 简单
标签: [数学, 字符串, 枚举]
来源链接: https://leetcode.com/problems/similar-rgb-color/
---

## 题目描述

RGB 颜色 `"#AABBCC"` 可以简写成 `"#ABC"` 。

- 例如，`"#15c"` 其实是 `"#1155cc"` 的简写。

现在，假如我们分别定义两个颜色 `"#ABCDEF"` 和 `"#UVWXYZ"`，则他们的相似度可以通过这个表达式 `-(AB - UV)^2 - (CD - WX)^2 - (EF - YZ)^2` 来计算。

那么给你一个按 `"#ABCDEF"` 形式定义的字符串 `color` 表示 RGB 颜色，请你以字符串形式，返回一个与它相似度最大且可以简写的颜色。（比如，可以表示成类似 `"#XYZ"` 的形式）

**任何** 具有相同的（最大）相似度的答案都会被视为正确答案。

**示例 1：**

```text
输入：color = "#09f166"
输出："#11ee66"
解释：
因为相似度计算得出 -(0x09 - 0x11)^2 -(0xf1 - 0xee)^2 - (0x66 - 0x66)^2 = -64 -9 -0 = -73
这已经是所有可以简写的颜色中最相似的了
```

**示例 2：**

```text
输入：color = "#4e3fe1"
输出："#5544dd"
```

**提示：**

- `color.length == 7`

- `color[0] == '#'`

- 对于任何 `i > 0`，`color[i]` 都是一个在范围 `['0', 'f']` 内的 16 进制数

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学, 字符串, 枚举」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
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
// Similar RGB Color：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func similarRGB(color string) string {
	f := func(x string) string {
		q, _ := strconv.ParseInt(x, 16, 64)
		if q%17 > 8 {
			q = q/17 + 1
		} else {
			q = q / 17
		}
		return fmt.Sprintf("%02x", 17*q)

	}
	a, b, c := color[1:3], color[3:5], color[5:7]
	return "#" + f(a) + f(b) + f(c)
}
```

### Java

```java
// Similar RGB Color：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String similarRGB(String color) {
        String a = color.substring(1, 3), b = color.substring(3, 5), c = color.substring(5, 7);
        return "#" + f(a) + f(b) + f(c);
    }

    private String f(String x) {
        int q = Integer.parseInt(x, 16);
        q = q / 17 + (q % 17 > 8 ? 1 : 0);
        return String.format("%02x", 17 * q);
    }
}
```

### Python

```python
# Similar RGB Color：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def similarRGB(self, color: str) -> str:
        def f(x):
            y, z = divmod(int(x, 16), 17)
            if z > 8:
                y += 1
            return '{:02x}'.format(17 * y)

        a, b, c = color[1:3], color[3:5], color[5:7]
        return f'#{f(a)}{f(b)}{f(c)}'
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。
