'use strict';
// Assessment engine tests · node:test（零依賴，Node 20 內建）
const { test } = require('node:test');
const assert = require('node:assert');
const AssessmentEngine = require('../src/assessment-engine.js');

const engine = new AssessmentEngine();

const QUESTIONS = [
  { id: 'L1_001', category: 'safety', reverse_scoring: false },
  { id: 'L1_002', category: 'routine', reverse_scoring: true },
  { id: 'L1_003', category: 'safety', reverse_scoring: false },
];
const ASSESSMENT = {
  levels: [
    { level: 1, name: 'Foundation / Grounding', chakra_id: 'muladhara',
      sephira_id: 'malkuth', questions: QUESTIONS },
    { level: 2, name: 'Emotional Flow', chakra_id: 'svadhisthana',
      sephira_id: 'yesod', questions: [
        { id: 'L2_001', category: 'emotion', reverse_scoring: false },
        { id: 'L2_002', category: 'creativity', reverse_scoring: false },
      ] },
  ],
};

test('reverse scoring flips the response (1 → 5)', () => {
  // L1_002 反向題：作答 5 → 計分 1；其餘作答 1 → 1
  const r = engine.calculateLevelScore(QUESTIONS, { L1_001: 1, L1_002: 5, L1_003: 1 });
  assert.strictEqual(r.total, 3);
  assert.strictEqual(r.answered, 3);
});

test('percentage and max possible', () => {
  const r = engine.calculateLevelScore(QUESTIONS, { L1_001: 3, L1_002: 3, L1_003: 3 });
  assert.strictEqual(r.total, 9);
  assert.strictEqual(r.maxPossible, 15);
  assert.strictEqual(Math.round(r.percentage), 60);
});

test('unanswered questions are excluded, not zero-scored', () => {
  const r = engine.calculateLevelScore(QUESTIONS, { L1_001: 5 });
  assert.strictEqual(r.answered, 1);
  assert.strictEqual(r.total, 5);
  assert.strictEqual(r.maxPossible, 15);   // 滿分仍以全部題數計
});

test('interpretation thresholds (<40 / <60 / <80 / else)', () => {
  // 簽名：interpretScore(total, questionCount)——百分比＝total/(questionCount*5)
  assert.strictEqual(engine.interpretScore(15, 10), 'very_low');  // 30%
  assert.strictEqual(engine.interpretScore(20, 10), 'low');       // 40%
  assert.strictEqual(engine.interpretScore(30, 10), 'balanced');  // 60%
  assert.strictEqual(engine.interpretScore(40, 10), 'high');      // 80%
});

test('balance: deficient / excessive / balanced', () => {
  // L1_002 是反向題：作答 5→計 1、作答 1→計 5
  assert.strictEqual(engine.calculateLevelScore(QUESTIONS,
    { L1_001: 1, L1_002: 5, L1_003: 1 }).balance, 'deficient');   // 3/15 = 20%
  assert.strictEqual(engine.calculateLevelScore(QUESTIONS,
    { L1_001: 5, L1_002: 1, L1_003: 5 }).balance, 'excessive');   // 15/15 = 100%
  assert.strictEqual(engine.calculateLevelScore(QUESTIONS,
    { L1_001: 4, L1_002: 3, L1_003: 4 }).balance, 'balanced');    // 11/15 = 73%
});

test('category breakdown averages with reverse scoring', () => {
  const cats = engine.analyzeCategories(QUESTIONS,
    { L1_001: 2, L1_002: 5, L1_003: 4 });
  // safety: (2+4)/2 = 3；routine: 反向 5→1 → 1
  assert.strictEqual(cats.safety.average, 3);
  assert.strictEqual(cats.routine.average, 1);
  assert.strictEqual(cats.safety.percentage, 60);
});

test('pillar dominance: mercy / severity / tie→balance', () => {
  assert.strictEqual(engine.calculatePillarDominance(
    { mercy: [5, 4], severity: [2, 2], balance: [3, 3] }).dominant, 'mercy');
  assert.strictEqual(engine.calculatePillarDominance(
    { mercy: [1, 1], severity: [5, 5], balance: [3, 3] }).dominant, 'severity');
  assert.strictEqual(engine.calculatePillarDominance(
    { mercy: [3], severity: [3], balance: [3] }).dominant, 'balance');
});

test('calculateAllScores keys by level number and carries it (bug fix guard)', () => {
  const all = engine.calculateAllScores(ASSESSMENT, { L1_001: 3, L2_001: 4 });
  assert.deepStrictEqual(Object.keys(all), ['1', '2']);
  assert.strictEqual(all['1'].level, 1);       // 缺這個會讓建議永遠掉 fallback
  assert.strictEqual(all['2'].level, 2);
  assert.strictEqual(all['1'].name, 'Foundation / Grounding');
});

test('recommendations use level-specific practices, not the generic fallback', () => {
  // L1 全 1 分 → very_low → 應拿到 Foundation 的 deficiency 清單
  const all = engine.calculateAllScores(ASSESSMENT,
    { L1_001: 1, L1_002: 1, L1_003: 1, L2_001: 5, L2_002: 5 });
  const pillar = engine.calculatePillarDominance({ mercy: [3], severity: [3], balance: [3] });
  const recs = engine.generateRecommendations(all, pillar);
  const deficiency = recs.find(r => r.type === 'deficiency' && r.level === 'Foundation / Grounding');
  assert.ok(deficiency, 'very_low level should produce a deficiency recommendation');
  assert.deepStrictEqual(deficiency.practices, [
    'Grounding exercises', 'Nature walks', 'Physical exercise',
    'Establish routine', 'Financial planning']);
});

test('generateReport end-to-end', () => {
  const responses = { L1_001: 4, L1_002: 3, L1_003: 4, L2_001: 2, L2_002: 3 };
  const report = engine.generateReport(ASSESSMENT, responses,
    { mercy: [4, 5], severity: [2, 2], balance: [3] });
  assert.ok(report.overallBalance > 0 && report.overallBalance <= 100);
  assert.strictEqual(Object.keys(report.levels).length, 2);
  assert.ok(report.recommendations.some(r => r.type === 'pillar'));
  assert.ok(report.summary.includes('dominant archetype'));
  assert.ok(report.summary.includes('Pillar of Mercy Dominant'));
});
