# 1452. People Whose List of Favorite Companies Is Not a Subset of Another List

---
编号: 1452
题目: People Whose List of Favorite Companies Is Not a Subset of Another List
难度: 中等
标签: [数组, 哈希表, 字符串]
来源链接: https://leetcode.com/problems/people-whose-list-of-favorite-companies-is-not-a-subset-of-another-list/
---

## 题目描述

给你一个数组 `favoriteCompanies` ，其中 `favoriteCompanies[i]` 是第 `i` 名用户收藏的公司清单（**下标从 0 开始**）。

请找出不是其他任何人收藏的公司清单的子集的收藏清单，并返回该清单下标*。*下标需要按升序排列*。*

**示例 1：**

```text
输入：favoriteCompanies = [["leetcode","google","facebook"],["google","microsoft"],["google","facebook"],["google"],["amazon"]]
输出：[0,1,4]
解释：
favoriteCompanies[2]=["google","facebook"] 是 favoriteCompanies[0]=["leetcode","google","facebook"] 的子集。
favoriteCompanies[3]=["google"] 是 favoriteCompanies[0]=["leetcode","google","facebook"] 和 favoriteCompanies[1]=["google","microsoft"] 的子集。
其余的收藏清单均不是其他任何人收藏的公司清单的子集，因此，答案为 [0,1,4] 。
```

**示例 2：**

```text
输入：favoriteCompanies = [["leetcode","google","facebook"],["leetcode","amazon"],["facebook","google"]]
输出：[0,1]
解释：favoriteCompanies[2]=["facebook","google"] 是 favoriteCompanies[0]=["leetcode","google","facebook"] 的子集，因此，答案为 [0,1] 。
```

**示例 3：**

```text
输入：favoriteCompanies = [["leetcode"],["google"],["facebook"],["amazon"]]
输出：[0,1,2,3]
```

**提示：**

- `1 <= favoriteCompanies.length <= 100`

- `1 <= favoriteCompanies[i].length <= 500`

- `1 <= favoriteCompanies[i][j].length <= 20`

- `favoriteCompanies[i]` 中的所有字符串 **各不相同** 。

- 用户收藏的公司清单也 **各不相同** ，也就是说，即便我们按字母顺序排序每个清单， `favoriteCompanies[i] != favoriteCompanies[j] `仍然成立。

- 所有字符串仅包含小写英文字母。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以将每个公司映射到一个唯一的整数，然后对于每个人，我们将他们收藏的公司转换为整数集合，最后判断是否存在一个人的收藏公司是另一个人的子集。

时间复杂度 $(n \times m \times k + n^2 \times m)$，空间复杂度 $O(n \times m)$。其中 $n$ 和 $m$ 分别是 `favoriteCompanies` 的长度和每个公司清单的平均长度，而 $k$ 是每个公司的平均长度。

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
// People Whose List of Favorite Companies Is Not a Subset of Another List：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func peopleIndexes(favoriteCompanies [][]string) (ans []int) {
	n := len(favoriteCompanies)
	d := make(map[string]int)
	idx := 0
	nums := make([]map[int]struct{}, n)

	for i := 0; i < n; i++ {
		nums[i] = make(map[int]struct{})
		for _, s := range favoriteCompanies[i] {
			if _, ok := d[s]; !ok {
				d[s] = idx
				idx++
			}
			nums[i][d[s]] = struct{}{}
		}
	}

	check := func(a, b map[int]struct{}) bool {
		for x := range a {
			if _, ok := b[x]; !ok {
				return false
			}
		}
		return true
	}
	for i := 0; i < n; i++ {
		ok := true
		for j := 0; j < n && ok; j++ {
			if i != j && check(nums[i], nums[j]) {
				ok = false
			}
		}
		if ok {
			ans = append(ans, i)
		}
	}

	return
}
```

### Java

```java
// People Whose List of Favorite Companies Is Not a Subset of Another List：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<Integer> peopleIndexes(List<List<String>> favoriteCompanies) {
        int n = favoriteCompanies.size();
        Map<String, Integer> d = new HashMap<>();
        int idx = 0;
        Set<Integer>[] nums = new Set[n];
        Arrays.setAll(nums, i -> new HashSet<>());
        for (int i = 0; i < n; ++i) {
            var ss = favoriteCompanies.get(i);
            for (var s : ss) {
                if (!d.containsKey(s)) {
                    d.put(s, idx++);
                }
                nums[i].add(d.get(s));
            }
        }
        List<Integer> ans = new ArrayList<>();
        for (int i = 0; i < n; ++i) {
            boolean ok = true;
            for (int j = 0; j < n && ok; ++j) {
                if (i != j && nums[j].containsAll(nums[i])) {
                    ok = false;
                }
            }
            if (ok) {
                ans.add(i);
            }
        }
        return ans;
    }
}
```

### Python

```python
# People Whose List of Favorite Companies Is Not a Subset of Another List：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def peopleIndexes(self, favoriteCompanies: List[List[str]]) -> List[int]:
        idx = 0
        d = {}
        n = len(favoriteCompanies)
        nums = [set() for _ in range(n)]
        for i, ss in enumerate(favoriteCompanies):
            for s in ss:
                if s not in d:
                    d[s] = idx
                    idx += 1
                nums[i].add(d[s])
        ans = []
        for i in range(n):
            if not any(i != j and (nums[i] & nums[j]) == nums[i] for j in range(n)):
                ans.append(i)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。
