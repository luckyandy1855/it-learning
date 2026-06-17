# 0981. Time Based Key-Value Store

---
编号: 981
题目: Time Based Key-Value Store
难度: 中等
标签: [设计, 哈希表, 字符串, 二分查找]
来源链接: https://leetcode.com/problems/time-based-key-value-store/
---

## 题目描述

设计一个基于时间的键值数据结构，该结构可以在不同时间戳存储对应同一个键的多个值，并针对特定时间戳检索键对应的值。

实现 `TimeMap` 类：

- `TimeMap()` 初始化数据结构对象

- `void set(String key, String value, int timestamp)` 存储给定时间戳 `timestamp` 时的键 `key` 和值 `value`。

- `String get(String key, int timestamp)` 返回一个值，该值在之前调用了 `set`，其中 `timestamp_prev <= timestamp` 。如果有多个这样的值，它将返回与最大  `timestamp_prev` 关联的值。如果没有值，则返回空字符串（`""`）。

**示例 1：**

```text
输入：
["TimeMap", "set", "get", "get", "set", "get", "get"]
[[], ["foo", "bar", 1], ["foo", 1], ["foo", 3], ["foo", "bar2", 4], ["foo", 4], ["foo", 5]]
输出：
[null, null, "bar", "bar", null, "bar2", "bar2"]

解释：
TimeMap timeMap = new TimeMap();
timeMap.set("foo", "bar", 1);  // 存储键 "foo" 和值 "bar" ，时间戳 timestamp = 1
timeMap.get("foo", 1);         // 返回 "bar"
timeMap.get("foo", 3);         // 返回 "bar", 因为在时间戳 3 和时间戳 2 处没有对应 "foo" 的值，所以唯一的值位于时间戳 1 处（即 "bar"） 。
timeMap.set("foo", "bar2", 4); // 存储键 "foo" 和值 "bar2" ，时间戳 timestamp = 4
timeMap.get("foo", 4);         // 返回 "bar2"
timeMap.get("foo", 5);         // 返回 "bar2"
```

**提示：**

- `1 <= key.length, value.length <= 100`

- `key` 和 `value` 由小写英文字母和数字组成

- `1 <= timestamp <= 10^7`

- `set` 操作中的时间戳 `timestamp` 都是严格递增的

- 最多调用 `set` 和 `get` 操作 `2 * 10^5` 次

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 哈希表, 字符串, 二分查找」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以用哈希表 $\textit{kvt}$ 记录键值对，其中键为字符串 $\textit{key}$，值为一个有序集合，集合中的每个元素为一个二元组 $(\textit{timestamp}, \textit{value})$，表示键 $\textit{key}$ 在时间戳 $\textit{timestamp}$ 时对应的值为 $\textit{value}$。

当我们需要查询键 $\textit{key}$ 在时间戳 $\textit{timestamp}$ 时对应的值时，我们可以通过有序集合的方法找到最大的时间戳 $\textit{timestamp}'$，使得 $\textit{timestamp}' \leq \textit{timestamp}$，然后返回对应的值即可。

时间复杂度方面，对于 $\textit{set}$ 操作，由于哈希表的插入操作的时间复杂度为 $O(1)$，因此时间复杂度为 $O(1)$。对于 $\textit{get}$ 操作，由于哈希表的查找操作的时间复杂度为 $O(1)$，而有序集合的查找操作的时间复杂度为 $O(\log n)$，因此时间复杂度为 $O(\log n)$。空间复杂度为 $O(n)$，其中 $n$ 为 $\textit{set}$ 操作的次数。

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
// Time Based Key-Value Store：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type TimeMap struct {
	ktv map[string][]pair
}

func Constructor() TimeMap {
	return TimeMap{map[string][]pair{}}
}

func (this *TimeMap) Set(key string, value string, timestamp int) {
	this.ktv[key] = append(this.ktv[key], pair{timestamp, value})
}

func (this *TimeMap) Get(key string, timestamp int) string {
	pairs := this.ktv[key]
	i := sort.Search(len(pairs), func(i int) bool { return pairs[i].t > timestamp })
	if i > 0 {
		return pairs[i-1].v
	}
	return ""
}

type pair struct {
	t int
	v string
}

/**
 * Your TimeMap object will be instantiated and called as such:
 * obj := Constructor();
 * obj.Set(key,value,timestamp);
 * param_2 := obj.Get(key,timestamp);
 */
```

### Java

```java
// Time Based Key-Value Store：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class TimeMap {
    private Map<String, TreeMap<Integer, String>> ktv = new HashMap<>();

    public TimeMap() {
    }

    public void set(String key, String value, int timestamp) {
        ktv.computeIfAbsent(key, k -> new TreeMap<>()).put(timestamp, value);
    }

    public String get(String key, int timestamp) {
        if (!ktv.containsKey(key)) {
            return "";
        }
        var tv = ktv.get(key);
        Integer t = tv.floorKey(timestamp);
        return t == null ? "" : tv.get(t);
    }
}

/**
 * Your TimeMap object will be instantiated and called as such:
 * TimeMap obj = new TimeMap();
 * obj.set(key,value,timestamp);
 * String param_2 = obj.get(key,timestamp);
 */
```

### Python

```python
# Time Based Key-Value Store：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class TimeMap:
    def __init__(self):
        self.ktv = defaultdict(list)

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.ktv[key].append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        if key not in self.ktv:
            return ''
        tv = self.ktv[key]
        i = bisect_right(tv, (timestamp, chr(127)))
        return tv[i - 1][1] if i else ''


# Your TimeMap object will be instantiated and called as such:
# obj = TimeMap()
# obj.set(key,value,timestamp)
# param_2 = obj.get(key,timestamp)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。
