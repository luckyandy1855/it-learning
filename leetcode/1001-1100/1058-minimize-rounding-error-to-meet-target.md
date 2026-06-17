# 1058. Minimize Rounding Error to Meet Target

---
编号: 1058
题目: Minimize Rounding Error to Meet Target
难度: 中等
标签: [贪心, 数组, 数学, 字符串, 排序]
来源链接: https://leetcode.com/problems/minimize-rounding-error-to-meet-target/
---

## 题目描述

给定一系列价格 `[p1,p2...,pn]` 和一个目标 `target`，将每个价格 `pi` 舍入为 `Roundi(pi)` 以使得舍入数组 `[Round1(p1),Round2(p2)...,Roundn(pn)]` 之和达到给定的目标值 `target`。每次舍入操作 `Roundi(pi)` 可以是向下舍 `Floor(pi)` 也可以是向上入 `Ceil(pi)`。

如果舍入数组之和无论如何都无法达到目标值 `target`，就返回字符串 `"-1"`。否则，以保留到**小数点后三位**的字符串格式返回最小的舍入误差，其定义为 `Σ |Roundi(pi) - (pi)|`（ i 从 1 到 n ）。

示例 1：

```text
输入：prices = ["0.700","2.800","4.900"], target = 8
输出："1.000"
解释：
使用 Floor，Ceil 和 Ceil 操作得到 (0.7 - 0) + (3 - 2.8) + (5 - 4.9) = 0.7 + 0.2 + 0.1 = 1.0 。
```

示例 2：

```text
输入：prices = ["1.500","2.500","3.500"], target = 10
输出："-1"
解释：
达到目标是不可能的。
```

示例 3：

```text
输入：prices = ["1.500","2.500","3.500"], target = 9
输出："1.500"
```

**提示：**

- `1 <= prices.length <= 500`

- 表示价格的每个字符串 `prices[i]` 都代表一个介于 `[0.0, 1000.0]` 之间的实数，并且正好有 3 个小数位。

- `target` 介于 0 和 1000000 之间。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 数学, 字符串, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

遍历价格数组 `prices`，先将每个价格 $p$ 向下舍入，累加到 `mi` 中，同时将每个价格的小数点部分添加到数组 `arr` 中。

遍历结束后，判断 `target` 是否在 `mi` 和 `mi + arr.length` 之间，如果不在，直接返回 `"-1"`。

接下来，我们计算 `target - mi`，即需要向上入的价格个数，然后将 `arr` 从大到小排序，从前往后遍历，将前 `target - mi` 个价格向上入，其余价格向下舍入，累计到 `ans` 中。

时间复杂度 $O(n\log n)$。其中 $n$ 为 `prices` 的长度。

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
// Minimize Rounding Error to Meet Target：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minimizeError(prices []string, target int) string {
	arr := []float64{}
	mi := 0
	for _, p := range prices {
		price, _ := strconv.ParseFloat(p, 64)
		mi += int(math.Floor(price))
		d := price - float64(math.Floor(price))
		if d > 0 {
			arr = append(arr, d)
		}
	}
	if target < mi || target > mi+len(arr) {
		return "-1"
	}
	d := target - mi
	sort.Float64s(arr)
	ans := float64(d)
	for i := 0; i < d; i++ {
		ans -= arr[len(arr)-i-1]
	}
	for i := d; i < len(arr); i++ {
		ans += arr[len(arr)-i-1]
	}
	return fmt.Sprintf("%.3f", ans)
}
```

### Java

```java
// Minimize Rounding Error to Meet Target：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String minimizeError(String[] prices, int target) {
        int mi = 0;
        List<Double> arr = new ArrayList<>();
        for (String p : prices) {
            double price = Double.valueOf(p);
            mi += (int) price;
            double d = price - (int) price;
            if (d > 0) {
                arr.add(d);
            }
        }
        if (target < mi || target > mi + arr.size()) {
            return "-1";
        }
        int d = target - mi;
        arr.sort(Collections.reverseOrder());
        double ans = d;
        for (int i = 0; i < d; ++i) {
            ans -= arr.get(i);
        }
        for (int i = d; i < arr.size(); ++i) {
            ans += arr.get(i);
        }
        DecimalFormat df = new DecimalFormat("#0.000");
        return df.format(ans);
    }
}
```

### Python

```python
# Minimize Rounding Error to Meet Target：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minimizeError(self, prices: List[str], target: int) -> str:
        mi = 0
        arr = []
        for p in prices:
            p = float(p)
            mi += int(p)
            if d := p - int(p):
                arr.append(d)
        if not mi <= target <= mi + len(arr):
            return "-1"
        d = target - mi
        arr.sort(reverse=True)
        ans = d - sum(arr[:d]) + sum(arr[d:])
        return f'{ans:.3f}'
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。
