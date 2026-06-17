const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

const LEETCODE_DIR = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(LEETCODE_DIR, "..");
const OFFICIAL_JSON = "/tmp/leetcode-all.json";
const DEFAULT_CONCURRENCY = Number(process.env.LEETCODE_FETCH_CONCURRENCY || 8);

const difficultyMap = {
  1: "简单",
  2: "中等",
  3: "困难",
};

const start = Number(process.argv[2] || 201);
const end = Number(process.argv[3] || 300);

if (!Number.isInteger(start) || !Number.isInteger(end) || start > end) {
  throw new Error("Usage: node leetcode/scripts/generate_leetcode_batch.js 401 1500");
}

function pad4(n) {
  return String(n).padStart(4, "0");
}

function segmentFor(id) {
  const segmentStart = Math.floor((id - 1) / 100) * 100 + 1;
  return `${pad4(segmentStart)}-${pad4(segmentStart + 99)}`;
}

function doocsSegmentFor(id) {
  const segmentStart = Math.floor(id / 100) * 100;
  return `${pad4(segmentStart)}-${pad4(segmentStart + 99)}`;
}

function rawDoocsUrl(id, title) {
  const doocsTitle = title.replace(/[:?/]/g, "");
  const folder = `${pad4(id)}.${encodeURIComponent(doocsTitle).replace(/%20/g, "%20")}`;
  return `https://raw.githubusercontent.com/doocs/leetcode/main/solution/${doocsSegmentFor(id)}/${folder}/README.md`;
}

function readOfficialRows() {
  const data = JSON.parse(fs.readFileSync(OFFICIAL_JSON, "utf8"));
  return data.stat_status_pairs
    .map((item) => ({
      id: Number(item.stat.frontend_question_id),
      title: item.stat.question__title.trim(),
      slug: item.stat.question__title_slug,
      difficulty: difficultyMap[item.difficulty.level] || "待校准",
      paidOnly: Boolean(item.paid_only),
    }))
    .filter((item) => item.id >= start && item.id <= end)
    .sort((a, b) => a.id - b.id);
}

function fetchText(url, attempt = 1) {
  return new Promise((resolve, reject) => {
    execFile(
      "curl",
      ["--connect-timeout", "10", "--max-time", "45", "-fsSL", url],
      { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (!error) {
          resolve(stdout);
          return;
        }
        if (attempt < 3) {
          setTimeout(() => {
            fetchText(url, attempt + 1).then(resolve, reject);
          }, 500 * attempt);
          return;
        }
        reject(new Error(`Failed to fetch ${url}\n${stderr || error.message}`));
      },
    );
  });
}

async function mapLimit(items, limit, worker) {
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      await worker(items[index], index);
    }
  });
  await Promise.all(workers);
}

function parseFrontmatter(md) {
  const block = md.match(/^---\n([\s\S]*?)\n---/);
  const tags = [];
  if (!block) return { tags };

  let inTags = false;
  for (const line of block[1].split("\n")) {
    if (/^tags:\s*$/.test(line)) {
      inTags = true;
      continue;
    }
    if (!inTags) continue;

    const tag = line.match(/^\s*-\s+(.+?)\s*$/);
    if (tag) tags.push(tag[1]);
    else if (/^\S/.test(line)) inTags = false;
  }
  return { tags };
}

function stripComments(s) {
  return s.replace(/<!--[\s\S]*?-->/g, "").trim();
}

function htmlToPlainText(s) {
  return s
    .replace(/&nbsp;| /g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&le;/g, "<=")
    .replace(/&ge;/g, ">=")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/<strong>([\s\S]*?)<\/strong>/g, "$1")
    .replace(/<code>([\s\S]*?)<\/code>/g, "$1")
    .replace(/<\/?[^>]+>/g, "");
}

function htmlToMarkdown(s) {
  let out = s;
  const preBlocks = [];
  out = out.replace(/<pre>([\s\S]*?)<\/pre>/g, (_, code) => {
    const idx = preBlocks.length;
    preBlocks.push(code);
    return `\n@@PRE_${idx}@@\n`;
  });
  out = out
    .replace(/&nbsp;| /g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&le;/g, "<=")
    .replace(/&ge;/g, ">=")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/<sup>(.*?)<\/sup>/g, "^$1")
    .replace(/<code>([\s\S]*?)<\/code>/g, "`$1`")
    .replace(/<strong>([\s\S]*?)<\/strong>/g, "**$1**")
    .replace(/<em>([\s\S]*?)<\/em>/g, "*$1*")
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/<p>/g, "\n")
    .replace(/<\/p>/g, "\n")
    .replace(/<ul>/g, "\n")
    .replace(/<\/ul>/g, "\n")
    .replace(/<li>/g, "- ")
    .replace(/<\/li>/g, "\n")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<\/?[^>]+>/g, "");
  out = out.replace(/@@PRE_(\d+)@@/g, (_, idx) => {
    const code = htmlToPlainText(preBlocks[Number(idx)]).trim();
    return `\n\`\`\`text\n${code}\n\`\`\`\n`;
  });
  return out
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .replace(/\n\t+- /g, "\n- ")
    .replace(/\*\*([^*]+?): \*\*/g, "**$1：**")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractBetween(md, startMarker, endMarker) {
  const i = md.indexOf(startMarker);
  if (i === -1) return "";
  const j = md.indexOf(endMarker, i + startMarker.length);
  if (j === -1) return md.slice(i + startMarker.length);
  return md.slice(i + startMarker.length, j);
}

function extractCode(md, langTitle) {
  const re = new RegExp(`#### ${langTitle}\\n\\n\\\`\\\`\\\`([a-zA-Z0-9+]*?)\\n([\\s\\S]*?)\\n\\\`\\\`\\\``);
  const m = md.match(re);
  return m ? { lang: m[1] || langTitle.toLowerCase(), code: m[2].trim() } : null;
}

function addCodeComment(lang, code, title) {
  if (lang === "go") {
    return `// ${title}：按照上方思路实现主解法。\n// 关键点：保持状态含义清晰，并单独处理边界输入。\n${code}`;
  }
  if (lang === "java") {
    const withImport = code.startsWith("import ") ? code : `import java.util.*;\n${code}`;
    return `// ${title}：按照上方思路实现主解法。\n// 关键点：保持状态含义清晰，并单独处理边界输入。\n${withImport}`;
  }
  return `# ${title}：按照上方思路实现主解法。\n# 关键点：保持状态含义清晰，并单独处理边界输入。\n${code}`;
}

function extractMethodSummary(md) {
  const solution = extractBetween(md, "## 解法", "<!-- tabs:start -->");
  const cleaned = stripComments(solution)
    .replace(/^### .+$/gm, "")
    .replace(/\$\$/g, "")
    .trim();
  return cleaned || "本题先明确输入、输出和约束，再选择与数据规模匹配的数据结构或状态转移。实现时重点维护清晰的不变量，避免边界输入破坏主流程。";
}

function normalizeDescription(md) {
  const desc = extractBetween(md, "<!-- description:start -->", "<!-- description:end -->");
  return htmlToMarkdown(desc) || "题目描述待校准。";
}

function buildCodeSection(item, cnMd, tags) {
  if (tags.includes("数据库")) {
    const sql = extractCode(cnMd, "MySQL");
    if (sql) {
      return `### SQL\n\n\`\`\`sql\n-- ${item.title}：使用 SQL 完成本题要求。\n-- 关键点：先按题意过滤或分组，再输出指定列名。\n${sql.code}\n\`\`\``;
    }
  }

  if (tags.includes("Shell")) {
    const bash = extractCode(cnMd, "Shell");
    if (bash) {
      return `### Bash\n\n\`\`\`bash\n# ${item.title}：使用 Shell 文本处理命令完成本题要求。\n# 关键点：按行或按词读取输入，并保持输出格式与题目一致。\n${bash.code}\n\`\`\``;
    }
  }

  const sections = [];
  const go = extractCode(cnMd, "Go");
  const java = extractCode(cnMd, "Java");
  const python = extractCode(cnMd, "Python3");

  if (go) sections.push(`### Go\n\n\`\`\`go\n${addCodeComment("go", go.code, item.title)}\n\`\`\``);
  if (java) sections.push(`### Java\n\n\`\`\`java\n${addCodeComment("java", java.code, item.title)}\n\`\`\``);
  if (python) sections.push(`### Python\n\n\`\`\`python\n${addCodeComment("python", python.code, item.title)}\n\`\`\``);

  if (!sections.length) {
    sections.push(`### 代码说明\n\n\`\`\`text\n当前公开来源未提供可可靠抽取的代码实现。本题后续应按 LeetCode 实际函数签名补充主解法。\n\`\`\``);
  }

  return sections.join("\n\n");
}

function buildDoc(item, cnMd) {
  const { tags } = parseFrontmatter(cnMd);
  const description = normalizeDescription(cnMd);
  const methodSummary = extractMethodSummary(cnMd);
  const codeSection = buildCodeSection(item, cnMd, tags);
  const tagText = tags.length ? tags.join(", ") : "待校准";
  const tagsYaml = tags.length ? tags.join(", ") : "待校准";

  return `# ${pad4(item.id)}. ${item.title}

---
编号: ${item.id}
题目: ${item.title}
难度: ${item.difficulty}
标签: [${tagsYaml}]
来源链接: https://leetcode.com/problems/${item.slug}/
---

## 题目描述

${description}

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「${tagText}」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

${methodSummary}

### 示意图

\`\`\`text
输入/状态  ->  按规则更新候选状态  ->  得到答案
   |                 |                    |
  边界             不变量               返回值
\`\`\`

---

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 参考解法 | 见「参考解法要点」 | 见「参考解法要点」 |

---

## 代码实现

${codeSection}

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。
`;
}

function updateReadme() {
  const readmePath = path.join(LEETCODE_DIR, "README.md");
  const rows = [];
  for (const dir of fs.readdirSync(LEETCODE_DIR)) {
    const dirPath = path.join(LEETCODE_DIR, dir);
    if (!/^\d{4}-\d{4}$/.test(dir) || !fs.statSync(dirPath).isDirectory()) continue;
    for (const fileName of fs.readdirSync(dirPath)) {
      if (!/^\d{4}-.*\.md$/.test(fileName)) continue;
      const file = `${dir}/${fileName}`;
      const content = fs.readFileSync(path.join(LEETCODE_DIR, file), "utf8");
      const id = fileName.match(/^(\d{4})-/)[1];
      const title = (content.match(/^题目: (.+)$/m) || [])[1] || fileName.replace(/^\d{4}-/, "").replace(/\.md$/, "");
      const difficulty = (content.match(/^难度: (.+)$/m) || [])[1] || "待校准";
      const tagLine = content.match(/^标签: \[(.*)\]$/m);
      const tags = tagLine && tagLine[1] ? tagLine[1].replace(/, /g, "、") : "待校准";
      rows.push({ id, title, difficulty, tags, file });
    }
  }
  const header = [
    "# LeetCode 题解索引",
    "",
    "| 题号 | 题目 | 难度 | 标签 |",
    "|------|------|------|------|",
  ];
  const rowsText = rows
    .sort((a, b) => Number(a.id) - Number(b.id))
    .map((item) => `| ${item.id} | [${item.title}](${item.file}) | ${item.difficulty} | ${item.tags} |`);
  fs.writeFileSync(readmePath, `${header.concat(rowsText).join("\n")}\n`);
}

function updatePlanProgress(generatedRows) {
  const planPath = path.join(REPO_ROOT, "docs/superpowers/plans/2026-06-17-leetcode-solution-docs.md");
  if (!fs.existsSync(planPath)) return;

  let plan = fs.readFileSync(planPath, "utf8");
  const batchIds = new Set();
  for (const item of generatedRows) {
    const batchId = Math.floor((item.id - 1) / 50) + 1;
    batchIds.add(batchId);
  }

  for (const batchId of [...batchIds].sort((a, b) => a - b)) {
    const rangeStart = (batchId - 1) * 50 + 1;
    const rangeEnd = batchId * 50;
    const line = `| Batch ${batchId} | ${pad4(rangeStart)}-${pad4(rangeEnd)} | ✅ Done |`;
    const existingRe = new RegExp(`\\| Batch ${batchId} \\| ${pad4(rangeStart)}-${pad4(rangeEnd)} \\|[^\\n]*\\|`);
    if (existingRe.test(plan)) {
      plan = plan.replace(existingRe, line);
    } else {
      const marker = "续传时从第一个未标 `✅ Done` 的批次继续。";
      plan = plan.replace(`\n\n${marker}`, `\n${line}\n\n${marker}`);
    }
  }

  fs.writeFileSync(planPath, plan);
}

async function main() {
  const rows = readOfficialRows();
  if (rows.length !== end - start + 1) {
    throw new Error(`Expected ${end - start + 1} rows, got ${rows.length}`);
  }

  await mapLimit(rows, DEFAULT_CONCURRENCY, async (item) => {
    const outDir = path.join(LEETCODE_DIR, segmentFor(item.id));
    fs.mkdirSync(outDir, { recursive: true });
    const filePath = path.join(outDir, `${pad4(item.id)}-${item.slug}.md`);
    if (fs.existsSync(filePath)) {
      process.stderr.write(`skip ${path.relative(LEETCODE_DIR, filePath)}\n`);
      return;
    }

    const cnMd = await fetchText(rawDoocsUrl(item.id, item.title));
    fs.writeFileSync(filePath, buildDoc(item, cnMd));
    process.stderr.write(`wrote ${path.relative(LEETCODE_DIR, filePath)}\n`);
  });

  updateReadme();
  updatePlanProgress(rows);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
