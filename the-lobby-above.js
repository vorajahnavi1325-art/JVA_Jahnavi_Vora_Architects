const reveals=document.querySelectorAll('.reveal');
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible')})},{threshold:.12});
reveals.forEach(el=>observer.observe(el));

const hero=document.querySelector('.hero>img');
window.addEventListener('scroll',()=>{
  if(hero){const y=Math.min(window.scrollY*.08,70);hero.style.transform=`scale(1.03) translateY(${y}px)`;}
},{passive:true});

const lightbox=document.querySelector('.lightbox');
const lightboxImg=lightbox.querySelector('img');
document.querySelectorAll('main img').forEach(img=>{
  img.addEventListener('click',()=>{
    lightboxImg.src=img.src;
    lightboxImg.alt=img.alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
  });
});
function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');lightboxImg.src='';}
lightbox.querySelector('.close').addEventListener('click',closeLightbox);
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox()});
