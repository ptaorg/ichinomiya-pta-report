(() => {
 const form=document.querySelector('#filters');if(!form)return;
 const cards=[...document.querySelectorAll('[data-record]')],fields=['q','school','status','year','topic'];
 const size=20,normalize=s=>s.normalize('NFKC').toLocaleLowerCase('ja');let current=1,matched=[];
 const nav=document.createElement('nav');nav.className='pagination';nav.setAttribute('aria-label','検索結果のページ');
 nav.innerHTML='<button type="button" id="previous-results">前の20件</button><span id="page-number"></span><button type="button" id="next-results">次の20件</button>';
 document.querySelector('#records').before(nav);
 const restore=()=>{const p=new URLSearchParams(location.search);for(const k of fields)form.elements[k].value=p.get(k)||'';current=Math.max(1,parseInt(p.get('page')||'1',10)||1);};
 const apply=(reset=false)=>{if(reset)current=1;const v=Object.fromEntries(fields.map(k=>[k,form.elements[k].value]));const words=normalize(v.q).trim().split(/\s+/).filter(Boolean);
 matched=cards.filter(c=>words.every(w=>normalize(c.dataset.search).includes(w))&&(!v.school||c.dataset.school.split(' ').includes(v.school))&&(!v.status||c.dataset.status===v.status)&&(!v.year||c.dataset.year===v.year)&&(!v.topic||c.dataset.topic.split(' ').includes(v.topic)));
 const pages=Math.max(1,Math.ceil(matched.length/size));current=Math.min(current,pages);cards.forEach(c=>c.hidden=true);matched.slice((current-1)*size,current*size).forEach(c=>c.hidden=false);
 document.querySelector('#result-count').textContent=`${matched.length}件が該当（全${cards.length}件中）・${matched.length?(current-1)*size+1:0}〜${Math.min(current*size,matched.length)}件目を表示`;
 document.querySelector('#empty').hidden=matched.length!==0;document.querySelector('#page-number').textContent=`${current} / ${pages}ページ`;document.querySelector('#previous-results').disabled=current===1;document.querySelector('#next-results').disabled=current===pages;
 const p=new URLSearchParams(Object.entries(v).filter(([,x])=>x));if(current>1)p.set('page',current);history.replaceState(null,'',location.pathname+(p.size?'?'+p:'')+location.hash);
 };
 form.addEventListener('input',()=>apply(true));form.addEventListener('change',()=>apply(true));form.addEventListener('submit',e=>{e.preventDefault();apply(true);});form.addEventListener('reset',()=>setTimeout(()=>apply(true),0));
 document.querySelector('#previous-results').addEventListener('click',()=>{current--;apply();document.querySelector('#result-count').scrollIntoView({block:'start'});});document.querySelector('#next-results').addEventListener('click',()=>{current++;apply();document.querySelector('#result-count').scrollIntoView({block:'start'});});
 window.addEventListener('popstate',()=>{restore();apply();});restore();apply();
})();

(() => {
 const field=document.querySelector('#school-name-query');
 if(!field)return;
 const entries=[...document.querySelectorAll('[data-school-entry]')];
 const count=document.querySelector('#school-match-count');
 field.addEventListener('input',()=>{
  const q=field.value.normalize('NFKC').trim();let n=0;
  entries.forEach(el=>{el.hidden=!el.dataset.schoolName.normalize('NFKC').includes(q);if(!el.hidden)n++;});
  count.textContent=`${n}校を表示（全61校）`;
 });
})();
