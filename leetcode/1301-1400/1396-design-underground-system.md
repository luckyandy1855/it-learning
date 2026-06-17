# 1396. Design Underground System

---
编号: 1396
题目: Design Underground System
难度: 中等
标签: [设计, 哈希表, 字符串]
来源链接: https://leetcode.com/problems/design-underground-system/
---

## 题目描述

地铁系统跟踪不同车站之间的乘客出行时间，并使用这一数据来计算从一站到另一站的平均时间。

实现 `UndergroundSystem` 类：

- `void checkIn(int id, string stationName, int t)`

    	- 通行卡 ID 等于 `id` 的乘客，在时间 `t` ，从 `stationName` 站进入

    	- 乘客一次只能从一个站进入

    - `void checkOut(int id, string stationName, int t)`

    	- 通行卡 ID 等于 `id` 的乘客，在时间 `t` ，从 `stationName` 站离开

    - `double getAverageTime(string startStation, string endStation)`

    	- 返回从 `startStation` 站到 `endStation` 站的平均时间

    	- 平均时间会根据截至目前所有从 `startStation` 站 **直接** 到达 `endStation` 站的行程进行计算，也就是从 `startStation` 站进入并从 `endStation` 离开的行程

    	- 从 `startStation` 到 `endStation` 的行程时间与从 `endStation` 到 `startStation` 的行程时间可能不同

    	- 在调用 `getAverageTime` 之前，至少有一名乘客从 `startStation` 站到达 `endStation` 站

你可以假设对 `checkIn` 和 `checkOut` 方法的所有调用都是符合逻辑的。如果一名乘客在时间 `t1` 进站、时间 `t2` 出站，那么 `t1 2` 。所有时间都按时间顺序发生。

**示例 1：**

```text
输入
["UndergroundSystem","checkIn","checkIn","checkIn","checkOut","checkOut","checkOut","getAverageTime","getAverageTime","checkIn","getAverageTime","checkOut","getAverageTime"]
[[],[45,"Leyton",3],[32,"Paradise",8],[27,"Leyton",10],[45,"Waterloo",15],[27,"Waterloo",20],[32,"Cambridge",22],["Paradise","Cambridge"],["Leyton","Waterloo"],[10,"Leyton",24],["Leyton","Waterloo"],[10,"Waterloo",38],["Leyton","Waterloo"]]

输出
[null,null,null,null,null,null,null,14.00000,11.00000,null,11.00000,null,12.00000]

解释
UndergroundSystem undergroundSystem = new UndergroundSystem();
undergroundSystem.checkIn(45, "Leyton", 3);
undergroundSystem.checkIn(32, "Paradise", 8);
undergroundSystem.checkIn(27, "Leyton", 10);
undergroundSystem.checkOut(45, "Waterloo", 15);  // 乘客 45 "Leyton" -> "Waterloo" ，用时 15-3 = 12
undergroundSystem.checkOut(27, "Waterloo", 20);  // 乘客 27 "Leyton" -> "Waterloo" ，用时 20-10 = 10
undergroundSystem.checkOut(32, "Cambridge", 22); // 乘客 32 "Paradise" -> "Cambridge" ，用时 22-8 = 14
undergroundSystem.getAverageTime("Paradise", "Cambridge"); // 返回 14.00000 。只有一个 "Paradise" -> "Cambridge" 的行程，(14) / 1 = 14
undergroundSystem.getAverageTime("Leyton", "Waterloo");    // 返回 11.00000 。有两个 "Leyton" -> "Waterloo" 的行程，(10 + 12) / 2 = 11
undergroundSystem.checkIn(10, "Leyton", 24);
undergroundSystem.getAverageTime("Leyton", "Waterloo");    // 返回 11.00000
undergroundSystem.checkOut(10, "Waterloo", 38);  // 乘客 10 "Leyton" -> "Waterloo" ，用时 38-24 = 14
undergroundSystem.getAverageTime("Leyton", "Waterloo");    // 返回 12.00000 。有三个 "Leyton" -> "Waterloo" 的行程，(10 + 12 + 14) / 3 = 12
```

**示例 2：**

```text
输入
["UndergroundSystem","checkIn","checkOut","getAverageTime","checkIn","checkOut","getAverageTime","checkIn","checkOut","getAverageTime"]
[[],[10,"Leyton",3],[10,"Paradise",8],["Leyton","Paradise"],[5,"Leyton",10],[5,"Paradise",16],["Leyton","Paradise"],[2,"Leyton",21],[2,"Paradise",30],["Leyton","Paradise"]]

输出
[null,null,null,5.00000,null,null,5.50000,null,null,6.66667]

解释
UndergroundSystem undergroundSystem = new UndergroundSystem();
undergroundSystem.checkIn(10, "Leyton", 3);
undergroundSystem.checkOut(10, "Paradise", 8); // 乘客 10 "Leyton" -> "Paradise" ，用时 8-3 = 5
undergroundSystem.getAverageTime("Leyton", "Paradise"); // 返回 5.00000 ，(5) / 1 = 5
undergroundSystem.checkIn(5, "Leyton", 10);
undergroundSystem.checkOut(5, "Paradise", 16); // 乘客 5 "Leyton" -> "Paradise" ，用时 16-10 = 6
undergroundSystem.getAverageTime("Leyton", "Paradise"); // 返回 5.50000 ，(5 + 6) / 2 = 5.5
undergroundSystem.checkIn(2, "Leyton", 21);
undergroundSystem.checkOut(2, "Paradise", 30); // 乘客 2 "Leyton" -> "Paradise" ，用时 30-21 = 9
undergroundSystem.getAverageTime("Leyton", "Paradise"); // 返回 6.66667 ，(5 + 6 + 9) / 3 = 6.66667
```

**提示：**

- `1 <= id, t <= 10^6`

- `1 <= stationName.length, startStation.length, endStation.length <= 10`

- 所有字符串由大小写英文字母与数字组成

- 总共最多调用 `checkIn`、`checkOut` 和 `getAverageTime` 方法 `2 * 10^4` 次

- 与标准答案误差在 `10^-5` 以内的结果都被视为正确结果

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 哈希表, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用两个哈希表来存储数据，其中：

- `ts`：存储乘客的 id 和乘客的进站时间和进站站点。其中键为乘客的 id，值为元组 `(t, stationName)`。
- `d`：存储乘客的进站站点和出站站点，以及乘客的行程时间和行程次数。其中键为元组 `(startStation, endStation)`，值为元组 `(totalTime, count)`。

当乘客进站时，我们将乘客的 id 和进站时间和进站站点存入 `ts` 中，即 `ts[id] = (t, stationName)`。

当乘客出站时，我们从 `ts` 中取出乘客的进站时间和进站站点 `(t0, station)`，然后计算乘客的行程时间 $t - t_0$，并将乘客的行程时间和行程次数存入 `d` 中。

当我们要求某个乘客的平均行程时间时，我们从 `d` 中取出乘客的行程时间和行程次数 `(totalTime, count)`，然后计算平均行程时间 $totalTime / count$ 即可。

时间复杂度 $O(1)$，空间复杂度 $O(n)$。其中 $n$ 为乘客的数量。

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
// Design Underground System：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type UndergroundSystem struct {
	ts map[int]pair
	d  map[station][2]int
}

func Constructor() UndergroundSystem {
	return UndergroundSystem{
		ts: make(map[int]pair),
		d:  make(map[station][2]int),
	}
}

func (this *UndergroundSystem) CheckIn(id int, stationName string, t int) {
	this.ts[id] = pair{t, stationName}
}

func (this *UndergroundSystem) CheckOut(id int, stationName string, t int) {
	p := this.ts[id]
	s := station{p.a, stationName}
	if _, ok := this.d[s]; !ok {
		this.d[s] = [2]int{t - p.t, 1}
	} else {
		this.d[s] = [2]int{this.d[s][0] + t - p.t, this.d[s][1] + 1}
	}

}

func (this *UndergroundSystem) GetAverageTime(startStation string, endStation string) float64 {
	s := station{startStation, endStation}
	return float64(this.d[s][0]) / float64(this.d[s][1])
}

type station struct {
	a string
	b string
}

type pair struct {
	t int
	a string
}

/**
 * Your UndergroundSystem object will be instantiated and called as such:
 * obj := Constructor();
 * obj.CheckIn(id,stationName,t);
 * obj.CheckOut(id,stationName,t);
 * param_3 := obj.GetAverageTime(startStation,endStation);
 */
```

### Java

```java
// Design Underground System：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class UndergroundSystem {
    private Map<Integer, Integer> ts = new HashMap<>();
    private Map<Integer, String> names = new HashMap<>();
    private Map<String, int[]> d = new HashMap<>();

    public UndergroundSystem() {
    }

    public void checkIn(int id, String stationName, int t) {
        ts.put(id, t);
        names.put(id, stationName);
    }

    public void checkOut(int id, String stationName, int t) {
        String key = names.get(id) + "-" + stationName;
        int[] v = d.getOrDefault(key, new int[2]);
        v[0] += t - ts.get(id);
        v[1]++;
        d.put(key, v);
    }

    public double getAverageTime(String startStation, String endStation) {
        String key = startStation + "-" + endStation;
        int[] v = d.get(key);
        return (double) v[0] / v[1];
    }
}

/**
 * Your UndergroundSystem object will be instantiated and called as such:
 * UndergroundSystem obj = new UndergroundSystem();
 * obj.checkIn(id,stationName,t);
 * obj.checkOut(id,stationName,t);
 * double param_3 = obj.getAverageTime(startStation,endStation);
 */
```

### Python

```python
# Design Underground System：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class UndergroundSystem:
    def __init__(self):
        self.ts = {}
        self.d = {}

    def checkIn(self, id: int, stationName: str, t: int) -> None:
        self.ts[id] = (t, stationName)

    def checkOut(self, id: int, stationName: str, t: int) -> None:
        t0, station = self.ts[id]
        x = self.d.get((station, stationName), (0, 0))
        self.d[(station, stationName)] = (x[0] + t - t0, x[1] + 1)

    def getAverageTime(self, startStation: str, endStation: str) -> float:
        x = self.d[(startStation, endStation)]
        return x[0] / x[1]


# Your UndergroundSystem object will be instantiated and called as such:
# obj = UndergroundSystem()
# obj.checkIn(id,stationName,t)
# obj.checkOut(id,stationName,t)
# param_3 = obj.getAverageTime(startStation,endStation)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。
