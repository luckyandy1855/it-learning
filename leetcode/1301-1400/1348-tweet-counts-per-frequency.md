# 1348. Tweet Counts Per Frequency

---
编号: 1348
题目: Tweet Counts Per Frequency
难度: 中等
标签: [设计, 哈希表, 字符串, 二分查找, 有序集合, 排序]
来源链接: https://leetcode.com/problems/tweet-counts-per-frequency/
---

## 题目描述

一家社交媒体公司正试图通过分析特定时间段内出现的推文数量来监控其网站上的活动。这些时间段可以根据特定的频率（ **每分钟 **、**每小时 **或 **每一天** ）划分为更小的 **时间段** 。

例如，周期 `[10,10000]` （以 **秒** 为单位）将被划分为以下频率的 **时间块** :

- 每 **分钟** (60秒 块)： `[10,69]`, `[70,129]`, `[130,189]`, `...`, `[9970,10000]`

- 每 **小时** (3600秒 块)：`[10,3609]`, `[3610,7209]`, `[7210,10000]`

- 每 **天** (86400秒 块)： `[10,10000]`

注意，最后一个块可能比指定频率的块大小更短，并且总是以时间段的结束时间结束(在上面的示例中为 `10000` )。

设计和实现一个API来帮助公司进行分析。

实现 `TweetCounts` 类:

- `TweetCounts()` 初始化 `TweetCounts` 对象。

- 存储记录时间的 `tweetName` (以秒为单位)。

- `List getTweetCountsPerFrequency(String freq, String tweetName, int startTime, int endTime)` 返回一个整数列表，表示给定时间 `[startTime, endTime]` （单位秒）和频率频率中，每个 **时间块** 中带有 `tweetName` 的 `tweet` 的数量。

- `freq` 是 `“minute”` 、 `“hour”` 或 `“day”` 中的一个，分别表示 **每分钟** 、 **每小时** 或 **每一天** 的频率。

**示例：**

```text
输入：
["TweetCounts","recordTweet","recordTweet","recordTweet","getTweetCountsPerFrequency","getTweetCountsPerFrequency","recordTweet","getTweetCountsPerFrequency"]
[[],["tweet3",0],["tweet3",60],["tweet3",10],["minute","tweet3",0,59],["minute","tweet3",0,60],["tweet3",120],["hour","tweet3",0,210]]

输出：
[null,null,null,null,[2],[2,1],null,[4]]

解释：
TweetCounts tweetCounts = new TweetCounts();
tweetCounts.recordTweet("tweet3", 0);
tweetCounts.recordTweet("tweet3", 60);
tweetCounts.recordTweet("tweet3", 10);                             // "tweet3" 发布推文的时间分别是 0, 10 和 60 。
tweetCounts.getTweetCountsPerFrequency("minute", "tweet3", 0, 59); // 返回 [2]。统计频率是每分钟（60 秒），因此只有一个有效时间间隔 [0,60> - > 2 条推文。
tweetCounts.getTweetCountsPerFrequency("minute", "tweet3", 0, 60); // 返回 [2,1]。统计频率是每分钟（60 秒），因此有两个有效时间间隔 1) [0,60> - > 2 条推文，和 2) [60,61> - > 1 条推文。
tweetCounts.recordTweet("tweet3", 120);                            // "tweet3" 发布推文的时间分别是 0, 10, 60 和 120 。
tweetCounts.getTweetCountsPerFrequency("hour", "tweet3", 0, 210);  // 返回 [4]。统计频率是每小时（3600 秒），因此只有一个有效时间间隔 [0,211> - > 4 条推文。
```

**提示：**

- `0  `10^4` 次操作。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 哈希表, 字符串, 二分查找, 有序集合, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用哈希表 `data` 记录每个用户的推文时间，用有序列表记录每个用户的所有推文时间。

对于 `recordTweet` 操作，我们将推文时间加入到用户的推文时间列表中。

对于 `getTweetCountsPerFrequency` 操作，我们先计算出时间间隔 `f`，然后遍历用户的推文时间列表，统计每个时间间隔内的推文数量。

时间复杂度，对于 `recordTweet` 操作，总的时间复杂度 $O(n \times \log n)$；对于 `getTweetCountsPerFrequency` 操作，总的时间复杂度 $O(q \times (t + \log n))$。其中 $n$, $q$ 和 $t$ 分别表示插入的推文数量，查询的次数和时间间隔的长度。

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

### Java

```java
// Tweet Counts Per Frequency：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class TweetCounts {
    private Map<String, TreeMap<Integer, Integer>> data = new HashMap<>();

    public TweetCounts() {
    }

    public void recordTweet(String tweetName, int time) {
        data.putIfAbsent(tweetName, new TreeMap<>());
        var tm = data.get(tweetName);
        tm.put(time, tm.getOrDefault(time, 0) + 1);
    }

    public List<Integer> getTweetCountsPerFrequency(
        String freq, String tweetName, int startTime, int endTime) {
        int f = 60;
        if ("hour".equals(freq)) {
            f = 3600;
        } else if ("day".equals(freq)) {
            f = 86400;
        }
        var tm = data.get(tweetName);
        List<Integer> ans = new ArrayList<>();
        for (int i = startTime; i <= endTime; i += f) {
            int s = 0;
            int end = Math.min(i + f, endTime + 1);
            for (int v : tm.subMap(i, end).values()) {
                s += v;
            }
            ans.add(s);
        }
        return ans;
    }
}

/**
 * Your TweetCounts object will be instantiated and called as such:
 * TweetCounts obj = new TweetCounts();
 * obj.recordTweet(tweetName,time);
 * List<Integer> param_2 = obj.getTweetCountsPerFrequency(freq,tweetName,startTime,endTime);
 */
```

### Python

```python
# Tweet Counts Per Frequency：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class TweetCounts:
    def __init__(self):
        self.d = {"minute": 60, "hour": 3600, "day": 86400}
        self.data = defaultdict(SortedList)

    def recordTweet(self, tweetName: str, time: int) -> None:
        self.data[tweetName].add(time)

    def getTweetCountsPerFrequency(
        self, freq: str, tweetName: str, startTime: int, endTime: int
    ) -> List[int]:
        f = self.d[freq]
        tweets = self.data[tweetName]
        t = startTime
        ans = []
        while t <= endTime:
            l = tweets.bisect_left(t)
            r = tweets.bisect_left(min(t + f, endTime + 1))
            ans.append(r - l)
            t += f
        return ans


# Your TweetCounts object will be instantiated and called as such:
# obj = TweetCounts()
# obj.recordTweet(tweetName,time)
# param_2 = obj.getTweetCountsPerFrequency(freq,tweetName,startTime,endTime)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。
