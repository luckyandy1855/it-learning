const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const LEETCODE_DIR = path.resolve(__dirname, "..");
const OFFICIAL_JSON = "/tmp/leetcode-all.json";

const difficultyMap = {
  1: "简单",
  2: "中等",
  3: "困难",
};

const start = Number(process.argv[2] || 1);
const end = Number(process.argv[3] || 100);

function pad4(n) {
  return String(n).padStart(4, "0");
}

function localSegmentFor(id) {
  const segmentStart = Math.floor((id - 1) / 100) * 100 + 1;
  const segmentEnd = segmentStart + 99;
  return `${pad4(segmentStart)}-${pad4(segmentEnd)}`;
}

function doocsSegmentFor(id) {
  const segmentStart = Math.floor(id / 100) * 100;
  const segmentEnd = segmentStart + 99;
  return `${pad4(segmentStart)}-${pad4(segmentEnd)}`;
}

function readOfficialRows() {
  const data = JSON.parse(fs.readFileSync(OFFICIAL_JSON, "utf8"));
  const rows = new Map();
  for (const item of data.stat_status_pairs) {
    const id = Number(item.stat.frontend_question_id);
    if (id < start || id > end) continue;
    rows.set(id, {
      id,
      title: item.stat.question__title,
      slug: item.stat.question__title_slug,
      difficulty: difficultyMap[item.difficulty.level] || "待校准",
    });
  }
  return rows;
}

function fetchText(url) {
  return execFileSync("curl", ["--connect-timeout", "10", "--max-time", "30", "-fsSL", url], {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });
}

function rawDoocsUrl(item) {
  const folder = `${pad4(item.id)}.${encodeURIComponent(item.title).replace(/%20/g, "%20")}`;
  return `https://raw.githubusercontent.com/doocs/leetcode/main/solution/${doocsSegmentFor(item.id)}/${folder}/README.md`;
}

function parseTags(md) {
  const block = md.match(/^---\n([\s\S]*?)\n---/);
  const tags = [];
  if (!block) return tags;

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
  return tags;
}

function findLocalFile(item) {
  const dir = path.join(LEETCODE_DIR, localSegmentFor(item.id));
  const expected = path.join(dir, `${pad4(item.id)}-${item.slug}.md`);
  if (fs.existsSync(expected)) return expected;

  const prefix = `${pad4(item.id)}-`;
  const found = fs.readdirSync(dir).find((name) => name.startsWith(prefix) && name.endsWith(".md"));
  if (!found) throw new Error(`Missing local file for ${pad4(item.id)} ${item.title}`);
  return path.join(dir, found);
}

function updateFrontmatter(filePath, item, tags) {
  const original = fs.readFileSync(filePath, "utf8");
  const next = original.replace(
    /---\n[\s\S]*?\n---/,
    `---\n编号: ${item.id}\n题目: ${item.title}\n难度: ${item.difficulty}\n标签: [${tags.length ? tags.join(", ") : "待校准"}]\n来源链接: https://leetcode.com/problems/${item.slug}/\n---`,
  );
  fs.writeFileSync(filePath, next);
}

function rebuildReadme() {
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

  rows.sort((a, b) => Number(a.id) - Number(b.id));
  const header = [
    "# LeetCode 题解索引",
    "",
    "- [按难度索引](index-by-difficulty.md)",
    "- [按题型索引](index-by-topic.md)",
    "",
    "| 题号 | 题目 | 难度 | 标签 |",
    "|------|------|------|------|",
  ];
  const body = rows.map((item) => `| ${item.id} | [${item.title}](${item.file}) | ${item.difficulty} | ${item.tags} |`);
  fs.writeFileSync(path.join(LEETCODE_DIR, "README.md"), `${header.concat(body).join("\n")}\n`);
}

function main() {
  const rows = readOfficialRows();
  for (const id of [...rows.keys()].sort((a, b) => a - b)) {
    const item = rows.get(id);
    const localFile = findLocalFile(item);
    const source = fetchText(rawDoocsUrl(item));
    const tags = parseTags(source);
    updateFrontmatter(localFile, item, tags);
    process.stderr.write(`calibrated ${path.relative(LEETCODE_DIR, localFile)}\n`);
  }
  rebuildReadme();
}

main();
