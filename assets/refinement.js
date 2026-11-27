
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if('IntersectionObserver' in window&&!reduceMotion){
 const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08});
 document.querySelectorAll('.section-head,.intro>div,.service-card,.person,.network article,.engagement-grid article,.knowledge-grid>*,.review-layout>*,.step').forEach(el=>{el.classList.add('reveal');io.observe(el)});document.body.classList.add('motion-ready');
}
const faqInput=document.querySelector('#faq-search');
faqInput.addEventListener('input',()=>{let count=0;document.querySelectorAll('.faq-list details').forEach(el=>{const match=el.textContent.toLowerCase().includes(faqInput.value.trim().toLowerCase());el.hidden=!match;if(match)count++});document.querySelector('#faq-empty').hidden=count>0});
document.querySelectorAll('.faq-list details').forEach(el=>el.addEventListener('toggle',()=>{if(el.open)document.querySelectorAll('.faq-list details').forEach(other=>{if(other!==el)other.open=false})}));

let scrollQueued=false;const cinematicHero=document.querySelector('.hero-v2');function updateScroll(){const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.reading-progress').style.width=(max>0?scrollY/max*100:0)+'%';document.querySelector('.header').classList.toggle('scrolled',scrollY>20);if(cinematicHero&&!reduceMotion){const top=cinematicHero.getBoundingClientRect().top;cinematicHero.style.setProperty('--hero-drift-y',Math.min(24,Math.max(0,-top*.035))+'px')}scrollQueued=false}if(cinematicHero&&!reduceMotion&&window.matchMedia('(pointer:fine)').matches){cinematicHero.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=cinematicHero.getBoundingClientRect();cinematicHero.style.setProperty('--hero-drift-x',(((e.clientX-r.left)/r.width-.5)*-10)+'px');cinematicHero.style.setProperty('--hero-drift-y',(((e.clientY-r.top)/r.height-.5)*-8)+'px')},{passive:true});cinematicHero.addEventListener('pointerleave',()=>{cinematicHero.style.setProperty('--hero-drift-x','0px');cinematicHero.style.setProperty('--hero-drift-y','0px')})}window.addEventListener('scroll',()=>{if(!scrollQueued){requestAnimationFrame(updateScroll);scrollQueued=true}},{passive:true});updateScroll();
// Keep the contact dock away from the hero actions and form fields.
const contactDock=document.querySelector('.sticky-call');
if(contactDock&&cinematicHero&&'IntersectionObserver' in window){
 const dockObserver=new IntersectionObserver(entries=>{contactDock.hidden=entries[0].isIntersecting;},{threshold:0});
 dockObserver.observe(cinematicHero);
 document.addEventListener('focusin',event=>{if(event.target.matches('input,select,textarea'))contactDock.hidden=true});
 document.addEventListener('focusout',event=>{if(event.target.matches('input,select,textarea'))contactDock.hidden=cinematicHero.getBoundingClientRect().bottom>0});
}
const workGallery=document.getElementById('work-gallery');
if(workGallery){
 const buttons=[...document.querySelectorAll('[data-gallery-step]')];
 const updateGallery=()=>{const card=workGallery.querySelector('figure');const stride=card.getBoundingClientRect().width+14;const index=Math.max(0,Math.min(2,Math.round(workGallery.scrollLeft/stride)));document.querySelector('.gallery-status').textContent=`Bild ${index+1} von 3`;buttons[0].disabled=index===0;buttons[1].disabled=index===2};
 buttons.forEach(button=>button.addEventListener('click',()=>{const card=workGallery.querySelector('figure');workGallery.scrollBy({left:(card.getBoundingClientRect().width+14)*Number(button.dataset.galleryStep),behavior:reduceMotion?'instant':'smooth'})}));
 workGallery.addEventListener('scroll',updateGallery,{passive:true});window.addEventListener('resize',updateGallery,{passive:true});updateGallery();
}
// Close the menu with Escape and return focus to the opener.
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Menü öffnen');menu.focus()}});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>menu.setAttribute('aria-label','Menü öffnen')));
// Prepare a message for the visitor's chosen channel; no delivery is claimed here.
const inquiryForm=document.querySelector('#inquiry');
const inquiryStatus=document.querySelector('#inquiry-status');
const inquirySubmit=document.querySelector('#inquiry-submit');
const inquiryText=()=>`Hallo Peters & Partner,\n\nAnliegen: ${document.querySelector('#inquiry-topic').value}\n\n${document.querySelector('#inquiry-message').value.trim()}`;
inquiryForm.querySelectorAll('[name="inquiry-channel"]').forEach(input=>input.addEventListener('change',()=>{inquirySubmit.textContent=input.value==='email'?'E-Mail öffnen':'In WhatsApp öffnen';inquiryStatus.textContent=''}));
inquiryForm.addEventListener('submit',event=>{
 event.preventDefault();if(!inquiryForm.reportValidity())return;
 const channel=inquiryForm.querySelector('[name="inquiry-channel"]:checked').value;
 const text=inquiryText();
 if(channel==='whatsapp'){
  window.open('https://wa.me/4915155770635?text='+encodeURIComponent(text),'_blank','noopener,noreferrer');
  inquiryStatus.textContent='Nachricht vorbereitet. Prüfe sie in WhatsApp und sende sie dort ab.';
 }else{
  window.location.href='mailto:info@peters-und-partner.de?subject='+encodeURIComponent(document.querySelector('#inquiry-topic').value)+'&body='+encodeURIComponent(text);
  inquiryStatus.textContent='E-Mail vorbereitet. Sende sie in deinem E-Mail-Programm ab. Alternativ kannst du die Nachricht kopieren.';
 }
});
document.querySelector('#copy-message').addEventListener('click',async()=>{
 const message=document.querySelector('#inquiry-message');
 if(!message.value.trim()){message.focus();inquiryStatus.textContent='Schreibe zuerst kurz, worum es geht.';return}
 try{await navigator.clipboard.writeText(inquiryText());inquiryStatus.textContent='Nachricht kopiert. Du kannst sie in WhatsApp oder eine E-Mail einfügen.'}
 catch{message.focus();message.select();inquiryStatus.textContent='Deine Nachricht ist markiert. Kopiere sie über das Menü deines Geräts.'}
});
// Genuine customer excerpts rotate every four seconds while visible.
// Manual navigation resets the interval; the pause button remains available.
const reviewExperience=document.querySelector('#review-experience');
if(reviewExperience){
 const cards=[...reviewExperience.querySelectorAll('.review-card')];
 const controls=reviewExperience.querySelector('.review-controls');
 const dots=[...reviewExperience.querySelectorAll('[data-review]')];
 const stage=reviewExperience.querySelector('.review-stage');
 const position=document.querySelector('#review-position');
 const play=document.querySelector('#review-play');
 const meter=reviewExperience.querySelector('.review-timer span');
 const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
 let current=0,userPaused=motionPreference.matches,focusPaused=false,inView=false,frame=0,last=0,elapsed=0,pointerStart=null;
 const duration=4000;
 const eligible=()=>!userPaused&&!focusPaused&&inView&&!document.hidden&&!motionPreference.matches;
 const updatePlay=()=>{play.disabled=motionPreference.matches;play.setAttribute('aria-pressed',String(userPaused));play.setAttribute('aria-label',motionPreference.matches?'Automatischer Wechsel bei reduzierter Bewegung deaktiviert':userPaused?'Automatischen Wechsel starten':'Automatischen Wechsel pausieren');play.querySelector('span').innerHTML=userPaused?'<svg viewBox="0 0 24 24"><path d="m8 5 10 7-10 7Z"/></svg>':'<svg viewBox="0 0 24 24"><path d="M9 5v14M15 5v14"/></svg>';reviewExperience.classList.toggle('is-playing',eligible());position.setAttribute('aria-live',userPaused?'polite':'off')};
 const render=()=>{
  cards.forEach((card,index)=>{
   card.classList.toggle('is-active',index===current);card.classList.toggle('is-before',index===(current-1+cards.length)%cards.length);card.classList.toggle('is-after',index===(current+1)%cards.length);
   card.inert=index!==current;card.setAttribute('aria-hidden',String(index!==current));
  });
  dots.forEach((dot,index)=>dot.setAttribute('aria-pressed',String(index===current)));
  position.textContent=`${current+1} / ${cards.length}`;meter.style.transform=`scaleX(${elapsed/duration})`;updatePlay();
 };
 const tick=now=>{
  frame=0;if(!eligible())return;elapsed+=now-last;last=now;
  if(elapsed>=duration){elapsed=0;current=(current+1)%cards.length;render()}
  meter.style.transform=`scaleX(${elapsed/duration})`;frame=requestAnimationFrame(tick);
 };
 const sync=()=>{if(frame){cancelAnimationFrame(frame);frame=0}updatePlay();if(eligible()){last=performance.now();frame=requestAnimationFrame(tick)}};
 const go=index=>{current=(index+cards.length)%cards.length;elapsed=0;render();sync()};
 cards.forEach((card,index)=>{card.setAttribute('role','group');card.setAttribute('aria-roledescription','Bewertung');card.setAttribute('aria-label',`${index+1} von ${cards.length}`)});
 reviewExperience.classList.add('is-enhanced');controls.hidden=false;render();
 document.querySelector('#review-prev').addEventListener('click',()=>go(current-1));
 document.querySelector('#review-next').addEventListener('click',()=>go(current+1));
 dots.forEach(dot=>dot.addEventListener('click',()=>go(Number(dot.dataset.review))));
 play.addEventListener('click',()=>{if(motionPreference.matches){userPaused=true;updatePlay();return}userPaused=!userPaused;focusPaused=false;sync()});
 reviewExperience.addEventListener('focusin',event=>{focusPaused=Boolean(event.target.closest('.review-source'));sync()});
 reviewExperience.addEventListener('focusout',()=>queueMicrotask(()=>{focusPaused=Boolean(document.activeElement.closest('.review-source'));sync()}));
 reviewExperience.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();go(current+(event.key==='ArrowRight'?1:-1))}});
 stage.addEventListener('pointerdown',event=>{if(event.pointerType==='touch'||event.pointerType==='pen'){pointerStart={x:event.clientX,y:event.clientY};elapsed=0;sync()}});
 stage.addEventListener('pointerup',event=>{if(!pointerStart)return;const x=event.clientX-pointerStart.x,y=event.clientY-pointerStart.y;pointerStart=null;if(Math.abs(x)>45&&Math.abs(x)>Math.abs(y)*1.4)go(current+(x<0?1:-1))});
 stage.addEventListener('pointercancel',()=>pointerStart=null);
 document.addEventListener('visibilitychange',sync);
 motionPreference.addEventListener('change',()=>{if(motionPreference.matches)userPaused=true;sync()});
 if('IntersectionObserver'in window){new IntersectionObserver(entries=>{inView=entries[0].intersectionRatio>=.35;if(contactDock)contactDock.hidden=inView||cinematicHero.getBoundingClientRect().bottom>0||document.activeElement.matches('input,select,textarea');sync()},{threshold:.35}).observe(reviewExperience)}
}
