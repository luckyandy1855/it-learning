const fs = require("fs");
const path = require("path");

const LEETCODE_DIR = path.resolve(__dirname, "..");

const difficultyOrder = ["简单", "中等", "困难", "待校准"];

const topicGroups = [
  {
    name: "数组与哈希",
    tags: ["数组", "哈希表", "计数", "矩阵"],
  },
  {
    name: "双指针与滑动窗口",
    tags: ["双指针", "滑动窗口"],
  },
  {
    name: "字符串",
    tags: ["字符串", "字符串匹配", "后缀数组"],
  },
  {
    name: "栈、队列与堆",
    tags: ["栈", "单调栈", "队列", "单调队列", "堆（优先队列）"],
  },
  {
    name: "链表",
    tags: ["链表"],
  },
  {
    name: "二叉树与树",
    tags: ["树", "二叉树", "二叉搜索树", "线段树", "树状数组", "字典树", "最近公共祖先"],
  },
  {
    name: "图论与搜索",
    tags: ["图", "广度优先搜索", "深度优先搜索", "拓扑排序", "最短路", "欧拉回路", "强连通分量"],
  },
  {
    name: "回溯",
    tags: ["回溯"],
  },
  {
    name: "动态规划",
    tags: ["动态规划", "记忆化", "状态压缩", "数位动态规划", "概率与统计", "组合数学"],
  },
  {
    name: "贪心",
    tags: ["贪心"],
  },
  {
    name: "二分查找",
    tags: ["二分查找", "二分搜索"],
  },
  {
    name: "排序与区间",
    tags: ["排序", "归并排序", "快速选择", "桶排序", "计数排序", "基数排序", "扫描线", "有序集合"],
  },
  {
    name: "并查集",
    tags: ["并查集"],
  },
  {
    name: "前缀和与差分",
    tags: ["前缀和", "差分数组"],
  },
  {
    name: "位运算",
    tags: ["位运算"],
  },
  {
    name: "数学与模拟",
    tags: ["数学", "模拟", "几何", "随机化", "博弈", "水塘抽样", "拒绝采样"],
  },
  {
    name: "设计题",
    tags: ["设计", "数据流", "迭代器", "哈希函数", "交互"],
  },
  {
    name: "数据库 SQL",
    tags: ["数据库"],
  },
  {
    name: "Shell",
    tags: ["Shell"],
  },
  {
    name: "并发",
    tags: ["多线程"],
  },
];

function mdLink(label, href) {
  return `[${label}](${href})`;
}

function parseFrontmatter(markdown, filePath) {
  const block = markdown.match(/^# .+\n\n---\n([\s\S]*?)\n---/);
  if (!block) {
    throw new Error(`Missing frontmatter: ${filePath}`);
  }

  const meta = {};
  for (const line of block[1].split("\n")) {
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (match) meta[match[1].trim()] = match[2].trim();
  }

  const tags = (meta["标签"] || "[]")
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return {
    id: Number(meta["编号"]),
    title: meta["题目"],
    difficulty: meta["难度"] || "待校准",
    tags,
    relPath: path.relative(LEETCODE_DIR, filePath).replaceAll(path.sep, "/"),
  };
}

function readProblems() {
  const problems = [];
  for (const dir of fs.readdirSync(LEETCODE_DIR)) {
    if (!/^\d{4}-\d{4}$/.test(dir)) continue;
    const dirPath = path.join(LEETCODE_DIR, dir);
    if (!fs.statSync(dirPath).isDirectory()) continue;

    for (const file of fs.readdirSync(dirPath)) {
      if (!/^\d{4}-.*\.md$/.test(file)) continue;
      const filePath = path.join(dirPath, file);
      problems.push(parseFrontmatter(fs.readFileSync(filePath, "utf8"), filePath));
    }
  }
  return problems.sort((a, b) => a.id - b.id);
}

function tagsText(problem) {
  return problem.tags.length ? problem.tags.join("、") : "待校准";
}

function tableRow(problem, includeTopic = false) {
  const base = [
    String(problem.id).padStart(4, "0"),
    mdLink(problem.title, problem.relPath),
    problem.difficulty,
  ];
  if (includeTopic) base.push(primaryTopic(problem));
  base.push(tagsText(problem));
  return `| ${base.join(" | ")} |`;
}

function primaryTopic(problem) {
  for (const group of topicGroups) {
    if (problem.tags.some((tag) => group.tags.includes(tag))) return group.name;
  }
  return "其他";
}

function countByDifficulty(problems) {
  const counts = new Map(difficultyOrder.map((difficulty) => [difficulty, 0]));
  for (const problem of problems) {
    counts.set(problem.difficulty, (counts.get(problem.difficulty) || 0) + 1);
  }
  return counts;
}

function buildDifficultyIndex(problems) {
  const counts = countByDifficulty(problems);
  const lines = [
    "# LeetCode 按难度索引",
    "",
    "用于按刷题强度安排复习节奏。建议先用简单题热身，再集中刷中等题，最后把困难题按题型拆开攻克。",
    "",
    "## 概览",
    "",
    "| 难度 | 数量 |",
    "|------|------|",
  ];

  for (const difficulty of difficultyOrder) {
    const count = counts.get(difficulty) || 0;
    if (count > 0) lines.push(`| ${difficulty} | ${count} |`);
  }

  for (const difficulty of difficultyOrder) {
    const group = problems.filter((problem) => problem.difficulty === difficulty);
    if (!group.length) continue;

    lines.push(
      "",
      `## ${difficulty}`,
      "",
      "| 题号 | 题目 | 难度 | 主复习题型 | 标签 |",
      "|------|------|------|------------|------|",
      ...group.map((problem) => tableRow(problem, true)),
    );
  }

  return `${lines.join("\n")}\n`;
}

function buildTopicIndex(problems) {
  const assigned = new Set();
  const lines = [
    "# LeetCode 按题型索引",
    "",
    "用于按能力模块复习。同一道题可能出现在多个题型下；表格保留原始标签，便于判断它是否适合作为交叉练习。",
    "",
    "## 概览",
    "",
    "| 题型 | 数量 |",
    "|------|------|",
  ];

  const groups = topicGroups.map((group) => ({
    ...group,
    problems: problems.filter((problem) => problem.tags.some((tag) => group.tags.includes(tag))),
  }));

  const other = problems.filter((problem) => !groups.some((group) => group.problems.includes(problem)));
  for (const group of groups) {
    if (group.problems.length) lines.push(`| ${group.name} | ${group.problems.length} |`);
  }
  if (other.length) lines.push(`| 其他 | ${other.length} |`);

  for (const group of groups) {
    if (!group.problems.length) continue;
    for (const problem of group.problems) assigned.add(problem.id);

    lines.push(
      "",
      `## ${group.name}`,
      "",
      "| 题号 | 题目 | 难度 | 标签 |",
      "|------|------|------|------|",
      ...group.problems.map((problem) => tableRow(problem)),
    );
  }

  if (other.length) {
    lines.push(
      "",
      "## 其他",
      "",
      "| 题号 | 题目 | 难度 | 标签 |",
      "|------|------|------|------|",
      ...other.map((problem) => tableRow(problem)),
    );
  }

  const duplicatedAssignments = groups.reduce((sum, group) => sum + group.problems.length, 0) - assigned.size;
  lines.splice(
    3,
    0,
    `当前覆盖 ${problems.length} 道题，跨题型重复收录 ${duplicatedAssignments} 次。`,
    "",
  );

  return `${lines.join("\n")}\n`;
}

function main() {
  const problems = readProblems();
  fs.writeFileSync(path.join(LEETCODE_DIR, "index-by-difficulty.md"), buildDifficultyIndex(problems));
  fs.writeFileSync(path.join(LEETCODE_DIR, "index-by-topic.md"), buildTopicIndex(problems));
  console.log(`built indexes for ${problems.length} problems`);
}

main();
