# 1357. Apply Discount Every n Orders

---
编号: 1357
题目: Apply Discount Every n Orders
难度: 中等
标签: [设计, 数组, 哈希表]
来源链接: https://leetcode.com/problems/apply-discount-every-n-orders/
---

## 题目描述

超市里正在举行打折活动，每隔 `n` 个顾客会得到 `discount` 的折扣。

超市里有一些商品，第 `i` 种商品为 `products[i]` 且每件单品的价格为 `prices[i]` 。

结账系统会统计顾客的数目，每隔 `n` 个顾客结账时，该顾客的账单都会打折，折扣为 `discount` （也就是如果原本账单为 `x` ，那么实际金额会变成 `x - (discount * x) / 100` ），然后系统会重新开始计数。

顾客会购买一些商品， `product[i]` 是顾客购买的第 `i` 种商品， `amount[i]` 是对应的购买该种商品的数目。

请你实现 `Cashier` 类：

- `Cashier(int n, int discount, int[] products, int[] prices)` 初始化实例对象，参数分别为打折频率 `n` ，折扣大小 `discount` ，超市里的商品列表 `products` 和它们的价格 `prices` 。

- `double getBill(int[] product, int[] amount)` 返回账单的实际金额（如果有打折，请返回打折后的结果）。返回结果与标准答案误差在 `10^-5` 以内都视为正确结果。

**示例 1：**

```text
输入
["Cashier","getBill","getBill","getBill","getBill","getBill","getBill","getBill"]
[[3,50,[1,2,3,4,5,6,7],[100,200,300,400,300,200,100]],[[1,2],[1,2]],[[3,7],[10,10]],[[1,2,3,4,5,6,7],[1,1,1,1,1,1,1]],[[4],[10]],[[7,3],[10,10]],[[7,5,3,1,6,4,2],[10,10,10,9,9,9,7]],[[2,3,5],[5,3,2]]]
输出
[null,500.0,4000.0,800.0,4000.0,4000.0,7350.0,2500.0]
解释
Cashier cashier = new Cashier(3,50,[1,2,3,4,5,6,7],[100,200,300,400,300,200,100]);
cashier.getBill([1,2],[1,2]);                        // 返回 500.0, 账单金额为 = 1 * 100 + 2 * 200 = 500.
cashier.getBill([3,7],[10,10]);                      // 返回 4000.0
cashier.getBill([1,2,3,4,5,6,7],[1,1,1,1,1,1,1]);    // 返回 800.0 ，账单原本为 1600.0 ，但由于该顾客是第三位顾客，他将得到 50% 的折扣，所以实际金额为 1600 - 1600 * (50 / 100) = 800 。
cashier.getBill([4],[10]);                           // 返回 4000.0
cashier.getBill([7,3],[10,10]);                      // 返回 4000.0
cashier.getBill([7,5,3,1,6,4,2],[10,10,10,9,9,9,7]); // 返回 7350.0 ，账单原本为 14700.0 ，但由于系统计数再次达到三，该顾客将得到 50% 的折扣，实际金额为 7350.0 。
cashier.getBill([2,3,5],[5,3,2]);                    // 返回 2500.0
```

**提示：**

- `1 <= n <= 10^4`

- `0 <= discount <= 100`

- `1 <= products.length <= 200`

- `1 <= products[i] <= 200`

- `products` 列表中 **不会** 有重复的元素。

- `prices.length == products.length`

- `1 <= prices[i] <= 1000`

- `1 <= product.length <= products.length`

- `product[i]` 在 `products` 出现过。

- `amount.length == product.length`

- `1 <= amount[i] <= 1000`

- 最多有 `1000` 次对 `getBill` 函数的调用。

- 返回结果与标准答案误差在 `10^-5` 以内都视为正确结果。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 数组, 哈希表」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

用哈希表 $d$ 存储商品编号和价格，然后遍历商品编号和数量，计算总价，再根据折扣计算折扣后的价格。

初始化的时间复杂度为 $O(n)$，其中 $n$ 为商品的数量。`getBill` 函数的时间复杂度为 $O(m)$，其中 $m$ 为购买商品的数量。空间复杂度为 $O(n)$。

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
// Apply Discount Every n Orders：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type Cashier struct {
	i        int
	n        int
	discount int
	d        map[int]int
}

func Constructor(n int, discount int, products []int, prices []int) Cashier {
	d := map[int]int{}
	for i, product := range products {
		d[product] = prices[i]
	}
	return Cashier{0, n, discount, d}
}

func (this *Cashier) GetBill(product []int, amount []int) (ans float64) {
	this.i++
	dis := 0
	if this.i%this.n == 0 {
		dis = this.discount
	}
	for j, p := range product {
		x := float64(this.d[p] * amount[j])
		ans += x - (float64(dis)*x)/100.0
	}
	return
}

/**
 * Your Cashier object will be instantiated and called as such:
 * obj := Constructor(n, discount, products, prices);
 * param_1 := obj.GetBill(product,amount);
 */
```

### Java

```java
// Apply Discount Every n Orders：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Cashier {
    private int i;
    private int n;
    private int discount;
    private Map<Integer, Integer> d = new HashMap<>();

    public Cashier(int n, int discount, int[] products, int[] prices) {
        this.n = n;
        this.discount = discount;
        for (int j = 0; j < products.length; ++j) {
            d.put(products[j], prices[j]);
        }
    }

    public double getBill(int[] product, int[] amount) {
        int dis = (++i) % n == 0 ? discount : 0;
        double ans = 0;
        for (int j = 0; j < product.length; ++j) {
            int p = product[j], a = amount[j];
            int x = d.get(p) * a;
            ans += x - (dis * x) / 100.0;
        }
        return ans;
    }
}

/**
 * Your Cashier object will be instantiated and called as such:
 * Cashier obj = new Cashier(n, discount, products, prices);
 * double param_1 = obj.getBill(product,amount);
 */
```

### Python

```python
# Apply Discount Every n Orders：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Cashier:
    def __init__(self, n: int, discount: int, products: List[int], prices: List[int]):
        self.i = 0
        self.n = n
        self.discount = discount
        self.d = {product: price for product, price in zip(products, prices)}

    def getBill(self, product: List[int], amount: List[int]) -> float:
        self.i += 1
        discount = self.discount if self.i % self.n == 0 else 0
        ans = 0
        for p, a in zip(product, amount):
            x = self.d[p] * a
            ans += x - (discount * x) / 100
        return ans


# Your Cashier object will be instantiated and called as such:
# obj = Cashier(n, discount, products, prices)
# param_1 = obj.getBill(product,amount)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。
