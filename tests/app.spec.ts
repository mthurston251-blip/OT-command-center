import {test,expect} from '@playwright/test';
test('fictional workspace persists service logs and school availability',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('./');await expect(page.getByText('A little structure. More room to care.')).toBeVisible();
 await page.getByRole('button',{name:'Students',exact:true}).click();await expect(page.locator('tbody tr')).toHaveCount(100);
 await page.getByRole('button',{name:'Service log',exact:true}).click();
 const entries=await page.locator('.log-entry').count();
 await page.locator('select[name="students"]').selectOption(['s1','s2']);await page.locator('input[name="minutes"]').fill('25');await page.locator('textarea').fill('Fictional group practice');await page.getByRole('button',{name:'Save service log'}).click();await expect(page.getByRole('status')).toHaveText('Saved on this device.');await expect(page.getByText('Fictional group practice')).toHaveCount(2);
 await page.reload();await page.getByRole('button',{name:'Service log',exact:true}).click();await expect(page.getByText('Fictional group practice')).toHaveCount(2);
 if(entries<19)await expect(page.locator('.log-entry')).toHaveCount(entries+2);
 await page.getByRole('button',{name:'School availability',exact:true}).click();await page.getByRole('button',{name:'Monday 08:00: available',exact:true}).click();await expect(page.getByRole('button',{name:'Monday 08:00: discouraged',exact:true})).toBeVisible();
 await page.reload();await page.getByRole('button',{name:'School availability',exact:true}).click();await expect(page.getByRole('button',{name:'Monday 08:00: discouraged',exact:true})).toBeVisible();
 await page.getByLabel('Select school for availability').selectOption('Willow Creek Elementary');await expect(page.getByRole('button',{name:'Monday 08:00: available',exact:true})).toBeVisible();
 expect(errors).toEqual([]);
});
test('production app reloads and saves while offline',async({page,context})=>{
 await page.goto('./');await expect(page.locator('h1')).toBeVisible();
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;if(!navigator.serviceWorker.controller)await new Promise<void>(resolve=>navigator.serviceWorker.addEventListener('controllerchange',()=>resolve(),{once:true}));});
 await expect.poll(()=>page.evaluate(async()=>{const keys=await caches.keys();return keys.length;})).toBeGreaterThan(0);
 await context.setOffline(true);await page.reload();await expect(page.getByText('A little structure. More room to care.')).toBeVisible();
 await page.getByRole('button',{name:'Service log',exact:true}).click();await page.locator('select[name="students"]').selectOption('s3');await page.locator('textarea').fill('Offline fictional note');await page.getByRole('button',{name:'Save service log'}).click();await expect(page.getByText('Offline fictional note')).toBeVisible();
 await page.reload();await page.getByRole('button',{name:'Service log',exact:true}).click();await expect(page.getByText('Offline fictional note')).toBeVisible();
 await context.setOffline(false);
});
test('adds a fictional student and a group calendar session',async({page})=>{
 await page.goto('./');await page.getByRole('button',{name:'Students',exact:true}).click();await page.getByRole('button',{name:'Add fictional student'}).click();
 const dialog=page.getByRole('dialog');await dialog.locator('input[name="name"]').fill('Demo New Student');await dialog.locator('input[name="deadline"]').fill('2027-05-10');await dialog.locator('input[name="goal"]').fill('Fictional handwriting goal');await dialog.getByRole('button',{name:'Save student'}).click();await expect(page.locator('tbody tr')).toHaveCount(101);
 await page.getByRole('button',{name:'Weekly calendar',exact:true}).click();await page.getByRole('button',{name:'Add session',exact:true}).click();const session=page.getByRole('dialog');
 await session.locator('select[name="students"]').selectOption(['s1','s2']);await session.locator('input[name="date"]').fill('2026-10-05');await session.getByRole('button',{name:'Save session'}).click();
 // Navigate to a predictable week independent of the test execution date.
 await page.reload();await page.getByRole('button',{name:'Weekly calendar',exact:true}).click();
 await expect.poll(()=>page.evaluate(async()=>{const db=await new Promise<IDBDatabase>((resolve,reject)=>{const req=indexedDB.open('ot-command-center');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});const result=await new Promise<any>(resolve=>{const req=db.transaction('workspace').objectStore('workspace').get('data');req.onsuccess=()=>resolve(req.result);});db.close();return result.sessions.some((s:any)=>s.date==='2026-10-05'&&s.studentIds.join(',')==='s1,s2');})).toBe(true);
});
