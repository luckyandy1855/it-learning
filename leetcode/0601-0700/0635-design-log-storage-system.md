# 0635. Design Log Storage System

---
编号: 635
题目: Design Log Storage System
难度: 中等
标签: [设计, 哈希表, 字符串, 有序集合]
来源链接: https://leetcode.com/problems/design-log-storage-system/
---

## 题目描述

你将获得多条日志，每条日志都有唯一的 `id` 和 `timestamp` ，`timestamp` 是形如 `Year:Month:Day:Hour:Minute:Second` 的字符串，`2017:01:01:23:59:59` ，所有值域都是零填充的十进制数。

实现 `LogSystem` 类：

- `LogSystem()` 初始化 `LogSystem` 对象

- `void put(int id, string timestamp)` 给定日志的 `id` 和 `timestamp` ，将这个日志存入你的存储系统中。

- `int[] retrieve(string start, string end, string granularity)` 返回在给定时间区间 `[start, end]` （包含两端）内的所有日志的 `id` 。`start` 、`end` 和 `timestamp` 的格式相同，`granularity` 表示考虑的时间粒度（例如，精确到 `Day`、`Minute` 等）。例如 `start = "2017:01:01:23:59:59"`、`end = "2017:01:02:23:59:59"` 且 `granularity = "Day"` 意味着需要查找从 **Jan. 1st 2017** 到 **Jan. 2nd 2017 **范围内的日志，可以忽略日志的 `Hour`、`Minute` 和 `Second` 。

**示例：**

```text
输入：
["LogSystem", "put", "put", "put", "retrieve", "retrieve"]
[[], [1, "2017:01:01:23:59:59"], [2, "2017:01:01:22:59:59"], [3, "2016:01:01:00:00:00"], ["2016:01:01:01:01:01", "2017:01:01:23:00:00", "Year"], ["2016:01:01:01:01:01", "2017:01:01:23:00:00", "Hour"]]
输出：
[null, null, null, null, [3, 2, 1], [2, 1]]

解释：
LogSystem logSystem = new LogSystem();
logSystem.put(1, "2017:01:01:23:59:59");
logSystem.put(2, "2017:01:01:22:59:59");
logSystem.put(3, "2016:01:01:00:00:00");

// 返回 [3,2,1]，返回从 2016 年到 2017 年所有的日志。
logSystem.retrieve("2016:01:01:01:01:01", "2017:01:01:23:00:00", "Year");

// 返回 [2,1]，返回从 Jan. 1, 2016 01:XX:XX 到 Jan. 1, 2017 23:XX:XX 之间的所有日志
// 不返回日志 3 因为记录时间 Jan. 1, 2016 00:00:00 超过范围的起始时间
logSystem.retrieve("2016:01:01:01:01:01", "2017:01:01:23:00:00", "Hour");
```

**提示：**

- `1 <= id <= 500`

- `2000 <= Year <= 2017`

- `1 <= Month <= 12`

- `1 <= Day <= 31`

- `0 <= Hour <= 23`

- `0 <= Minute, Second <= 59`

- `granularity` 是这些值 `["Year", "Month", "Day", "Hour", "Minute", "Second"]` 之一

- 最多调用 `500` 次 `put` 和 `retrieve`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 哈希表, 字符串, 有序集合」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

将日志的 `id` 和 `timestamp` 作为元组存入数组中，然后在 `retrieve()` 方法中，根据 `granularity` 截取 `start` 和 `end` 的相应部分，然后遍历数组，将符合条件的 `id` 加入结果数组中。

时间复杂度方面，`put()` 方法的时间复杂度为 $O(1)$，`retrieve()` 方法的时间复杂度为 $O(n)$，其中 $n$ 为数组的长度。

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
// Design Log Storage System：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type LogSystem struct {
	logs []pair
	d    map[string]int
}

func Constructor() LogSystem {
	d := map[string]int{
		"Year":   4,
		"Month":  7,
		"Day":    10,
		"Hour":   13,
		"Minute": 16,
		"Second": 19,
	}
	return LogSystem{[]pair{}, d}
}

func (this *LogSystem) Put(id int, timestamp string) {
	this.logs = append(this.logs, pair{id, timestamp})
}

func (this *LogSystem) Retrieve(start string, end string, granularity string) (ans []int) {
	i := this.d[granularity]
	s, e := start[:i], end[:i]
	for _, log := range this.logs {
		t := log.ts[:i]
		if s <= t && t <= e {
			ans = append(ans, log.id)
		}
	}
	return
}

type pair struct {
	id int
	ts string
}

/**
 * Your LogSystem object will be instantiated and called as such:
 * obj := Constructor();
 * obj.Put(id,timestamp);
 * param_2 := obj.Retrieve(start,end,granularity);
 */
```

### Java

```java
// Design Log Storage System：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class LogSystem {
    private List<Log> logs = new ArrayList<>();
    private Map<String, Integer> d = new HashMap<>();

    public LogSystem() {
        d.put("Year", 4);
        d.put("Month", 7);
        d.put("Day", 10);
        d.put("Hour", 13);
        d.put("Minute", 16);
        d.put("Second", 19);
    }

    public void put(int id, String timestamp) {
        logs.add(new Log(id, timestamp));
    }

    public List<Integer> retrieve(String start, String end, String granularity) {
        List<Integer> ans = new ArrayList<>();
        int i = d.get(granularity);
        String s = start.substring(0, i);
        String e = end.substring(0, i);
        for (var log : logs) {
            String t = log.ts.substring(0, i);
            if (s.compareTo(t) <= 0 && t.compareTo(e) <= 0) {
                ans.add(log.id);
            }
        }
        return ans;
    }
}

class Log {
    int id;
    String ts;

    Log(int id, String ts) {
        this.id = id;
        this.ts = ts;
    }
}

/**
 * Your LogSystem object will be instantiated and called as such:
 * LogSystem obj = new LogSystem();
 * obj.put(id,timestamp);
 * List<Integer> param_2 = obj.retrieve(start,end,granularity);
 */
```

### Python

```python
# Design Log Storage System：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class LogSystem:
    def __init__(self):
        self.logs = []
        self.d = {
            "Year": 4,
            "Month": 7,
            "Day": 10,
            "Hour": 13,
            "Minute": 16,
            "Second": 19,
        }

    def put(self, id: int, timestamp: str) -> None:
        self.logs.append((id, timestamp))

    def retrieve(self, start: str, end: str, granularity: str) -> List[int]:
        i = self.d[granularity]
        return [id for id, ts in self.logs if start[:i] <= ts[:i] <= end[:i]]


# Your LogSystem object will be instantiated and called as such:
# obj = LogSystem()
# obj.put(id,timestamp)
# param_2 = obj.retrieve(start,end,granularity)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。
