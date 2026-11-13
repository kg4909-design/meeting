/* 실제 만남 회고 기록 (기록 탭에서 열 때만 불러와요).
   시뮬레이션에서 배운 것과 현실에서 통한 것의 차이를 맞추기 위한 기록이에요. */
(function(){
"use strict";
const RKEY="reflect_v1";
const KINDS={match:'결정사 첫 만남',date:'소개팅',daily:'일상 대화'};
const REACT={good:'관심이 느껴졌어요',mid:'보통이었어요',low:'별로였어요',unk:'잘 모르겠어요'};
const AFTER={yes:'이어졌어요(애프터)',hold:'보류',no:'안 이어졌어요',tbd:'아직 몰라요'};
function rget(){const d=LS.get(RKEY,null)||{};d.items=d.items||[];return d}
function rsave(d){return LS.set(RKEY,d)}
const dstr=()=>{const x=new Date();return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')};
let root=null,formOpen=false;
function field(label,el){const w=mk('div');const l=mk('label',label);l.style.cssText='display:block;margin-top:10px;font-size:13px';w.appendChild(l);w.appendChild(el);return w}
function sel(map,val){const s=document.createElement('select');Object.keys(map).forEach(k=>{const o=document.createElement('option');o.value=k;o.textContent=map[k];if(k===val)o.selected=true;s.appendChild(o)});s.style.cssText='width:100%;box-sizing:border-box';return s}
function ta(ph,rows){const t=document.createElement('textarea');t.rows=rows||2;t.placeholder=ph;t.style.cssText='width:100%;box-sizing:border-box';return t}
function render(){
  if(!root)return;root.innerHTML='';
  const d=rget();
  const top=mk('div',null,'card');top.style.marginTop='10px';
  top.appendChild(mk('h2','📝 실제 만남 회고'));
  top.appendChild(mk('div','실제로 만나고 나서 통한 말과 아쉬운 말을 적어 두면, 연습과 현실의 차이를 맞출 수 있어요. 한 번에 1~2분이면 돼요.','small'));
  const nb=mk('button',formOpen?'접기':'새 회고 쓰기','btn main');nb.type='button';nb.onclick=()=>{formOpen=!formOpen;render()};top.appendChild(nb);
  const cl=mk('button','닫기','btn ghost');cl.type='button';cl.onclick=()=>{root.innerHTML='';formOpen=false};top.appendChild(cl);
  root.appendChild(top);
  if(formOpen)root.appendChild(form());
  if(d.items.length){
    const sm=mk('div',null,'card');sm.style.marginTop='10px';sm.appendChild(mk('h2','📚 지금까지의 회고 '+d.items.length+'건'));
    const w=d.items.filter(x=>x.worked).slice(-3).reverse();
    if(w.length){sm.appendChild(mk('div','최근 통한 말','small'));w.forEach(x=>sm.appendChild(mk('div','· '+x.worked,'sec')))}
    const m=d.items.filter(x=>x.missed).slice(-3).reverse();
    if(m.length){sm.appendChild(mk('div','최근 아쉬운 말','small'));m.forEach(x=>sm.appendChild(mk('div','· '+x.missed,'sec')))}
    const ct={yes:0,hold:0,no:0,tbd:0};d.items.forEach(x=>{if(ct[x.after]!=null)ct[x.after]++});
    sm.appendChild(mk('div','결과 분포: 이어짐 '+ct.yes+' · 보류 '+ct.hold+' · 안 이어짐 '+ct.no+' · 아직 '+ct.tbd,'small'));
    root.appendChild(sm);
    d.items.slice().reverse().forEach(x=>{
      const dt=mk('details');dt.style.marginTop='8px';dt.appendChild(mk('summary',x.date+' · '+(KINDS[x.kind]||'')+(x.who?' · '+x.who:'')+' · '+(AFTER[x.after]||'')));
      const b=mk('div');
      [['상대 반응',REACT[x.react]||''],['통한 말',x.worked],['아쉬운 말',x.missed],['다음에 해 볼 한 가지',x.next]].forEach(r=>{if(r[1]){const l=mk('div',null,'sec');l.appendChild(mk('b',r[0]+': '));l.appendChild(document.createTextNode(r[1]));b.appendChild(l)}});
      const del=mk('button','이 회고 삭제','btn rd');del.type='button';del.onclick=()=>{if(confirm('이 회고를 삭제할까요?')){const dd=rget();dd.items=dd.items.filter(i=>i.id!==x.id);rsave(dd);render()}};b.appendChild(del);
      dt.appendChild(b);root.appendChild(dt);
    });
  }
}
function form(){
  const c=mk('div',null,'card');c.style.marginTop='10px';
  const dt=document.createElement('input');dt.type='date';dt.value=dstr();dt.style.cssText='width:100%;box-sizing:border-box';
  const kind=sel(KINDS,'match');
  const who=document.createElement('input');who.placeholder='상대 호칭 (이니셜이나 별명, 실명 없이도 돼요)';who.maxLength=20;who.style.cssText='width:100%;box-sizing:border-box';
  const react=sel(REACT,'unk'),after=sel(AFTER,'tbd');
  const worked=ta('상대가 반응이 좋았던 내 말이나 순간을 적어 주세요.',2);
  const missed=ta('돌아보니 아쉬웠던 내 말이나 순간을 적어 주세요.',2);
  const next=document.createElement('input');next.placeholder='다음 만남에서 딱 1가지만 해 본다면?';next.maxLength=120;next.style.cssText='width:100%;box-sizing:border-box';
  const setMemo=document.createElement('input');setMemo.type='checkbox';setMemo.checked=true;setMemo.style.width='auto';
  const lb=document.createElement('label');lb.style.cssText='display:flex;gap:8px;align-items:center;margin-top:10px;font-size:13px';lb.appendChild(setMemo);lb.appendChild(document.createTextNode(" 이걸 '오늘의 미션'으로 저장해서 다음 시뮬레이션 연습에 반영하기"));
  c.appendChild(field('만난 날',dt));c.appendChild(field('어떤 만남이었나요',kind));c.appendChild(field('상대',who));
  c.appendChild(field('상대의 반응은 어땠나요',react));c.appendChild(field('그 뒤 결과',after));
  c.appendChild(field('통한 말',worked));c.appendChild(field('아쉬운 말',missed));c.appendChild(field('다음에 해 볼 딱 1가지',next));c.appendChild(lb);
  const msg=mk('div','','warn');
  const sv=mk('button','저장하기','btn main');sv.type='button';
  sv.onclick=()=>{
    if(!worked.value.trim()&&!missed.value.trim()&&!next.value.trim()){msg.textContent='통한 말, 아쉬운 말, 다음에 해 볼 것 중 하나는 적어 주세요.';return}
    const d=rget();
    d.items.push({id:Date.now(),date:dt.value||dstr(),kind:kind.value,who:who.value.trim(),react:react.value,after:after.value,worked:worked.value.trim(),missed:missed.value.trim(),next:next.value.trim()});
    d.items=d.items.slice(-200);rsave(d);
    if(setMemo.checked&&next.value.trim()){try{const t=next.value.trim();LS.set(NK,t);if($('memo'))$('memo').value=t;if($('memo2'))$('memo2').value=t}catch(e){}}
    formOpen=false;render();
    const m=mk('div',setMemo.checked&&next.value.trim()?'저장했어요 ✓ 다음 연습의 미션에 넣어 뒀어요.':'저장했어요 ✓','warn good');root.insertBefore(m,root.firstChild.nextSibling);
  };
  c.appendChild(sv);c.appendChild(msg);return c;
}
window.RF={open(){root=document.getElementById('rfRoot');if(!root)return;formOpen=false;render()},
  merge(src){if(!src||!Array.isArray(src.items))return 0;const d=rget();const ids=new Set(d.items.map(x=>x.id));let n=0;src.items.forEach(x=>{if(x&&!ids.has(x.id)){d.items.push(x);n++}});d.items.sort((a,b)=>a.id-b.id);rsave(d);return n}};
})();
