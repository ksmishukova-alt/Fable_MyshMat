/**
 * Автотест банка задач и механики раннеров: `npm run verify:bank` (из apps/web).
 * Сам транспилирует банк через локальный TypeScript и проверяет:
 *  - L1: guidedSteps у каждой задачи, у каждого шага есть ответ/верный вариант;
 *  - L2: support согласован (planOrder — перестановка, действия вычислимы и равны value,
 *    findError корректен);
 *  - ответы входят в acceptedAnswers, подсказки каскада есть у всех;
 *  - формулы «Подсчёта фигур» сверены перебором, ответы задач равны формулам;
 *  - серверная нормализация принимает эталонные ответы.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, ".verify-build");
mkdirSync(out, { recursive: true });

// 1) транспиляция банка локальным tsc (мини-tsconfig с алиасом @/)
const cfgPath = path.join(out, "tsconfig.verify.json");
writeFileSync(
  cfgPath,
  JSON.stringify({
    compilerOptions: {
      outDir: out,
      rootDir: path.join(root, "src"),
      module: "esnext",
      target: "es2022",
      moduleResolution: "bundler",
      skipLibCheck: true,
      baseUrl: path.join(root, "src"),
      paths: { "@/*": ["./*"] },
    },
    files: [
      path.join(root, "src/lib/olympiad-bank.ts"),
      path.join(root, "src/lib/counting-figures-bank.ts"),
      path.join(root, "src/types/olympiad.ts"),
    ],
  }),
);
execFileSync(
  process.execPath,
  [path.join(root, "node_modules", "typescript", "bin", "tsc"), "-p", cfgPath],
  { stdio: "inherit" },
);

// 2) починка алиасов @/ → относительные пути
for (const f of ["lib/olympiad-bank.js", "lib/counting-figures-bank.js"]) {
  const fp = path.join(out, f);
  let src = readFileSync(fp, "utf-8");
  src = src.replace(/from "@\/lib\/([^"]+)"/g, 'from "./$1.js"');
  src = src.replace(/from "@\/types\/([^"]+)"/g, 'from "../types/$1.js"');
  writeFileSync(fp, src);
}

const { PROBLEMS, TOPICS } = await import(pathToFileURL(path.join(out, "lib/olympiad-bank.js")));
const { segCount, fanCount, gridSquares, rectCount } = await import(
  pathToFileURL(path.join(out, "lib/counting-figures-bank.js"))
);

let errors = 0;
const fail = (msg) => {
  errors++;
  console.error("FAIL:", msg);
};

// нормализация — копия серверной (api/olympiad/check)
const norm = (s) =>
  String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/,/g, ".")
    .replace(/[×·]/g, "*")
    .replace(/[:÷]/g, "/")
    .replace(/−/g, "-");

// ── формулы: перепроверка перебором ──
const bruteSeg = (n) => {
  let c = 0;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) c++;
  return c;
};
const bruteSquares = (n) => {
  let c = 0;
  for (let k = 1; k <= n; k++) c += (n - k + 1) ** 2;
  return c;
};
const bruteRect = (r, cc) => {
  let c = 0;
  for (let y1 = 0; y1 <= r; y1++)
    for (let y2 = y1 + 1; y2 <= r; y2++)
      for (let x1 = 0; x1 <= cc; x1++) for (let x2 = x1 + 1; x2 <= cc; x2++) c++;
  return c;
};
for (let n = 2; n <= 10; n++) {
  if (segCount(n) !== bruteSeg(n)) fail(`segCount(${n})`);
  if (fanCount(n) !== bruteSeg(n + 1)) fail(`fanCount(${n}) ≠ C(${n + 1},2)`);
  if (gridSquares(n) !== bruteSquares(n)) fail(`gridSquares(${n})`);
}
if (rectCount(3, 4) !== bruteRect(3, 4)) fail("rectCount(3,4)");

// ── инварианты банка ──
const ids = new Set();
for (const p of PROBLEMS) {
  const tag = `${p.id} (${p.topicId} L${p.level})`;
  if (ids.has(p.id)) fail(`дубль id ${p.id}`);
  ids.add(p.id);
  if (!TOPICS.find((t) => t.id === p.topicId)) fail(`${tag}: неизвестная тема`);
  if (!p.statement?.trim()) fail(`${tag}: пустое условие`);
  if (!p.acceptedAnswers?.length) fail(`${tag}: нет acceptedAnswers`);
  if (!p.acceptedAnswers.some((a) => norm(a) === norm(p.expectedAnswer)))
    fail(`${tag}: expectedAnswer не входит в accepted`);
  if (!p.hints?.length) fail(`${tag}: нет подсказок каскада`);

  if (p.level === 1) {
    if (!p.guidedSteps?.length) fail(`${tag}: L1 без guidedSteps`);
    for (const st of p.guidedSteps ?? []) {
      const hasOpts = !!st.options?.length;
      const hasAcc = !!st.accepted?.length;
      if (!hasOpts && !hasAcc) fail(`${tag}/${st.id}: шаг без ответа`);
      if (hasOpts && !st.options.some((o) => o.isCorrect))
        fail(`${tag}/${st.id}: нет верного варианта`);
    }
  }
  if (p.level === 2) {
    if (!p.support) fail(`${tag}: L2 без support`);
    const sup = p.support ?? {};
    if (sup.planCards) {
      if (!sup.planOrder || sup.planOrder.length !== sup.planCards.length)
        fail(`${tag}: planOrder не согласован с planCards`);
      const sorted = [...(sup.planOrder ?? [])].sort((a, b) => a - b);
      if (sorted.some((v, i) => v !== i)) fail(`${tag}: planOrder не перестановка`);
    }
    for (const [i, a] of (sup.actions ?? []).entries()) {
      if (a.correctKind < 0 || a.correctKind >= a.kinds.length)
        fail(`${tag}: action ${i} correctKind вне диапазона`);
      if (!a.acceptedExpressions?.length) fail(`${tag}: action ${i} без выражений`);
      if (a.value !== undefined) {
        const expr = norm(a.acceptedExpressions[0]);
        if (/^[0-9+\-*/().]+$/.test(expr)) {
          const val = Function(`"use strict";return (${expr})`)();
          if (val !== a.value) fail(`${tag}: action ${i}: ${expr} = ${val} ≠ ${a.value}`);
        }
      }
    }
    if (sup.findError) {
      if (sup.findError.wrongLine < 0 || sup.findError.wrongLine >= sup.findError.lines.length)
        fail(`${tag}: findError.wrongLine вне диапазона`);
      if (!sup.findError.acceptedFixes?.length) fail(`${tag}: findError без acceptedFixes`);
    }
  }
  if (p.figure) {
    const f = p.figure;
    const expect =
      f.kind === "segments"
        ? segCount(f.points)
        : f.kind === "fan"
          ? fanCount(f.parts)
          : f.kind === "grid"
            ? gridSquares(f.size)
            : rectCount(f.rows, f.cols);
    if (norm(p.expectedAnswer) !== norm(String(expect)))
      fail(`${tag}: ответ ${p.expectedAnswer} ≠ формуле ${expect}`);
  }
}

// ── сводка ──
const byTopic = {};
for (const p of PROBLEMS) {
  byTopic[p.topicId] ??= { 1: 0, 2: 0, 3: 0 };
  byTopic[p.topicId][p.level]++;
}
console.log("Банк задач:");
for (const [t, lv] of Object.entries(byTopic)) {
  console.log(
    `  ${t.padEnd(18)} L1:${lv[1]}  L2:${lv[2]}  L3:${lv[3]}  всего:${lv[1] + lv[2] + lv[3]}`,
  );
}
console.log(errors === 0 ? "\nBANK OK — все механики согласованы" : `\nОшибок: ${errors}`);
process.exit(errors ? 1 : 0);
