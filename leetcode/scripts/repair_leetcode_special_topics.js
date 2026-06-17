const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const LEETCODE_DIR = path.resolve(__dirname, "..");

function pad4(n) {
  return String(n).padStart(4, "0");
}

function doocsSegmentFor(id) {
  const segmentStart = Math.floor(id / 100) * 100;
  return `${pad4(segmentStart)}-${pad4(segmentStart + 99)}`;
}

function fetchText(url) {
  return execFileSync("curl", ["--connect-timeout", "10", "--max-time", "30", "-fsSL", url], {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });
}

function rawDoocsUrl(id, title) {
  const folder = `${pad4(id)}.${encodeURIComponent(title).replace(/%20/g, "%20")}`;
  return `https://raw.githubusercontent.com/doocs/leetcode/main/solution/${doocsSegmentFor(id)}/${folder}/README.md`;
}

function extractCode(md, heading) {
  const re = new RegExp(`#### ${heading}\\n\\n\\\`\\\`\\\`([a-zA-Z0-9]+)\\n([\\s\\S]*?)\\n\\\`\\\`\\\``);
  const match = md.match(re);
  if (!match) return null;
  return { lang: match[1], code: match[2].trim() };
}

function replaceCodeSection(content, section) {
  return content.replace(/## 代码实现\n\n[\s\S]*?\n---\n\n## 踩坑记录/, `## 代码实现\n\n${section}\n\n---\n\n## 踩坑记录`);
}

function main() {
  const files = [];
  for (const dir of fs.readdirSync(LEETCODE_DIR)) {
    const dirPath = path.join(LEETCODE_DIR, dir);
    if (!/^\d{4}-\d{4}$/.test(dir) || !fs.statSync(dirPath).isDirectory()) continue;
    for (const fileName of fs.readdirSync(dirPath)) {
      if (/^\d{4}-.*\.md$/.test(fileName)) files.push(path.join(dirPath, fileName));
    }
  }

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf8");
    const id = Number((content.match(/^编号: (\d+)$/m) || [])[1]);
    const title = (content.match(/^题目: (.+)$/m) || [])[1];
    const tags = (content.match(/^标签: \[(.*)\]$/m) || [])[1] || "";
    if (!id || !title || (!tags.includes("数据库") && !tags.includes("Shell"))) continue;

    const source = fetchText(rawDoocsUrl(id, title));
    const sql = extractCode(source, "MySQL");
    const bash = extractCode(source, "Shell");

    let section = "";
    if (sql) {
      section = `### SQL\n\n\`\`\`sql\n-- ${title}：使用 SQL 完成本题要求。\n-- 关键点：先按题意过滤或分组，再输出指定列名。\n${sql.code}\n\`\`\``;
    } else if (bash) {
      section = `### Bash\n\n\`\`\`bash\n# ${title}：使用 Shell 文本处理命令完成本题要求。\n# 关键点：按行或按词读取输入，并保持输出格式与题目一致。\n${bash.code}\n\`\`\``;
    } else {
      throw new Error(`No SQL/Shell code found for ${path.relative(LEETCODE_DIR, filePath)}`);
    }

    fs.writeFileSync(filePath, replaceCodeSection(content, section));
    process.stderr.write(`repaired ${path.relative(LEETCODE_DIR, filePath)}\n`);
  }
}

main();
