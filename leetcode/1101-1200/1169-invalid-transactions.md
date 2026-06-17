# 1169. Invalid Transactions

---
编号: 1169
题目: Invalid Transactions
难度: 中等
标签: [数组, 哈希表, 字符串, 排序]
来源链接: https://leetcode.com/problems/invalid-transactions/
---

## 题目描述

如果出现下述两种情况，交易 **可能无效**：

- 交易金额超过 `$1000`

- 或者，它和 **另一个城市** 中 **同名** 的另一笔交易相隔不超过 `60` 分钟（包含 60 分钟整）

给定字符串数组交易清单 `transaction` 。每个交易字符串 `transactions[i]` 由一些用逗号分隔的值组成，这些值分别表示交易的名称，时间（以分钟计），金额以及城市。

返回 `transactions`，返回可能无效的交易列表。你可以按 **任何顺序** 返回答案。

**示例 1：**

```text
输入：transactions = ["alice,20,800,mtv","alice,50,100,beijing"]
输出：["alice,20,800,mtv","alice,50,100,beijing"]
解释：第一笔交易是无效的，因为第二笔交易和它间隔不超过 60 分钟、名称相同且发生在不同的城市。同样，第二笔交易也是无效的。
```

**示例 2：**

```text
输入：transactions = ["alice,20,800,mtv","alice,50,1200,mtv"]
输出：["alice,50,1200,mtv"]
```

**示例 3：**

```text
输入：transactions = ["alice,20,800,mtv","bob,50,1200,mtv"]
输出：["bob,50,1200,mtv"]
```

**提示：**

- `transactions.length <= 1000`

- 每笔交易 `transactions[i]` 按 `"{name},{time},{amount},{city}"` 的格式进行记录

- 每个交易名称 `{name}` 和城市 `{city}` 都由小写英文字母组成，长度在 `1` 到 `10` 之间

- 每个交易时间 `{time}` 由一些数字组成，表示一个 `0` 到 `1000` 之间的整数

- 每笔交易金额 `{amount}` 由一些数字组成，表示一个 `0` 到 `2000` 之间的整数

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 字符串, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

遍历交易列表，对于每笔交易，如果金额大于 1000，或者同名且城市不同且时间间隔不超过 60 分钟，则将其加入答案。

具体地，我们使用哈希表 `d` 记录每个交易，其中键为交易名称，值为一个列表，列表中的每个元素为一个三元组 `(time, city, index)`，表示在 `time` 时刻在 `city` 城市进行了编号为 `index` 的交易。同时，我们使用哈希表 `idx` 记录答案中的交易编号。

遍历交易列表，对于每笔交易，我们首先将其加入哈希表 `d` 中，然后判断其金额是否大于 1000，如果是，则将其编号加入答案中。然后我们遍历哈希表 `d` 中的交易，如果交易名称相同且城市不同且时间间隔不超过 60 分钟，则将其编号加入答案中。

最后，我们遍历答案中的交易编号，将其对应的交易加入答案即可。

时间复杂度 $O(n^2)$，空间复杂度 $O(n)$。其中 $n$ 为交易列表的长度。

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
// Invalid Transactions：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func invalidTransactions(transactions []string) (ans []string) {
	d := map[string][]tuple{}
	idx := map[int]bool{}
	for i, x := range transactions {
		e := strings.Split(x, ",")
		name := e[0]
		time, _ := strconv.Atoi(e[1])
		amount, _ := strconv.Atoi(e[2])
		city := e[3]
		d[name] = append(d[name], tuple{time, city, i})
		if amount > 1000 {
			idx[i] = true
		}
		for _, item := range d[name] {
			if city != item.city && abs(time-item.t) <= 60 {
				idx[i], idx[item.i] = true, true
			}
		}
	}
	for i := range idx {
		ans = append(ans, transactions[i])
	}
	return
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

type tuple struct {
	t    int
	city string
	i    int
}
```

### Java

```java
// Invalid Transactions：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<String> invalidTransactions(String[] transactions) {
        Map<String, List<Item>> d = new HashMap<>();
        Set<Integer> idx = new HashSet<>();
        for (int i = 0; i < transactions.length; ++i) {
            var e = transactions[i].split(",");
            String name = e[0];
            int time = Integer.parseInt(e[1]);
            int amount = Integer.parseInt(e[2]);
            String city = e[3];
            d.computeIfAbsent(name, k -> new ArrayList<>()).add(new Item(time, city, i));
            if (amount > 1000) {
                idx.add(i);
            }
            for (Item item : d.get(name)) {
                if (!city.equals(item.city) && Math.abs(time - item.t) <= 60) {
                    idx.add(i);
                    idx.add(item.i);
                }
            }
        }
        List<String> ans = new ArrayList<>();
        for (int i : idx) {
            ans.add(transactions[i]);
        }
        return ans;
    }
}

class Item {
    int t;
    String city;
    int i;

    Item(int t, String city, int i) {
        this.t = t;
        this.city = city;
        this.i = i;
    }
}
```

### Python

```python
# Invalid Transactions：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def invalidTransactions(self, transactions: List[str]) -> List[str]:
        d = defaultdict(list)
        idx = set()
        for i, x in enumerate(transactions):
            name, time, amount, city = x.split(",")
            time, amount = int(time), int(amount)
            d[name].append((time, city, i))
            if amount > 1000:
                idx.add(i)
            for t, c, j in d[name]:
                if c != city and abs(time - t) <= 60:
                    idx.add(i)
                    idx.add(j)
        return [transactions[i] for i in idx]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。
