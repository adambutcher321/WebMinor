import puppeteer from 'puppeteer';
const out = process.argv[2];
const b = await puppeteer.launch({headless: 'new'});
for (const [w,h,tag] of [[1440,900,'desk'],[390,844,'phone']]) {
  const p = await b.newPage(); await p.setViewport({width:w,height:h,deviceScaleFactor:2});
  await p.goto('http://localhost:3000/pricing',{waitUntil:'networkidle0'});
  const a = await p.$('a[href="https://www.printminor.com/"]');
  await a.evaluate(e=>e.scrollIntoView({block:'center'}));
  await new Promise(r=>setTimeout(r,800));
  const r0 = await a.boundingBox(); const sy = await p.evaluate(()=>scrollY); const r = {...r0, y: r0.y + sy};
  const clip = {x:Math.max(0,r.x-30), y:r.y-70, width:Math.min(w-Math.max(0,r.x-30), r.width+60), height:r.height+100};
  await p.screenshot({path:`${out}/pm-${tag}-rest.png`, clip});
  if (tag==='desk') { await p.mouse.move(r0.x+r0.width/2, r0.y+r0.height/2); await new Promise(r=>setTimeout(r,1200)); await p.screenshot({path:`${out}/pm-${tag}-hover.png`, clip}); }
  if (tag==='phone') await p.screenshot({path:`${out}/pm-phone-full.png`});
}
await b.close();
