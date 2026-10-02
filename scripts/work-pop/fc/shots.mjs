import puppeteer from 'puppeteer';
const out = process.argv[2];
const b = await puppeteer.launch({headless:'new'}); const p = await b.newPage();
await p.setViewport({width:1440,height:900,deviceScaleFactor:1});
await p.goto('http://localhost:3000/case-studies',{waitUntil:'networkidle0'});
for (const slug of ['fernhollow','crookeries']) {
  const row = await p.$(`a[href="/demo/${slug}"] img[src*="pop%2F${slug}"], a[href="/demo/${slug}"] img[src*="pop/${slug}"]`);
  const frame = await row.evaluateHandle(e=>e.closest('[data-reveal="frame"]'));
  await frame.evaluate(e=>e.scrollIntoView({block:'center'}));
  await new Promise(r=>setTimeout(r,2500));
  const bb = await frame.boundingBox();
  await p.screenshot({path:`${out}/wp-${slug}.png`});
}
// homepage strip: pause the drift and force pop on each card
await p.goto('http://localhost:3000/',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,1500));
for (const slug of ['fernhollow','crookeries']) {
  const bb = await p.evaluate((slug)=>{
    document.querySelectorAll('[class*=workTrack]').forEach(t=>t.style.animationPlayState='paused');
    const c=[...document.querySelectorAll(`[data-work-card][href="/demo/${slug}"]`)][0];
    c.scrollIntoView({block:'center', inline:'center'});
    const track=c.closest('[class*=workTrack]'); const r=c.getBoundingClientRect();
    track.style.translate = `${(innerWidth/2 - (r.left + r.width/2)) + (parseFloat(getComputedStyle(track).translate)||0)}px 0`;
    track.style.animation='none';
    c.setAttribute('data-centre','');
    const r2=c.getBoundingClientRect(); return {x:r2.x,y:r2.y,width:r2.width,height:r2.height};
  }, slug);
  await new Promise(r=>setTimeout(r,1500));
  await p.screenshot({path:`${out}/hs-${slug}.png`});
  await p.evaluate((slug)=>document.querySelector(`[data-work-card][href="/demo/${slug}"]`).removeAttribute('data-centre'), slug);
}
await b.close();
