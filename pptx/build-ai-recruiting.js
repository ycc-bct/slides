// Builds an editable PowerPoint version of slides/ai-recruiting.
// Geometry is authored on the same 1920 × 1080 grid as the web deck and converted here.
const path = require('node:path');
const pptxgen = require('pptxgenjs');

const OUT = path.join(__dirname, 'AI智慧招募自動化.pptx');
const ASSET = (f) => path.join(__dirname, 'assets', f);

const inch = (px) => +(px / 144).toFixed(4);
const pt = (px) => +(px * 0.5).toFixed(2);

// Microsoft JhengHei ships with Windows and with Office for Mac, and its Latin glyphs follow Segoe UI.
const FONT = 'Microsoft JhengHei';
const MONO = 'Consolas';
// Stands in for the web deck's Google Sans Flex numerals; Office installs it on Windows and Mac.
const DISPLAY = 'Century Gothic';

const C = {
  bg: '0A0D12',
  text: 'F4EDE3',
  dim: '9AA3AE',
  faint: '5A6470',
  accent: '4D9DFF',
  panel: '0F141B',
  panel2: '131A24',
  steel: '9AB4D2',
  ghost: '2B3440',
  tableRule: '1E242D',
  tableRuleStrong: '2D3540',
  tableAfter: '0D141D',
};

// Translucency, as PowerPoint transparency percentages.
const T = { line: 86, lineStrong: 76, aiSoft: 88, aiLine: 64, aiCard: 92, aiLayer: 91, aiChip: 94, pill: 98 };

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = 'AI 智慧招募自動化';
pres.company = 'Bahwan CyberTek';
pres.theme = { headFontFace: FONT, bodyFontFace: FONT };

// ─── Drawing helpers (fresh option objects every call: pptxgenjs mutates them) ───

function text(slide, content, o) {
  slide.addText(content, {
    x: inch(o.x),
    y: inch(o.y),
    w: inch(o.w),
    h: inch(o.h),
    fontFace: o.font ?? FONT,
    fontSize: o.size,
    color: o.color ?? C.text,
    bold: o.bold ?? false,
    align: o.align ?? 'left',
    valign: o.valign ?? 'middle',
    charSpacing: o.cs,
    lineSpacing: o.lh,
    margin: o.margin ?? 0,
    paraSpaceBefore: 0,
    paraSpaceAfter: o.after ?? 0,
    lang: 'zh-TW',
    fit: 'none',
    isTextBox: true,
    ...(o.shape ? { shape: o.shape, rectRadius: o.radius, fill: o.fill, line: o.lineStyle } : {}),
  });
}

function box(slide, o) {
  const round = o.radius !== undefined;
  slide.addShape(round ? pres.shapes.ROUNDED_RECTANGLE : pres.shapes.RECTANGLE, {
    x: inch(o.x),
    y: inch(o.y),
    w: inch(o.w),
    h: inch(o.h),
    ...(round ? { rectRadius: inch(o.radius) } : {}),
    fill: o.fill ? { color: o.fill, transparency: o.fillT ?? 0 } : { type: 'none' },
    line: o.line ? { color: o.line, transparency: o.lineT ?? 0, width: o.lw ?? 0.75 } : { type: 'none' },
  });
}

function hline(slide, x1, x2, y, color, transparency, width = 0.75, dash) {
  slide.addShape(pres.shapes.LINE, {
    x: inch(x1),
    y: inch(y),
    w: inch(x2 - x1),
    h: 0,
    line: { color, transparency, width, ...(dash ? { dashType: dash } : {}) },
  });
}

function vline(slide, x, y1, y2, color, transparency, width = 1) {
  slide.addShape(pres.shapes.LINE, {
    x: inch(x),
    y: inch(y1),
    w: 0,
    h: inch(y2 - y1),
    line: { color, transparency, width },
  });
}

function dot(slide, cx, cy, d, color, transparency = 0, glow = false) {
  slide.addShape(pres.shapes.OVAL, {
    x: inch(cx - d / 2),
    y: inch(cy - d / 2),
    w: inch(d),
    h: inch(d),
    fill: { color, transparency },
    line: { type: 'none' },
    ...(glow ? { shadow: { type: 'outer', color, blur: 8, offset: 0, angle: 0, opacity: 0.75 } } : {}),
  });
}

function image(slide, file, x, y, w, h) {
  slide.addImage({ path: ASSET(file), x: inch(x), y: inch(y), w: inch(w), h: inch(h) });
}

// A right-pointing chevron between two cards, centred on (cx, cy).
function chevron(slide, cx, cy) {
  const s = 6;
  const opts = () => ({ color: C.steel, transparency: T.lineStrong, width: 1.1 });
  slide.addShape(pres.shapes.LINE, { x: inch(cx - s / 2), y: inch(cy - s), w: inch(s), h: inch(s), line: opts() });
  slide.addShape(pres.shapes.LINE, { x: inch(cx - s / 2), y: inch(cy), w: inch(s), h: inch(s), flipV: true, line: opts() });
}

// ─── Slide masters: the layouts a salesperson picks from 「新增投影片」 ───
// Layout ids stay ASCII because pptxgenjs builds media part names from them;
// finalize.py gives them their Chinese display names.

const footerTrack = () => ({
  line: {
    x: inch(104),
    y: inch(1027),
    w: inch(1712),
    h: 0,
    line: { color: C.steel, transparency: T.lineStrong, width: 1 },
  },
});

const slideNumber = () => ({
  x: inch(1616),
  y: inch(1036),
  w: inch(200),
  h: inch(24),
  fontFace: MONO,
  fontSize: 8,
  color: C.faint,
  align: 'right',
  margin: 0,
});

const titlePlaceholder = () => ({
  placeholder: {
    options: {
      name: 'title',
      type: 'title',
      x: inch(154),
      y: inch(68),
      w: inch(1662),
      h: inch(67),
      fontFace: FONT,
      fontSize: 27,
      bold: true,
      color: C.text,
      align: 'left',
      valign: 'middle',
      margin: 0,
    },
    text: '按一下以新增標題',
  },
});

const headerRule = () => ({
  line: {
    x: inch(104),
    y: inch(161),
    w: inch(1712),
    h: 0,
    line: { color: C.steel, transparency: T.line, width: 0.75 },
  },
});

pres.defineSlideMaster({
  title: 'COVER',
  background: { path: ASSET('background.jpg') },
  objects: [],
});

pres.defineSlideMaster({
  title: 'CONTENT',
  background: { path: ASSET('background.jpg') },
  objects: [titlePlaceholder(), headerRule(), footerTrack()],
  slideNumber: slideNumber(),
});

pres.defineSlideMaster({
  title: 'CONTENT_TEXT',
  background: { path: ASSET('background.jpg') },
  objects: [
    titlePlaceholder(),
    headerRule(),
    footerTrack(),
    {
      placeholder: {
        options: {
          name: 'body',
          type: 'body',
          x: inch(104),
          y: inch(210),
          w: inch(1712),
          h: inch(760),
          fontFace: FONT,
          fontSize: 16,
          color: C.dim,
          valign: 'top',
          margin: 0,
        },
        text: '按一下以新增文字',
      },
    },
  ],
  slideNumber: slideNumber(),
});

pres.defineSlideMaster({
  title: 'CLOSING',
  background: { path: ASSET('background.jpg') },
  objects: [footerTrack()],
  slideNumber: slideNumber(),
});

// ─── Shared page furniture ───

function contentSlide(num, title, footer) {
  const slide = pres.addSlide({ masterName: 'CONTENT' });
  text(slide, num, { x: 104, y: 100, w: 48, h: 33, size: 11, bold: true, color: C.accent, font: DISPLAY });
  slide.addText(title, { placeholder: 'title', lang: 'zh-TW' });
  footerLabel(slide, footer);
  return slide;
}

function footerLabel(slide, label) {
  text(slide, label.toUpperCase(), { x: 104, y: 1036, w: 800, h: 24, size: 8, font: MONO, color: C.faint, cs: 1.3 });
}

function monoRight(slide, label, y, right = 1637) {
  text(slide, label, { x: right - 537, y, w: 537, h: 26, size: 8.5, font: MONO, color: C.faint, cs: 1.5, align: 'right' });
}

function innodiskMark(slide) {
  image(slide, 'innodisk-wordmark.png', 1659, 97, 157, 30);
}

function caseStudyMark(slide) {
  monoRight(slide, 'CASE STUDY', 99);
  innodiskMark(slide);
}

function takeaway(slide, y, content) {
  box(slide, { x: 104, y, w: 1712, h: 79, fill: C.accent, fillT: T.aiLayer });
  box(slide, { x: 104, y, w: 3, h: 79, fill: C.accent });
  text(slide, content, { x: 135, y, w: 1660, h: 79, size: 13, bold: true });
}

function chip(slide, x, y, label, align = 'left') {
  const w = 304;
  const h = 39;
  const left = align === 'center' ? x - w / 2 : x;
  text(slide, label, {
    x: left,
    y,
    w,
    h,
    size: 7.5,
    font: MONO,
    color: C.accent,
    cs: 0.9,
    margin: [pt(37), 0, 0, 0],
    shape: pres.shapes.ROUNDED_RECTANGLE,
    radius: inch(h / 2),
    fill: { color: C.accent, transparency: T.aiSoft },
    lineStyle: { color: C.accent, transparency: T.aiLine, width: 0.75 },
  });
  dot(slide, left + 23, y + h / 2, 8, C.accent, 0, true);
}

// ─── 1 · Cover ───

{
  const s = pres.addSlide({ masterName: 'COVER' });
  image(s, 'bct-logo-white.png', 104, 70, 158, 40);
  text(s, 'TALENT ACQUISITION AUTOMATION', {
    x: 1216, y: 77, w: 600, h: 26, size: 8.5, font: MONO, color: C.faint, cs: 1.5, align: 'right',
  });
  chip(s, 104, 220, 'RIGHT PEOPLE ON THE BUS');
  text(
    s,
    [
      { text: 'AI', options: { color: C.accent, fontFace: DISPLAY } },
      { text: ' 智慧招募自動化', options: { color: C.text } },
    ],
    { x: 104, y: 300, w: 1500, h: 180, size: 75, bold: true },
  );
  text(
    s,
    [
      { text: '運用 AI 與流程自動化，提升從人才吸引、履歷篩選到面試安排的招募效率。', options: { color: C.dim, breakLine: true } },
      { text: '延伸企業既有 HR 系統能力，而非取代現有系統。', options: { color: C.text, bold: true } },
    ],
    { x: 104, y: 515, w: 1300, h: 110, size: 15.5, lh: 27.3, valign: 'top' },
  );

  // Recruitment pipeline rail: accent stages are where AI assists.
  hline(s, 104, 1816, 873, C.accent, 55, 1);
  const nodes = [
    [229.5, '人才吸引', false],
    [521.5, '履歷彙整', false],
    [813.5, 'AI 人才配對', true],
    [1106.5, '招募人員審核', false],
    [1398.5, '智慧面試排程', true],
    [1691.5, '人才評估', false],
  ];
  for (const [cx, label, ai] of nodes) {
    dot(s, cx, 873, 25, ai ? C.accent : C.text, ai ? 84 : 91);
    dot(s, cx, 873, 13, ai ? C.accent : C.text, 0, ai);
    text(s, label, { x: cx - 125, y: 895, w: 250, h: 33, size: 11, align: 'center', color: ai ? C.accent : C.faint, bold: ai });
  }
}

// ─── 2 · Context ───

{
  const s = contentSlide('01', '當招募規模快速成長，如何更有效率地找到「對的人」？', 'Context');

  const card = (x, w, ai) =>
    box(s, {
      x, y: 311, w, h: 448, radius: 14,
      fill: ai ? C.accent : C.panel, fillT: ai ? T.aiCard : 0,
      line: ai ? C.accent : C.steel, lineT: ai ? T.aiLine : T.line,
    });
  const kick = (x, label, ai = false) => text(s, label, { x, y: 344, w: 460, h: 29, size: 9.5, color: ai ? C.accent : C.faint });
  const rule = (x1, x2, ai = false) => hline(s, x1, x2, 623, ai ? C.accent : C.steel, ai ? T.aiLine : T.line);

  card(104, 522, false);
  kick(139, '2025 新進員工');
  text(
    s,
    [
      { text: '638', options: { fontSize: 62, bold: true, fontFace: DISPLAY } },
      { text: ' 人', options: { fontSize: 22, fontFace: FONT } },
    ],
    { x: 139, y: 380, w: 460, h: 125, size: 62, valign: 'bottom' },
  );
  rule(139, 591);
  text(s, '2025 年研華台灣總部新進員工', { x: 139, y: 644, w: 470, h: 41, size: 12.5, color: C.dim });
  text(s, '2024 年為 344 人', { x: 139, y: 693, w: 460, h: 34, size: 10.5, color: C.faint });

  card(652, 616, true);
  kick(687, '研華人才招募核心理念', true);
  text(s, 'Right People on the Bus', { x: 687, y: 387, w: 560, h: 45, size: 15 });
  text(s, '「先找到對的人，\n再決定要做什麼」', {
    x: 687, y: 454, w: 560, h: 117, size: 20, bold: true, color: C.accent, lh: 29.2, valign: 'top',
  });
  hline(s, 687, 1233, 672, C.accent, T.aiLine);
  text(s, '人才決策的品質，決定後續所有決策的品質。', { x: 687, y: 693, w: 560, h: 34, size: 10.5, color: C.faint });

  card(1294, 522, false);
  kick(1329, 'Elite 招募計畫');
  text(
    s,
    [
      { text: '23', options: { fontSize: 62, bold: true, fontFace: DISPLAY } },
      { text: '%', options: { fontSize: 30, bold: true, fontFace: DISPLAY } },
    ],
    { x: 1329, y: 380, w: 460, h: 125, size: 62, valign: 'bottom' },
  );
  rule(1329, 1781);
  text(s, '2025 年 Elite 系列招募活動整體成效', { x: 1329, y: 644, w: 475, h: 41, size: 12.5, color: C.dim });
  text(s, '高於原訂 20% 目標', { x: 1329, y: 693, w: 460, h: 34, size: 10.5, color: C.faint });

  takeaway(s, 793, '當招募規模持續成長，如何將「找到對的人」的能力，延伸到更大規模的日常招募流程？');
}

// ─── 3 · Process ───

{
  const s = contentSlide('02', 'AI 可以如何延伸既有招募流程？', 'Process');
  text(s, '現有流程 ＋ AI 增強點', { x: 1316, y: 98, w: 500, h: 29, size: 9.5, color: C.faint, align: 'right' });

  const COLS = [104, 538, 971, 1405];
  const ROWS = [329, 546];
  const W = 412;
  const H = 197;

  const stage = (col, row, idx, title, detail, link) => {
    const x = COLS[col];
    const y = ROWS[row];
    box(s, { x, y, w: W, h: H, radius: 12, fill: C.panel, line: C.steel, lineT: T.line });
    text(s, idx, { x: x + 27, y: y + 27, w: 80, h: 29, size: 9.5, bold: true, color: C.faint, font: DISPLAY });
    text(s, title, { x: x + 27, y: y + 68, w: 370, h: 36, size: 13, bold: true });
    if (detail.ai) {
      hline(s, x + 27, x + 385, y + 130, C.accent, T.aiLine, 0.75, 'dash');
      dot(s, x + 31, y + 157, 8, C.accent, 0, true);
      text(s, detail.ai, { x: x + 45, y: y + 143, w: 350, h: 28, size: 9.5, color: C.accent });
    } else {
      text(s, detail.text, { x: x + 27, y: y + 116, w: 370, h: 60, size: 9, color: C.faint, lh: 14, valign: 'top' });
    }
    if (link) chevron(s, x + W + 11, y + H / 2);
  };

  stage(0, 0, '01', '多元人才來源', { text: '104｜企業人才網站\n員工推薦｜Elite 招募計畫' }, true);
  stage(1, 0, '02', '履歷彙整', { text: '不同來源的履歷進入統一流程' }, true);
  stage(2, 0, '03', '履歷篩選與人才初步排序', { ai: 'AI 人才適配分析' }, true);
  stage(3, 0, '04', '招募人員審核', { ai: 'AI 協助候選人優先排序' }, false);
  stage(0, 1, '05', '用人主管審核', { text: '確認人選是否符合團隊需求' }, true);
  stage(1, 1, '06', '面試安排', { ai: '智慧面試排程' }, true);
  stage(2, 1, '07', '面試評估與人才決策', { text: '彙整面試回饋，決定錄用人選' }, true);
  stage(3, 1, '08', '錄用與新人報到', { text: '完成錄取流程並銜接報到' }, false);

  takeaway(s, 776, 'AI 協助分析與排序，最終人才決策仍由招募人員與用人主管負責。');
}

// ─── 4 · Innodisk before / after ───

{
  const s = contentSlide('03', '宜鼎案例：從分散作業走向 AI 智慧招募', 'Innodisk · Before / After');
  caseStudyMark(s);

  const STEP_Y = [342, 423, 505, 586, 668, 749, 831];
  const column = (x, head, tag, steps, after) => {
    text(s, head, { x, y: 283, w: 300, h: 42, size: 14, bold: true });
    text(s, tag, { x: x + 378, y: 292, w: 300, h: 23, size: 7.5, font: MONO, color: C.faint, cs: 1.2, align: 'right' });
    steps.forEach((label, i) => {
      const y = STEP_Y[i];
      box(s, {
        x, y, w: 678, h: 71, radius: 10,
        fill: after ? C.panel2 : C.panel,
        line: C.steel, lineT: after ? T.lineStrong : T.line,
      });
      dot(s, x + 26, y + 35.5, 6, C.faint);
      text(s, label, { x: x + 46, y, w: 600, h: 71, size: 11.5, color: after ? C.text : C.dim });
    });
  };

  column(104, '導入前', 'BEFORE', ['多來源履歷', '人工整理', '逐份履歷篩選', '人工聯繫候選人', '往返確認面試時間', '安排面試', '整理面試結果'], false);
  column(1138, '導入後', 'AFTER', ['履歷集中彙整', 'AI 人才適配分析', '候選人優先排序', '招募人員審核', '候選人自動通知', '智慧面試排程', '面試評估集中管理'], true);

  box(s, { x: 810, y: 283, w: 300, h: 619, radius: 14, fill: C.accent, fillT: 93, line: C.accent, lineT: T.aiLine });
  image(s, 'bct-logo-white.png', 901, 483, 118, 30);
  text(s, 'AI 智慧招募\n自動化', { x: 820, y: 535, w: 280, h: 77, size: 13.5, bold: true, color: C.accent, align: 'center', lh: 19.2 });
  text(s, 'AI 協助排序\nHR 掌握最終決策', { x: 820, y: 634, w: 280, h: 67, size: 10.5, color: C.faint, align: 'center', lh: 16.8 });
}

// ─── 5 · Innodisk in practice ───

{
  const s = contentSlide('04', '宜鼎案例：招募人員實際怎麼使用？', 'Innodisk · In Practice');
  text(s, '從一個職缺開始', { x: 1237, y: 98, w: 400, h: 29, size: 9.5, color: C.faint, align: 'right' });
  innodiskMark(s);

  const ITEM_Y = [293, 426, 560, 694];
  const flowColumn = (x, items) => {
    vline(s, x + 26, 303, 768, C.steel, T.lineStrong, 1);
    items.forEach(([n, title, desc], i) => {
      const y = ITEM_Y[i];
      if (i > 0) hline(s, x + 78, x + 808, y - 25, C.steel, T.line);
      text(s, n, {
        x, y: y + 2, w: 52, h: 52, size: 10, bold: true, color: C.dim, align: 'center', font: DISPLAY,
        shape: pres.shapes.OVAL,
        fill: { color: C.panel },
        lineStyle: { color: C.steel, transparency: T.lineStrong, width: 0.75 },
      });
      text(s, title, { x: x + 78, y, w: 730, h: 39, size: 14.5, bold: true });
      text(s, desc, { x: x + 78, y: y + 48, w: 730, h: 33, size: 10.5, color: C.faint });
    });
  };

  flowColumn(104, [
    ['01', '建立職缺需求', '招募人員與用人主管確認人才條件'],
    ['02', '彙整候選人履歷', '不同招募來源的履歷進入統一流程'],
    ['03', 'AI 人才適配分析', '依職缺條件與候選人履歷進行分析與優先排序'],
    ['04', '招募人員審核', '優先檢視高適配候選人，最終篩選由招募人員決定'],
  ]);
  flowColumn(1008, [
    ['05', '用人主管確認', '將合適候選人提供用人主管進一步審核'],
    ['06', '發送面試邀請', '系統依條件自動通知候選人'],
    ['07', '智慧面試排程', '協調候選人、面試主管與會議資源'],
    ['08', '面試與評估', '彙整面試結果，協助後續人才決策'],
  ]);

  takeaway(s, 836, '從一個職缺開始，看 AI 如何融入日常招募工作。');
}

// ─── 6 · Impact ───

{
  const s = contentSlide('05', '宜鼎案例：導入前後的招募流程改變', 'Impact');
  caseStudyMark(s);

  const pairs = [
    ['不同來源履歷人工整理', '履歷集中彙整'],
    ['招募人員逐份進行初步篩選', 'AI 協助排序，優先檢視高適配人才'],
    ['人工寄送候選人通知', '依招募階段自動通知'],
    ['Email 往返確認面試時間', '智慧面試排程'],
    ['人工確認主管與會議資源', '自動協調可用時間與資源'],
    ['面試回饋分散', '評估結果集中彙整'],
  ];
  const rule = (color) => ({ type: 'solid', pt: 0.75, color });
  const none = { type: 'none' };
  const headCell = (label, color) => ({
    text: label,
    options: {
      fontFace: FONT, fontSize: 9.5, bold: true, color, fill: { color: C.panel },
      border: [rule(C.tableRule), none, rule(C.tableRuleStrong), none], valign: 'middle', lang: 'zh-TW',
    },
  });
  const bodyCell = (label, after, last) => ({
    text: label,
    options: {
      fontFace: FONT, fontSize: 11.5, bold: after, color: after ? C.text : C.dim,
      ...(after ? { fill: { color: C.tableAfter } } : {}),
      border: [none, none, last ? rule(C.tableRule) : rule(C.tableRule), none], valign: 'middle', lang: 'zh-TW',
    },
  });
  const rows = [[headCell('導入前', C.faint), headCell('導入後', C.accent)]];
  pairs.forEach(([before, after], i) => {
    const last = i === pairs.length - 1;
    rows.push([bodyCell(before, false, last), bodyCell(after, true, last)]);
  });
  s.addTable(rows, {
    x: inch(104),
    y: inch(266),
    w: inch(1712),
    colW: [inch(856), inch(856)],
    rowH: [inch(62), ...pairs.map(() => inch(63.6))],
    margin: [7.5, 13, 7.5, 13],
  });

  const band = (x, title, pills, ai) => {
    box(s, {
      x, y: 734, w: 844, h: 184, radius: 12,
      fill: ai ? C.accent : C.panel, fillT: ai ? T.aiCard : 0,
      line: ai ? C.accent : C.steel, lineT: ai ? T.aiLine : T.line,
    });
    text(s, title, { x: x + 27, y: 755, w: 790, h: 29, size: 9.5, color: ai ? C.accent : C.faint });
    let px = x + 27;
    let py = 796;
    for (const [label, w] of pills) {
      if (px + w > x + 844 - 27) {
        px = x + 27;
        py += 55;
      }
      text(s, label, {
        x: px, y: py, w, h: 46, size: 10.5, align: 'center',
        color: ai ? C.accent : C.dim,
        shape: pres.shapes.ROUNDED_RECTANGLE,
        radius: inch(23),
        fill: { color: ai ? C.accent : 'FFFFFF', transparency: ai ? T.aiChip : T.pill },
        lineStyle: { color: ai ? C.accent : C.steel, transparency: ai ? T.aiLine : T.line, width: 0.75 },
      });
      px += w + 14;
    }
  };
  band(104, '預期價值', [['減少重複性行政工作', 232], ['縮短招募作業時間', 210], ['提升人才篩選效率', 210], ['改善候選人體驗', 188]], false);
  band(972, '建議成效衡量指標', [['履歷初篩時間 ↓', 194], ['面試安排時間 ↓', 194], ['招募行政作業時間 ↓', 236], ['用人主管接受推薦人選比例 ↑', 322]], true);
}

// ─── 7 · Architecture ───

{
  const s = contentSlide('06', '延伸既有 HR 生態系，而非取代現有系統', 'Architecture');

  const layer = (y, tag, title, chips, core) => {
    box(s, {
      x: 104, y, w: 1712, h: 125, radius: 14,
      fill: core ? C.accent : C.panel, fillT: core ? T.aiLayer : 0,
      line: core ? C.accent : C.steel, lineT: core ? T.aiLine : T.line,
    });
    text(s, tag, { x: 139, y: y + 25, w: 400, h: 23, size: 7.5, font: MONO, color: C.faint, cs: 1.2 });
    let titleX = 139;
    if (core) {
      image(s, 'bct-logo-white.png', 139, y + 65, 103, 26);
      titleX = 258;
    }
    text(s, title, { x: titleX, y: y + 56, w: 440 - (titleX - 139), h: 44, size: 14.5, bold: true, color: core ? C.accent : C.text });
    let cx = 573;
    for (const [label, w] of chips) {
      text(s, label, {
        x: cx, y: y + 36, w, h: 53, size: 11, align: 'center',
        color: core ? C.accent : C.dim,
        shape: pres.shapes.ROUNDED_RECTANGLE,
        radius: inch(8),
        fill: { color: core ? C.accent : 'FFFFFF', transparency: core ? T.aiChip : T.pill },
        lineStyle: { color: core ? C.accent : C.steel, transparency: core ? T.aiLine : T.line, width: 0.75 },
      });
      cx += w + 12;
    }
  };
  const arrow = (y) => text(s, '↓', { x: 930, y, w: 60, h: 28, size: 12, color: C.faint, align: 'center' });

  layer(259, 'SOURCES', '人才來源', [['104', 80], ['企業人才網站', 176], ['員工推薦', 132], ['其他招募管道', 176]], false);
  arrow(398);
  layer(440, 'AUTOMATION LAYER', 'AI 智慧招募自動化', [['履歷整合', 132], ['AI 人才適配', 157], ['候選人優先排序', 197], ['流程自動化', 154], ['面試協調', 132], ['候選人溝通', 154]], true);
  arrow(579);
  layer(621, 'EXISTING SYSTEMS', '企業既有 HR 生態系', [['Workday', 134], ['Email', 102], ['Calendar', 136], ['Teams', 110], ['其他企業系統', 176]], false);

  takeaway(s, 780, '保留既有 HR 投資，補足跨平台、跨角色與跨流程的自動化需求。');
  text(s, '研華自 2023 年正式導入 Workday，並已應用於人才發展及內部轉調等流程。', {
    x: 104, y: 893, w: 1712, h: 32, size: 10, color: C.faint,
  });
}

// ─── 8 · Roadmap ───

{
  const s = contentSlide('07', '從一個高價值招募情境開始', 'Roadmap');
  monoRight(s, 'PROPOSED ROADMAP', 101, 1816);

  const COLS = [104, 538, 971, 1405];
  const phase = (col, n, tag, title, lead, items, link) => {
    const x = COLS[col];
    box(s, { x, y: 310, w: 412, h: 451, radius: 14, fill: C.panel, line: C.steel, lineT: T.line });
    text(s, n, { x: x + 29, y: 336, w: 200, h: 56, size: 26, bold: true, color: C.ghost, font: DISPLAY });
    text(s, tag, { x: x + 29, y: 409, w: 200, h: 18, size: 7, font: MONO, color: C.faint, cs: 1.1 });
    text(s, title, { x: x + 29, y: 437, w: 360, h: 42, size: 14, bold: true });
    text(s, lead, { x: x + 29, y: 495, w: 370, h: 34, size: 10.5, color: C.faint });
    text(
      s,
      items.map((item, i) => ({
        text: item,
        options: { bullet: { indent: 9 }, breakLine: i < items.length - 1 },
      })),
      { x: x + 29, y: 544, w: 370, h: 200, size: 10, color: C.dim, lh: 14.8, after: 4.5, valign: 'top' },
    );
    if (link) chevron(s, x + 412 + 11, 536);
  };

  phase(0, '01', 'PHASE 1', '了解現況', '選擇具代表性的 AI、研發或工程職缺', ['履歷來源', '人才篩選方式', '用人主管協作', '面試安排', '既有 Workday 流程'], true);
  phase(1, '02', 'PHASE 2', '找出自動化機會', '盤點可由 AI 承接的重複性工作', ['AI 人才適配', '候選人優先排序', '面試排程', '候選人溝通'], true);
  phase(2, '03', 'PHASE 3', '小規模驗證', '選擇 1–3 個職缺，衡量：', ['履歷篩選時間', '招募行政作業時間', '推薦人選接受率', '面試安排效率'], true);
  phase(3, '04', 'PHASE 4', '逐步擴大', '驗證有效後往外延伸', ['更多職缺', '更多事業單位', '更多人才來源', '更多招募流程'], false);

  takeaway(s, 795, '從一個實際招募情境開始，找出 AI 能降低重複性工作、同時強化「Right People on the Bus」的機會。');
}

// ─── 9 · Appendix ───

{
  const s = contentSlide('A', 'Appendix', 'Appendix');
  image(s, 'bct-logo-white.png', 1698, 97, 118, 30);

  hline(s, 104, 1816, 401, C.steel, T.line);
  const row = (y, n, label) => {
    text(s, n, { x: 112, y: y + 49, w: 90, h: 45, size: 15, bold: true, color: C.accent, font: DISPLAY });
    text(s, label, { x: 216, y: y + 43, w: 1500, h: 57, size: 19, bold: true });
    hline(s, 104, 1816, y + 142, C.steel, T.line);
  };
  row(401, 'A1', 'BCT 公司與台灣團隊介紹');
  row(543, 'A2', 'AI、資料、雲端與企業系統整合能力');
  row(685, 'A3', 'AI 智慧招募完整功能與延伸應用');
}

// ─── 10 · Close ───

{
  const s = pres.addSlide({ masterName: 'CLOSING' });
  chip(s, 960, 305, 'RIGHT PEOPLE ON THE BUS', 'center');
  text(
    s,
    [
      { text: '先找到對的人，', options: { breakLine: true } },
      { text: '再讓 ' },
      { text: 'AI', options: { color: C.accent } },
      { text: ' 把重複的工作接走。' },
    ],
    { x: 360, y: 390, w: 1200, h: 190, size: 31, bold: true, align: 'center', lh: 45.3 },
  );
  text(s, '延伸企業既有 HR 系統能力，從一個高價值招募情境開始驗證。', {
    x: 360, y: 629, w: 1200, h: 41, size: 12.5, color: C.dim, align: 'center',
  });
  image(s, 'bct-logo-white.png', 873, 731, 174, 44);
  footerLabel(s, 'Thank you');
}

pres.writeFile({ fileName: OUT }).then((f) => console.log('wrote', f));
