/* Copyright (C) 2026 Cinderella_yufeng; SPDX-License-Identifier: AGPL-3.0-only */
const { chromium } = require('playwright');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const fs = require('node:fs');
const assert = require('node:assert/strict');

async function main() {
  fs.mkdirSync(path.join(__dirname, '../work'), {recursive:true});
  const launch = { headless: true, args: ['--disable-gpu'] };
  if (process.env.BCA_BROWSER_PATH) launch.executablePath = process.env.BCA_BROWSER_PATH;
  const browser = await chromium.launch(launch);
  try {
    const page = await browser.newPage({viewport: {width: 1440, height: 900}, acceptDownloads: true});
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(pathToFileURL(path.resolve(__dirname, '../index.html')).href);
    async function calc() { await page.click('#calculate'); }
    async function cells() {
      return page.locator('#sample-results tr').evaluateAll(rows => rows.map(r => [...r.querySelectorAll('td')].map(td => td.innerText.trim())));
    }
    async function error(pattern) {
      await calc();
      assert.equal(await page.locator('#results').isVisible(), false);
      assert.match(await page.locator('#error').innerText(), pattern);
    }
    assert.equal(await page.locator('#preset').inputValue(), 'lab-six');
    assert.match(await page.locator('footer').innerText(), /Cinderella_yufeng/);
    assert.equal(await page.locator('#unit').inputValue(), 'mg');
    await page.click('#demo'); await calc();
    assert.equal(await page.locator('#sample-results tr').count(), 3);
    assert.match(await page.locator('#quality').innerText(), /严格大于/);
    assert.match(await page.locator('#warnings').innerText(), /虚构/);

    await page.selectOption('#preset', 'beyotime-p0012');
    assert.equal(await page.locator('#conc-list').inputValue(), '0, 0.025, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5');
    assert.equal(await page.locator('#std-total').inputValue(), '20');
    assert.match(await page.locator('#preset-source').getAttribute('href'), /beyotime/);
    await page.selectOption('#preset', 'micro-bca-23235');
    assert.equal(await page.locator('#unit').inputValue(), 'ug');
    assert.equal(await page.locator('#method').inputValue(), 'quadratic');
    assert.equal(await page.locator('#std-total').inputValue(), '150');
    await page.selectOption('#preset', 'custom');
    await page.click('#clear');
    await page.locator('.advanced summary').click();

    // Four custom points, three standard replicates and two vertical sample replicates.
    const xs = [0, 0.2, 0.5, 1];
    const std = [-0.01, 0, 0.01].map(delta => xs.map(x => (0.1 + 0.8 * x + delta).toFixed(5)).join('\t')).join('\n');
    await page.fill('#conc-list', '0\n0.2\n0.5\n1');
    await page.fill('#std-reps', '3');
    await page.fill('#sample-reps', '2');
    await page.fill('#sample-volume', '5');
    await page.fill('#dilution', '2');
    await page.fill('#standards', std);
    await page.fill('#samples', '0.33\t0.49\n0.35\t0.51\n0.65\t0.89\n0.67\t0.91');
    assert.match(await page.locator('#pair-preview').innerText(), /样品1：0\.33 \/ 0\.35/);
    await calc();
    let out = await cells();
    assert.equal(out.length, 4);
    assert.deepEqual([out[0][7],out[0][8],out[0][9]], ['0.3000','2.4000','2400.00']);
    assert.deepEqual([out[1][7],out[1][8]], ['0.5000','4.0000']);
    assert.equal(await page.locator('#blank-value').innerText(), '0.1000');
    assert.equal(await page.locator('#r2').innerText(), '1.00000000');
    assert.equal(await page.locator('#standard-results tr').count(), 4);

    let downloadPromise = page.waitForEvent('download');
    await page.click('#export');
    let download = await downloadPromise;
    const csv = fs.readFileSync(await download.path(), 'utf8');
    assert.match(csv, /2\.400000/);
    assert.match(csv, /孔内补液换算倍数/);

    // Unit switching converts standards, including µg per well using the standard volume.
    await page.selectOption('#unit', 'ug');
    assert.equal(await page.locator('#conc-list').inputValue(), '0, 200, 500, 1000');
    await calc(); assert.equal((await cells())[0][8], '2.4000');
    await page.selectOption('#unit', 'ug-well');
    assert.equal(await page.locator('#conc-list').inputValue(), '0, 4, 10, 20');
    await calc(); assert.equal((await cells())[0][8], '2.4000');
    await page.selectOption('#unit', 'mg');
    assert.equal(await page.locator('#conc-list').inputValue(), '0, 0.2, 0.5, 1');

    // A differing final pre-reagent volume cannot silently be treated as equivalent.
    await page.fill('#sample-total', '10');
    await error(/总体积不同/);
    await page.fill('#sample-total', '20');

    // Already-corrected inputs are not blank-subtracted again; zero is optional.
    await page.selectOption('#blank-mode', 'corrected');
    await page.fill('#conc-list', '0.2,0.5,1');
    const correctedXs = [0.2,0.5,1];
    const correctedStd = [-0.01,0,0.01].map(d => correctedXs.map(x => (0.8*x+d).toFixed(5)).join('\t')).join('\n');
    await page.fill('#standards', correctedStd);
    await page.fill('#samples', '0.23\n0.25');
    await calc(); out = await cells();
    assert.equal(out[0][7], '0.3000');
    assert.equal(out[0][8], '2.4000');
    assert.equal(await page.locator('#blank-value').innerText(), '输入已扣空白');
    await page.selectOption('#blank-mode', 'raw');
    await error(/必须包含 0/);

    // R² gate blocks by default; explicit "warn" permits a labeled result.
    await page.fill('#conc-list', '0,0.2,0.5,1');
    await page.fill('#std-reps', '2');
    await page.fill('#standards', '0.1\t0.8\t0.2\t1.1\n0.1\t0.8\t0.2\t1.1');
    await page.fill('#samples', '0.33\n0.35');
    await calc(); out = await cells();
    assert.equal(out[0][8], '—');
    assert.equal(out[0][10], '曲线未通过');
    await page.selectOption('#qc-policy', 'warn'); await calc(); out = await cells();
    assert.notEqual(out[0][8], '—');
    assert.match(await page.locator('#quality').innerText(), /未严格大于/);

    // A model with no residual degrees of freedom cannot pass an R² quality gate.
    await page.fill('#conc-list', '0,1');
    await page.fill('#standards', '0.1\t0.9\n0.1\t0.9');
    await page.selectOption('#qc-policy', 'block'); await calc();
    assert.equal(await page.locator('#r2').innerText(), '不适用');
    assert.equal((await cells())[0][10], 'R² 不适用');
    await page.fill('#conc-list', '0,0.2,0.5,1');

    // Point-to-point interpolation has no global R².
    await page.selectOption('#method', 'piecewise');
    const standard2 = [0, 0.2, 0.5, 1].map(x => (0.1 + 0.8*x).toFixed(4)).join('\t');
    await page.fill('#standards', standard2 + '\n' + standard2);
    await page.selectOption('#qc-policy', 'block'); await calc();
    assert.equal((await cells())[0][8], '—');
    assert.equal(await page.locator('#r2').innerText(), '不适用');
    await page.selectOption('#qc-policy', 'warn'); await calc();
    assert.equal((await cells())[0][7], '0.3000');

    // The quadratic inverse correctly recovers a synthetic concentration.
    await page.selectOption('#method', 'quadratic');
    const quad = [0,0.2,0.5,1].map(x => (0.1 + 0.6*x + 0.2*x*x).toFixed(4)).join('\t');
    await page.fill('#standards', quad + '\n' + quad);
    await page.fill('#samples', '0.417\n0.423');
    await page.selectOption('#qc-policy', 'block'); await calc();
    assert.equal((await cells())[0][7], '0.4621');

    // A sample above the maximum standard is numerically extrapolated and labeled.
    await page.selectOption('#method', 'linear');
    await page.selectOption('#qc-policy', 'block');
    await page.fill('#standards', standard2 + '\n' + standard2);
    await page.fill('#samples', '1.29\n1.31'); await calc(); out = await cells();
    assert.equal(out[0][7], '1.5000');
    assert.equal(out[0][8], '12.0000');
    assert.equal(out[0][10], '外推估算');

    // Samples with incomplete vertical replicate cells are rejected rather than shifted.
    await page.fill('#samples', '0.33\t0.49\n0.35\t'); await error(/缺孔/);
    await page.fill('#samples', '0.33\t0.49\n\n0.35\t0.51\n0.65\t0.67'); await error(/缺孔/);

    // Imported names remain text, and formula-like names are escaped in CSV exports.
    await page.selectOption('#layout', 'rows');
    await page.fill('#samples', '样品名称,吸光度1,吸光度2\n<img src=x onerror=alert(1)>,0.33,0.35');
    await calc();
    assert.equal(await page.locator('#sample-results img').count(), 0);
    assert.match((await cells())[0][0], /<img/);
    await page.fill('#samples', '样品名称,吸光度1,吸光度2\n=1+1,0.33,0.35');
    await calc();
    downloadPromise = page.waitForEvent('download');
    await page.click('#export'); download = await downloadPromise;
    const safeCsv = fs.readFileSync(await download.path(), 'utf8');
    assert.match(safeCsv, /"'=1\+1"/);
    await page.selectOption('#layout', 'columns');

    // Saving a local profile never includes pasted absorbances or sample names.
    await page.fill('#samples', '0.33\n0.35');
    await page.fill('#profile-name', '我的测试方案');
    await page.click('#save-profile');
    assert.match(await page.locator('#preset').inputValue(), /^local:/);
    const stored = await page.evaluate(() => localStorage.getItem('bca-platform-local-profiles-v1'));
    assert.match(stored, /我的测试方案/);
    assert.doesNotMatch(stored, /0\.33/);

    // Backup round trip and previous six-standard calculator backups remain usable.
    await calc();
    downloadPromise = page.waitForEvent('download'); await page.click('#save-project'); download = await downloadPromise;
    const savedPath = path.join(__dirname, '../work/test-backup.json');
    await download.saveAs(savedPath);
    await page.click('#clear');
    await page.locator('#project-file').setInputFiles(savedPath);
    await page.waitForFunction(() => document.getElementById('samples').value.includes('0.33'));
    await calc(); assert.equal((await cells())[0][8], '2.4000');
    const moved = JSON.parse(fs.readFileSync(savedPath, 'utf8'));
    moved.settings.presetId = 'local:profile-from-another-browser';
    await page.locator('#project-file').setInputFiles({name:'moved.json', mimeType:'application/json', buffer:Buffer.from(JSON.stringify(moved))});
    await page.waitForFunction(() => document.getElementById('preset').value === 'custom');
    await calc(); assert.equal((await cells())[0][8], '2.4000');
    const legacy = {format:'bca-calculator-3', settings:{method:'linear',layout:'columns',dilution:'1'},
      standards:'0.10\t0.20\t0.30\t0.50\t0.90\t1.70\n0.10\t0.20\t0.30\t0.50\t0.90\t1.70',
      samples:'0.49\n0.51',demo:false};
    await page.locator('#project-file').setInputFiles({name:'legacy.json', mimeType:'application/json', buffer:Buffer.from(JSON.stringify(legacy))});
    await page.waitForFunction(() => document.getElementById('conc-list').value.includes('0.125'));
    await calc(); assert.equal((await cells())[0][7], '0.5000');
    assert.equal(await page.locator('#std-reps').inputValue(), '2');

    // Mobile layout and no runtime exceptions.
    await page.setViewportSize({width:390,height:844});
    await page.click('#demo'); await calc();
    const size = await page.evaluate(() => ({inner:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
    assert.equal(size.inner, size.scroll);
    await page.screenshot({path:path.join(__dirname, '../work/mobile.png'), fullPage:true});
    assert.deepEqual(errors, []);
    console.log('PASS: presets, variable gradients/replicates, units, blank correction, sample top-up, R², interpolation, extrapolation, backups and layout');
  } finally { await browser.close(); }
}
main().catch(e => { console.error(e); process.exitCode = 1; });

