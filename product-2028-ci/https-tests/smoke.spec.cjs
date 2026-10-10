const {test,expect}=require('@playwright/test'),fs=require('fs'),path=require('path'),crypto=require('crypto');
test('HTTPS exact tested assets and isolated origin',async({page,request})=>{
 await page.goto('/');expect(new URL(page.url()).origin).toBe('https://qinghua-2028-iphone-pilot.rosyjam8.chatgpt.site');
 await expect(page.locator('#create')).toBeVisible();
 const root=path.join(__dirname,'../../product-2028-pilot-build');
 for(const name of fs.readdirSync(root)){const r=await request.get('/'+name);expect(r.status()).toBe(200);expect(crypto.createHash('sha256').update(await r.body()).digest('hex')).toBe(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,name))).digest('hex'));}
 const state=await page.evaluate(()=>({secure:isSecureContext,origin:location.origin,keys:Object.keys(localStorage)}));expect(state.secure).toBe(true);expect(state.keys.some(k=>k.startsWith('qh2027'))).toBe(false);
});
test('online actual answer survives reload and grades into review',async({page})=>{
 await page.goto('/');await page.locator('#name').fill('HTTPS虚构验收档案');await page.locator('#create').click();await expect(page.locator('#wrong')).toBeVisible();
 const u=JSON.parse(fs.readFileSync(path.join(__dirname,'../../product-2028-pilot-build/representative-courses.json'),'utf8')).units[0];await page.locator('[data-unit="'+u.id+'"]').click();await page.locator('#learned').click();await page.locator('#answer').fill('HTTPS闭卷原始回答');
 await expect.poll(()=>page.evaluate(async()=>{const b=await profile.exportBackup();return b.sessions.find(s=>s.id==='unit:en-foundation-svo')?.draft;})).toBe('HTTPS闭卷原始回答');
 await page.reload();await page.getByRole('button',{name:'继续 HTTPS虚构验收档案'}).click();await page.locator('[data-unit="'+u.id+'"]').click();await expect(page.locator('#answer')).toHaveValue('HTTPS闭卷原始回答');await page.locator('#recall').click();await expect(page.locator('#submit')).toBeVisible();
 await page.locator('input[name="pick"]').nth(0).check();await page.locator('#submit').click();await expect(page.locator('#next')).toBeVisible();await page.locator('#cause').selectOption('concept');await page.locator('#reflection').fill('HTTPS错因原文');await page.locator('#next').click();
 await expect.poll(()=>page.evaluate(async()=>{const b=await profile.exportBackup();return b.events.filter(e=>e.action==='answered').length;})).toBe(1);
 const b=await page.evaluate(()=>profile.exportBackup());expect(b.events.find(e=>e.action==='recalled').payload.answer).toBe('HTTPS闭卷原始回答');
});