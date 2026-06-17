# 1286. Iterator for Combination

---
编号: 1286
题目: Iterator for Combination
难度: 中等
标签: [设计, 字符串, 回溯, 迭代器]
来源链接: https://leetcode.com/problems/iterator-for-combination/
---

## 题目描述

请你设计一个迭代器类 `CombinationIterator` ，包括以下内容：

- `CombinationIterator(string characters, int combinationLength)` 一个构造函数，输入参数包括：用一个 **有序且字符唯一 **的字符串 `characters`（该字符串只包含小写英文字母）和一个数字 `combinationLength` 。

- 函数 *`next()` *，按 **字典序 **返回长度为 `combinationLength` 的下一个字母组合。

- 函数 *`hasNext()` *，只有存在长度为 `combinationLength` 的下一个字母组合时，才返回 `true`

**示例 1：**

```text
输入:
["CombinationIterator", "next", "hasNext", "next", "hasNext", "next", "hasNext"]
[["abc", 2], [], [], [], [], [], []]
输出：
[null, "ab", true, "ac", true, "bc", false]
解释：
CombinationIterator iterator = new CombinationIterator("abc", 2); // 创建迭代器 iterator
iterator.next(); // 返回 "ab"
iterator.hasNext(); // 返回 true
iterator.next(); // 返回 "ac"
iterator.hasNext(); // 返回 true
iterator.next(); // 返回 "bc"
iterator.hasNext(); // 返回 false
```

**提示：**

- `1 <= combinationLength <= characters.length <= 15`

-  `characters` 中每个字符都 **不同**

- 每组测试数据最多对 `next` 和 `hasNext` 调用 `10^4`次

- 题目保证每次调用函数 `next` 时都存在下一个字母组合。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 字符串, 回溯, 迭代器」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们通过 $DFS$ 枚举，预处理生成所有长度为 $combinationLength$ 的字符串，存放到 $cs$ 数组中。

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
// Iterator for Combination：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type CombinationIterator struct {
	cs  []string
	idx int
}

func Constructor(characters string, combinationLength int) CombinationIterator {
	t := []byte{}
	n := len(characters)
	cs := []string{}
	var dfs func(int)
	dfs = func(i int) {
		if len(t) == combinationLength {
			cs = append(cs, string(t))
			return
		}
		if i == n {
			return
		}
		t = append(t, characters[i])
		dfs(i + 1)
		t = t[:len(t)-1]
		dfs(i + 1)
	}
	dfs(0)
	return CombinationIterator{cs, 0}
}

func (this *CombinationIterator) Next() string {
	ans := this.cs[this.idx]
	this.idx++
	return ans
}

func (this *CombinationIterator) HasNext() bool {
	return this.idx < len(this.cs)
}

/**
 * Your CombinationIterator object will be instantiated and called as such:
 * obj := Constructor(characters, combinationLength);
 * param_1 := obj.Next();
 * param_2 := obj.HasNext();
 */
```

### Java

```java
// Iterator for Combination：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class CombinationIterator {
    private int n;
    private int combinationLength;
    private String characters;
    private StringBuilder t = new StringBuilder();
    private List<String> cs = new ArrayList<>();
    private int idx = 0;

    public CombinationIterator(String characters, int combinationLength) {
        n = characters.length();
        this.combinationLength = combinationLength;
        this.characters = characters;
        dfs(0);
    }

    public String next() {
        return cs.get(idx++);
    }

    public boolean hasNext() {
        return idx < cs.size();
    }

    private void dfs(int i) {
        if (t.length() == combinationLength) {
            cs.add(t.toString());
            return;
        }
        if (i == n) {
            return;
        }
        t.append(characters.charAt(i));
        dfs(i + 1);
        t.deleteCharAt(t.length() - 1);
        dfs(i + 1);
    }
}

/**
 * Your CombinationIterator object will be instantiated and called as such:
 * CombinationIterator obj = new CombinationIterator(characters, combinationLength);
 * String param_1 = obj.next();
 * boolean param_2 = obj.hasNext();
 */
```

### Python

```python
# Iterator for Combination：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class CombinationIterator:
    def __init__(self, characters: str, combinationLength: int):
        def dfs(i):
            if len(t) == combinationLength:
                cs.append(''.join(t))
                return
            if i == n:
                return
            t.append(characters[i])
            dfs(i + 1)
            t.pop()
            dfs(i + 1)

        cs = []
        n = len(characters)
        t = []
        dfs(0)
        self.cs = cs
        self.idx = 0

    def next(self) -> str:
        ans = self.cs[self.idx]
        self.idx += 1
        return ans

    def hasNext(self) -> bool:
        return self.idx < len(self.cs)


# Your CombinationIterator object will be instantiated and called as such:
# obj = CombinationIterator(characters, combinationLength)
# param_1 = obj.next()
# param_2 = obj.hasNext()
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。
