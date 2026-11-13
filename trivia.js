/* 오늘의 상식 탭 — 탭을 처음 열 때만 불러오는 별도 파일.
   index.html 의 공용 함수(LS, $, mk, aiJson, ttsSay, ttsStop, dKey, dget, dsave, CFG ...)만 사용하고
   실전 연습(실시간 음성)·연결 진단 코드는 건드리지 않아요. */
(function(){
"use strict";
const TK="trivia_v1";
const FIELDS=["카페·디저트","술·와인·위스키","집·인테리어·살림","맛집·음식 문화","여행·도시","반려동물","영화·드라마·OTT","음악·공연","전시·미술","책·웹툰","야구·축구","e스포츠(롤 등)","운동·러닝·필라테스","수면·건강 상식","관계·심리","재테크 상식","과학·우주","역사 속 재미있는 이야기","요즘 트렌드"];
const F_DRINK="술·와인·위스키",F_SPORT=["야구·축구","e스포츠(롤 등)"],F_TREND="요즘 트렌드";
const SEARCH_MODELS=["gemini-2.5-flash","gemini-2.5-flash-lite"];
const WIN=3600e3*12;

/* ---------- 기본 카드(처음 보여 드린 샘플 5장, API 없이도 쓸 수 있어요) ---------- */
const SEED=[
{id:"seed1",f:"카페·디저트",kw:"콜드브루",sum:["콜드브루는 찬물에 원두를 오래 담가 우려낸 커피예요.","아이스 아메리카노는 뜨겁게 뽑은 에스프레소에 물과 얼음을 넣은 거고요.","그래서 둘은 만드는 방법부터 달라요. 보통 콜드브루는 몇 시간 이상 걸려요(시간은 확인 필요)."],open:"혹시 커피 마실 때 콜드브루 좋아하세요, 아니면 아이스 아메리카노 쪽이세요?",qs:["자주 가시는 카페는 어떤 분위기예요?","커피 말고 카페에서 꼭 시키는 메뉴가 있으세요?"],links:["원두","디저트","카페 투어"],mine:"내가 자주 가는 동네 카페나 작업하기 좋았던 곳 하나를 떠올려 두기.",mistake:"원두 산지나 추출 방식 지식을 길게 늘어놓기.",quiz:{q:"콜드브루의 특징은?",o:["뜨거운 물로 빠르게 추출","찬물에 오래 우려냄","우유를 반드시 넣음","탄산수로 만듦"],a:1,why:"콜드브루는 찬물에 오래 우려내는 방식이에요."},seed:1},
{id:"seed2",f:F_DRINK,kw:"싱글 몰트 위스키",sum:["싱글 몰트는 한 증류소에서 만든 보리 맥아 위스키예요.","\"싱글\"은 병이 하나라는 뜻이 아니라 증류소가 하나라는 뜻이에요.","그래서 병에 증류소 이름이 쓰여 있는 경우가 많아요."],open:"위스키 좋아하는 분들은 처음 입문한 계기가 다 다르던데, 어떻게 시작하셨어요?",qs:["술 마실 때 분위기를 더 보세요, 술 종류를 더 보세요?","기억에 남는 술자리가 있으세요?"],links:["바","안주","여행지의 술"],sober:"저는 술을 잘 안 마셔서 맛은 잘 모르지만, 분위기 좋은 바는 구경하는 것만으로도 재밌더라고요. 어떤 데가 좋았어요?",mine:"술 대신 마시는 음료나 분위기 좋았던 곳 이야기로 연결하기.",mistake:"술을 안 마시는 걸 변명하듯 길게 설명하기, 상대에게 마시라고 권하기.",quiz:{q:"싱글 몰트에서 \"싱글\"의 뜻은?",o:["한 병만 판매","한 증류소","한 번 증류","한 종류의 곡물만 사용"],a:1,why:"싱글은 한 증류소에서 만들었다는 뜻이에요."},seed:1},
{id:"seed3",f:"야구·축구",kw:"한국 프로야구",type:"basic",sum:["한국 프로야구(KBO)는 1982년에 시작했고 지금은 10개 구단이에요(확인 필요).","야구는 한 이닝에 아웃 세 개가 나오면 공격과 수비가 바뀌어요.","직관 가면 팀마다 응원가와 응원 문화가 달라서 그걸 보러 가는 사람도 많아요."],open:"혹시 응원하는 야구팀 있으세요?",qs:["직관 가보신 적 있으세요? 가면 뭐가 제일 좋았어요?","그 팀을 응원하게 된 계기가 있나요?"],links:["직관","치맥","응원가"],mine:"야구를 몰라도 되고, 분위기만 구경하러 가본 경험이 있으면 그 얘기를 꺼내기.",mistake:"성적·선수 기록을 외워서 상대를 시험하듯 말하기.",quiz:{q:"야구에서 공수가 바뀌는 때는?",o:["점수가 나면","아웃 3개","안타 3개","투수 교체 때"],a:1,why:"한 이닝에 아웃 3개가 나오면 공격과 수비가 바뀌어요."},seed:1},
{id:"seed4",f:"과학·우주",kw:"멀어지는 달",sum:["달은 지구에서 해마다 조금씩 멀어지고 있어요.","그 속도는 1년에 약 3.8cm로 알려져 있어요(확인 필요).","손톱이 자라는 속도와 비슷하다고 비유하기도 해요."],open:"달이 해마다 조금씩 멀어진다는 얘기 들어보셨어요?",qs:["보름달 볼 때 소원 비는 편이세요?","밤하늘 보는 거 좋아하세요?"],links:["별 보기","캠핑","보름달"],mine:"캠핑이나 야간 러닝 중에 본 달이나 하늘이 인상 깊었다면 그 얘기를 짧게.",mistake:"천문 용어를 늘어놓아 강의처럼 되는 것.",quiz:{q:"달은 지구에서 어떻게 되고 있을까?",o:["점점 가까워짐","점점 멀어짐","제자리","규칙 없이 오락가락"],a:1,why:"달은 해마다 조금씩 멀어지고 있어요."},seed:1},
{id:"seed5",f:"반려동물",kw:"강아지 코 무늬",sum:["강아지 코의 무늬는 개체마다 달라서 사람 지문처럼 쓰일 수 있다고 해요.","그래서 반려견 등록이나 신원 확인 연구에 쓰이기도 했어요(확인 필요).","코가 촉촉한 것은 냄새를 잘 맡는 것과 관련이 있다고 알려져 있어요(확인 필요)."],open:"혹시 강아지나 고양이 키우세요, 아니면 좋아하는 쪽이세요?",qs:["그 아이는 어떤 성격이에요?","산책 코스 정해 놓으셨어요?"],links:["산책","이름","동물병원"],mine:"산책 중 만난 강아지나 어릴 적 키운 동물 이야기를 짧게.",mistake:"사진을 보여 달라고 조르거나, 상대가 키우지 않는데 계속 키우는 얘기만 하기.",quiz:{q:"강아지 코 무늬는?",o:["모든 개가 같음","개체마다 다름","나이 들면 사라짐","털 색에 따라 같음"],a:1,why:"코 무늬는 개체마다 달라요."},seed:1}
];

/* ---------- 저장소 ---------- */
function tget(){const d=LS.get(TK,null)||{};d.cards=d.cards||{};d.days=d.days||{};d.star=d.star||{};d.flag=d.flag||{};d.rv=d.rv||{};d.chain=d.chain||[];d.w=d.w||{};d.ex=d.ex||[];d.seen=d.seen||{};return d}
function tsave(d){return LS.set(TK,d)}
const today=()=>dKey();
const dayAdd=(n)=>{const x=new Date();x.setDate(x.getDate()+n);return dKey(x.getTime())};
const daysSince=(ts)=>Math.floor((Date.now()-ts)/86400e3);
function weight(d,f){const v=d.w[f];return v==null?1:Number(v)}
function allCards(d){const m={};SEED.forEach(c=>{m[c.id]=c});Object.keys(d.cards).forEach(k=>{m[k]=d.cards[k]});return Object.values(m)}
function cardById(d,id){return d.cards[id]||SEED.find(c=>c.id===id)}
function latestExpired(c){if(!c.latest)return false;const lim=F_SPORT.includes(c.f)?7:30;return daysSince(c.ts||0)>=lim}
function usable(d,c){return !d.flag[c.id]&&!latestExpired(c)&&!(d.ex||[]).some(k=>k&&(c.kw+c.sum.join(' ')).includes(k))}

/* ---------- 스타일 ---------- */
function css(){
  if(document.getElementById('tvCss'))return;
  const s=document.createElement('style');s.id='tvCss';
  s.textContent=`.tv h2{margin:0 0 8px;font-size:17px}.tv .sm{font-size:12px;color:var(--mu);line-height:1.5;margin-top:6px}.tv .kw{font-size:19px;font-weight:800;margin:2px 0 2px}.tv .fl{display:inline-block;font-size:11px;background:var(--sf2);color:#ead9ff;border-radius:999px;padding:3px 9px;margin-right:6px}
.tv .sec{margin-top:10px;font-size:13px;line-height:1.55}.tv .sec b{color:#ffd1e1}.tv ol,.tv ul{margin:4px 0 0 18px;padding:0}.tv .say{background:var(--bg2);border-radius:12px;padding:10px;margin-top:6px}
.tv .row{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.tv .row button{flex:1;min-width:90px;margin-top:0;padding:10px;font-size:12px}
.tv .opt{display:block;width:100%;text-align:left;background:var(--sf2);border:1px solid var(--ln);color:#fff;border-radius:12px;padding:12px;margin-top:8px;font-size:14px}
.tv .opt.ok{background:#14532d;border-color:#4ade80}.tv .opt.no{background:#7f1d1d;border-color:#f87171}
.tv .tag{font-size:11px;color:#fbbf24}.tv .bar{height:6px;border-radius:3px;background:var(--bg2);overflow:hidden;margin-top:6px}.tv .bar i{display:block;height:100%;background:var(--grad)}
.tv input,.tv textarea,.tv select{width:100%;box-sizing:border-box;background:var(--bg2);color:#fff;border:1px solid var(--ln);border-radius:12px;padding:10px;font-size:14px;margin-top:6px}
.tv .wrow{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:13px;margin-top:6px}.tv .wrow select{width:auto;margin:0;padding:6px}
.tv .warn{color:#fbbf24;font-size:12px;line-height:1.5;margin-top:6px;white-space:pre-line}.tv .good{color:#4ade80}.tv .bad{color:#f87171}
.tv details{margin-top:10px}.tv summary{cursor:pointer;font-weight:700;font-size:14px}`;
  document.head.appendChild(s);
}

/* ---------- 상태 ---------- */
const S={view:'home',busy:false,msg:'',cur:null,rd:{on:false,i:0,ids:[],paused:false},quiz:null,chainKw:'',chainRes:null,prep:null,showAll:false,srcOK:null};
let root=null;
function say(t,cls){S.msg=t||'';S.cls=cls||'';const e=document.getElementById('tvMsg');if(e){e.textContent=S.msg;e.className='warn '+(S.cls||'')}}

/* ---------- 카드 만들기(AI) ---------- */
const GEN_SYS=`당신은 한국어 대화 코치입니다. 누구와 대화하든(특히 20~30대 이성) 상대가 꺼낸 키워드에서 가볍게 대화를 이어갈 '넓고 얕은 상식 카드'를 만듭니다. 지식 자랑이 아니라 상대에게 질문을 넘기는 용도예요.
[정확성] 확실한 사실만 쓰세요. 불확실하면 빼세요. 수치·연도·순위에는 문장 끝에 "(확인 필요)"를 붙이세요. 의학·투자는 일반 상식 수준으로만, 단정·권유 금지. 지어낸 인물·수치·인용 금지.
[말투] 부드러운 존댓말. 요약 3줄은 각 한 문장, 마지막 줄은 "오, 그래요?" 소리가 나오는 사실. '꺼내는 한마디'는 상대 입장에서 부담 없는 짧은 질문. 열린 질문은 상대의 경험·취향을 묻는 것(정답 있는 질문, 시험하듯 묻는 질문 금지).
[술 분야] 음주 권유·미화 표현 금지. 필드 sober에 "잘 안 마시는 사람으로서 이어가는 한마디"를 존댓말 1~2문장으로 넣으세요.
[스포츠] 점수·기록 암기보다 응원 팀·직관 경험을 묻는 질문을 우선하세요.
[퀴즈] 4지선다 1개. 정답은 a(0~3 인덱스). why는 한 문장. 오답은 그럴듯하되 명확히 틀린 것.
[출력] JSON 객체 하나만: {"cards":[{"f":"분야명","kw":"키워드","sum":["문장1","문장2","문장3"],"open":"꺼내는 한마디","qs":["질문1","질문2"],"links":["키워드1","키워드2","키워드3"],"mine":"내 경험 연결 힌트(한 줄)","mistake":"대화를 망치는 흔한 실수(한 줄)","sober":"(술 분야만)","quiz":{"q":"","o":["","","",""],"a":0,"why":""}}]}`;

function cleanCard(c,f,extra){
  const s=v=>typeof v==='string'?v.trim():'';
  if(!c||!s(c.kw)||!Array.isArray(c.sum)||c.sum.length<3||!c.quiz||!Array.isArray(c.quiz.o)||c.quiz.o.length!==4)return null;
  const a=Number(c.quiz.a);if(!(a>=0&&a<=3))return null;
  const out={id:'t'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),f:FIELDS.includes(s(c.f))?s(c.f):(f||'기타'),kw:s(c.kw).slice(0,30),sum:c.sum.slice(0,3).map(s),open:s(c.open),qs:(c.qs||[]).map(s).filter(Boolean).slice(0,2),links:(c.links||[]).map(s).filter(Boolean).slice(0,3),mine:s(c.mine),mistake:s(c.mistake),quiz:{q:s(c.quiz.q),o:c.quiz.o.map(s),a:a,why:s(c.quiz.why)},ts:Date.now()};
  if(!out.open||out.sum.some(x=>!x)||!out.quiz.q||out.quiz.o.some(x=>!x))return null;
  if(out.f===F_DRINK&&s(c.sober))out.sober=s(c.sober);
  if(out.f===F_DRINK&&/(한잔\s*(해|하자|합시다)|마셔\s*(보세요|봐요)|드셔\s*보세요.*술)/.test(out.open+out.qs.join('')))return null;
  return Object.assign(out,extra||{});
}
function pickFields(d,n,exclude){
  const pool=[];FIELDS.forEach(f=>{if(exclude&&exclude.includes(f))return;const w=weight(d,f);for(let i=0;i<w;i++)pool.push(f)});
  const out=[];const sh=pool.sort(()=>Math.random()-.5);
  for(const f of sh){if(!out.includes(f))out.push(f);if(out.length>=n)break}
  return out;
}
async function genCards(d,fields,custom){
  const known=allCards(d).map(c=>c.kw).slice(-60).join(', ');
  const user=(custom?`상대 관심사: ${custom}\n위 관심사와 관련된 카드를 서로 다른 주제로 ${fields.length}장 만들어 주세요. 분야명(f)은 가장 가까운 것을 아래 목록에서 고르세요.\n`:`다음 분야마다 카드 1장씩, 총 ${fields.length}장을 만들어 주세요: ${fields.join(' / ')}\n`)+`분야 목록: ${FIELDS.join(', ')}\n이미 만든 키워드(겹치지 않게): ${known||'없음'}\n제외할 키워드: ${(d.ex||[]).join(', ')||'없음'}\n최신 뉴스·순위·결과는 쓰지 말고 오래 가는 상식만 쓰세요.`;
  const r=await aiJson(GEN_SYS,user,{temp:0.7,max:6000});
  const arr=(r.obj&&r.obj.cards)||[];
  const out=[];arr.forEach(c=>{const x=cleanCard(c,null,custom?{custom:1}:null);if(x)out.push(x)});
  if(!out.length)throw new Error('카드를 읽지 못했어요(형식 오류). 다시 시도해 주세요.');
  return{cards:out,model:r.model};
}

/* ---------- 최신 카드(구글 검색 연동, 확인된 것만) ---------- */
function searchBlocked(){return Date.now()-(LS.get('trv_search_block_at',0)||0)<WIN}
async function genLatest(d,field){
  if(!gKey())throw new Error('Gemini 키가 필요해요(구글 검색 연동은 Gemini에서만 돼요).');
  if(searchBlocked())throw new Error('최근 검색 연동이 한도·결제 문제로 거절돼 잠시 꺼 두었어요. 아래 "다시 켜기"로 재시도할 수 있어요.');
  const sport=F_SPORT.includes(field);
  const asOf=today();
  const prompt=`오늘은 ${asOf}입니다. 구글 검색으로 확인되는 ${sport?'최근 일주일 안의 '+field+' 소식(최근 결과, 순위, 일정 중 하나)':'요즘(최근 한 달 안) 한국에서 이야기되는 트렌드 하나'}만으로 대화 카드 1장을 만드세요. 검색으로 확인되지 않는 내용은 쓰지 마세요. 점수·수치는 문장 끝에 "(확인 필요)"를 붙이고 기준 날짜(${asOf})를 sum에 한 번 밝히세요. ${sport?'점수 암기보다 응원 팀·직관 경험을 묻는 질문을 우선하세요.':''}
출력은 JSON 객체 하나만(설명·코드블록 금지): {"cards":[{"f":"${field}","kw":"","sum":["","",""],"open":"","qs":["",""],"links":["","",""],"mine":"","mistake":"","quiz":{"q":"","o":["","","",""],"a":0,"why":""}}]}
말투는 부드러운 존댓말, 상대에게 질문을 넘기는 용도입니다. 지어낸 내용 금지.`;
  let lastErr;
  for(const m of gModels(SEARCH_MODELS)){
    const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),45000);
    try{
      const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`,{method:'POST',signal:ctl.signal,headers:{'Content-Type':'application/json','x-goog-api-key':gKey()},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],tools:[{google_search:{}}],generationConfig:{temperature:0.2,maxOutputTokens:3000}})});
      clearTimeout(to);
      if(!res.ok){const tx=await res.text();lastErr=new Error(`[${m}] HTTP ${res.status} ${tx.slice(0,120)}`);lastErr.status=res.status;if(res.status===429||res.status===403){LS.set('trv_search_block_at',Date.now())}continue}
      const j=await res.json();const cand=j.candidates&&j.candidates[0]||{};
      const txt=((cand.content&&cand.content.parts)||[]).map(p=>p.text||'').join('');
      const ch=((cand.groundingMetadata&&cand.groundingMetadata.groundingChunks)||[]).map(x=>x.web).filter(w=>w&&w.uri);
      if(!ch.length){lastErr=new Error(`[${m}] 검색 출처가 확인되지 않아 카드를 버렸어요.`);continue}
      const obj=parseJsonLoose(txt);const c=cleanCard(obj&&obj.cards&&obj.cards[0],field,{latest:1,asOf:asOf,src:ch.slice(0,3).map(w=>({t:w.title||'',u:w.uri}))});
      if(!c){lastErr=new Error(`[${m}] 카드 형식을 읽지 못함`);continue}
      return c;
    }catch(e){clearTimeout(to);lastErr=new Error(`[${m}] ${e.name==='AbortError'?'45초 응답 없음':e.message}`)}
  }
  throw lastErr||new Error('최신 카드를 만들지 못했어요.');
}

/* ---------- 오늘의 5장 ---------- */
function reviewDue(d){const k=today();return Object.keys(d.rv).filter(id=>d.rv[id].due<=k&&cardById(d,id)&&!d.flag[id])}
function chooseToday(d){
  const k=today();let day=d.days[k];
  if(day&&day.ids&&day.ids.length)return day;
  const seen=d.seen,usableCards=allCards(d).filter(c=>usable(d,c)&&!c.latest);
  const unseen=usableCards.filter(c=>!seen[c.id]);
  const chosen=[],usedF=new Set();
  const order=pickFields(d,FIELDS.length).sort(()=>Math.random()-.5);
  const pri=f=>unseen.filter(c=>c.f===f);
  for(const f of order){if(chosen.length>=5)break;const p=pri(f);if(p.length){chosen.push(p[0]);usedF.add(f)}}
  // 부족하면 이미 본 카드로 보충(분야 다양성 유지)
  if(chosen.length<5){for(const f of order){if(chosen.length>=5)break;if(usedF.has(f))continue;const p=usableCards.filter(c=>c.f===f&&!chosen.includes(c));if(p.length){chosen.push(p[0]);usedF.add(f)}}}
  day={ids:chosen.map(c=>c.id),done:false,q:null};
  return day;
}
async function ensureToday(d){
  const k=today();
  let day=chooseToday(d);
  const need=5-day.ids.length;
  if(need>0){
    const fields=pickFields(d,need,day.ids.map(id=>(cardById(d,id)||{}).f).concat(F_TREND));
    if(gKey()||claudeKey()){
      say('🧠 오늘의 카드를 만드는 중이에요... (보통 10~30초)');
      try{const g=await genCards(d,fields);g.cards.forEach(c=>{d.cards[c.id]=c;if(day.ids.length<5)day.ids.push(c.id)});say('')}
      catch(e){say('AI 카드 생성 실패: '+String(e.message).slice(0,200)+'\n가진 카드로만 진행해요. (⚙️ 설정에서 키·AI 두뇌 확인)','bad')}
    }
    if(!day.ids.length){const any=allCards(d).filter(c=>usable(d,c)).slice(0,5);day.ids=any.map(c=>c.id)}
  }
  d.days[k]=day;tsave(d);return day;
}

/* ---------- 읽어주기 ---------- */
function speechOf(c,n,tot){
  const t=[`${n}번째 카드, ${c.kw}.`];
  c.sum.forEach(x=>t.push(x.replace(/\(확인 필요\)/g,', 확인이 필요한 내용이에요.')));
  t.push('이렇게 꺼내 보세요. '+c.open);
  if(c.qs&&c.qs[0])t.push('이어서 이렇게 물어볼 수 있어요. '+c.qs[0]);
  return t.join(' ');
}
function rdStop(){S.rd.on=false;try{ttsStop()}catch(e){}}
function rdPlay(i){
  const d=tget(),ids=S.rd.ids;
  if(i>=ids.length){rdStop();S.rd.i=0;say('브리핑이 끝났어요. 아래에서 퀴즈를 풀어 보세요.');render();return}
  S.rd.on=true;S.rd.paused=false;S.rd.i=i;
  const c=cardById(d,ids[i]);
  d.seen[c.id]=Date.now();tsave(d);
  render();
  const my=++S.rd.token;
  ttsSay(speechOf(c,i+1,ids.length),{onDone:()=>{if(S.rd.on&&my===S.rd.token)rdPlay(i+1)}});
}
function startBrief(){
  const d=tget();S.rd.token=(S.rd.token||0);
  ensureToday(d).then(day=>{S.rd.ids=day.ids.slice();S.view='brief';try{ttsUnlock()}catch(e){}rdPlay(0)}).catch(e=>say('오류: '+e.message,'bad'));
}

/* ---------- 퀴즈 ---------- */
function startQuiz(ids,title){
  const d=tget();
  const qs=ids.map(id=>{const c=cardById(d,id);if(!c)return null;const o=c.quiz.o.map((t,i)=>({t:t,ok:i===c.quiz.a}));o.sort(()=>Math.random()-.5);return{id:id,kw:c.kw,q:c.quiz.q,o:o,why:c.quiz.why}}).filter(Boolean);
  if(!qs.length){say('풀 문제가 없어요.');return}
  S.quiz={title:title||'퀴즈',qs:qs,i:0,score:0,wrong:[],ans:null};S.view='quiz';render();
}
function answerQuiz(k){
  const Q=S.quiz;if(!Q||Q.ans!=null)return;const q=Q.qs[Q.i];Q.ans=k;
  const ok=q.o[k].ok;if(ok)Q.score++;else Q.wrong.push(q.id);
  const d=tget();
  if(!ok){d.rv[q.id]={n:0,due:dayAdd(1)}}
  else if(d.rv[q.id]){const r=d.rv[q.id];r.n++;const gap=[1,3,7][r.n];if(gap==null)delete d.rv[q.id];else r.due=dayAdd(gap)}
  tsave(d);render();
}
function nextQuiz(){
  const Q=S.quiz;Q.i++;Q.ans=null;
  if(Q.i>=Q.qs.length){
    const d=tget(),k=today();
    if(Q.title==='오늘의 퀴즈'&&d.days[k]){d.days[k].done=true;d.days[k].q={score:Q.score,n:Q.qs.length};tsave(d)}
    S.view='quizEnd'
  }
  render();
}

/* ---------- 카드 표시·동작 ---------- */
function cardEl(c,d,opt){
  opt=opt||{};
  const e=mk('div',null,'card');e.style.marginTop='10px';
  const top=mk('div');top.appendChild(mk('span',c.f,'fl'));if(c.latest)top.appendChild(mk('span','최신 · 기준 '+(c.asOf||''),'tag'));if(c.custom)top.appendChild(mk('span','맞춤','tag'));if(c.seed)top.appendChild(mk('span','기본 카드','tag'));
  e.appendChild(top);e.appendChild(mk('div',c.kw,'kw'));
  const sec=(t,body)=>{const s=mk('div',null,'sec');const b=mk('b',t);s.appendChild(b);if(typeof body==='string')s.appendChild(mk('div',body));else s.appendChild(body);e.appendChild(s)};
  const ol=mk('ol');c.sum.forEach(x=>ol.appendChild(mk('li',x)));sec('30초 요약',ol);
  const sy=mk('div',c.open,'say');sec('꺼내는 한마디',sy);
  const ul=mk('ul');c.qs.forEach(x=>ul.appendChild(mk('li',x)));sec('이어갈 열린 질문',ul);
  sec('연결 키워드',c.links.join(' · '));
  if(c.sober)sec('🍵 안 마시는 사람의 한마디',c.sober);
  sec('내 경험 연결 힌트',c.mine);sec('대화를 망치는 흔한 실수',c.mistake);
  if(c.latest&&c.src&&c.src.length){const s=mk('div',null,'sec');s.appendChild(mk('b','출처(검색으로 확인됨)'));c.src.forEach(x=>{const a=mk('a',x.t||x.u);a.href=x.u;a.target='_blank';a.rel='noopener noreferrer';a.style.cssText='display:block;color:#7dd3fc;font-size:12px;word-break:break-all';s.appendChild(a)});e.appendChild(s)}
  const rw=mk('div',null,'row');
  const star=mk('button',d.star[c.id]?'★ 별표':'☆ 별표','btn sub');star.onclick=()=>{const x=tget();if(x.star[c.id]){delete x.star[c.id]}else{x.star[c.id]=1;if(!x.rv[c.id])x.rv[c.id]={n:0,due:dayAdd(1)}}tsave(x);render()};
  const st=mk('button','📖 이야기 은행으로','btn sub');st.onclick=()=>toStory(c);
  const fl=mk('button','🚩 틀렸어요','btn rd');fl.onclick=()=>{if(confirm('이 카드를 틀린 카드로 신고하고 앞으로 숨길까요?')){const x=tget();x.flag[c.id]=Date.now();delete x.rv[c.id];tsave(x);render()}};
  rw.appendChild(star);rw.appendChild(st);rw.appendChild(fl);e.appendChild(rw);
  return e;
}
function toStory(c){
  showTab('story');
  const t=$('stRaw');if(t){t.value='[상식 연결: '+c.kw+'] '+c.mine+' — 내 경험을 한두 줄로 적어 주세요: ';t.focus();try{t.scrollIntoView({block:'center'})}catch(e){}}
}
function goTalk(c){
  const m=$('memo2')||$('memo');
  const txt='이번 대화 미션: 상대가 \''+c.kw+'\'와 관련된 이야기를 꺼내면, 오늘 배운 상식으로 가볍게 받고 질문을 넘겨 보기. (예: '+c.open+')';
  if($('memo'))$('memo').value=txt;if($('memo2'))$('memo2').value=txt;LS.set(NK,txt);
  showTab('meet');setStatus('미션을 넣어 뒀어요. 상대를 정하고 시작해 보세요.','#4ade80');
}

/* ---------- 키워드 사슬 ---------- */
const CH_RUBRIC=`당신은 대화 코치입니다. 아래 기준만으로, 같은 입력에는 같은 점수를 매기세요(일관성). 점수는 모두 0~20 정수.
- nat(자연스러움): 키워드에서 일상 대화로 무리 없이 이어지는가(억지·지식 자랑이면 감점)
- other(상대 중심): 상대의 경험·취향·감정을 향하는가(내 이야기·정보 전달 위주면 감점)
- div(다양성): 3개 키워드가 서로 다른 방향(경험/취향/장소/사람 등)으로 뻗는가(비슷하면 감점)
- qual(질문의 질): 열린 질문인가(예/아니오·시험·추궁이면 감점), 부담 없고 구체적인가
출력은 JSON 객체 하나만: {"nat":0,"other":0,"div":0,"qual":0,"ai_kw":["","",""],"ai_q":"","tip":"가장 낮은 축을 고치는 한 줄 조언","dim":"nat|other|div|qual 중 가장 낮은 것"}. 입력에 없는 사실을 지어내지 마세요.`;
function chainPickKw(d){
  const cs=allCards(d).filter(c=>usable(d,c));const c=cs[Math.floor(Math.random()*cs.length)];
  return c?c.kw:'카페';
}
async function chainSubmit(kws,q){
  const kw=S.chainKw;
  say('🤖 채점하는 중이에요...');
  try{
    const r=await aiJson(CH_RUBRIC,`키워드: ${kw}\n내가 이은 키워드 3개: ${kws.join(', ')}\n내 질문: ${q}`,{temp:0,max:1200});
    const o=r.obj,n=k=>Math.max(0,Math.min(20,Math.round(Number(o[k])||0)));
    const sc={nat:n('nat'),other:n('other'),div:n('div'),qual:n('qual')};
    const dim=Object.keys(sc).sort((a,b)=>sc[a]-sc[b])[0];
    const rec={ts:Date.now(),kw:kw,mine:kws,q:q,sc:sc,dim:dim,ai_kw:(o.ai_kw||[]).slice(0,3),ai_q:o.ai_q||'',tip:o.tip||'',model:r.model};
    const d=tget();d.chain.push(rec);d.chain=d.chain.slice(-60);tsave(d);
    if(Object.values(sc).reduce((a,b)=>a+b,0)<80)chainToDrill(rec);
    S.chainRes=rec;say('');render();
  }catch(e){say('채점 실패: '+String(e.message).slice(0,240),'bad')}
}
function chainToDrill(rec){
  try{
    const ax={nat:'u',other:'e',div:'f',qual:'f'}[rec.dim]||'f';
    const dd=dget();dd.dx=dd.dx||[];const cid='XT'+rec.ts;
    if(dd.dx.find(c=>c.id===cid))return;
    dd.dx.push({id:cid,lv:0,ax:ax,src:'trivia',say:`저 요즘 ${rec.kw}에 좀 빠져 있어요.`,cue:`키워드 사슬에서 '${{nat:'자연스러움',other:'상대 중심',div:'다양성',qual:'질문의 질'}[rec.dim]}' 점수가 낮았어요. 이 말에 이어 보세요.`,due:dayAdd(1)});
    dd.dx=dd.dx.slice(-30);dsave(dd);
  }catch(e){console.error(e)}
}

/* ---------- 약속 전 준비 ---------- */
async function prepGo(txt){
  const d=tget();
  say('🧠 관련 카드를 만드는 중이에요... (보통 15~40초)');
  try{
    const g=await genCards(d,new Array(5).fill('x'),txt);
    const Q=await aiJson(`당신은 대화 코치입니다. 상대 관심사로 첫 질문 3개를 만드세요. 열린 질문, 상대의 경험·취향을 묻는 것, 시험·추궁 금지, 부드러운 존댓말. JSON 객체 하나만: {"qs":["","",""]}`,`상대 관심사: ${txt}`,{temp:0.6,max:800});
    g.cards.forEach(c=>{d.cards[c.id]=c});tsave(d);
    S.prep={txt:txt,ids:g.cards.slice(0,5).map(c=>c.id),qs:(Q.obj.qs||[]).slice(0,3)};say('');render();
  }catch(e){say('실패: '+String(e.message).slice(0,240),'bad')}
}

/* ---------- 화면 ---------- */
function clear(){root.innerHTML=''}
function btn(t,cls,fn){const b=mk('button',t,'btn '+(cls||'main'));b.type='button';b.onclick=fn;return b}
function homeView(){
  const d=tget(),k=today(),day=d.days[k];
  const c=mk('div',null,'card');c.appendChild(mk('h2','🧠 오늘의 상식'));
  c.appendChild(mk('div','넓고 얕게, 상대에게 질문을 넘기기 위한 교양이에요. 지식 자랑이 아니라 "혹시 ~ 좋아하세요?"를 꺼내는 용도입니다. (후속 질문이 호감을 높인다는 연구: Huang et al., 2017)','sm'));
  c.appendChild(btn('🎧 오늘의 상식 듣기 (5장 · 2~3분)','main',startBrief));
  const stat=[];const rd=reviewDue(d);
  if(day&&day.done)stat.push('오늘 퀴즈 완료 '+(day.q?day.q.score+'/'+day.q.n:''));
  if(rd.length)stat.push('🔁 복습할 카드 '+rd.length+'장');
  if(stat.length)c.appendChild(mk('div',stat.join(' · '),'sm'));
  const row=mk('div',null,'row');
  if(day&&day.ids.length)row.appendChild(btn('✅ 오늘 퀴즈 5문제','sub',()=>startQuiz(day.ids,'오늘의 퀴즈')));
  if(rd.length)row.appendChild(btn('🔁 복습 퀴즈','sub',()=>startQuiz(rd.slice(0,5),'복습 퀴즈')));
  c.appendChild(row);
  const m=mk('div',S.msg,'warn '+(S.cls||''));m.id='tvMsg';c.appendChild(m);
  root.appendChild(c);
  // 읽어주기 안내
  const tip=mk('div',null,'card');tip.appendChild(mk('div','🔊 읽어주기는 ⚙️ 설정의 음성 설정(기기 음성 / Gemini 음성, 속도, 목소리)을 그대로 따라요. 화면이 꺼져도 이어지는지는 아래 "화면 꺼짐 확인법"을 따라 해 보세요.','sm'));
  const dt=mk('details');dt.appendChild(mk('summary','화면 꺼짐 확인법 (갤럭시 S21)'));
  const ol=mk('ol','','sm');['"오늘의 상식 듣기"를 누르고 첫 카드가 읽히기 시작하는지 확인','측면 버튼으로 화면을 끄고 30초 기다리기','소리가 이어지면 OK. 끊기면 ⚙️에서 음성을 "Gemini 음성"으로 바꿔 다시 시도(기기 음성보다 끊김이 적어요 — 단, 기기·환경에 따라 다를 수 있어요)','계속 끊기면 휴대폰 설정 → 배터리에서 크롬(또는 설치한 앱)을 "제한 없음"으로 바꾸기'].forEach(t=>ol.appendChild(mk('li',t)));
  dt.appendChild(ol);tip.appendChild(dt);root.appendChild(tip);
  // 최신 카드
  const L=mk('div',null,'card');L.appendChild(mk('h2','📰 최신 카드(스포츠·트렌드)'));
  const blocked=searchBlocked();
  L.appendChild(mk('div','구글 검색으로 확인된 내용만, 출처와 기준 날짜를 붙여요. 스포츠는 7일, 트렌드는 30일 뒤 숨겨요. 무료 키에서 검색 연동은 Gemini 2.5 Flash 계열만 하루 500회라고 공식 가격표에 적혀 있어요(Gemini 3 계열은 무료 키 불가). 안 되면 이 기능만 꺼지고 기본 카드는 그대로 써요.','sm'));
  const lr=mk('div',null,'row');
  [['⚾ 야구·축구 최신',F_SPORT[0]],['🎮 e스포츠 최신',F_SPORT[1]],['✨ 요즘 트렌드',F_TREND]].forEach(([t,f])=>lr.appendChild(btn(t,'sub',()=>makeLatest(f))));
  L.appendChild(lr);
  if(blocked){L.appendChild(mk('div','🔒 최근 검색이 거절돼 잠시 꺼 뒀어요.','warn'));L.appendChild(btn('다시 켜기','ghost',()=>{LS.set('trv_search_block_at',0);render()}))}
  const lat=allCards(d).filter(c=>c.latest&&usable(d,c)).sort((a,b)=>b.ts-a.ts).slice(0,3);
  lat.forEach(x=>L.appendChild(cardEl(x,d)));root.appendChild(L);
  // 추가 모드
  const M=mk('div',null,'card');M.appendChild(mk('h2','🧩 추가 모드'));
  const mr=mk('div',null,'row');
  mr.appendChild(btn('🔗 키워드 사슬','sub',()=>{S.chainKw=chainPickKw(tget());S.chainRes=null;S.view='chain';render()}));
  mr.appendChild(btn('📅 약속 전 준비','sub',()=>{S.prep=null;S.view='prep';render()}));
  mr.appendChild(btn('🗂 카드 보관함','sub',()=>{S.view='all';render()}));
  M.appendChild(mr);root.appendChild(M);
  // 설정
  const dd=mk('details','','card');dd.appendChild(mk('summary','⚙️ 분야 비중(0~3) · 제외 키워드'));
  FIELDS.forEach(f=>{const r=mk('div',null,'wrow');r.appendChild(mk('span',f));const sel=document.createElement('select');[0,1,2,3].forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;if(weight(d,f)===v)o.selected=true;sel.appendChild(o)});sel.onchange=()=>{const x=tget();x.w[f]=Number(sel.value);tsave(x)};r.appendChild(sel);dd.appendChild(r)});
  dd.appendChild(mk('div','제외 키워드(쉼표로 구분). 이 단어가 들어간 카드는 안 나와요.','sm'));
  const ex=document.createElement('input');ex.value=(d.ex||[]).join(', ');ex.placeholder='예) 정치, 군대';ex.onchange=()=>{const x=tget();x.ex=ex.value.split(',').map(s=>s.trim()).filter(Boolean);tsave(x)};dd.appendChild(ex);
  root.appendChild(dd);
}
async function makeLatest(f){
  const d=tget();say('🔎 검색으로 확인하며 만드는 중이에요... (보통 15~40초)');
  try{const c=await genLatest(d,f);d.cards[c.id]=c;tsave(d);say('만들었어요 ✓ ('+c.f+')','good');render()}
  catch(e){say('최신 카드는 지금 만들 수 없어요: '+String(e.message).slice(0,240)+'\n기본 카드는 그대로 쓸 수 있어요.','bad');render()}
}
function briefView(){
  const d=tget(),ids=S.rd.ids,i=Math.min(S.rd.i,ids.length-1);
  const c=cardById(d,ids[i]);
  const h=mk('div',null,'card');h.appendChild(mk('h2',`🎧 브리핑 ${i+1} / ${ids.length}`));
  const bar=mk('div',null,'bar');const bi=mk('i');bi.style.width=((i+1)/ids.length*100)+'%';bar.appendChild(bi);h.appendChild(bar);
  const row=mk('div',null,'row');
  row.appendChild(btn(S.rd.on?'⏸ 일시정지':'▶ 이어서 듣기','sub',()=>{if(S.rd.on){rdStop();S.rd.paused=true;render()}else rdPlay(S.rd.i)}));
  row.appendChild(btn('⏭ 다음 카드','sub',()=>{rdStop();rdPlay(S.rd.i+1)}));
  row.appendChild(btn('⏹ 그만 듣기','rd',()=>{rdStop();S.view='home';render()}));
  h.appendChild(row);root.appendChild(h);
  if(c)root.appendChild(cardEl(c,d));
  const nx=mk('div',null,'card');
  nx.appendChild(btn('✅ 퀴즈 5문제 풀기','main',()=>{rdStop();const dd=tget();startQuiz(dd.days[today()].ids,'오늘의 퀴즈')}));
  if(c)nx.appendChild(btn('💬 궁금한 거 물어보기 (실전 대화로 이어가기)','sub',()=>{rdStop();goTalk(c)}));
  nx.appendChild(btn('← 처음으로','ghost',()=>{rdStop();S.view='home';render()}));
  root.appendChild(nx);
}
function quizView(){
  const Q=S.quiz,q=Q.qs[Q.i];
  const c=mk('div',null,'card');c.appendChild(mk('h2',`${Q.title} ${Q.i+1} / ${Q.qs.length}`));
  c.appendChild(mk('div',q.kw,'tag'));c.appendChild(mk('div',q.q,'kw')).style.fontSize='16px';
  q.o.forEach((o,k)=>{const b=mk('button',o.t,'opt');b.type='button';if(Q.ans!=null){if(o.ok)b.classList.add('ok');else if(k===Q.ans)b.classList.add('no')}b.onclick=()=>answerQuiz(k);c.appendChild(b)});
  if(Q.ans!=null){c.appendChild(mk('div',(q.o[Q.ans].ok?'정답이에요! ':'아쉬워요. ')+q.why,'sec'));c.appendChild(btn(Q.i+1>=Q.qs.length?'결과 보기':'다음 문제','main',nextQuiz))}
  root.appendChild(c);
}
function quizEndView(){
  const Q=S.quiz,d=tget();
  const c=mk('div',null,'card');c.appendChild(mk('h2',`결과 ${Q.score} / ${Q.qs.length}`));
  if(Q.wrong.length){c.appendChild(mk('div','틀린 문제는 1일 · 3일 · 7일 뒤에 다시 나와요: '+Q.wrong.map(id=>(cardById(d,id)||{}).kw).join(', '),'sm'))}
  else c.appendChild(mk('div','전부 맞췄어요! 이제 "혹시 ~ 좋아하세요?"만 꺼내면 돼요.','sm'));
  const day=d.days[today()];const first=day&&cardById(d,day.ids[0]);
  if(first)c.appendChild(btn('💬 궁금한 거 물어보기 (실전 대화로 이어가기)','sub',()=>goTalk(first)));
  c.appendChild(btn('처음으로','ghost',()=>{S.view='home';render()}));root.appendChild(c);
}
function chainView(){
  const c=mk('div',null,'card');c.appendChild(mk('h2','🔗 키워드 사슬'));
  c.appendChild(mk('div','상대가 이 키워드를 꺼냈다고 생각하고, 이어갈 키워드 3개와 질문 1개를 적어 보세요. AI가 자연스러움·상대 중심·다양성·질문의 질을 채점해요. 점수가 낮으면 다음 날 드릴에 한 장 들어가요.','sm'));
  c.appendChild(mk('div','키워드: '+S.chainKw,'kw'));
  c.appendChild(btn('🔀 다른 키워드','ghost',()=>{S.chainKw=chainPickKw(tget());S.chainRes=null;render()}));
  const ins=[1,2,3].map(n=>{const i=document.createElement('input');i.placeholder='이어갈 키워드 '+n;i.maxLength=20;c.appendChild(i);return i});
  const q=document.createElement('textarea');q.placeholder='그 키워드로 상대에게 할 질문 1개';q.maxLength=120;q.rows=2;c.appendChild(q);
  const go=btn('채점 받기','main',()=>{const ks=ins.map(i=>i.value.trim()).filter(Boolean);if(ks.length<3||q.value.trim().length<4){say('키워드 3개와 질문을 모두 적어 주세요.','bad');return}go.disabled=true;chainSubmit(ks,q.value.trim()).finally(()=>{go.disabled=false})});c.appendChild(go);
  const m=mk('div',S.msg,'warn '+(S.cls||''));m.id='tvMsg';c.appendChild(m);
  const r=S.chainRes;
  if(r){const t=mk('div',null,'sec');const nm={nat:'자연스러움',other:'상대 중심',div:'다양성',qual:'질문의 질'};
    t.appendChild(mk('b','결과 '+Object.values(r.sc).reduce((a,b)=>a+b,0)+' / 80'));Object.keys(nm).forEach(k=>t.appendChild(mk('div',nm[k]+' '+r.sc[k]+' / 20'+(k===r.dim?'  ← 가장 낮음':''))));
    if(r.tip)t.appendChild(mk('div','💡 '+r.tip));
    if(r.ai_kw&&r.ai_kw.length)t.appendChild(mk('div','AI 지도: '+r.ai_kw.join(' · ')+(r.ai_q?' / 질문: '+r.ai_q:'')));
    c.appendChild(t)}
  root.appendChild(c);
  root.appendChild(btn('← 처음으로','ghost',()=>{S.view='home';render()}));
}
function prepView(){
  const c=mk('div',null,'card');c.appendChild(mk('h2','📅 약속 전 준비'));
  c.appendChild(mk('div','상대 관심사를 적으면 관련 카드 5장과 첫 질문 3개를 만들어요. (예: 러닝, 와인, 고양이)','sm'));
  const t=document.createElement('input');t.placeholder='상대 관심사 (쉼표로 구분)';t.maxLength=80;c.appendChild(t);
  const go=btn('준비하기','main',()=>{if(t.value.trim().length<2){say('관심사를 적어 주세요.','bad');return}go.disabled=true;prepGo(t.value.trim()).finally(()=>{go.disabled=false})});c.appendChild(go);
  const m=mk('div',S.msg,'warn '+(S.cls||''));m.id='tvMsg';c.appendChild(m);root.appendChild(c);
  if(S.prep){const d=tget();const q=mk('div',null,'card');q.appendChild(mk('h2','첫 질문 3개'));const ol=mk('ol');S.prep.qs.forEach(x=>ol.appendChild(mk('li',x)));q.appendChild(ol);root.appendChild(q);S.prep.ids.forEach(id=>{const x=cardById(d,id);if(x)root.appendChild(cardEl(x,d))})}
  root.appendChild(btn('← 처음으로','ghost',()=>{S.view='home';render()}));
}
function allView(){
  const d=tget();const cs=allCards(d).filter(c=>!d.flag[c.id]).sort((a,b)=>(d.star[b.id]?1:0)-(d.star[a.id]?1:0)||(b.ts||0)-(a.ts||0));
  const h=mk('div',null,'card');h.appendChild(mk('h2','🗂 카드 보관함 '+cs.length+'장'));h.appendChild(mk('div','별표 카드가 위에 나와요. 틀렸다고 신고한 카드는 숨겨져요.','sm'));
  h.appendChild(btn('← 처음으로','ghost',()=>{S.view='home';render()}));root.appendChild(h);
  cs.slice(0,S.showAll?500:20).forEach(c=>root.appendChild(cardEl(c,d)));
  if(!S.showAll&&cs.length>20)root.appendChild(btn('더 보기','sub',()=>{S.showAll=true;render()}));
}
function render(){
  if(!root)return;clear();
  ({home:homeView,brief:briefView,quiz:quizView,quizEnd:quizEndView,chain:chainView,prep:prepView,all:allView}[S.view]||homeView)();
}
window.TV={
  open(){root=document.getElementById('tvRoot');if(!root)return;css();S.view=S.rd.on?'brief':(S.view==='quiz'||S.view==='quizEnd'?S.view:'home');render()},
  start(){root=document.getElementById('tvRoot');css();startBrief()},
  merge(src){ // 백업 불러오기용
    if(!src||typeof src!=='object')return 0;const d=tget();let n=0;
    Object.keys(src.cards||{}).forEach(k=>{if(!d.cards[k]){d.cards[k]=src.cards[k];n++}});
    ['days','rv','star','flag','seen'].forEach(f=>Object.keys(src[f]||{}).forEach(k=>{if(d[f][k]==null)d[f][k]=src[f][k]}));
    const ts=new Set(d.chain.map(x=>x.ts));(src.chain||[]).forEach(x=>{if(x&&!ts.has(x.ts)){d.chain.push(x);n++}});
    Object.keys(src.w||{}).forEach(k=>{if(d.w[k]==null)d.w[k]=src.w[k]});
    tsave(d);return n;
  }
};
})();
