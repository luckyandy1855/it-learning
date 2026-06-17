# 1279. Traffic Light Controlled Intersection

---
编号: 1279
题目: Traffic Light Controlled Intersection
难度: 简单
标签: [多线程]
来源链接: https://leetcode.com/problems/traffic-light-controlled-intersection/
---

## 题目描述

这是两条路的交叉路口。第一条路是 A 路，车辆可沿 1 号方向由北向南行驶，也可沿 2 号方向由南向北行驶。第二条路是 B 路，车辆可沿 3 号方向由西向东行驶，也可沿 4 号方向由东向西行驶。

每条路在路口前都有一个红绿灯。红绿灯可以亮起红灯或绿灯。

- **绿灯**表示两个方向的车辆都可通过路口。

- **红灯**表示两个方向的车辆都不可以通过路口，必须等待绿灯亮起。

两条路上的红绿灯不可以同时为绿灯。这意味着，当 A 路上的绿灯亮起时，B 路上的红灯会亮起；当 B 路上的绿灯亮起时，A 路上的红灯会亮起.

开始时，A 路上的**绿灯**亮起，B 路上的**红灯**亮起。当一条路上的绿灯亮起时，所有车辆都可以从任意两个方向通过路口，直到另一条路上的绿灯亮起。不同路上的车辆不可以同时通过路口。

给这个路口设计一个没有死锁的红绿灯控制系统。

实现函数 `void carArrived(carId, roadId, direction, turnGreen, crossCar)` :

- `carId` 为到达车辆的编号。

- `roadId` 为车辆所在道路的编号。

- `direction` 为车辆的行进方向。

- `turnGreen` 是一个函数，调用此函数会使当前道路上的绿灯亮起。

- `crossCar` 是一个函数，调用此函数会允许车辆通过路口。

当你的答案避免了车辆在路口出现死锁，此答案会被认定为正确的。当路口已经亮起绿灯时仍打开绿灯，此答案会被认定为错误的。

**示例 1:**

```text
输入: cars = [1,3,5,2,4], directions = [2,1,2,4,3], arrivalTimes = [10,20,30,40,50]
输出: [
"Car 1 Has Passed Road A In Direction 2",    // A 路上的红绿灯为绿色，1 号车可通过路口。
"Car 3 Has Passed Road A In Direction 1",    // 红绿灯仍为绿色，3 号车通过路口。
"Car 5 Has Passed Road A In Direction 2",    // 红绿灯仍为绿色，5 号车通过路口。
"Traffic Light On Road B Is Green",          // 2 号车在 B 路请求绿灯。
"Car 2 Has Passed Road B In Direction 4",    // B 路上的绿灯现已亮起，2 号车通过路口。
"Car 4 Has Passed Road B In Direction 3"     // 红绿灯仍为绿色，4 号车通过路口。
]
```

**示例 2:**

```text
输入: cars = [1,2,3,4,5], directions = [2,4,3,3,1], arrivalTimes = [10,20,30,40,40]
输出: [
"Car 1 Has Passed Road A In Direction 2",    // A 路上的红绿灯为绿色，1 号车可通过路口。
"Traffic Light On Road B Is Green",          // 2 号车在 B 路请求绿灯。
"Car 2 Has Passed Road B In Direction 4",    // B 路上的绿灯现已亮起，2 号车通过路口。
"Car 3 Has Passed Road B In Direction 3",    // B 路上的绿灯现已亮起，3 号车通过路口。
"Traffic Light On Road A Is Green",          // 5 号车在 A 路请求绿灯。
"Car 5 Has Passed Road A In Direction 1",    // A 路上的绿灯现已亮起，5 号车通过路口。
"Traffic Light On Road B Is Green",          // 4 号车在 B 路请求绿灯。4 号车在路口等灯，直到 5 号车通过路口，B 路的绿灯亮起。
"Car 4 Has Passed Road B In Direction 3"     // B 路上的绿灯现已亮起，4 号车通过路口。
]
解释: 这是一个无死锁的方案。注意，在 A 路上的绿灯亮起、5 号车通过前让 4 号车通过，也是一个正确且可被接受的方案。
```

**提示：**

- `1 <= cars.length <= 20`

- `cars.length = directions.length`

- `cars.length = arrivalTimes.length`

- `cars` 中的所有值都是唯一的。

- `1 <= directions[i] <= 4`

- `arrivalTimes` 是非递减的。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「多线程」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

本题先明确输入、输出和约束，再选择与数据规模匹配的数据结构或状态转移。实现时重点维护清晰的不变量，避免边界输入破坏主流程。

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
// Traffic Light Controlled Intersection：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class TrafficLight {
    private int road = 1;

    public TrafficLight() {
    }

    public synchronized void carArrived(int carId, // ID of the car
        int roadId, // ID of the road the car travels on. Can be 1 (road A) or 2 (road B)
        int direction, // Direction of the car
        Runnable turnGreen, // Use turnGreen.run() to turn light to green on current road
        Runnable crossCar // Use crossCar.run() to make car cross the intersection
    ) {
        if (roadId != road) {
            turnGreen.run();
            road = roadId;
        }
        crossCar.run();
    }
}
```

### Python

```python
# Traffic Light Controlled Intersection：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
from threading import Lock


class TrafficLight:
    def __init__(self):
        self.lock = Lock()
        self.road = 1

    def carArrived(
        self,
        carId: int,  # ID of the car
        # ID of the road the car travels on. Can be 1 (road A) or 2 (road B)
        roadId: int,
        direction: int,  # Direction of the car
        # Use turnGreen() to turn light to green on current road
        turnGreen: 'Callable[[], None]',
        # Use crossCar() to make car cross the intersection
        crossCar: 'Callable[[], None]',
    ) -> None:
        self.lock.acquire()
        if self.road != roadId:
            self.road = roadId
            turnGreen()
        crossCar()
        self.lock.release()
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。
