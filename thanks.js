/* 구체적 인정·감사 말하기 연습 (드릴 탭에서 열 때만 불러와요) */
(function(){
"use strict";
const TKEY="thx_v1";
const AX=[{k:'a',name:'구체적 행동'},{k:'m',name:'나에게 준 의미·기분'},{k:'t',name:'진심의 크기'}];
const RUBRIC=`[a 구체적 행동] 상대가 '무엇을' 해 주었는지 구체적으로 짚는가("예약해 주셔서", "지난번 얘기를 기억해 주셔서"). "고마워요", "착하시네요" 같은 막연한 표현만이면 0~4. 상황에 나온 행동을 정확히 짚으면 15점 이상.
[m 나에게 준 의미·기분] 그 행동이 나에게 어떤 기분·도움·의미였는지 한 마디로 말하는가("덕분에 마음이 편했어요"). 없으면 0~4.
[t 진심의 크기] 과장·아부·평가("정말 최고예요", "천사 같아요", "착하시네요")가 아니라 행동과 영향 중심으로 담백하게 말하는가. 사람 자체를 평가하거나 과하면 감점, 뭔가를 바라는 말·조건 달기는 큰 감점. 길게 늘어놓으면 감점.`;
const SIT=[
 ['t1','상대가 미리 식당을 찾아 예약해 두었어요.','저 대신 예약까지 해 둔 상황'],
 ['t2','상대가 지난번에 내가 말한 책을 기억하고 "그 책 읽어 봤어요"라고 해요.','내 말을 기억해 준 상황'],
 ['t3','내가 길을 헤매 약속에 조금 늦었는데, 상대가 웃으며 기다려 줬어요.','늦은 나를 기다려 준 상황'],
 ['t4','내가 하는 일 이야기를 상대가 끝까지 진지하게 듣고 궁금한 걸 물어봐 줬어요.','내 이야기를 진지하게 들어 준 상황'],
 ['t5','상대가 요즘 힘든 일을 조심스럽게 털어놓았어요.','솔직한 이야기를 꺼내 준 상황'],
 ['t6','메뉴를 고를 때 상대가 "음식 가리는 거 있으세요?" 하고 내 취향을 먼저 챙겼어요.','내 취향을 먼저 배려한 상황'],
 ['t7','헤어질 때 상대가 "오늘 이야기 즐거웠어요"라고 먼저 말해 줬어요.','먼저 마음을 표현해 준 상황'],
 ['t8','내가 말실수를 했는데 상대가 부드럽게 웃으며 넘겨 줬어요.','내 실수를 부드럽게 넘겨 준 상황'],
 ['t9','내 시시한 농담에 상대가 진심으로 웃어 줬어요.','내 농담에 웃어 준 상황'],
 ['t10','내 고민을 듣고 상대가 시간을 내서 자기 경험을 들려주며 조언해 줬어요.','시간을 내어 조언해 준 상황']
];
function tget(){const d=LS.get(TKEY,null)||{};d.hist=d.hist||[];d.seen=d.seen||{};return d}
function tsave(d){return LS.set(TKEY,d)}
const gradeWord=a=>a>=17?'좋음':a>=12?'보통':'보완';
function pickSit(d){
  const unseen=SIT.filter(s=>!d.seen[s[0]]);
  const pool=unseen.length?unseen:SIT;
  if(!unseen.length)d.seen={};
  return pool[Math.floor(Math.random()*pool.length)];
}
let root=null,cur=null,sp=null;
function stats(d){
  const h=d.hist.slice(-10);if(!h.length)return null;
  const avg=k=>Math.round(h.reduce((a,x)=>a+((x.ax||{})[k]||0),0)/h.length);
  return AX.map(a=>a.name+' '+gradeWord(avg(a.k))).join(' · ')+' (최근 '+h.length+'회)';
}
function render(){
  if(!root)return;root.innerHTML='';
  const d=tget();
  const c=mk('div',null,'card');c.style.marginTop='10px';
  c.appendChild(mk('h2','🙏 구체적 인정·감사 말하기'));
  c.appendChild(mk('div','"고마워요", "착하시네요"보다 상대가 한 행동을 구체적으로 짚고, 그게 나에게 어떤 의미였는지 말해 보는 연습이에요. 상대가 이해받고 인정받고 있다고 느끼는 정도가 친밀감에 중요하다는 연구가 있어요. (예: Laurenceau 외, 2005)','small'));
  const st=stats(d);if(st)c.appendChild(mk('div','📊 '+st,'small'));
  const go=mk('button',cur?'다른 상황으로':'연습 시작','btn main');go.type='button';go.onclick=()=>{const dd=tget();cur=pickSit(dd);dd.seen[cur[0]]=1;tsave(dd);show()};
  c.appendChild(go);
  const close=mk('button','닫기','btn ghost');close.type='button';close.onclick=()=>{try{sp&&sp.stop()}catch(e){}root.innerHTML='';cur=null};c.appendChild(close);
  root.appendChild(c);
  const box=mk('div');box.id='thxBox';root.appendChild(box);
  if(cur)show();
}
function show(){
  const box=document.getElementById('thxBox');if(!box||!cur)return;
  if(!window.SP){box.textContent='불러오는 중...';return}
  try{sp&&sp.stop()}catch(e){}
  const sit=`[상황] ${cur[1]}\n이 사람에게 직접 고마움이나 인정을 1~2문장으로 말해 보세요. (행동을 구체적으로 + 나에게 준 의미)`;
  sp=window.SP.practice(box,{title:'🙏 '+cur[2],situation:sit,hint:'예: "미리 예약해 주셔서 오는 길이 한결 편했어요." 처럼 행동과 기분을 같이 말해 보세요.',axes:AX,rubric:RUBRIC,sample:'',
    onResult:rec=>{const dd=tget();const ax={};AX.forEach(a=>ax[a.k]=rec.ax[a.k].s);dd.hist.push({id:cur[0],ts:Date.now(),t:rec.total,ax:ax});dd.hist=dd.hist.slice(-100);tsave(dd)}});
}
window.TH={open(){root=document.getElementById('thxRoot');if(!root)return;cur=null;render()}};
})();
