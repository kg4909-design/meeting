/* 🌱 이번 주 실전 미션 (시작 화면에서 열 때만 불러와요).
   시뮬레이터는 연습장이고, 실력은 실제 사람과의 짧은 대화에서 늘어요. 작은 실전 1개 → 기록 → 예상과 실제 신호 비교. */
(function(){
"use strict";
const KEY="real_v1";
const M=[
 ['follow','되묻기','상대가 한 말 속 단어 하나를 받아서 한 번 되묻기','동료·가족·아는 사람과 대화 중. 예) "아까 말한 ○○는 어쩌다 하게 됐어요?"'],
 ['thanks','구체적 감사','오늘 도움 준 사람에게 "무엇을 해 줘서 어땠다" 한 줄 말하기','예) "자료 정리해 줘서 오늘 편했어요."'],
 ['feel','감정 한마디','상대가 일·일상 얘기를 하면 사실 질문 전에 감정 한마디 먼저 얹기','예) "그건 좀 힘들었겠어요." / "반가웠겠네요."'],
 ['piece','내 이야기 한 조각','질문 대신 내 경험 한 조각을 말하고 질문 없이 끝내 보기','상대가 편한 사람과. 길게 말하지 말고 1~2문장.'],
 ['small','가벼운 한마디','가게·엘리베이터·택배 등에서 날씨 말고 그 상황에 맞는 한마디 건네기','예) 카페에서 "오늘 사람 많네요." 정도로 충분해요.'],
 ['listen','끝까지 듣고 되짚기','상대 말을 끊지 않고 끝까지 듣고 "~라는 거죠?" 한 문장으로 되짚기','한 번만 해도 돼요. 길게 요약하지 않기.'],
 ['start','먼저 말 걸기','아는 사람 한 명에게 먼저 안부 한마디(대면·문자 모두 가능) 건네기','부담 없는 사람부터. 용건 없는 안부로.'],
 ['quiet','3초 기다리기','내 답을 한 뒤 바로 질문하지 않고 3초 기다려 보기','침묵이 어색하게 느껴지는 걸 그냥 지나가게 둬 보는 연습이에요.'],
 ['size','반응 크기 조절','재미있는 얘기엔 반응을 조금 크게, 나머지는 담백하게 하기','모든 얘기에 똑같이 반응하지 않기.'],
 ['observe','관찰 한마디','상대가 고른 것(메뉴·물건)을 보고 "이거 좋아하시나 봐요" 한마디 하기','칭찬이 아니라 본 것을 말하는 연습이에요.'],
 ['end','마무리 한마디','대화가 끝날 때 "얘기 즐거웠어요" 같은 담백한 한마디 남기기','진심일 때만. 과하지 않게.'],
 ['call','10분 안부','가까운 사람과 10분 통화(또는 식사)하며 위 기술 중 하나만 써 보기','하나만 정하고 나머지는 편하게.']
];
const SIG=[['laugh','웃었다'],['cont','내 말에 이어서 말했다'],['ask','나에게 되물었다'],['long','이야기가 길어졌다'],['init','먼저 말을 걸어왔다'],['unk','잘 모르겠다']];
const PRED={1:'1 (별로 안 좋아했을 것 같아요)',2:'2',3:'3 (보통)',4:'4',5:'5 (좋게 느꼈을 것 같아요)'};
function rget(){const d=LS.get(KEY,null)||{};d.log=d.log||[];d.seen=d.seen||{};d.pending=d.pending||null;d.cur=d.cur||null;return d}
function rsave(d){return LS.set(KEY,d)}
function weekStart(){const d=new Date();d.setHours(0,0,0,0);const w=(d.getDay()+6)%7;d.setDate(d.getDate()-w);return d.getTime()}
function pickM(d,skip){
  const un=M.filter(m=>!d.seen[m[0]]&&m[0]!==skip);const pool=un.length?un:M.filter(m=>m[0]!==skip);
  if(!un.length)d.seen={};return pool[Math.floor(Math.random()*pool.length)];
}
let root=null;
const find=id=>M.find(m=>m[0]===id)||M[0];
function render(){
  if(!root)return;root.innerHTML='';
  const d=rget();
  const c=mk('div',null,'card');c.style.marginTop='10px';
  c.appendChild(mk('h2','🌱 이번 주 실전 미션'));
  c.appendChild(mk('div','시뮬레이터는 연습장이에요. 실력은 실제 사람과의 짧은 대화에서 늘어요. 오늘은 아주 작은 것 하나만 해 봐요. 잘되든 안 되든 기록하는 것 자체가 연습이에요.','small'));
  const ws=weekStart();const n=d.log.filter(x=>x.id>=ws&&x.did!=='no').length;
  c.appendChild(mk('div','이번 주 실전 '+n+'회 (목표: 주 3회, 못 채워도 괜찮아요)','small'));
  if(d.pending){
    const m=find(d.pending.m);
    const b=mk('div',null,'sec');b.appendChild(mk('b','🕐 해 보고 오셨나요?'));
    b.appendChild(mk('div',m[2]));b.appendChild(mk('div','하기 전 예상: '+d.pending.pred+'점','small'));
    const did=sel({yes:'했어요',part:'조금 했어요',no:'못 했어요'});
    const who=document.createElement('input');who.placeholder='누구와? (별명이나 "동료"처럼 짧게, 선택)';who.maxLength=20;who.style.cssText='width:100%;box-sizing:border-box';
    b.appendChild(fl('했나요',did));b.appendChild(fl('상대',who));
    const sg=mk('div');sg.style.cssText='margin-top:10px;font-size:13px';sg.appendChild(mk('div','상대가 보인 신호가 있었나요? (해당하는 것 모두)'));
    const cks={};SIG.forEach(s=>{const l=document.createElement('label');l.style.cssText='display:flex;gap:8px;align-items:center;margin-top:6px;font-size:13px';const k=document.createElement('input');k.type='checkbox';k.style.width='auto';cks[s[0]]=k;l.appendChild(k);l.appendChild(document.createTextNode(' '+s[1]));sg.appendChild(l)});b.appendChild(sg);
    const note=document.createElement('textarea');note.rows=2;note.placeholder='한 줄 메모 (선택): 무슨 말을 했고, 어땠나요?';note.style.cssText='width:100%;box-sizing:border-box';b.appendChild(fl('메모',note));
    const msg=mk('div','','warn');
    const sv=mk('button','기록하기','btn main');sv.type='button';
    sv.onclick=()=>{
      const dd=rget();const p=dd.pending;if(!p)return;
      const sig=SIG.filter(s=>s[0]!=='unk'&&cks[s[0]].checked).map(s=>s[0]);
      const rec={id:p.id,date:new Date(p.id).toISOString().slice(0,10),m:p.m,pred:p.pred,did:did.value,who:who.value.trim(),sig:sig,unk:!!cks.unk.checked,note:note.value.trim().slice(0,200)};
      dd.log.push(rec);dd.log=dd.log.slice(-300);dd.pending=null;rsave(dd);
      render();showResult(rec);try{window.realSummary&&window.realSummary()}catch(e){}
    };
    b.appendChild(sv);b.appendChild(msg);
    const cx=mk('button','취소(오늘은 건너뛰기)','btn ghost');cx.type='button';cx.onclick=()=>{const dd=rget();dd.pending=null;rsave(dd);render()};b.appendChild(cx);
    c.appendChild(b);
  }else{
    if(!d.cur||!find(d.cur.m)){const dd=rget();dd.cur={m:pickM(dd)[0]};dd.seen[dd.cur.m]=1;rsave(dd);d.cur=dd.cur}
    const m=find(d.cur.m);
    const b=mk('div',null,'sec');b.appendChild(mk('b','🎯 오늘의 작은 미션 · '+m[1]));
    b.appendChild(mk('div',m[2]));b.appendChild(mk('div',m[3],'small'));
    try{const memo=LS.get(NK,'');if(memo)b.appendChild(mk('div','시뮬레이션에서 정한 오늘의 한 가지: '+memo,'small'))}catch(e){}
    const pr=sel(PRED);pr.value='3';
    b.appendChild(fl('하기 전 예상: 이 대화가 끝나면 상대가 나와의 대화를 좋게 느꼈을 것 같은 정도는?',pr));
    const go=mk('button','해 볼게요 (예상 기록)','btn main');go.type='button';
    go.onclick=()=>{const dd=rget();dd.pending={id:Date.now(),m:dd.cur.m,pred:Number(pr.value)};dd.seen[dd.cur.m]=1;dd.cur=null;rsave(dd);render();try{window.realSummary&&window.realSummary()}catch(e){}};
    const other=mk('button','다른 미션','btn sub');other.type='button';other.onclick=()=>{const dd=rget();const nm=pickM(dd,dd.cur&&dd.cur.m);dd.cur={m:nm[0]};dd.seen[nm[0]]=1;rsave(dd);render()};
    b.appendChild(go);b.appendChild(other);c.appendChild(b);
  }
  const cl=mk('button','닫기','btn ghost');cl.type='button';cl.onclick=()=>{root.innerHTML=''};c.appendChild(cl);
  root.appendChild(c);
  /* 예상 vs 실제 신호 */
  const done=d.log.filter(x=>x.did!=='no'&&typeof x.pred==='number').slice(-12);
  if(done.length>=3){
    const sm=mk('div',null,'card');sm.style.marginTop='10px';sm.appendChild(mk('h2','📈 예상과 실제 신호 (최근 '+done.length+'회)'));
    const avgP=done.reduce((a,x)=>a+x.pred,0)/done.length;
    const avgS=done.reduce((a,x)=>a+(x.sig||[]).length,0)/done.length;
    sm.appendChild(mk('div','내 예상 평균 '+avgP.toFixed(1)+'점 · 상대가 보인 신호 평균 '+avgS.toFixed(1)+'개','sec'));
    sm.appendChild(mk('div',avgP<=2.6&&avgS>=1.5?'예상은 낮은데 상대가 보인 신호는 꽤 있었어요. 대화 뒤에는 어색했던 순간이 더 크게 기억되곤 해요.':'기록이 쌓이면 내 예상과 실제 신호의 차이가 보여요. 점수가 아니라 신호를 기준으로 보세요.','small'));
    root.appendChild(sm);
  }
  const lg=d.log.slice(-8).reverse();
  if(lg.length){
    const h=mk('div',null,'card');h.style.marginTop='10px';h.appendChild(mk('h2','📚 최근 기록'));
    lg.forEach(x=>{const m=find(x.m);const sg=(x.sig||[]).map(k=>(SIG.find(s=>s[0]===k)||[0,k])[1]).join(', ');
      h.appendChild(mk('div','· '+x.date+' '+m[1]+' · 예상 '+x.pred+'점 · '+({yes:'했어요',part:'조금',no:'못 했어요'}[x.did]||'')+(sg?' · 신호: '+sg:'')+(x.note?' · '+x.note:''),'sec'))});
    root.appendChild(h);
  }
  const ev=document.createElement('details');ev.style.marginTop='10px';ev.appendChild(mk('summary','🔬 이 방식의 근거와 한계'));
  const eb=mk('div',null,'small');eb.style.whiteSpace='pre-line';
  eb.textContent="· 대화 직후 사람들은 상대가 자신을 실제보다 덜 좋아했다고 평가하는 경향이 있었어요(Boothby 외, 2018, Psychological Science). 이 기록의 '예상 vs 실제 신호'는 그 차이를 스스로 확인해 보려는 장치예요.\n· 상대 말에 이어서 묻는 질문(후속 질문)이 호감을 높이는 경향이 보고됐지만, 지나치거나 반복되면 역효과일 수 있어요(Huang 외, 2017).\n· 구체적 목표와 피드백이 있는 연습이 숙련에 필요하지만, 연습한 그 기술만 늘어난다는 한계도 있어요(Ericsson의 계획된 연습 개념).\n· AI 상대와의 연습은 피드백이 있을 때 기술이 늘었다는 소규모 실험이 있으나(Stanford HAI 소개 연구), 실제 사람과의 대화로 이어지는지는 확인되지 않았어요. 그래서 이 앱은 실전 기록을 함께 쓰게 만들었어요.\n· 이 앱의 '신호'는 건 님이 보고 체크한 것이라 정확한 호감도 측정이 아니에요.";
  ev.appendChild(eb);root.appendChild(ev);
}
function showResult(rec){
  const m=find(rec.m);const box=mk('div',null,'card');box.style.marginTop='10px';
  if(rec.did==='no'){box.appendChild(mk('div','못 해도 괜찮아요. 시도하려고 마음먹은 것부터가 시작이에요. 내일은 더 작은 미션(예: "가벼운 한마디")으로 바꿔 봐도 좋아요.','sec'))}
  else{
    const t=rec.sig.length;
    let s='기록했어요 ✓ ';
    if(rec.pred<=2&&t>=2)s+='예상은 '+rec.pred+'점이었는데 상대가 보인 신호는 '+t+'개였어요. 어색했던 순간보다 상대가 보인 신호도 같이 기억해 두세요.';
    else if(t===0&&!rec.unk)s+='이번엔 뚜렷한 신호가 없었네요. 한 번의 결과로 판단하지 말고, 다음에 같은 미션을 한 번 더 해 봐요.';
    else s+='해 본 것만으로 충분해요. 다음엔 "'+m[1]+'"을 한 번 더 하거나 다른 미션으로 넘어가 보세요.';
    box.appendChild(mk('div',s,'sec'));
  }
  root.insertBefore(box,root.firstChild.nextSibling);
}
function sel(map){const s=document.createElement('select');Object.keys(map).forEach(k=>{const o=document.createElement('option');o.value=k;o.textContent=map[k];s.appendChild(o)});s.style.cssText='width:100%;box-sizing:border-box';return s}
function fl(label,el){const w=mk('div');const l=mk('label',label);l.style.cssText='display:block;margin-top:10px;font-size:13px';w.appendChild(l);w.appendChild(el);return w}
window.RL={open(){root=document.getElementById('realRoot');if(!root)return;render()},
  merge(src){if(!src||!Array.isArray(src.log))return 0;const d=rget();const ids=new Set(d.log.map(x=>x.id));let n=0;src.log.forEach(x=>{if(x&&!ids.has(x.id)){d.log.push(x);n++}});d.log.sort((a,b)=>a.id-b.id);rsave(d);return n}};
})();
