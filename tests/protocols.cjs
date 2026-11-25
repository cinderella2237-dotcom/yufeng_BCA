/* Copyright (C) 2026 Cinderella_yufeng; SPDX-License-Identifier: AGPL-3.0-only */
const { chromium } = require('playwright');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
  const launch = {headless:true}; if (process.env.BCA_BROWSER_PATH) launch.executablePath = process.env.BCA_BROWSER_PATH;
  const browser = await chromium.launch(launch);
  try {
    const context = await browser.newContext({acceptDownloads:true, viewport:{width:1280,height:850}});
    const page = await context.newPage();
    const errors=[]; page.on('pageerror', e => errors.push(e.message));
    const url=pathToFileURL(path.resolve(__dirname,'../index.html')).href;
    await page.goto(url);
    const presets = {
      'takara-t9300a-standard': ['0, 0.125, 0.25, 0.5, 0.75, 1, 1.5, 2','25'],
      'takara-t9300a-low': ['0, 5, 10, 20, 50, 100, 150, 200','100'],
      'servicebio-g2026': ['0, 0.025, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5','20'],
      'glpbio-gk10009': ['0, 0.125, 0.25, 0.5, 0.75, 1, 1.5, 2','25'],
      'proteintech-pk10026': ['0, 0.025, 0.125, 0.25, 0.5, 0.75, 1, 1.5, 2','20'],
      'solarbio-pc0020': ['0, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5','20'],
      'yeasen-20200': ['0, 0.125, 0.25, 0.5, 0.75, 1, 1.5, 2','25'],
      'epizyme-zj102': ['0, 0.125, 0.25, 0.5, 0.75, 1, 1.5, 2','20']
    };
    for (const [id,[concs,vol]] of Object.entries(presets)) {
      await page.selectOption('#preset',id);
      assert.equal(await page.locator('#conc-list').inputValue(),concs);
      assert.equal(await page.locator('#std-total').inputValue(),vol);
      assert.doesNotMatch(await page.locator('#preset-note').innerText(),/[\u4e00-\u9fff]/);
    }
    await page.selectOption('#preset','aike-x-bca500');
    assert.equal(await page.locator('#assay-mode').inputValue(),'x-bca-10');
    assert.equal(await page.locator('#blank-mode').inputValue(),'none');
    assert.equal(await page.locator('#std-reps').inputValue(),'3');
    assert.match(await page.locator('#preset-note').innerText(),/without topping up/);
    await page.fill('#standards','0.2\t0.45\t0.7\t0.95\t1.2\n0.2\t0.45\t0.7\t0.95\t1.2\n0.2\t0.45\t0.7\t0.95\t1.2');
    await page.fill('#samples','0.6\n0.6'); await page.fill('#dilution','2');
    await page.click('#calculate');
    assert.equal(await page.locator('#blank-value').innerText(),'Not blank-subtracted (raw readings)');
    assert.equal(await page.locator('#sample-results tr td').nth(7).innerText(),'4.0000');
    assert.equal(await page.locator('#sample-results tr td').nth(8).innerText(),'8.0000');
    assert.match(await page.locator('#warnings').innerText(),/not the stock concentration/);
    await page.locator('details.advanced').evaluate(e => e.open=true);
    await page.fill('#sample-volume','5'); await page.click('#calculate');
    assert.match(await page.locator('#error').innerText(),/supports only the stated 10/);
    await page.fill('#sample-volume','10');
    await page.fill('#profile-name','X saved test');
    await page.click('#save-profile');
    const id=await page.locator('#preset').inputValue(); assert.match(id,/^local:/);
    const promise=page.waitForEvent('download'); await page.click('#export-profile');
    const download=await promise; const contents=fs.readFileSync(await download.path(),'utf8');
    const profile=JSON.parse(contents); assert.equal(profile.format,'bca-protocol-1');
    assert.equal(profile.settings.assayMode,'x-bca-10');
    assert.equal(Object.hasOwn(profile,'samples'),false); assert.equal(Object.hasOwn(profile,'standards'),false);
    assert.doesNotMatch(contents,/0\.6\\n0\.6/);
    await page.reload(); assert.ok(await page.locator('#preset option[value="'+id+'"]').count());
    const second = await browser.newContext({acceptDownloads:true}); const fresh=await second.newPage(); await fresh.goto(url);
    await fresh.fill('#samples','0.71\n0.72');
    await fresh.setInputFiles('#profile-file',{name:'protocol.json',mimeType:'application/json',buffer:Buffer.from(contents)});
    await fresh.waitForFunction(() => document.getElementById('preset').value.startsWith('local:'));
    assert.equal(await fresh.locator('#assay-mode').inputValue(),'x-bca-10');
    assert.equal(await fresh.locator('#samples').inputValue(),'0.71\n0.72');
    assert.equal(await fresh.locator('#std-reps').inputValue(),'3');
    await fresh.selectOption('#language-switch','zh'); assert.match(await fresh.locator('#preset-note').innerText(),/本浏览器/);
    await fresh.locator('details.advanced').evaluate(e => e.open=true);
    assert.match(await fresh.locator('#std-total-label').innerText(),/参考体积/);
    await fresh.setInputFiles('#profile-file',{name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"format":"bad"}')});
    await fresh.locator('#error').waitFor({state:'visible'});
    assert.match(await fresh.locator('#error').innerText(),/无法识别/);
    await fresh.close(); await second.close();
    assert.deepEqual(errors,[]);
    await context.close();
    console.log('PASS: requested kit presets, X-BCA raw calculation and guards, local profiles and portable settings');
  } finally { await browser.close(); }
})().catch(e => {console.error(e);process.exit(1);});
