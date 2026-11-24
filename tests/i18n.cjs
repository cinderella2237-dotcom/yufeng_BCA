/* Copyright (C) 2026 Cinderella_yufeng; SPDX-License-Identifier: AGPL-3.0-only */
const { chromium } = require('playwright');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const fs = require('node:fs');
const assert = require('node:assert/strict');

async function main() {
  const launch = {headless:true};
  if (process.env.BCA_BROWSER_PATH) launch.executablePath = process.env.BCA_BROWSER_PATH;
  const browser = await chromium.launch(launch);
  try {
    const page = await browser.newPage({viewport:{width:1440,height:900}, acceptDownloads:true});
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(pathToFileURL(path.resolve(__dirname,'../index.html')).href);
    assert.equal(await page.locator('#language-switch').inputValue(),'en');
    assert.equal(await page.locator('html').getAttribute('lang'),'en');
    assert.match(await page.locator('h1').innerText(),/BCA Protein Quantification/);
    async function chineseNodes() {
      return page.evaluate(() => {
        const out=[], walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
        while(walker.nextNode()) {
          const n=walker.currentNode, p=n.parentElement;
          if(p && !p.closest('[data-i18n-ignore]') && /[\u4e00-\u9fff]/.test(n.nodeValue)) out.push(n.nodeValue.trim());
        }
        return out.filter(Boolean);
      });
    }
    assert.deepEqual(await chineseNodes(), []);
    for (const id of ['lab-six','pierce-23225','beyotime-p0012','beyotime-p0010s','solarbio-pc0020','vazyme-e112','micro-bca-23235','custom']) {
      await page.selectOption('#preset', id);
      assert.doesNotMatch(await page.locator('#preset-note').innerText(),/[\u4e00-\u9fff]/);
    }
    await page.fill('#conc-list','0, 0.2, 0.5, 1');
    await page.fill('#profile-name','My protocol');
    await page.click('#save-profile');
    const savedProfile = await page.locator('#preset').inputValue();
    assert.match(savedProfile,/^local:/);
    await page.selectOption('#language-switch','zh');
    assert.equal(await page.locator('#preset').inputValue(),savedProfile);
    assert.equal(await page.locator('#conc-list').inputValue(),'0, 0.2, 0.5, 1');
    assert.match(await page.locator('#import-notice').innerText(),/已保存/);
    await page.selectOption('#language-switch','en');
    assert.equal(await page.locator('#preset').inputValue(),savedProfile);
    assert.match(await page.locator('#import-notice').innerText(),/saved/i);
    await page.click('#demo');
    assert.match(await page.locator('#pair-preview').innerText(),/Sample 1: 0\.539 \/ 0\.541/);
    await page.click('#calculate');
    assert.equal(await page.locator('#sample-results tr').count(),3);
    assert.match(await page.locator('#quality').innerText(),/strictly greater/);
    assert.deepEqual(await chineseNodes(), []);
    let promise = page.waitForEvent('download');
    await page.click('#export');
    let download = await promise;
    let csv = fs.readFileSync(await download.path(),'utf8');
    assert.equal(download.suggestedFilename(),'BCA-protein-concentrations.csv');
    assert.match(csv,/Sample name/);
    assert.match(csv,/Sample 1/);
    assert.doesNotMatch(csv,/[\u4e00-\u9fff]/);
    const before = {
      standards: await page.locator('#standards').inputValue(),
      samples: await page.locator('#samples').inputValue(),
      concentration: await page.locator('#sample-results tr').first().locator('td').nth(8).innerText()
    };
    await page.selectOption('#language-switch','zh');
    assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN');
    assert.equal(await page.locator('#calculate').innerText(),'计算蛋白浓度');
    assert.equal(await page.locator('#results').isVisible(),true);
    assert.equal(await page.locator('#standards').inputValue(),before.standards);
    assert.equal(await page.locator('#samples').inputValue(),before.samples);
    assert.equal(await page.locator('#sample-results tr').first().locator('td').nth(8).innerText(),before.concentration);
    await page.selectOption('#language-switch','en');
    assert.equal(await page.locator('#sample-results tr').first().locator('td').nth(8).innerText(),before.concentration);
    assert.deepEqual(await chineseNodes(), []);
    await page.fill('#samples','1.85\n1.87');
    await page.click('#calculate');
    assert.equal(await page.locator('#sample-results tr').first().locator('td').last().innerText(),'Extrapolated estimate');
    const extrapolated = await page.locator('#sample-results tr').first().locator('td').nth(8).innerText();
    await page.selectOption('#language-switch','zh');
    assert.equal(await page.locator('#sample-results tr').first().locator('td').last().innerText(),'外推估算');
    assert.equal(await page.locator('#sample-results tr').first().locator('td').nth(8).innerText(),extrapolated);
    await page.selectOption('#language-switch','en');

    // User-supplied names are never translated or altered, regardless of language.
    await page.selectOption('#layout','rows');
    await page.fill('#samples','Sample Name,Absorbance 1,Absorbance 2,Dilution\n蛋白A,0.539,0.541,2');
    await page.click('#calculate');
    assert.equal(await page.locator('#sample-results tr').first().locator('td').first().innerText(),'蛋白A');
    promise = page.waitForEvent('download');
    await page.click('#export');
    download = await promise;
    csv = fs.readFileSync(await download.path(),'utf8');
    assert.match(csv,/Sample name/);
    assert.match(csv,/蛋白A/);
    assert.doesNotMatch(csv,/样品名称/);
    await page.selectOption('#language-switch','zh');
    assert.equal(await page.locator('#sample-results tr').first().locator('td').first().innerText(),'蛋白A');
    promise = page.waitForEvent('download'); await page.click('#export'); download=await promise;
    csv=fs.readFileSync(await download.path(),'utf8');
    assert.match(csv,/样品名称/);

    // Chinese headers still work in the English interface.
    await page.selectOption('#language-switch','en');
    await page.fill('#samples','样品名称,吸光度1,吸光度2,稀释倍数\nProtein B,0.539,0.541,1');
    await page.click('#calculate');
    assert.equal(await page.locator('#sample-results tr').first().locator('td').first().innerText(),'Protein B');
    await page.locator('.advanced summary').click();
    await page.fill('#sample-total','5');
    await page.click('#calculate');
    assert.match(await page.locator('#error').innerText(),/sample volume cannot exceed|different total volumes/i);
    await page.selectOption('#language-switch','zh');
    assert.match(await page.locator('#error').innerText(),/体积/);
    await page.selectOption('#language-switch','en');
    assert.doesNotMatch(await page.locator('#error').innerText(),/[\u4e00-\u9fff]/);
    await page.fill('#sample-total','12.5');
    await page.selectOption('#layout','columns');
    await page.fill('#samples','0.4\t0.5\n0.41\t');
    assert.match(await page.locator('#pair-preview').innerText(),/missing well/i);
    await page.click('#calculate');
    assert.match(await page.locator('#error').innerText(),/missing well/i);

    // A previous six-point backup remains usable with English messages.
    const legacy = {format:'bca-calculator-3', settings:{method:'linear',layout:'columns',dilution:'1'},
      standards:'0.10\t0.20\t0.30\t0.50\t0.90\t1.70\n0.10\t0.20\t0.30\t0.50\t0.90\t1.70',
      samples:'0.49\n0.51',demo:false};
    await page.locator('#project-file').setInputFiles({name:'legacy.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(legacy))});
    await page.waitForFunction(()=>document.getElementById('samples').value.includes('0.49'));
    assert.match(await page.locator('#import-notice').innerText(),/older six-point backup/i);
    await page.click('#calculate');
    assert.equal(await page.locator('#sample-results tr').first().locator('td').nth(7).innerText(),'0.5000');
    const legacyV1 = {format:'bca-calculator-1', settings:{volume:'12.5',unit:'mg',method:'linear',layout:'columns',dilution:'1'},
      standards:'0\t0.10\t0.10\n0.125\t0.20\t0.20\n0.25\t0.30\t0.30\n0.5\t0.50\t0.50\n1\t0.90\t0.90\n2\t1.70\t1.70',
      samples:'0.49\n0.51',demo:false};
    await page.locator('#project-file').setInputFiles({name:'legacy-v1.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(legacyV1))});
    await page.waitForFunction(()=>document.getElementById('standards').value.startsWith('Concentration'));
    await page.click('#calculate');
    assert.equal(await page.locator('#sample-results tr').first().locator('td').nth(7).innerText(),'0.5000');

    // Language preference survives reload, but pasted measurements are not stored.
    await page.selectOption('#language-switch','zh');
    await page.reload();
    assert.equal(await page.locator('#language-switch').inputValue(),'zh');
    assert.equal(await page.locator('#samples').inputValue(),'');
    await page.selectOption('#language-switch','en');
    await page.setViewportSize({width:390,height:844});
    await page.click('#demo'); await page.click('#calculate');
    let size=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
    assert.equal(size.width,size.scroll);
    await page.selectOption('#language-switch','zh');
    size=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
    assert.equal(size.width,size.scroll);
    assert.deepEqual(errors,[]);
    console.log('PASS: English default, Chinese switch, preserved calculations, localized CSV/errors, headers, names, preference and mobile layout');
  } finally { await browser.close(); }
}
main().catch(e=>{console.error(e); process.exitCode=1});
