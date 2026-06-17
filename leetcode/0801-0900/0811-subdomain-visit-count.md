# 0811. Subdomain Visit Count

---
编号: 811
题目: Subdomain Visit Count
难度: 中等
标签: [数组, 哈希表, 字符串, 计数]
来源链接: https://leetcode.com/problems/subdomain-visit-count/
---

## 题目描述

网站域名 `"discuss.leetcode.com"` 由多个子域名组成。顶级域名为 `"com"` ，二级域名为 `"leetcode.com"` ，最低一级为 `"discuss.leetcode.com"` 。当访问域名 `"discuss.leetcode.com"` 时，同时也会隐式访问其父域名 `"leetcode.com" `以及 `"com"` 。

**计数配对域名** 是遵循 `"rep d1.d2.d3"` 或 `"rep d1.d2"` 格式的一个域名表示，其中 `rep` 表示访问域名的次数，`d1.d2.d3` 为域名本身。

- 例如，`"9001 discuss.leetcode.com"` 就是一个 **计数配对域名** ，表示 `discuss.leetcode.com` 被访问了 `9001` 次。

给你一个** 计数配对域名 **组成的数组 `cpdomains` ，解析得到输入中每个子域名对应的 **计数配对域名** ，并以数组形式返回。可以按 **任意顺序** 返回答案。

**示例 1：**

```text
输入：cpdomains = ["9001 discuss.leetcode.com"]
输出：["9001 leetcode.com","9001 discuss.leetcode.com","9001 com"]
解释：例子中仅包含一个网站域名："discuss.leetcode.com"。
按照前文描述，子域名 "leetcode.com" 和 "com" 都会被访问，所以它们都被访问了 9001 次。
```

**示例 2：**

```text
输入：cpdomains = ["900 google.mail.com", "50 yahoo.com", "1 intel.mail.com", "5 wiki.org"]
输出：["901 mail.com","50 yahoo.com","900 google.mail.com","5 wiki.org","5 org","1 intel.mail.com","951 com"]
解释：按照前文描述，会访问 "google.mail.com" 900 次，"yahoo.com" 50 次，"intel.mail.com" 1 次，"wiki.org" 5 次。
而对于父域名，会访问 "mail.com" 900 + 1 = 901 次，"com" 900 + 50 + 1 = 951 次，和 "org" 5 次。
```

**提示：**

- `1 i d1i.d2i.d3i"` 或 `"repi d1i.d2i"` 格式

- `repi` 是范围 `[1, 10^4]` 内的一个整数

- `d1i`、`d2i` 和 `d3i` 由小写英文字母组成

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 字符串, 计数」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用哈希表 `cnt` 存储每个域名（子域名）对应的访问次数。

然后遍历数组，对于每个域名，我们将其拆分为子域名，然后更新哈希表 `cnt` 中对应的访问次数。

最后，我们将哈希表中的键值对转换为数组，即可得到答案。

时间复杂度 $O(L)$，空间复杂度 $O(L)$。其中 $L$ 是数组 `cpdomains` 中所有域名的长度之和。

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
// Subdomain Visit Count：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func subdomainVisits(cpdomains []string) []string {
	cnt := map[string]int{}
	for _, s := range cpdomains {
		i := strings.IndexByte(s, ' ')
		v, _ := strconv.Atoi(s[:i])
		for ; i < len(s); i++ {
			if s[i] == ' ' || s[i] == '.' {
				cnt[s[i+1:]] += v
			}
		}
	}
	ans := make([]string, 0, len(cnt))
	for s, v := range cnt {
		ans = append(ans, strconv.Itoa(v)+" "+s)
	}
	return ans
}
```

### Java

```java
// Subdomain Visit Count：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<String> subdomainVisits(String[] cpdomains) {
        Map<String, Integer> cnt = new HashMap<>();
        for (String s : cpdomains) {
            int i = s.indexOf(" ");
            int v = Integer.parseInt(s.substring(0, i));
            for (; i < s.length(); ++i) {
                if (s.charAt(i) == ' ' || s.charAt(i) == '.') {
                    String t = s.substring(i + 1);
                    cnt.put(t, cnt.getOrDefault(t, 0) + v);
                }
            }
        }
        List<String> ans = new ArrayList<>();
        for (var e : cnt.entrySet()) {
            ans.add(e.getValue() + " " + e.getKey());
        }
        return ans;
    }
}
```

### Python

```python
# Subdomain Visit Count：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def subdomainVisits(self, cpdomains: List[str]) -> List[str]:
        cnt = Counter()
        for s in cpdomains:
            v = int(s[: s.index(' ')])
            for i, c in enumerate(s):
                if c in ' .':
                    cnt[s[i + 1 :]] += v
        return [f'{v} {s}' for s, v in cnt.items()]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。
