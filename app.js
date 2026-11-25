/* Copyright (C) 2026 Cinderella_yufeng; SPDX-License-Identifier: AGPL-3.0-only */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var state = { result: null, demo: false, presetId: 'lab-six', presetEdited: false, lastUnit: 'mg', errorRaw: '', noticeRaw: '' };
  var i18n = window.BCA_I18N;
  function L(value) { return i18n.text(value); }
  function choose(zh, en) { return i18n.language() === 'zh' ? zh : en; }
  function displayName(sample) {
    return sample.autoName ? choose(sample.name, sample.name.replace(/^样品/, 'Sample ')) : sample.name;
  }
  function presetName(preset) {
    return preset && preset.id.indexOf('local:') === 0 ? preset.name : L(preset ? preset.name : '自定义');
  }
  var PRESETS = window.BCA_KIT_PRESETS;
  var CONCENTRATIONS = [0, 0.125, 0.25, 0.5, 1, 2]; // Only for old six-point backups.
  var METHOD_NAMES = { linear: '线性回归', quadratic: '二次回归', piecewise: '逐点插值' };
  var DEMO_STANDARDS = [
    '0.070\t0.173\t0.273\t0.465\t0.850\t1.595',
    '0.072\t0.175\t0.275\t0.467\t0.852\t1.597'
  ].join('\n');
  var DEMO_SAMPLES = ['0.539\t0.232\t0.390', '0.541\t0.235\t0.392'].join('\n');

  function cleanCell(value) { return String(value == null ? '' : value).replace(/^\uFEFF/, '').trim(); }
  function number(value) {
    var s = cleanCell(value);
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(s)) return NaN;
    var n = Number(s);
    return Number.isFinite(n) ? n : NaN;
  }
  function finiteCells(row) { return row.length > 0 && row.every(function (v) { return Number.isFinite(number(v)); }); }
  function avg(values) { return values.reduce(function (a, b) { return a + b; }, 0) / values.length; }
  function sampleSD(values) {
    if (values.length < 2) return null;
    var m = avg(values);
    return Math.sqrt(values.reduce(function (sum, v) { return sum + Math.pow(v - m, 2); }, 0) / (values.length - 1));
  }
  function fmt(value, decimals) {
    if (!Number.isFinite(value)) return '—';
    if (Math.abs(value) >= 1e12 || (value !== 0 && Math.abs(value) < 1e-7)) return value.toExponential(3);
    var out = value.toFixed(decimals);
    return Number(out) === 0 ? Number(0).toFixed(decimals) : out;
  }
  function formatR2(value, threshold) {
    var short = fmt(value, 8);
    return value > threshold && Number(short) <= threshold ? value.toPrecision(17) : short;
  }
  function coefficient(value) {
    return value === 0 || !Number.isFinite(value) ? '0' : Number(value.toPrecision(7)).toString();
  }
  function signedTerm(value, suffix) { return (value < 0 ? ' − ' : ' + ') + coefficient(Math.abs(value)) + suffix; }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
  function fail(message) { throw new Error(message); }
  function trimTrailing(row) {
    row = row.slice();
    while (row.length && row[row.length - 1] === '') row.pop();
    return row;
  }

  // Excel paste, CSV and TSV including quoted cells.
  function trimBlankEdges(rows, keepLeading) {
    while (!keepLeading && rows.length && !rows[0].length) rows.shift();
    while (rows.length && !rows[rows.length - 1].length) rows.pop();
    return rows;
  }
  function readRows(text, keepEmptyRows) {
    text = String(text).replace(/^\uFEFF/, '');
    var first = text.split(/\r?\n/).filter(function (line) { return line.trim() !== ''; })[0] || '';
    if (/^sep=./i.test(first.trim())) {
      text = text.slice(text.indexOf(first) + first.length).replace(/^\r?\n/, '');
      first = text.split(/\r?\n/).filter(function (line) { return line.trim() !== ''; })[0] || '';
    }
    var delimiter = first.indexOf('\t') >= 0 ? '\t' : first.indexOf(',') >= 0 ? ',' :
      first.indexOf('，') >= 0 ? '，' : first.indexOf(';') >= 0 ? ';' : null;
    if (!delimiter) {
      var plain = text.split(/\r?\n/).map(function (line) {
        return line.trim() ? line.trim().split(/\s+/).map(cleanCell) : [];
      });
      return trimBlankEdges(keepEmptyRows ? plain : plain.filter(function (row) { return row.length; }), keepEmptyRows);
    }
    var rows = [], row = [], field = '', quoted = false;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (ch === '"') {
        if (quoted && text[i + 1] === '"') { field += '"'; i++; }
        else if (quoted) quoted = false;
        else if (field.trim() === '') { quoted = true; field = ''; }
        else field += ch;
      } else if (ch === delimiter && !quoted) {
        row.push(cleanCell(field)); field = '';
      } else if ((ch === '\r' || ch === '\n') && !quoted) {
        if (ch === '\r' && text[i + 1] === '\n') i++;
        row.push(cleanCell(field)); field = '';
        var cleaned = trimTrailing(row);
        if (cleaned.length || keepEmptyRows) rows.push(cleaned);
        row = [];
      } else field += ch;
    }
    if (quoted) fail('表格中有未闭合的英文双引号，请检查粘贴内容。');
    row.push(cleanCell(field));
    var last = trimTrailing(row);
    if (last.length || keepEmptyRows) rows.push(last);
    return trimBlankEdges(rows, keepEmptyRows);
  }

  function positiveVolume(value, label) {
    var n = number(value);
    if (!Number.isFinite(n) || n <= 0) fail(label + '必须是大于 0 的数字。');
    return n;
  }
  function positiveCount(value, label) {
    var n = number(value);
    if (!Number.isInteger(n) || n < 1 || n > 8) fail(label + '必须为 1–8 的整数。');
    return n;
  }
  function toMgPerMl(value, unit, standardTotal) {
    if (unit === 'ug') return value / 1000;
    if (unit === 'ug-well') return value / standardTotal;
    return value;
  }
  function fromMgPerMl(value, unit, standardTotal) {
    if (unit === 'ug') return value * 1000;
    if (unit === 'ug-well') return value * standardTotal;
    return value;
  }
  function rawConcentrations(text) {
    var cells = cleanCell(text).split(/[\s,，;；]+/).filter(Boolean);
    if (cells.length < 2 || cells.length > 96) fail('请输入 2–96 个标准浓度，并以逗号、空格或换行分隔。');
    return cells.map(function (cell) {
      var n = number(cell);
      if (!Number.isFinite(n) || n < 0) fail('标准浓度必须是大于或等于 0 的数字。');
      return n;
    });
  }
  function standardConfig(settings) {
    var raw = rawConcentrations(settings.concText);
    var total = positiveVolume(settings.standardTotal, '标准品加工作液前总体积');
    var mg = raw.map(function (x) { return toMgPerMl(x, settings.unit, total); });
    mg.forEach(function (x, i) {
      if (mg.some(function (y, j) { return i !== j && Math.abs(x - y) <= 1e-10 * Math.max(1, Math.abs(x), Math.abs(y)); })) {
        fail('标准浓度中有重复值；同一浓度的复孔应放在相同标准点下。');
      }
    });
    if (settings.blankMode === 'raw' && !mg.some(function (x) { return x === 0; })) {
      fail('选择原始读数扣空白时，标准梯度必须包含 0 浓度。');
    }
    return { raw: raw, values: mg, count: mg.length, reps: positiveCount(settings.stdReps, '标准品复孔数'),
      layout: settings.stdLayout, unit: settings.unit, total: total };
  }
  function validateAssayMode(settings) {
    var mode = settings.assayMode || 'matched';
    if (['matched', 'x-bca-10'].indexOf(mode) < 0) fail('备份文件中的设置格式不正确。');
    if (mode !== 'x-bca-10') return;
    var xs = rawConcentrations(settings.concText), expected = [0, 2.5, 5, 7.5, 10];
    if (settings.unit !== 'mg' || settings.blankMode !== 'none' || xs.length !== expected.length ||
        xs.some(function (x, i) { return Math.abs(x - expected[i]) > 1e-9; }) ||
        number(settings.standardTotal) !== 10 || number(settings.sampleVolume) !== 10 ||
        number(settings.sampleTotal) !== 10 || number(settings.reagent) !== 200) {
      fail('X-BCA500 仅支持说明书的 10 µL 样品方案：使用 mg/mL、0/2.5/5/7.5/10 梯度、10 µL 参考和样品体积、200 µL 工作液及不扣空白。');
    }
  }
  function standardIndex(value, cfg) {
    var x = number(value);
    if (!Number.isFinite(x)) return -1;
    x = toMgPerMl(x, cfg.unit, cfg.total);
    return cfg.values.findIndex(function (v) { return Math.abs(v - x) <= 1e-10 * Math.max(1, Math.abs(v), Math.abs(x)); });
  }
  function concentrationSequence(row, cfg) {
    return row.length === cfg.count && row.every(function (v, i) { return standardIndex(v, cfg) === i; });
  }
  function parseStandards(text, cfg) {
    var rows = readRows(text);
    if (!rows.length) fail('请粘贴标准品的吸光度表格。');
    if (rows.length > (cfg.layout === 'columns' ? cfg.reps : cfg.count)) {
      var header = rows[0];
      if (concentrationSequence(header, cfg) || (header.length === cfg.count + 1 && concentrationSequence(header.slice(1), cfg))) rows.shift();
      else if (/浓度|concentration|standard/i.test(header[0] || '') &&
          header.slice(1).some(function (v) { return /复孔|吸光|^od|^abs|^rep/i.test(v); })) rows.shift();
    }
    var groups = new Array(cfg.count), description;
    if (rows.length === cfg.count && rows.every(function (row) { return row.length === cfg.reps + 1 && standardIndex(row[0], cfg) >= 0; })) {
      rows.forEach(function (row) {
        var idx = standardIndex(row[0], cfg);
        if (groups[idx]) fail('标准品浓度 ' + row[0] + ' 出现重复，请每个标准点只提供一行。');
        if (!finiteCells(row.slice(1))) fail('标准浓度 ' + row[0] + ' 的复孔读数不完整或不是数字。');
        groups[idx] = row.slice(1).map(number);
      });
      if (groups.filter(Boolean).length !== cfg.count) fail('带浓度的表格必须包含所有已设置的标准点。');
      description = '按浓度识别每一行';
    } else if (cfg.layout === 'columns' && rows.length === cfg.reps &&
        rows.every(function (row) {
          var cells = row.length === cfg.count + 1 && (row[0] === '' || !Number.isFinite(number(row[0]))) ? row.slice(1) : row;
          return cells.length === cfg.count && finiteCells(cells);
        })) {
      var matrix = rows.map(function (row) {
        return (row.length === cfg.count + 1 ? row.slice(1) : row).map(number);
      });
      groups = cfg.values.map(function (_, i) { return matrix.map(function (row) { return row[i]; }); });
      description = '每列一个标准浓度';
    } else if (cfg.layout === 'rows' && rows.length === cfg.count &&
        rows.every(function (row) { return row.length === cfg.reps && finiteCells(row); })) {
      groups = rows.map(function (row) { return row.map(number); });
      description = '每行一个标准浓度';
    } else {
      fail('无法识别标准品表格。当前设置为 ' + cfg.count + ' 个标准点、每点 ' + cfg.reps +
        ' 孔；请检查表格方向、孔数和缺失值。');
    }
    return {
      entries: cfg.values.map(function (x, i) { return { x: x, values: groups[i] }; }).sort(function (a, b) { return a.x - b.x; }),
      description: description
    };
  }
  function sampleNameHeader(value) { return /^(样品(?:名称|编号|名)?|样本(?:名称|编号|名)?|sample(?:[ _-]?(?:name|id))?|name|id|编号)$/i.test(value); }
  function dilutionHeader(value) { return /稀释|dilution|factor/i.test(value); }
  function absorbanceHeader(value) { return /^(?:吸光(?:度|值)?|复孔|重复|od(?:值)?|absorbance|abs|rep(?:licate)?)[ _-]*(?:[一二三１２３]|\d+)?$/i.test(value); }
  function findSampleHeader(row) {
    var absIndices = [], nameIndex = -1, dilutionIndex = -1;
    row.forEach(function (v, i) {
      if (absorbanceHeader(v)) absIndices.push(i);
      else if (sampleNameHeader(v)) nameIndex = i;
      else if (dilutionHeader(v)) dilutionIndex = i;
    });
    return (absIndices.length >= 2 || (absIndices.length === 1 && (nameIndex >= 0 || dilutionIndex >= 0 || row.length === 1))) ? { abs: absIndices, name: nameIndex, dilution: dilutionIndex } : null;
  }
  function validDilution(value, context) {
    var n = number(value);
    if (!Number.isFinite(n) || n < 1) fail(context + '的预稀释倍数必须是大于或等于 1 的数字；未稀释请填 1。');
    return n;
  }
  function isReplicateLabel(v) { return /^(?:复孔|重复|rep(?:licate)?|od)[ _-]*[一二三四五六七八１２３４５６７８1-8]$/i.test(v || ''); }
  function stripReplicateLabel(row, allowOtherLabels) {
    if (row.length > 1 && (isReplicateLabel(row[0]) || row[0] === '' ||
        (allowOtherLabels && !Number.isFinite(number(row[0]))))) return row.slice(1);
    return row.slice();
  }
  function stripVerticalLabel(row) {
    if (!row.length) return [];
    var first = cleanCell(row[0]);
    if (row.length > 1 && (first === '' || isReplicateLabel(first) ||
        /^[A-H]$/i.test(first) || /^row[ _-]*[A-H]$/i.test(first) || /^行[ _-]*[A-H]$/i.test(first))) {
      return row.slice(1);
    }
    return row.slice();
  }
  function parseSamplesByColumns(rows, dilution, reps) {
    var names = null;
    if (rows.length % reps !== 0) {
      if (rows.length !== reps + 1) fail('上下复孔表格的行数应为复孔数的整数倍，请检查是否漏选。');
      var candidate = rows[0].slice();
      if (!candidate.every(function (v) { return !v || (!Number.isFinite(number(v)) && !/^(?:err(?:or)?|ovr|over|nan|null|---)$/i.test(v)); })) {
        fail('上下复孔表格的行数不完整，且首行也是数字，请检查是否漏选复孔。');
      }
      names = candidate; rows = rows.slice(1);
    }
    if (!rows.length) fail('请粘贴样品吸光度。');
    var samples = [];
    for (var rowIndex = 0; rowIndex < rows.length; rowIndex += reps) {
      var group = rows.slice(rowIndex, rowIndex + reps).map(stripVerticalLabel);
      var width = Math.max.apply(null, group.map(function (row) { return row.length; }));
      if (!width) fail('样品第 ' + (rowIndex + 1) + ' 行开始的复孔组没有读数。');
      var groupNames = names;
      if (groupNames && groupNames.length === width + 1 && sampleNameHeader(groupNames[0])) groupNames = groupNames.slice(1);
      if (groupNames && groupNames.length !== width) fail('样品名称数量与复孔列数不一致。');
      for (var column = 0; column < width; column++) {
        var cells = group.map(function (row) { return cleanCell(row[column]); });
        if (cells.every(function (v) { return !v; })) continue;
        if (cells.some(function (v) { return !v; })) fail('样品第 ' + (rowIndex + 1) + ' 行开始的复孔组、第 ' + (column + 1) + ' 列存在缺孔，请核对。');
        if (!finiteCells(cells)) fail('样品第 ' + (rowIndex + 1) + ' 行开始的复孔组、第 ' + (column + 1) + ' 列包含非数字读数。');
        var named = !!(groupNames && groupNames[column]);
        samples.push({ name: named ? groupNames[column] : '样品' + (samples.length + 1), autoName: !named,
          dilution: dilution, values: cells.map(number) });
      }
    }
    if (!samples.length) fail('未识别到样品读数。');
    return { samples: samples, description: '上下同列配对，按组从左至右编号' };
  }
  function parseSamples(text, layout, defaultDilution, reps) {
    var rows = readRows(text, layout === 'columns');
    if (!rows.length) fail('请粘贴至少一个样品的吸光度。');
    var header = findSampleHeader(rows[0]);
    if (!header && layout === 'columns') return parseSamplesByColumns(rows, defaultDilution, reps);
    if (header) { rows = readRows(text, false); rows.shift(); }
    if (!rows.length) fail('样品表格只有表头，没有读数。');
    if (!header && rows.length === 1 && rows[0].length > reps && rows[0].length % reps === 0 && finiteCells(rows[0])) {
      var flat = rows[0].map(number);
      return {
        samples: Array.from({ length: flat.length / reps }, function (_, i) {
          return { name: '样品' + (i + 1), autoName: true, dilution: defaultDilution, values: flat.slice(i * reps, (i + 1) * reps) };
        }),
        description: '单行按复孔数分组'
      };
    }
    var samples = rows.map(function (row, i) {
      var context = '样品数据第 ' + (i + 1) + ' 行', name, values, dilution = defaultDilution;
      if (header) {
        name = header.name >= 0 ? cleanCell(row[header.name]) : '';
        values = header.abs.map(function (j) { return cleanCell(row[j]); }).filter(function (v) { return v !== ''; });
        if (header.dilution >= 0 && cleanCell(row[header.dilution]) !== '') dilution = validDilution(row[header.dilution], context);
      } else if (row.length === reps) { name = ''; values = row; }
      else if (row.length === reps + 1 && !Number.isFinite(number(row[0]))) { name = row[0]; values = row.slice(1); }
      else fail(context + '格式不明确。请按设置的复孔数输入；如含样品编号或稀释倍数请提供表头。');
      if (!values.length || !finiteCells(values)) fail(context + '缺少有效吸光度，请核对复孔。');
      return { name: name || '样品' + (i + 1), autoName: !name, dilution: dilution, values: values.map(number) };
    });
    return { samples: samples, description: header ? '按表头识别，每行一个样品' : '每行一个样品' };
  }
  function solve(matrix, vector) {
    var n = vector.length;
    var a = matrix.map(function (row, i) { return row.slice().concat([vector[i]]); });
    for (var c = 0; c < n; c++) {
      var pivot = c;
      for (var r = c + 1; r < n; r++) if (Math.abs(a[r][c]) > Math.abs(a[pivot][c])) pivot = r;
      if (Math.abs(a[pivot][c]) < 1e-12) fail('标准数据无法拟合所选曲线，请检查输入。');
      var swap = a[c]; a[c] = a[pivot]; a[pivot] = swap;
      var div = a[c][c];
      for (var j = c; j <= n; j++) a[c][j] /= div;
      for (var k = 0; k < n; k++) {
        if (k === c) continue;
        var factor = a[k][c];
        for (var m = c; m <= n; m++) a[k][m] -= factor * a[c][m];
      }
    }
    return a.map(function (row) { return row[n]; });
  }
  function makeFit(points, method) {
    if (method === 'piecewise') {
      var increasing = points.every(function (p, i) { return i === 0 || p.y > points[i - 1].y; });
      function segmentByX(x) {
        var i = 1; while (i < points.length - 1 && x > points[i].x) i++;
        return [points[i - 1], points[i]];
      }
      function segmentByY(y) {
        var i = 1; while (i < points.length - 1 && y > points[i].y) i++;
        return [points[i - 1], points[i]];
      }
      return {
        name: METHOD_NAMES.piecewise, equation: '相邻标准点线性插值', r2: null, r2Evaluable: false,
        monotonic: increasing, disorder: !increasing, hasAlternative: function () { return false; },
        predict: function (x) { var p = segmentByX(x); return p[0].y + (p[1].y - p[0].y) * (x - p[0].x) / (p[1].x - p[0].x); },
        inverse: function (y) {
          if (!increasing) return NaN;
          var p = segmentByY(y); return p[0].x + (p[1].x - p[0].x) * (y - p[0].y) / (p[1].y - p[0].y);
        }
      };
    }
    var maxX = points[points.length - 1].x, degree = method === 'quadratic' ? 2 : 1;
    if (points.length < degree + 1) fail('所选拟合方法所需的不同标准点数不足。');
    var n = degree + 1, matrix = [], vector = [];
    for (var r = 0; r < n; r++) {
      matrix[r] = []; vector[r] = 0;
      for (var c = 0; c < n; c++) matrix[r][c] = 0;
    }
    points.forEach(function (p) {
      var t = p.x / maxX;
      for (var r = 0; r < n; r++) {
        vector[r] += p.y * Math.pow(t, r);
        for (var c = 0; c < n; c++) matrix[r][c] += Math.pow(t, r + c);
      }
    });
    var b = solve(matrix, vector);
    var linear = b[1] / maxX, quadratic = degree === 2 ? b[2] / (maxX * maxX) : 0;
    var startSlope = b[1], endSlope = b[1] + (degree === 2 ? 2 * b[2] : 0);
    var slopeTolerance = Math.max(Math.abs(startSlope), Math.abs(endSlope)) * 1e-10;
    var monotonic = startSlope >= -slopeTolerance && endSlope >= -slopeTolerance && Math.max(startSlope, endSlope) > 0;
    var predict = function (x) { var t = x / maxX; return b[0] + b[1] * t + (degree === 2 ? b[2] * t * t : 0); };
    var mean = avg(points.map(function (p) { return p.y; }));
    var total = points.reduce(function (sum, p) { return sum + Math.pow(p.y - mean, 2); }, 0);
    var residual = points.reduce(function (sum, p) { return sum + Math.pow(p.y - predict(p.x), 2); }, 0);
    if (!(total > 0) || !Number.isFinite(total) || !Number.isFinite(residual)) fail('标准品吸光度无法形成有效曲线，请检查标准品数据。');
    var equation = degree === 1 ? 'y = ' + coefficient(linear) + 'x' + signedTerm(b[0], '') :
      'y = ' + coefficient(quadratic) + 'x²' + signedTerm(linear, 'x') + signedTerm(b[0], '');
    var useQuadratic = degree === 2 && Math.abs(quadratic * maxX) > 1e-12 * Math.max(Math.abs(linear), 1e-15);
    var inverse = function (y) {
      if (!useQuadratic) return (y - b[0]) / linear;
      var disc = linear * linear - 4 * quadratic * (b[0] - y);
      var tolerance = Number.EPSILON * Math.max(1, linear * linear, Math.abs(4 * quadratic * (b[0] - y))) * 32;
      if (disc < -tolerance) return NaN;
      var root = Math.sqrt(Math.max(0, disc)), denominator = linear + root;
      return denominator !== 0 ? 2 * (y - b[0]) / denominator : (-linear + root) / (2 * quadratic);
    };
    var hasAlternative = function (x) {
      if (!useQuadratic) return false;
      var other = -linear / quadratic - x;
      return Number.isFinite(other) && other >= 0 &&
        Math.abs(other - x) > 1e-9 * Math.max(1, Math.abs(x), Math.abs(other));
    };
    var disorder = points.some(function (p, i) { return i > 0 && p.y <= points[i - 1].y; });
    return { name: METHOD_NAMES[method], equation: equation, r2: 1 - residual / total,
      r2Evaluable: points.length > degree + 1, predict: predict, inverse: inverse,
      hasAlternative: hasAlternative, monotonic: monotonic, disorder: disorder };
  }
  function calculate(settings, standardText, sampleText) {
    var cfg = standardConfig(settings);
    validateAssayMode(settings);
    var sampleVolume = positiveVolume(settings.sampleVolume, '实际样品体积');
    var sampleTotal = positiveVolume(settings.sampleTotal, '样品补液后总体积');
    positiveVolume(settings.reagent, '每孔 BCA 工作液体积');
    if (sampleVolume > sampleTotal + 1e-10) fail('样品实际加入体积不能大于补液后总体积。');
    if (Math.abs(sampleTotal - cfg.total) > 1e-8 * Math.max(1, sampleTotal, cfg.total)) {
      fail('标准品和样品加工作液前的总体积不同；请核对实验方案，使两者反应条件可比较。');
    }
    var wellFactor = sampleTotal / sampleVolume;
    var standardData = parseStandards(standardText, cfg);
    var sampleData = parseSamples(sampleText, settings.layout, validDilution(settings.dilution, '统一设置'), positiveCount(settings.sampleReps, '样品复孔数'));
    var entries = standardData.entries, zero = entries.find(function (s) { return s.x === 0; });
    var blank = settings.blankMode === 'raw' ? avg(zero.values) : null;
    var points = entries.map(function (s) {
      var mean = avg(s.values), corrected = mean - (blank === null ? 0 : blank), sd = sampleSD(s.values);
      return { x: s.x, values: s.values, mean: mean, y: corrected, cv: sd !== null && corrected > 0 ? sd / corrected * 100 : null };
    });
    var fit = makeFit(points, settings.method);
    var threshold = number(settings.r2Threshold);
    if (!Number.isFinite(threshold) || threshold < 0 || threshold >= 1) fail('R² 门槛必须大于或等于 0 且小于 1。');
    var passesR2 = fit.r2Evaluable && fit.r2 > threshold;
    var qualityAllows = passesR2 || settings.qcPolicy === 'warn';
    var positivePoints = points.filter(function (p) { return p.x > 0; });
    if (!positivePoints.length) fail('标准梯度需要至少一个非零浓度。');
    var minX = positivePoints[0].x, maxX = points[points.length - 1].x;
    var validBounds = points[points.length - 1].y > points[0].y;
    var usable = qualityAllows && fit.monotonic && validBounds;
    var xTolerance = Math.max(1e-14, Math.abs(maxX) * 1e-10);
    var results = sampleData.samples.map(function (sample) {
      var mean = avg(sample.values), corrected = mean - (blank === null ? 0 : blank), status = '标准点内', measured = null;
      var sd = sampleSD(sample.values), cv = sd !== null && corrected > 0 ? sd / corrected * 100 : null;
      if (!qualityAllows) status = fit.r2Evaluable ? '曲线未通过' : 'R² 不适用';
      else if (!fit.monotonic || !validBounds) status = '曲线不可反算';
      else {
        var inverse = fit.inverse(corrected);
        if (!Number.isFinite(inverse)) status = '曲线无实数解';
        else {
          measured = inverse;
          if (inverse < -xTolerance) status = '负值估算';
          else if (inverse > maxX + xTolerance) status = fit.hasAlternative(inverse) ? '外推多解' : '外推估算';
          else if (inverse < minX - xTolerance) status = fit.hasAlternative(inverse) ? '低点多解' : '低点估算';
        }
      }
      var original = measured === null ? null : measured * wellFactor * sample.dilution;
      if (original !== null && !Number.isFinite(original)) fail('样品“' + sample.name + '”浓度超出计算范围，请检查稀释倍数。');
      return { name: sample.name, autoName: sample.autoName, values: sample.values, dilution: sample.dilution, mean: mean, corrected: corrected, cv: cv,
        status: status, prefix: '', measured: measured, original: original };
    });
    var warnings = ['厂商预设及本次标准点覆盖范围不等于本实验已验证的定量范围；请核对实际操作条件。'];
    if (settings.assayMode === 'x-bca-10') warnings.push(PRESETS.find(function (p) { return p.id === 'aike-x-bca500'; }).note);
    if (!fit.r2Evaluable) warnings.unshift('逐点插值没有整体 R²，或回归自由度不足；不可用 R² 判定曲线质量。');
    else if (!passesR2 && settings.qcPolicy === 'warn') warnings.unshift('R² 未达到设置门槛；当前选择为显示结果并提醒。');
    if (fit.disorder) warnings.push('部分相邻标准点的复孔均值没有随浓度上升，请检查标准品数据。');
    if (qualityAllows && !fit.monotonic) warnings.unshift('拟合曲线在标准点区间内不是持续上升，无法可靠反算。');
    if (qualityAllows && !validBounds) warnings.unshift('最高标准点的吸光度未高于最低标准点，未报告浓度。');
    if (results.some(function (s) { return s.values.length === 1; })) warnings.push('部分样品只有单孔，无法评估复孔一致性。');
    if (results.some(function (s) { return s.values.length !== number(settings.sampleReps); })) warnings.push('部分样品实际复孔数与统一设置不同，已按表头中实际提供的读数取平均。');
    if (results.some(function (s) { return s.status === '外推估算' || s.status === '外推多解'; })) warnings.push('部分结果根据方程外推得到；R² 只反映标准点拟合，建议稀释后复测以验证。');
    if (results.some(function (s) { return s.status === '低点估算' || s.status === '低点多解'; })) warnings.push('部分样品低于最低非零标准点，低点结果需验证。');
    if (results.some(function (s) { return s.status === '外推多解' || s.status === '低点多解'; })) warnings.push('二次曲线存在多个非负解；显示与标准点上升段相连的解。');
    if (results.some(function (s) { return s.status === '曲线无实数解'; })) warnings.push('部分吸光度与所选曲线没有实数交点，无法计算。');
    if (results.some(function (s) { return s.status === '负值估算'; })) warnings.push('负值只是低信号下的数学结果，不表示真实蛋白浓度为负。');
    if (state.demo) warnings.unshift('演示数据为虚构示例，不可作为实际实验结果。');
    return { settings: settings, cfg: cfg, blank: blank, points: points, fit: fit, threshold: threshold,
      passesR2: passesR2, qualityAllows: qualityAllows, usable: usable, wellFactor: wellFactor,
      minX: minX, maxX: maxX, results: results, warnings: warnings, demo: state.demo,
      standardDescription: standardData.description, sampleDescription: sampleData.description };
  }
  function concentration(sample, value, digits) { return value === null ? '—' : sample.prefix + fmt(value, digits); }
  function currentSettings() {
    return {
      presetId: $('preset').value, concText: $('conc-list').value, unit: $('unit').value,
      stdReps: $('std-reps').value, stdLayout: $('std-layout').value,
      standardTotal: $('std-total').value, sampleVolume: $('sample-volume').value,
      sampleTotal: $('sample-total').value, reagent: $('reagent').value,
      method: $('method').value, blankMode: $('blank-mode').value, assayMode: $('assay-mode').value,
      r2Threshold: $('r2-threshold').value, qcPolicy: $('qc-policy').value,
      layout: $('layout').value, sampleReps: $('sample-reps').value, dilution: $('dilution').value
    };
  }
  function refreshConcentrationPreview() {
    var preview = $('concentration-preview');
    preview.innerHTML = '';
    try {
      var raw = rawConcentrations($('conc-list').value);
      raw.forEach(function (value) {
        var el = document.createElement('span');
        el.textContent = String(value);
        preview.appendChild(el);
      });
      $('standard-format').textContent = choose(
        '当前：' + raw.length + ' 个标准点，每点 ' + $('std-reps').value + ' 孔；按选择的表格方向粘贴。',
        'Current setup: ' + raw.length + ' standard points, ' + $('std-reps').value + ' wells each. Paste ' +
        ($('std-layout').value === 'columns' ? 'standards in columns and replicates in rows.' : 'standards in rows and replicates in columns.'));
    } catch (_) {
      $('standard-format').textContent = L('请先填写至少两个有效标准点，再粘贴吸光度。');
    }
    $('preset-edited').textContent = state.presetEdited ? L('当前方案已编辑，请核对梯度、单位和体积。') : '';
  }
  function updatePairPreview() {
    var preview = $('pair-preview');
    if (!$('samples').value.trim()) { preview.hidden = true; return; }
    try {
      var data = parseSamples($('samples').value, $('layout').value, validDilution($('dilution').value, '统一设置'),
        positiveCount($('sample-reps').value, '样品复孔数'));
      var shown = data.samples.slice(0, 6).map(function (sample) { return displayName(sample) + choose('：', ': ') + sample.values.join(' / '); });
      preview.className = 'pair-preview';
      preview.textContent = choose(
        '已识别 ' + data.samples.length + ' 个样品（' + data.description + '）。配对预览：' + shown.join('；') + (data.samples.length > 6 ? '；…' : '') + '。',
        'Identified ' + data.samples.length + ' samples (' + L(data.description) + '). Pairing preview: ' + shown.join('; ') + (data.samples.length > 6 ? '; …' : '') + '.');
    } catch (ex) {
      preview.className = 'pair-preview invalid';
      preview.textContent = choose('暂未识别完整配对：', 'Incomplete pairing: ') + L(ex.message || '请检查样品数据。');
    }
    preview.hidden = false;
  }
  function invalidate() {
    state.result = null; $('results').hidden = true; $('error').hidden = true;
    updatePairPreview(); refreshConcentrationPreview();
  }
  function buildChart(result) {
    var points = result.points, fit = result.fit, minX = points[0].x, maxX = result.maxX;
    var vals = points.map(function (p) { return p.y; });
    for (var i = 0; i <= 100; i++) vals.push(fit.predict(minX + (maxX - minX) * i / 100));
    var minY = Math.min.apply(null, vals), maxY = Math.max.apply(null, vals), padding = (maxY - minY) * 0.1 || 0.1;
    minY -= padding * 0.4; maxY += padding;
    var w = 620, h = 300, left = 58, right = 18, top = 16, bottom = 40;
    var sx = function (x) { return left + (x - minX) / (maxX - minX) * (w - left - right); };
    var sy = function (y) { return h - bottom - (y - minY) / (maxY - minY) * (h - top - bottom); };
    var digits = maxX - minX < 0.1 ? 4 : maxX - minX < 1 ? 3 : 2;
    var html = '<svg viewBox="0 0 620 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="620" height="300" fill="white"/>';
    for (var tick = 0; tick <= 4; tick++) {
      var yy = minY + (maxY - minY) * tick / 4, py = sy(yy), xx = minX + (maxX - minX) * tick / 4;
      html += '<line x1="' + left + '" y1="' + py + '" x2="' + (w - right) + '" y2="' + py + '" stroke="#e8f0ec"/>';
      html += '<text x="' + (left - 9) + '" y="' + (py + 4) + '" text-anchor="end" fill="#526b63" font-size="11" font-family="sans-serif">' + fmt(yy, 2) + '</text>';
      html += '<text x="' + sx(xx) + '" y="' + (h - 14) + '" text-anchor="middle" fill="#526b63" font-size="11" font-family="sans-serif">' + fmt(xx, digits) + '</text>';
    }
    html += '<line x1="' + left + '" y1="' + (h - bottom) + '" x2="' + (w - right) + '" y2="' + (h - bottom) + '" stroke="#b9ccc3"/>';
    var path = '';
    for (var j = 0; j <= 140; j++) {
      var x = minX + (maxX - minX) * j / 140;
      path += (j ? ' L ' : 'M ') + sx(x).toFixed(2) + ' ' + sy(fit.predict(x)).toFixed(2);
    }
    html += '<path d="' + path + '" fill="none" stroke="#7fc7a3" stroke-width="3"/>';
    points.forEach(function (p) { html += '<circle cx="' + sx(p.x) + '" cy="' + sy(p.y) + '" r="4.6" fill="#087a6a" stroke="white" stroke-width="1.5"/>'; });
    $('chart').innerHTML = html + '</svg>';
  }
  function render(result) {
    $('input-summary').textContent = choose(
      '已识别 ' + result.points.length + ' 个标准点（' + result.standardDescription + '）及 ' + result.results.length + ' 个样品（' + result.sampleDescription + '）。请核对下方复孔对应关系。',
      'Identified ' + result.points.length + ' standard points (' + L(result.standardDescription) + ') and ' + result.results.length + ' samples (' + L(result.sampleDescription) + '). Check replicate pairing below.');
    var quality = $('quality');
    quality.className = 'quality ' + (result.usable ? (result.passesR2 ? 'quality-pass' : 'quality-warn') : 'quality-fail');
    if (!result.fit.r2Evaluable) {
      quality.textContent = choose(
        '本方法没有可用于质量判断的整体 R²。' + (result.usable ? '当前选择显示结果并提醒。' : '当前条件下暂停报告浓度。'),
        'There is no overall R² usable for quality control. ' + (result.usable ? 'Results are shown with a warning.' : 'Concentrations are not reported.'));
    } else if (!result.passesR2) {
      quality.textContent = choose(
        'R² = ' + formatR2(result.fit.r2, result.threshold) + '，未严格大于 ' + result.threshold + (result.usable ? '；当前选择显示结果并提醒。' : '；当前条件下暂停报告浓度。'),
        'R² = ' + formatR2(result.fit.r2, result.threshold) + ' is not strictly greater than ' + result.threshold + (result.usable ? '; results are shown with a warning.' : '; concentrations are not reported.'));
    } else if (!result.usable) {
      quality.textContent = choose('R² 达到设定值，但曲线不满足可靠反算条件；已暂停报告浓度。', 'R² meets the threshold, but the curve cannot be reliably inverted; concentrations are not reported.');
    } else {
      quality.textContent = choose(
        'R² = ' + formatR2(result.fit.r2, result.threshold) + '，严格大于设定的 ' + result.threshold + '。请同时检查标准点及复孔一致性。',
        'R² = ' + formatR2(result.fit.r2, result.threshold) + ' is strictly greater than ' + result.threshold + '. Also review the standard points and replicate consistency.');
    }
    $('warnings').innerHTML = result.warnings.map(function (w) { return '<div class="warning">' + escapeHtml(L(w)) + '</div>'; }).join('');
    $('method-label').textContent = L(result.fit.name);
    $('blank-value').textContent = result.blank === null ? L(result.settings.blankMode === 'none' ? '未扣空白（原始读数）' : '输入已扣空白') : fmt(result.blank, 4);
    $('actual-range').textContent = fmt(result.minX, result.minX < 0.01 ? 5 : 3) + '–' + fmt(result.maxX, result.maxX < 0.01 ? 5 : 3) + ' mg/mL';
    $('r2').textContent = result.fit.r2Evaluable ? formatR2(result.fit.r2, result.threshold) : L('不适用');
    $('equation').textContent = L(result.fit.equation);
    $('sample-results').innerHTML = result.results.map(function (s) {
      var micrograms = s.original === null ? null : s.original * 1000;
      return '<tr><td>' + escapeHtml(displayName(s)) + '</td><td>' + fmt(s.values[0], 4) + '</td><td>' +
        (s.values.length > 1 ? s.values.slice(1).map(function (v) { return fmt(v, 4); }).join(' / ') : '—') +
        '</td><td>' + fmt(s.mean, 4) + '</td><td>' + fmt(s.corrected, 4) + '</td><td>' +
        (s.cv === null ? '—' : fmt(s.cv, 1) + '%') + '</td><td>' + fmt(s.dilution, 2) +
        '</td><td>' + escapeHtml(concentration(s, s.measured, 4)) + '</td><td class="result-strong">' +
        escapeHtml(concentration(s, s.original, 4)) + '</td><td>' + escapeHtml(concentration(s, micrograms, 2)) +
        '</td><td><span class="' + (s.status === '标准点内' ? 'status-ok' : 'status-out') + '">' + escapeHtml(L(s.status)) + '</span></td></tr>';
    }).join('');
    $('standard-results').innerHTML = result.points.map(function (p) {
      return '<tr><td>' + fmt(p.x, p.x < 0.01 ? 5 : 3) + '</td><td>' +
        p.values.map(function (v) { return fmt(v, 4); }).join(' / ') + '</td><td>' + p.values.length +
        '</td><td>' + fmt(p.mean, 4) + '</td><td>' + fmt(p.y, 4) + '</td><td>' +
        (p.cv === null ? '—' : fmt(p.cv, 1) + '%') + '</td></tr>';
    }).join('');
    buildChart(result); $('results').hidden = false;
  }
  function showError(message) { state.errorRaw = message; $('error').textContent = L(message); $('error').hidden = false; }
  function showNotice(message) { state.noticeRaw = message; $('import-notice').textContent = L(message); $('import-notice').hidden = false; }
  function run() {
    try {
      $('error').hidden = true;
      state.result = calculate(currentSettings(), $('standards').value, $('samples').value);
      render(state.result); $('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (ex) {
      state.result = null; $('results').hidden = true; showError(ex.message || '计算失败，请检查输入。');
    }
  }
  function download(name, data, mime) {
    var url = URL.createObjectURL(new Blob([data], { type: mime })), a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 15000);
  }
  function csvCell(value, userText) {
    var s = value === null || value === undefined ? '' : String(value);
    if (userText && /^[\s]*[=+\-@]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  }
  function selectedPreset() {
    var id = $('preset').value;
    var builtIn = PRESETS.find(function (p) { return p.id === id; });
    if (builtIn) return builtIn;
    var profile = readProfiles().find(function (p) { return 'local:' + p.id === id; });
    if (!profile) return null;
    var base = PRESETS.find(function (p) { return p.id === profile.baseId; });
    return { id: id, name: profile.name, settings: profile.settings,
      source: base ? base.source : '', note: '此方案保存在本浏览器，仅含设置；请核对当前试剂盒和实际操作。' };
  }
  var PROFILE_KEY = 'bca-platform-local-profiles-v1';
  function readProfiles() {
    try {
      var items = JSON.parse(localStorage.getItem(PROFILE_KEY) || '[]');
      return Array.isArray(items) ? items.filter(function (p) {
        return p && typeof p.id === 'string' && typeof p.name === 'string' && p.settings && typeof p.settings === 'object';
      }).slice(0, 50) : [];
    } catch (_) { return []; }
  }
  function writeProfiles(items) {
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(items)); }
    catch (_) { fail('浏览器无法保存本机方案；请检查本地存储设置。'); }
  }
  function refreshPresetOptions(selected) {
    var select = $('preset');
    select.innerHTML = '';
    var built = document.createElement('optgroup'); built.label = L('说明书示例与自定义');
    PRESETS.forEach(function (preset) {
      var option = document.createElement('option'); option.value = preset.id; option.textContent = presetName(preset); built.appendChild(option);
    });
    select.appendChild(built);
    var profiles = readProfiles();
    if (profiles.length) {
      var own = document.createElement('optgroup'); own.label = L('本浏览器保存的方案');
      profiles.forEach(function (profile) {
        var option = document.createElement('option'); option.value = 'local:' + profile.id;
        option.textContent = profile.name; own.appendChild(option);
      });
      select.appendChild(own);
    }
    if (selected && Array.from(select.options).some(function (o) { return o.value === selected; })) select.value = selected;
    else select.value = selected ? 'custom' : 'lab-six';
    $('delete-profile').hidden = select.value.indexOf('local:') !== 0;
  }
  function updatePresetDescription() {
    var selected = selectedPreset(), link = $('preset-source');
    $('preset-note').textContent = L(selected ? selected.note : '请核对本次实验条件。');
    if (selected && selected.source) { link.href = selected.source; link.hidden = false; }
    else { link.removeAttribute('href'); link.hidden = true; }
    $('delete-profile').hidden = $('preset').value.indexOf('local:') !== 0;
  }
  function updateAssayLabel() {
    var special = $('assay-mode').value === 'x-bca-10';
    $('std-total-label').textContent = L(special ?
      'X-BCA 样品参考体积（µL，非标准加液体积）' : '标准品加工作液前总体积（µL）');
    $('assay-mode-note').hidden = !special;
    $('assay-mode-note').textContent = special ? L(PRESETS.find(function (p) { return p.id === 'aike-x-bca500'; }).note) : '';
  }
  function applySettings(settings) {
    var fields = {
      'conc-list': 'concText', unit: 'unit', 'std-reps': 'stdReps', 'std-layout': 'stdLayout',
      'std-total': 'standardTotal', 'sample-volume': 'sampleVolume', 'sample-total': 'sampleTotal',
      reagent: 'reagent', method: 'method', 'blank-mode': 'blankMode', 'r2-threshold': 'r2Threshold',
      'qc-policy': 'qcPolicy', layout: 'layout', 'sample-reps': 'sampleReps', dilution: 'dilution', 'assay-mode': 'assayMode'
    };
    Object.keys(fields).forEach(function (id) {
      if (settings[fields[id]] !== undefined) $(id).value = String(settings[fields[id]]);
    });
    $('assay-mode').value = settings.assayMode || 'matched';
    updateAssayLabel();
    state.lastUnit = $('unit').value;
  }
  function presetSettings(preset) {
    return {
      presetId: preset.id, concText: preset.concentrations.join(', '), unit: preset.unit,
      stdReps: String(preset.stdReps || 2), stdLayout: 'columns', standardTotal: preset.standardTotal, sampleVolume: preset.sampleAliquot,
      sampleTotal: preset.sampleTotal, reagent: preset.reagent, method: preset.method, blankMode: preset.blankMode || 'raw', assayMode: preset.assayMode || 'matched',
      r2Threshold: '0.99', qcPolicy: 'block', layout: 'columns', sampleReps: '2', dilution: '1'
    };
  }
  function applyPreset() {
    var preset = selectedPreset();
    if (!preset) { showError('无法识别所选方案。'); return; }
    applySettings(preset.settings || presetSettings(preset));
    state.presetId = $('preset').value; state.presetEdited = false;
    updatePresetDescription(); invalidate();
  }
  function markEdited() { state.presetEdited = true; invalidate(); }
  function convertUnit() {
    var next = $('unit').value, previous = state.lastUnit;
    if (next === previous) return;
    try {
      var total = positiveVolume($('std-total').value, '标准品加工作液前总体积');
      var values = rawConcentrations($('conc-list').value).map(function (v) {
        return fromMgPerMl(toMgPerMl(v, previous, total), next, total);
      });
      $('conc-list').value = values.map(function (v) { return Number(v.toPrecision(10)).toString(); }).join(', ');
      state.lastUnit = next; markEdited();
    } catch (ex) {
      $('unit').value = previous; showError('无法换算标准单位：' + (ex.message || '请检查浓度和体积。'));
    }
  }
  function exportResults() {
    var r = state.result; if (!r) return;
    var preset = selectedPreset();
    var headers = ['样品名称','复孔读数','平均吸光度','空白处理后吸光度','复孔CV(%)','孔外预稀释倍数','孔内补液换算倍数',
      '补液后反应前浓度(mg/mL)','原样浓度(mg/mL)','原样浓度(µg/mL)','状态','空白均值',
      '标准浓度(mg/mL)','标准品复孔吸光度','拟合方法','曲线表达式(x为mg/mL)','R²',
      'R²质控门槛','R²判定','未达标策略','标准总体积(µL)','样品实际体积(µL)','样品补液后体积(µL)','工作液体积(µL)',
      '试剂盒或本机方案','来源说明书','实验提示','演示数据'];
    if (r.settings.assayMode === 'x-bca-10') headers[20] = 'X-BCA 样品参考体积（µL，非标准加液体积）';
    var rows = [headers.map(function (x) { return csvCell(L(x), false); }).join(',')];
    var stdValues = r.points.map(function (p) { return p.values.join('/'); }).join(';');
    var stdConcs = r.points.map(function (p) { return p.x; }).join(';');
    r.results.forEach(function (s) {
      var cells = [displayName(s), s.values.join(';'), fmt(s.mean, 6), fmt(s.corrected, 6), s.cv === null ? '' : fmt(s.cv, 2), s.dilution, r.wellFactor,
        concentration(s, s.measured, 6), concentration(s, s.original, 6),
        concentration(s, s.original === null ? null : s.original * 1000, 4), L(s.status),
        r.blank === null ? L(r.settings.blankMode === 'none' ? '未扣空白（原始读数）' : '输入已扣空白') : fmt(r.blank, 6), stdConcs, stdValues,
        L(r.fit.name), L(r.fit.equation), r.fit.r2Evaluable ? r.fit.r2.toPrecision(15) : '',
        r.threshold, L(r.fit.r2Evaluable ? (r.passesR2 ? '通过' : '未通过') : '不适用'), r.settings.qcPolicy,
        r.settings.standardTotal, r.settings.sampleVolume, r.settings.sampleTotal, r.settings.reagent,
        presetName(preset), preset && preset.source ? preset.source : '',
        L('预设示例应按实际实验核对；外推结果需验证'), r.demo ? L('虚构演示数据') : ''];
      rows.push(cells.map(function (x, i) { return csvCell(x, i === 0 || i === 24); }).join(','));
    });
    download(choose('BCA蛋白浓度结果.csv', 'BCA-protein-concentrations.csv'), '\uFEFF' + rows.join('\r\n'), 'text/csv;charset=utf-8');
  }
  function saveProject() {
    var data = { format: 'bca-platform-1', settings: currentSettings(), standards: $('standards').value,
      samples: $('samples').value, demo: state.demo };
    download(choose('BCA计算数据备份.json', 'BCA-data-backup.json'), JSON.stringify(data, null, 2), 'application/json;charset=utf-8');
  }
  async function readText(file) {
    var buffer = await file.arrayBuffer(), bytes = new Uint8Array(buffer);
    if (bytes[0] === 0xFF && bytes[1] === 0xFE) return new TextDecoder('utf-16le').decode(buffer);
    if (bytes[0] === 0xFE && bytes[1] === 0xFF) return new TextDecoder('utf-16be').decode(buffer);
    try { return new TextDecoder('utf-8', { fatal: true }).decode(buffer); }
    catch (_) { return new TextDecoder('gb18030').decode(buffer); }
  }
  function bindImport(inputId, targetId) {
    $(inputId).addEventListener('change', async function (event) {
      try {
        var file = event.target.files[0];
        if (file) { $(targetId).value = await readText(file); invalidate(); }
      } catch (_) { showError('文件读取失败，请将 CSV 或 TSV 内容直接粘贴到输入框。'); }
      event.target.value = '';
    });
  }
  function validateSavedSettings(s) {
    if (!s || typeof s.concText !== 'string' || ['mg','ug','ug-well'].indexOf(s.unit) < 0 ||
        ['columns','rows'].indexOf(s.stdLayout) < 0 || ['columns','rows'].indexOf(s.layout) < 0 ||
        ['linear','quadratic','piecewise'].indexOf(s.method) < 0 || ['raw','corrected','none'].indexOf(s.blankMode) < 0 ||
        ['block','warn'].indexOf(s.qcPolicy) < 0) fail('备份文件中的设置格式不正确。');
    standardConfig(s); validateAssayMode(s); positiveCount(s.sampleReps, '样品复孔数');
    positiveVolume(s.sampleVolume, '样品体积'); positiveVolume(s.sampleTotal, '样品补液后体积');
    positiveVolume(s.reagent, '工作液体积'); validDilution(s.dilution, '统一设置');
    var threshold = number(s.r2Threshold);
    if (!Number.isFinite(threshold) || threshold < 0 || threshold >= 1) fail('备份中的 R² 门槛不正确。');
  }
  function legacySettings(old) {
    var preset = PRESETS.find(function (p) { return p.id === 'lab-six'; });
    var s = presetSettings(preset);
    s.method = ['linear','quadratic'].indexOf(old.method) >= 0 ? old.method : 'linear';
    s.layout = old.layout === 'rows' ? 'rows' : 'columns';
    s.dilution = old.dilution || '1';
    return s;
  }
  function migrateLegacyV1(data) {
    if (!data.settings || data.settings.volume !== '12.5' || ['ug','mg'].indexOf(data.settings.unit) < 0 ||
        ['linear','quadratic'].indexOf(data.settings.method) < 0) {
      fail('旧版方案无法自动转换，请核对条件并重新粘贴数据。');
    }
    var rows = readRows(data.standards), groups = new Map();
    if (rows.length && /浓度|concentration|standard/i.test(rows[0][0] || '')) rows.shift();
    rows.forEach(function (row) {
      var readings = row.slice(1).filter(function (v) { return v !== ''; });
      if (!readings.length) return;
      var x = number(row[0]); if (data.settings.unit === 'ug') x /= 1000;
      var idx = CONCENTRATIONS.findIndex(function (c) { return Number.isFinite(x) && Math.abs(c - x) < 1e-9; });
      if (idx < 0) fail('旧版包含六点示例以外的标准；请使用自定义梯度粘贴。');
      if (!finiteCells(readings)) fail('旧版标准吸光度无效。');
      if (!groups.has(idx)) groups.set(idx, []);
      groups.get(idx).push.apply(groups.get(idx), readings.map(number));
    });
    var output = [];
    for (var i = 0; i < CONCENTRATIONS.length; i++) {
      if (!groups.has(i)) continue;
      if (groups.get(i).length !== 2) fail('旧版标准复孔数与两孔不一致，请核对后粘贴。');
      output.push([CONCENTRATIONS[i]].concat(groups.get(i)).join('\t'));
    }
    var s = legacySettings(data.settings); s.stdLayout = 'rows';
    return { format: 'bca-platform-1', settings: s,
      standards: output.length ? 'Concentration\tAbsorbance 1\tAbsorbance 2\n' + output.join('\n') : '', samples: data.samples, demo: data.demo };
  }
  function normalizeProject(data) {
    if (!data || typeof data.standards !== 'string' || typeof data.samples !== 'string') fail('无法识别数据备份。');
    if (data.format === 'bca-calculator-1') return migrateLegacyV1(data);
    if (data.format === 'bca-calculator-2' || data.format === 'bca-calculator-3') {
      return { format: 'bca-platform-1', settings: legacySettings(data.settings || {}),
        standards: data.standards, samples: data.samples, demo: data.demo };
    }
    if (data.format !== 'bca-platform-1') fail('无法识别数据备份格式。');
    return data;
  }
  $('calculate').addEventListener('click', run);
  $('export').addEventListener('click', exportResults);
  $('save-project').addEventListener('click', saveProject);
  $('preset').addEventListener('change', applyPreset);
  $('unit').addEventListener('change', convertUnit);
  $('demo').addEventListener('click', function () {
    refreshPresetOptions('lab-six'); applyPreset();
    $('standards').value = DEMO_STANDARDS; $('samples').value = DEMO_SAMPLES;
    state.demo = true; $('demo-alert').hidden = false; $('import-notice').hidden = true; invalidate();
  });
  $('clear').addEventListener('click', function () {
    $('standards').value = ''; $('samples').value = '';
    state.demo = false; $('demo-alert').hidden = true; $('import-notice').hidden = true; invalidate();
  });
  ['standards','samples'].forEach(function (id) { $(id).addEventListener('input', invalidate); });
  ['conc-list','std-reps','std-total','sample-volume','sample-total','reagent','r2-threshold','sample-reps','dilution'].forEach(function (id) {
    $(id).addEventListener('input', markEdited);
  });
  ['method','blank-mode','qc-policy','layout','std-layout','assay-mode'].forEach(function (id) {
    $(id).addEventListener('change', markEdited);
  });
  $('assay-mode').addEventListener('change', updateAssayLabel);
  $('save-profile').addEventListener('click', function () {
    try {
      var name = $('profile-name').value.trim();
      if (!name) fail('请先输入常用方案名称。');
      var settings = currentSettings(); validateSavedSettings(settings);
      var profiles = readProfiles(), previous = selectedPreset();
      if (profiles.length >= 50) fail('本机方案已达 50 个，请先删除不需要的方案。');
      var id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      var localPrevious = previous && previous.id.indexOf('local:') === 0 ? readProfiles().find(function (p) { return 'local:' + p.id === previous.id; }) : null;
      var baseId = localPrevious ? localPrevious.baseId : (previous ? previous.id : 'custom');
      profiles.push({ id: id, name: name, baseId: baseId, settings: settings });
      writeProfiles(profiles); refreshPresetOptions('local:' + id);
      state.presetEdited = false; updatePresetDescription(); invalidate();
      showNotice('常用方案已保存到本浏览器，不包含吸光度和样品名称。');
    } catch (ex) { showError(ex.message || '无法保存方案。'); }
  });
  $('delete-profile').addEventListener('click', function () {
    var id = $('preset').value.replace(/^local:/, '');
    try {
      writeProfiles(readProfiles().filter(function (p) { return p.id !== id; }));
      refreshPresetOptions('custom'); applyPreset();
      showNotice('已删除本浏览器中的该方案。');
    } catch (ex) { showError(ex.message || '无法删除方案。'); }
  });
  $('export-profile').addEventListener('click', function () {
    try {
      var settings = currentSettings(); validateSavedSettings(settings);
      var previous = selectedPreset();
      var local = previous && previous.id.indexOf('local:') === 0 ? readProfiles().find(function (p) { return 'local:' + p.id === previous.id; }) : null;
      var baseId = local ? local.baseId : (previous ? previous.id : 'custom');
      var name = $('profile-name').value.trim() || (local ? local.name : L('未命名方案'));
      settings.presetId = baseId;
      download('BCA-protocol.json', JSON.stringify({format:'bca-protocol-1', name:name, baseId:baseId, settings:settings}, null, 2), 'application/json;charset=utf-8');
      showNotice('方案已导出，不包含吸光度或样品名称。');
    } catch (ex) { showError(ex.message || '无法保存方案。'); }
  });
  $('profile-file').addEventListener('change', async function (event) {
    try {
      var file = event.target.files[0]; if (!file) return;
      if (file.size > 1024 * 1024) fail('方案文件过大。');
      var data = JSON.parse(await readText(file));
      if (!data || data.format !== 'bca-protocol-1' || typeof data.name !== 'string' || !data.name.trim() || data.name.length > 80 || !data.settings) fail('无法识别方案文件，请选择本平台导出的方案文件。');
      validateSavedSettings(data.settings);
      var profiles = readProfiles(); if (profiles.length >= 50) fail('本机方案已达 50 个，请先删除不需要的方案。');
      var base = PRESETS.find(function (p) { return p.id === data.baseId; });
      var id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      var settings = Object.assign({}, data.settings, {presetId: base ? base.id : 'custom'});
      profiles.push({id:id, name:data.name.trim(), baseId:base ? base.id : 'custom', settings:settings});
      writeProfiles(profiles); refreshPresetOptions('local:' + id); applyPreset();
      $('profile-name').value = data.name.trim();
      showNotice('方案已导入并保存到本浏览器，不包含吸光度或样品名称。');
    } catch (ex) { showError(ex.message || '无法识别方案文件，请选择本平台导出的方案文件。'); }
    event.target.value = '';
  });
  bindImport('standard-file', 'standards'); bindImport('sample-file', 'samples');
  $('project-file').addEventListener('change', async function (event) {
    try {
      var file = event.target.files[0]; if (!file) return;
      var original = JSON.parse(await readText(file)), data = normalizeProject(original);
      validateSavedSettings(data.settings);
      refreshPresetOptions(data.settings.presetId || 'custom'); applySettings(data.settings);
      $('standards').value = data.standards; $('samples').value = data.samples;
      state.demo = data.demo === true; $('demo-alert').hidden = !state.demo;
      state.presetEdited = true; updatePresetDescription();
      showNotice(original.format === 'bca-platform-1' ?
        '已恢复数据备份；请核对标准梯度与复孔配对。' :
        '已导入旧版六点备份；请核对标准梯度、体积和复孔配对。');
      invalidate();
    } catch (ex) { showError(ex.message || '无法载入数据备份。'); }
    event.target.value = '';
  });
  document.addEventListener('bca-languagechange', function () {
    var selected = $('preset').value;
    refreshPresetOptions(selected);
    updatePresetDescription();
    updateAssayLabel();
    refreshConcentrationPreview();
    updatePairPreview();
    if (!$('error').hidden && state.errorRaw) showError(state.errorRaw);
    if (!$('import-notice').hidden && state.noticeRaw) showNotice(state.noticeRaw);
    if (state.result) render(state.result);
  });
  refreshPresetOptions('lab-six'); applyPreset();
}());
