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

/* ---------- 기본 카드: 흔히 알려진 확실한 이야기만(수치·연도 없음). 일상 대화 소재 위주 ---------- */
function C(n,f,kw,sum,open,qs,links,mine,mistake,qz,sober){
  const o=qz[1].slice();const a=qz[2];
  const c={id:"d"+String(n).padStart(2,"0"),f:f,kw:kw,sum:sum,open:open,qs:qs,links:links,mine:mine,mistake:mistake,quiz:{q:qz[0],o:o,a:a,why:qz[3]},seed:1};
  if(sober)c.sober=sober;return c;
}
const SEED=[
C(1,"카페·디저트","티라미수",["티라미수는 이탈리아어로 \"나를 끌어올려 줘\", 그러니까 기운 나게 해 달라는 뜻이에요.","마스카르포네 치즈와 커피에 적신 빵으로 만들어요.","그래서 디저트인데 커피 향이 은근히 진해요."],"혹시 디저트 좋아하세요? 카페 가면 꼭 시키는 거 있으세요?",["달달한 거랑 쌉쌀한 거 중에 어느 쪽이 더 끌리세요?","기억에 남는 디저트 맛집 있어요?"],["커피","케이크","카페 투어"],"내가 좋아하는 디저트나 자주 가는 카페 한 곳을 떠올려 두기.","이름 뜻을 강의하듯 길게 설명하기.",["티라미수의 뜻에 가장 가까운 것은?",["나를 끌어올려 줘","달콤한 구름","이탈리아의 아침","한 입만 더"],0,"이탈리아어로 기운을 북돋아 달라는 뜻이에요."]),
C(2,"카페·디저트","아포가토",["아포가토는 이탈리아어로 \"빠뜨리다, 잠기다\"라는 뜻이에요.","바닐라 아이스크림에 뜨거운 에스프레소를 부어 먹는 디저트고요.","뜨거운 거랑 차가운 게 만나서 한 입에 두 가지 온도가 나요."],"혹시 커피 좋아하세요? 디저트에 커피 얹어 먹는 것도 좋아하세요?",["커피는 보통 뜨겁게 드세요, 차갑게 드세요?","카페에서 디저트랑 같이 시키는 조합이 있어요?"],["에스프레소","아이스크림","카페"],"디저트 카페에서 먹어 본 특이한 조합이 있다면 짧게 꺼내기.","커피 지식 자랑으로 흐르기.",["아포가토를 만드는 방법은?",["우유 거품을 얹는다","아이스크림에 에스프레소를 붓는다","얼음을 갈아 넣는다","시럽에 졸인다"],1,"아이스크림에 에스프레소를 부어 먹어요."]),
C(3,"술·와인·위스키","막걸리 흔들기",["막걸리는 쌀로 빚은 우리 전통 술이에요.","병 바닥에 가라앉은 부분이 있어서, 마시기 전에 살살 흔들어 섞어 마셔요.","그래서 막걸리 병은 흔들어 먹는 술로 유명해요."],"혹시 막걸리 좋아하세요? 비 오는 날 파전이랑 먹는다는 얘기 많이 하잖아요.",["비 오는 날 생각나는 음식 있으세요?","친구들이랑 모이면 주로 뭐 드세요?"],["파전","비 오는 날","전통주"],"술 대신 음식이나 분위기 이야기로 연결하기.","술 못 마신다고 변명하듯 길게 설명하기, 마시라고 권하기.",["막걸리를 마시기 전에 하는 행동은?",["얼음을 넣는다","살살 흔들어 섞는다","따뜻하게 데운다","물을 탄다"],1,"가라앉은 부분을 섞어 마시기 위해 흔들어요."],"저는 술을 잘 안 마셔서 맛은 잘 모르는데, 막걸리 먹을 때 같이 먹는 안주 얘기는 재밌더라고요. 뭐랑 드세요?"),
C(4,"술·와인·위스키","싱글 몰트 위스키",["싱글 몰트는 한 증류소에서 만든 보리 맥아 위스키예요.","\"싱글\"은 병이 하나라는 뜻이 아니라 증류소가 하나라는 뜻이에요.","그래서 병에 증류소 이름이 쓰여 있는 경우가 많아요."],"위스키 좋아하는 분들은 입문한 계기가 다 다르던데, 어떻게 시작하셨어요?",["술 마실 때 분위기를 더 보세요, 술 종류를 더 보세요?","기억에 남는 술자리가 있으세요?"],["바","안주","여행지의 술"],"술 대신 마시는 음료나 분위기 좋았던 곳 이야기로 연결하기.","술 안 마시는 걸 변명하듯 길게 설명하기, 마시라고 권하기.",["싱글 몰트에서 \"싱글\"의 뜻은?",["한 병만 판매","한 증류소","한 번 증류","한 종류의 곡물만"],1,"싱글은 한 증류소에서 만들었다는 뜻이에요."],"저는 술을 잘 안 마셔서 맛은 잘 모르지만, 분위기 좋은 바는 구경하는 것만으로도 재밌더라고요. 어떤 데가 좋았어요?"),
C(5,"집·인테리어·살림","식물 과습",["식물을 죽게 하는 가장 흔한 이유는 물 부족보다 물을 너무 자주 주는 거라고들 해요.","그래서 겉흙이 마른 걸 확인하고 주는 게 기본이에요.","사랑이 넘쳐서 죽이는 경우가 많다는 거죠."],"혹시 집에 키우는 식물 있으세요?",["식물 키우는 거 좋아하세요, 아니면 구경하는 쪽이세요?","집에서 제일 아끼는 공간이 어디예요?"],["화분","베란다","홈카페"],"내가 키워 본 식물이나 실패담 하나를 가볍게 꺼내기.","식물 관리법을 가르치듯 말하기.",["식물이 가장 많이 죽는 흔한 이유는?",["햇빛이 너무 약해서","물을 너무 자주 줘서","화분이 작아서","이름을 안 불러서"],1,"과습이 흔한 실패 원인으로 꼽혀요."]),
C(6,"집·인테리어·살림","집들이 선물",["집들이 선물로 휴지와 세제를 주는 문화가 있어요.","휴지는 일이 술술 풀리라는 뜻, 세제는 거품처럼 재물이 일어나라는 뜻이에요.","센스 있는 선물이라 지금도 많이들 주고받아요."],"혹시 집들이 가 본 적 있으세요? 선물 뭐 가져가셨어요?",["선물 고를 때 기준이 있으세요?","집 꾸미는 거 좋아하세요?"],["선물","이사","인테리어"],"내가 받아서 좋았던 선물이나 해 본 선물 이야기로 연결하기.","선물 가격이나 브랜드로 비교하기.",["집들이 선물로 휴지를 주는 이유는?",["가볍고 싸서","일이 술술 풀리라고","쓸 일이 많아서","색이 예뻐서"],1,"휴지는 일이 술술 풀리라는 뜻을 담아요."]),
C(7,"맛집·음식 문화","평양냉면과 함흥냉면",["평양냉면은 메밀 면에 담백한 육수가 특징이에요.","함흥냉면은 전분 면이라 쫄깃하고, 보통 매콤하게 비벼 먹어요.","같은 냉면인데 고향에 따라 스타일이 꽤 달라요."],"혹시 냉면 좋아하세요? 평양냉면 쪽이세요, 함흥냉면 쪽이세요?",["여름에 꼭 먹는 음식 있으세요?","처음 평양냉면 드셨을 때 어땠어요?"],["여름 음식","육수","맛집"],"처음 먹었을 때 낯설었던 음식 이야기를 짧게.","호불호를 단정 지으며 상대 취향을 평가하기.",["함흥냉면의 특징은?",["메밀 면에 담백한 육수","전분 면에 매콤한 양념","밀가루 면에 크림 소스","쌀국수에 고기 국물"],1,"함흥냉면은 쫄깃한 전분 면에 매콤하게 비벼 먹어요."]),
C(8,"맛집·음식 문화","짜장면",["짜장면은 중국 음식에서 시작해 한국에서 한국식으로 자리 잡은 음식이에요.","인천 차이나타운이 짜장면의 고향으로 자주 꼽혀요.","이사 날 짜장면 시켜 먹는 문화도 있잖아요."],"혹시 이사 가면 짜장면부터 시키세요? 짜장 vs 짬뽕 하면 어느 쪽이세요?",["이사하거나 큰일 끝나면 먹는 음식 있으세요?","어릴 때 외식하면 꼭 시키던 거 있어요?"],["짬뽕","중국집","이사"],"짜장 vs 짬뽕 선택을 내 취향으로 가볍게 답하기.","어느 쪽이 맞다고 정리하려 하기.",["짜장면의 고향으로 자주 꼽히는 곳은?",["부산 자갈치","인천 차이나타운","전주 한옥마을","서울 명동"],1,"인천 차이나타운이 고향으로 자주 꼽혀요."]),
C(9,"여행·도시","제주 삼다도",["제주도는 돌, 바람, 여자가 많다고 해서 삼다도라고 불러요.","실제로 바람이 세고 돌담이 많아서 풍경이 독특해요.","그래서 제주 하면 돌담길이 먼저 떠오르는 사람도 많아요."],"혹시 제주도 가 보셨어요? 갔을 때 제일 좋았던 곳 있으세요?",["여행 가면 계획 세우는 편이세요, 즉흥인 편이세요?","다음에 가 보고 싶은 곳 있으세요?"],["렌터카","올레길","맛집"],"내가 갔던 제주 여행 중 기억나는 장면 하나 꺼내기.","여행지 정보를 줄줄 읊기.",["제주를 삼다도라고 부르는 이유에 해당하는 것은?",["돌·바람·여자가 많아서","귤·말·바다가 많아서","산·폭포·호수가 많아서","섬이 세 개라서"],0,"돌, 바람, 여자가 많다고 해서 삼다도예요."]),
C(10,"여행·도시","벚꽃 전선",["일본에서는 벚꽃이 남쪽부터 피어 올라가요.","그래서 \"벚꽃 전선\"이라는 말이 있고, 이걸 따라 북쪽으로 여행하는 사람도 있어요.","한국도 남쪽부터 꽃이 피어서 비슷한 이야기가 있어요."],"혹시 벚꽃 구경 좋아하세요? 봄에 가 본 곳 중에 기억나는 데 있어요?",["봄 하면 떠오르는 곳 있으세요?","꽃구경이랑 단풍 구경 중에 뭐가 더 좋으세요?"],["봄 나들이","사진","일본 여행"],"봄에 갔던 곳이나 꽃 구경한 기억을 짧게.","꽃 개화 시기를 정확히 따지기.",["벚꽃 전선은 무엇을 가리킬까?",["벚꽃이 남쪽부터 피어 올라가는 흐름","벚꽃 축제 입장 줄","벚꽃 모양 과자","벚꽃 사진 대회"],0,"남쪽부터 북쪽으로 벚꽃이 피어 올라가는 흐름이에요."]),
C(11,"반려동물","고양이 그르릉",["고양이가 그르릉거리는 건 기분 좋을 때만이 아니에요.","불안하거나 아플 때도 낸다고 알려져 있어요.","그래서 그르릉 소리 하나로 기분을 단정하기는 어려워요."],"혹시 고양이 좋아하세요? 고양이 키워 보신 적 있으세요?",["강아지 파세요, 고양이 파세요?","동물 좋아하게 된 계기가 있어요?"],["집사","강아지","동물병원"],"동물 키워 본 경험이나 길에서 만난 고양이 이야기를 짧게.","고양이 행동을 단정적으로 설명하기.",["고양이가 그르릉거리는 때는?",["기분 좋을 때만","기분 좋을 때도, 불안할 때도","배고플 때만","잠잘 때만"],1,"기분 좋을 때뿐 아니라 불안하거나 아플 때도 내요."]),
C(12,"반려동물","강아지 꼬리 흔들기",["강아지가 꼬리를 흔든다고 항상 기분이 좋은 건 아니에요.","꼬리의 높이나 흔드는 방향에 따라 감정이 다르다고 알려져 있어요.","그래서 꼬리만 보지 말고 표정이랑 몸짓도 같이 보라고 해요."],"혹시 강아지 키우세요, 아니면 좋아하는 쪽이세요?",["그 아이는 어떤 성격이에요?","산책 코스 정해 놓으셨어요?"],["산책","이름","동물병원"],"산책 중 만난 강아지나 어릴 적 키운 동물 이야기를 짧게.","사진을 보여 달라고 조르기.",["강아지 꼬리 흔들기에 대한 설명으로 맞는 것은?",["항상 기분이 좋다는 뜻","높이와 방향에 따라 감정이 다르다","배고프다는 뜻","추워서 하는 행동"],1,"꼬리 모양에 따라 감정이 달라요."]),
C(13,"영화·드라마·OTT","기생충",["영화 기생충은 아카데미 작품상을 받은 최초의 비영어 영화예요.","한국 영화가 세계에서 크게 주목받은 계기로 자주 이야기돼요.","그래서 한국 영화 하면 이 작품을 떠올리는 사람이 많아요."],"혹시 영화 자주 보세요? 요즘 본 것 중에 추천할 만한 거 있으세요?",["영화관 가는 거 좋아하세요, 집에서 보는 거 좋아하세요?","인생 영화 하나 꼽자면요?"],["극장","OTT","정주행"],"최근 본 영화나 드라마 한 편을 한 줄 감상과 함께 꺼내기.","영화 평론하듯 길게 분석하기.",["기생충이 받은 기록으로 알려진 것은?",["아카데미 작품상을 받은 최초의 비영어 영화","가장 오래 상영한 영화","최초의 흑백 영화","최초의 애니메이션 작품상"],0,"아카데미 작품상을 받은 첫 비영어 영화예요."]),
C(14,"영화·드라마·OTT","극장 팝콘",["영화관 수익에서 매점이 꽤 중요한 역할을 한다고들 해요.","그래서 영화관에 가면 팝콘과 음료 세트를 꼭 권하는 거예요.","팝콘 냄새만 맡아도 영화관 같다는 사람도 많고요."],"혹시 영화관 가면 팝콘 꼭 사세요?",["팝콘 맛은 어떤 걸 좋아하세요?","영화 보면서 뭐 먹는 편이세요?"],["극장","데이트","간식"],"영화관에서의 소소한 습관 하나를 가볍게 꺼내기.","영화관 가격이나 수익 구조를 따지기.",["영화관에서 매점이 중요한 이유로 알려진 것은?",["수익에서 차지하는 몫이 커서","영화보다 먼저 생겨서","법으로 정해져 있어서","팝콘 회사가 만든 곳이라서"],0,"영화관 수익에서 매점이 큰 역할을 해요."]),
C(15,"음악·공연","앙코르",["앙코르는 프랑스어로 \"다시\"라는 뜻이에요.","공연이 끝나고 박수로 한 곡 더 요청하는 걸 이렇게 불러요.","영어권에서도 이 말을 그대로 써요."],"혹시 콘서트 가 보신 적 있으세요? 기억에 남는 공연 있어요?",["좋아하는 가수나 밴드 있으세요?","라이브로 들으면 달라지는 노래가 있어요?"],["콘서트","페스티벌","플레이리스트"],"공연 갔던 기억이나 자주 듣는 노래 하나를 꺼내기.","음악 지식으로 상대 취향을 평가하기.",["앙코르의 뜻은?",["다시","고마워요","마지막","큰 소리로"],0,"프랑스어로 다시라는 뜻이에요."]),
C(16,"음악·공연","노래방",["노래방의 뿌리는 일본의 가라오케로 알려져 있어요.","가라오케는 \"비어 있는 오케스트라\"라는 뜻이라고 해요.","한국에서는 코인 노래방까지 생기면서 자기 스타일로 발전했어요."],"혹시 노래방 좋아하세요? 18번 노래 있으세요?",["노래방 가면 꼭 부르는 노래 있어요?","혼자 코인 노래방 가 보신 적 있으세요?"],["코인 노래방","플레이리스트","회식"],"내가 자주 부르는 노래나 노래방 에피소드를 가볍게 꺼내기.","노래 잘하는지 평가하거나 시험하듯 묻기.",["가라오케의 뜻에 가까운 것은?",["비어 있는 오케스트라","노래하는 방","마이크 소리","함께 부르는 노래"],0,"비어 있는 오케스트라라는 뜻이에요."]),
C(17,"전시·미술","도슨트",["도슨트는 전시를 안내하고 설명해 주는 사람이에요.","라틴어로 \"가르치다\"에서 온 말이라고 알려져 있어요.","설명을 들으면서 보면 작품이 더 재밌어진다는 사람이 많아요."],"혹시 전시회 좋아하세요? 최근에 본 전시 있으세요?",["전시 보러 가면 설명을 들으며 보세요, 혼자 보세요?","좋아하는 화가나 스타일 있어요?"],["미술관","데이트","사진"],"가 봤던 전시나 인상 깊었던 작품을 짧게 꺼내기.","작품 해석을 아는 척하며 길게 설명하기.",["도슨트는 어떤 사람일까?",["전시를 안내하고 설명해 주는 사람","작품을 파는 사람","미술관을 지키는 사람","그림을 그리는 사람"],0,"전시를 안내하고 설명해 주는 사람이에요."]),
C(18,"전시·미술","고흐와 그림",["고흐는 살아 있을 때 그림이 거의 팔리지 않았다고 알려져 있어요.","지금은 세계에서 가장 사랑받는 화가 중 한 명이 됐죠.","그래서 \"작가는 죽고 나서 유명해진다\"는 이야기의 대표 사례로 자주 나와요."],"혹시 좋아하는 화가 있으세요?",["미술관 가면 오래 보는 편이세요, 쓱 훑는 편이세요?","그림 중에 집에 걸고 싶은 거 있어요?"],["미술관","전시","엽서"],"좋아하는 그림이나 가 본 미술관 이야기를 짧게.","미술사 지식을 늘어놓기.",["고흐에 대해 알려진 이야기는?",["생전에 그림이 거의 안 팔렸다","생전에 가장 부자였다","그림을 한 장도 안 그렸다","조각가였다"],0,"생전에는 그림이 거의 안 팔렸다고 알려져 있어요."]),
C(19,"책·웹툰","웹툰이라는 말",["웹툰은 웹과 카툰을 합친 말로, 한국에서 시작된 표현이에요.","지금은 해외에서도 \"웹툰\"이라는 이름 그대로 불려요.","드라마나 영화로 만들어진 웹툰도 정말 많죠."],"혹시 웹툰 보세요? 요즘 챙겨 보는 거 있으세요?",["웹툰이 드라마로 나오면 원작이 더 좋으세요?","책이랑 웹툰 중에 뭐가 더 편하세요?"],["드라마","원작","책"],"요즘 보는 웹툰이나 드라마화된 작품 얘기를 가볍게.","작품 스포일러를 말하기.",["웹툰이라는 말은 무엇의 합성어?",["웹과 카툰","웹과 툴","웹과 마음","월과 툰"],0,"웹과 카툰을 합친 말이에요."]),
C(20,"책·웹툰","하루키와 달리기",["소설가 무라카미 하루키는 달리기를 꾸준히 하는 걸로 유명해요.","달리기에 대한 에세이 책도 썼어요.","글쓰기도 체력이 중요하다는 이야기로 자주 인용돼요."],"혹시 요즘 읽는 책 있으세요? 아니면 달리기 같은 운동 하세요?",["책 읽는 시간은 주로 언제예요?","운동하면서 듣는 거나 보는 거 있어요?"],["러닝","독서","에세이"],"내 러닝이나 독서 습관을 가볍게 연결하기.","책 내용을 요약하듯 길게 말하기.",["하루키가 꾸준히 하는 것으로 유명한 운동은?",["달리기","수영","골프","요가"],0,"달리기로 유명하고 관련 에세이도 있어요."]),
C(21,"야구·축구","승리 요정",["야구 팬들 사이에는 \"내가 직관 가면 이긴다\" 같은 징크스 문화가 있어요.","그래서 승리 요정, 패배 요정이라는 말도 써요.","팬마다 자기만의 징크스가 있다는 이야기가 많아요."],"혹시 응원하는 야구팀 있으세요?",["직관 가보신 적 있으세요? 가면 뭐가 제일 좋았어요?","그 팀을 응원하게 된 계기가 있나요?"],["직관","치맥","응원가"],"야구를 몰라도 되고, 분위기만 구경하러 가 본 경험이 있으면 그 얘기를 꺼내기.","성적·선수 기록을 외워서 상대를 시험하듯 말하기.",["야구 팬들이 말하는 승리 요정은?",["직관 가면 팀이 이긴다고 믿는 사람","팀의 마스코트","심판","응원가를 만든 사람"],0,"직관 가면 이긴다는 징크스를 가진 사람을 가리켜요."]),
C(22,"야구·축구","더비",["축구에서 더비는 같은 지역 팀끼리의 라이벌 경기를 뜻해요.","그래서 더비 날이면 분위기가 평소보다 훨씬 뜨거워요.","팬들은 이 경기만큼은 꼭 이겨야 한다고들 해요."],"혹시 축구 좋아하세요? 응원하는 팀 있으세요?",["축구는 직접 하는 걸 더 좋아하세요, 보는 걸 더 좋아하세요?","친구들이랑 같이 본 경기 중에 기억나는 거 있어요?"],["직관","월드컵","응원"],"축구를 봤던 기억이나 같이 본 사람 이야기를 짧게.","선수 이름과 기록을 외워 테스트하듯 말하기.",["축구에서 더비란?",["같은 지역 팀끼리의 라이벌 경기","결승전","친선 경기","여자 경기"],0,"같은 지역 라이벌 팀끼리의 경기예요."]),
C(23,"e스포츠(롤 등)","롤 다섯 포지션",["리그 오브 레전드는 다섯 명이 한 팀이고 포지션이 나뉘어 있어요.","탑, 정글, 미드, 원딜, 서포터예요.","그래서 같은 게임인데 포지션마다 하는 일이 꽤 달라요."],"혹시 게임 좋아하세요? 롤 해 보셨어요?",["게임은 직접 하는 편이세요, 보는 편이세요?","보통 어떤 장르 좋아하세요?"],["게임","e스포츠","친구"],"게임을 해 본 경험이나 같이 한 사람 이야기를 가볍게.","게임 용어를 쏟아 내 상대가 따라오지 못하게 하기.",["롤의 한 팀은 몇 명일까?",["세 명","네 명","다섯 명","일곱 명"],2,"한 팀은 다섯 명이에요."]),
C(24,"e스포츠(롤 등)","e스포츠 종주국",["한국은 e스포츠 종주국으로 불려요.","스타크래프트 프로게이머 시절부터 방송 경기 문화가 있었어요.","그래서 한국 선수들이 세계 대회에서 강한 걸로 유명해요."],"혹시 e스포츠 경기 보신 적 있으세요?",["경기를 보면 어떤 게 제일 재밌어요?","같이 볼 친구 있어요?"],["스타크래프트","롤","직관"],"경기를 본 경험이 있다면 그 분위기를 짧게.","선수 기록을 외워 시험하듯 말하기.",["한국이 흔히 불리는 별명은?",["e스포츠 종주국","게임 섬","축구 왕국","바둑 나라"],0,"e스포츠 종주국으로 불려요."]),
C(25,"운동·러닝·필라테스","러너스 하이",["러너스 하이는 달리다 보면 기분이 좋아지는 현상을 부르는 말이에요.","정확한 이유는 아직 연구 중이라고 알려져 있어요.","그래서 달리기가 기분 전환 운동으로 인기가 많아요."],"혹시 요즘 하는 운동 있으세요?",["운동할 때 음악 들으세요?","몸 쓰는 걸 좋아하는 편이세요?"],["러닝","음악","건강"],"내가 달리면서 느낀 점이나 좋아하는 코스를 짧게.","기록이나 속도로 비교하기.",["러너스 하이란?",["달릴 때 기분이 좋아지는 현상","달리기 대회","운동화 브랜드","마라톤 코스"],0,"달리다 보면 기분이 좋아지는 현상이에요."]),
C(26,"운동·러닝·필라테스","필라테스",["필라테스는 창시자 조지프 필라테스의 이름에서 따온 이름이에요.","재활에서 출발했다고 알려져 있어요.","그래서 자세와 몸의 중심을 잡는 데 집중하는 운동이에요."],"혹시 필라테스 해 보셨어요? 아니면 요가 같은 거 관심 있으세요?",["운동 시작하면 오래 하는 편이세요?","몸이 편해지는 습관 있으세요?"],["요가","자세","운동 루틴"],"내 운동 루틴이나 해 본 운동 이야기를 가볍게.","운동 방법을 가르치듯 말하기.",["필라테스라는 이름은 어디서 왔을까?",["창시자의 이름","나라 이름","동작의 이름","기구의 이름"],0,"창시자 조지프 필라테스의 이름에서 왔어요."]),
C(27,"수면·건강 상식","짧은 낮잠",["낮잠은 짧게 자면 개운하고, 너무 길게 자면 오히려 멍해진다고들 해요.","그래서 점심 후에 짧게 눈을 붙이는 걸 추천하는 사람이 많아요.","길게 자고 나서 더 피곤했던 경험, 한 번쯤 있죠?"],"혹시 낮잠 좋아하세요? 주말에 늦잠 자는 편이세요?",["잠 잘 자는 편이세요?","잠 안 올 때 하는 게 있어요?"],["주말","수면","카페인"],"내 수면 습관이나 낮잠 경험을 가볍게.","건강 조언을 하듯 말하기.",["낮잠에 대해 흔히 하는 이야기는?",["짧게 자면 개운하다","길게 자야 개운하다","낮잠은 무조건 해롭다","낮잠은 밤에만 효과 있다"],0,"짧은 낮잠이 개운하다고들 해요."]),
C(28,"수면·건강 상식","아침 햇빛",["아침에 햇빛을 쬐면 생체리듬을 맞추는 데 도움이 된다고 알려져 있어요.","그래서 잠이 안 오는 사람에게 아침 산책을 권하기도 해요.","커튼 열고 하루를 시작하는 것도 작은 습관이 될 수 있어요."],"혹시 아침형 인간이세요, 저녁형 인간이세요?",["아침에 일어나면 제일 먼저 하는 게 뭐예요?","주말 아침은 어떻게 보내세요?"],["산책","아침 루틴","수면"],"내 아침 습관이나 주말 산책 이야기를 짧게.","건강 정보를 단정적으로 말하기.",["아침 햇빛이 도움이 되는 것은?",["생체리듬 맞추기","머리카락 자라기","키 크기","시력 좋아지기"],0,"생체리듬을 맞추는 데 도움이 된다고 알려져 있어요."]),
C(29,"관계·심리","칵테일 파티 효과",["시끄러운 곳에서도 내 이름이 불리면 귀에 쏙 들어오는 현상이 있어요.","이걸 칵테일 파티 효과라고 불러요.","그래서 대화에서 상대 이름을 불러 주면 집중을 끌 수 있어요."],"혹시 시끄러운 카페에서도 내 이름 들리면 바로 알아채세요?",["사람 많은 데서 대화하는 거 괜찮은 편이세요?","조용한 곳이 더 좋으세요?"],["이름","대화","카페"],"내 경험 중 이름을 불렀더니 반응이 달라졌던 순간을 가볍게.","심리학 용어를 아는 척 설명하기.",["칵테일 파티 효과란?",["시끄러워도 내 이름은 잘 들리는 현상","술 마시면 말이 많아지는 현상","파티에서 인기 얻는 법","칵테일 만드는 법"],0,"시끄러운 곳에서도 내 이름은 잘 들리는 현상이에요."]),
C(30,"관계·심리","단순 노출 효과",["자주 접할수록 호감이 생기는 경향을 단순 노출 효과라고 불러요.","그래서 자주 마주치는 사람에게 정이 가기도 해요.","노래도 자주 들으면 좋아지는 경우가 있잖아요."],"혹시 처음엔 별로였는데 자꾸 들으니 좋아진 노래 있으세요?",["자주 가는 단골 가게 있으세요?","낯선 사람과도 금방 친해지는 편이세요?"],["단골","노래","친구"],"내가 자주 들어서 좋아진 노래나 단골 가게 이야기를 가볍게.","이 효과를 상대에게 써먹으려는 의도를 드러내기.",["단순 노출 효과란?",["자주 접할수록 호감이 생기는 경향","한 번 보고 반하는 현상","오래 보면 질리는 현상","사진 찍으면 못 나오는 현상"],0,"자주 접할수록 호감이 생기는 경향이에요."]),
C(31,"재테크 상식","복리",["복리는 이자에 또 이자가 붙는 방식이에요.","그래서 시간이 길수록 불어나는 폭이 커진다고들 해요.","눈덩이가 굴러가며 커지는 모습에 자주 비유해요."],"혹시 저축이나 재테크 관심 있으세요?",["돈 모으는 습관 있으세요?","소비는 계획형이세요, 즉흥형이세요?"],["저축","적금","소비 습관"],"내가 실천하는 작은 저축 습관을 가볍게 꺼내기.","투자 종목이나 수익률을 자랑하기.",["복리란?",["이자에 이자가 붙는 방식","원금만 불어나는 방식","빌린 돈의 세금","환율이 변하는 방식"],0,"이자에 이자가 붙는 방식이에요."]),
C(32,"재테크 상식","선저축 후소비",["월급이 들어오면 먼저 저축하고 남은 돈으로 쓰는 방식이 있어요.","이걸 선저축 후소비라고 불러요.","쓰고 남는 돈을 모으는 것보다 꾸준해지기 쉽다고들 해요."],"혹시 월급날 루틴 있으세요?",["소소하게 아끼는 습관 있어요?","큰돈 쓰기 전에 고민하는 편이세요?"],["월급","적금","가계부"],"내가 쓰는 가계부나 절약 습관을 가볍게.","금액이나 수입을 캐묻기.",["선저축 후소비란?",["먼저 저축하고 남은 돈으로 쓰기","먼저 쓰고 남기면 저축하기","돈을 빌려서 쓰기","현금만 쓰기"],0,"먼저 저축하고 남은 돈으로 쓰는 방식이에요."]),
C(33,"역사 속 재미있는 이야기","한글",["한글은 세종대왕이 백성이 쉽게 쓰도록 만든 글자예요.","한글날은 훈민정음을 세상에 알린 걸 기념하는 날이에요.","만든 사람과 만든 원리가 알려진 몇 안 되는 글자로 자주 소개돼요."],"혹시 한글날에 뭐 하세요? 쉬는 날이라 좋죠?",["쉬는 날엔 보통 뭐 하세요?","역사 이야기 좋아하세요?"],["세종대왕","휴일","책"],"쉬는 날 보내는 방식을 가볍게 연결하기.","역사 사실로 상대를 가르치려 들기.",["한글을 만든 사람은?",["세종대왕","이순신","정약용","신사임당"],0,"세종대왕이 만들었어요."]),
C(34,"역사 속 재미있는 이야기","삼양라면",["한국 최초의 라면은 삼양식품의 삼양라면으로 알려져 있어요.","먹을 게 부족하던 시절에 값싸고 든든한 음식으로 퍼졌어요.","지금은 라면이 한국인의 소울푸드 중 하나가 됐죠."],"혹시 라면 좋아하세요? 끓이는 방법에 취향 있으세요?",["라면에 꼭 넣는 재료 있으세요?","야식으로 가장 땡기는 거 뭐예요?"],["야식","편의점","한강 라면"],"내 라면 취향이나 야식 에피소드를 가볍게.","어느 라면이 최고인지 논쟁하기.",["한국 최초의 라면으로 알려진 것은?",["삼양라면","신라면","너구리","진라면"],0,"삼양식품의 삼양라면으로 알려져 있어요."])
];

/* ---------- 저장소 ---------- */
function tget(){const d=LS.get(TK,null)||{};d.cards=d.cards||{};d.days=d.days||{};d.star=d.star||{};d.flag=d.flag||{};d.rv=d.rv||{};d.chain=d.chain||[];d.w=d.w||{};d.ex=d.ex||[];d.seen=d.seen||{};return d}
function tsave(d){return LS.set(TK,d)}
const noChk=t=>String(t||'').replace(/\s*[（(]확인 필요[）)]/g,'');
const today=()=>dKey();
const dayAdd=(n)=>{const x=new Date();x.setDate(x.getDate()+n);return dKey(x.getTime())};
const daysSince=(ts)=>Math.floor((Date.now()-ts)/86400e3);
function weight(d,f){const v=d.w[f];return v==null?(f==="과학·우주"?0:1):Number(v)}
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

/* ---------- 카드 만들기 ---------- */
function cleanCard(c,f,extra){
  const s=v=>typeof v==='string'?v.trim():'';
  if(!c||!s(c.kw)||!Array.isArray(c.sum)||c.sum.length<3||!c.quiz||!Array.isArray(c.quiz.o)||c.quiz.o.length!==4)return null;
  const a=Number(c.quiz.a);if(!(a>=0&&a<=3))return null;
  const out={id:'t'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),f:FIELDS.includes(s(c.f))?s(c.f):(f||'기타'),kw:s(c.kw).slice(0,30),sum:c.sum.slice(0,3).map(s),open:s(c.open),qs:(c.qs||[]).map(s).filter(Boolean).slice(0,2),links:(c.links||[]).map(s).filter(Boolean).slice(0,3),mine:s(c.mine),mistake:s(c.mistake),quiz:{q:s(c.quiz.q),o:c.quiz.o.map(s),a:a,why:s(c.quiz.why)},ts:Date.now()};
  if(!out.open||out.sum.some(x=>!x)||!out.quiz.q||out.quiz.o.some(x=>!x))return null;
  if(/확인 필요|확실하지 않|정확하지 않/.test(JSON.stringify(c)))return null;
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
const SCHEMA=`{"cards":[{"f":"분야명","kw":"키워드","sum":["문장1","문장2","문장3"],"open":"꺼내는 한마디","qs":["질문1","질문2"],"links":["키워드1","키워드2","키워드3"],"mine":"내 경험 연결 힌트(한 줄)","mistake":"대화를 망치는 흔한 실수(한 줄)","sober":"(술 분야만)","quiz":{"q":"","o":["","","",""],"a":0,"why":""}}]}`;
const STYLE=`[말투] 부드러운 존댓말. 요약 3줄은 각 한 문장이고, 마지막 줄은 듣는 사람이 "오, 그래요?" 하고 궁금해할 흥미로운 사실. '꺼내는 한마디'는 상대 입장에서 부담 없는 짧은 질문. 열린 질문은 상대의 경험·취향을 묻는 것(정답이 있거나 시험하듯 묻는 질문 금지).
[소재] 지식 설명이 아니라 일상 대화에서 화제로 꺼내기 좋은 흥미로운 이야기. 과학 이론·기술 설명은 피하세요.
[술 분야] 음주 권유·미화 금지. sober 필드에 "잘 안 마시는 사람으로서 이어가는 한마디"를 1~2문장으로.
[스포츠] 점수·기록 암기보다 응원 팀·직관 경험을 묻는 질문을 우선.
[퀴즈] 4지선다 1개, 정답 인덱스 a(0~3), why는 한 문장.
[금지] "(확인 필요)" 같은 불확실 표현을 쓰지 마세요. 검색으로 확실히 확인되지 않는 문장은 아예 빼고 확실한 다른 사실로 대체하세요. 지어낸 인물·수치·인용 금지. 의학·투자는 일반 상식 수준, 단정·권유 금지.`;
function searchBlocked(){return Date.now()-(LS.get('trv_search_block_at',0)||0)<WIN}
/* 구글 검색 연동 호출: 검색 출처가 확인된 카드만 돌려줘요. 확인 안 되면 버려요. */
async function grounded(prompt,fieldDefault,extra){
  if(!gKey())throw new Error('Gemini 키가 필요해요(구글 검색 연동은 Gemini에서만 돼요).');
  if(searchBlocked())throw new Error('최근 검색 연동이 한도·결제 문제로 거절돼 잠시 꺼 두었어요.');
  let lastErr;
  for(const m of gModels(SEARCH_MODELS)){
    const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),45000);
    try{
      const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`,{method:'POST',signal:ctl.signal,headers:{'Content-Type':'application/json','x-goog-api-key':gKey()},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],tools:[{google_search:{}}],generationConfig:{temperature:0.3,maxOutputTokens:6000}})});
      clearTimeout(to);
      if(!res.ok){const tx=await res.text();lastErr=new Error(`[${m}] HTTP ${res.status} ${tx.slice(0,120)}`);lastErr.status=res.status;if(res.status===429||res.status===403){LS.set('trv_search_block_at',Date.now())}continue}
      const j=await res.json();const cand=j.candidates&&j.candidates[0]||{};
      const txt=((cand.content&&cand.content.parts)||[]).map(p=>p.text||'').join('');
      const ch=((cand.groundingMetadata&&cand.groundingMetadata.groundingChunks)||[]).map(x=>x.web).filter(w=>w&&w.uri);
      if(!ch.length){lastErr=new Error(`[${m}] 검색 출처가 확인되지 않아 카드를 버렸어요.`);continue}
      const obj=parseJsonLoose(txt);const src=ch.slice(0,3).map(w=>({t:w.title||'',u:w.uri}));
      const out=[];((obj&&obj.cards)||[]).forEach(c=>{const x=cleanCard(c,fieldDefault,Object.assign({src:src},extra||{}));if(x)out.push(x)});
      if(!out.length){lastErr=new Error(`[${m}] 카드 형식을 읽지 못함`);continue}
      return out;
    }catch(e){clearTimeout(to);lastErr=new Error(`[${m}] ${e.name==='AbortError'?'45초 응답 없음':e.message}`)}
  }
  throw lastErr||new Error('카드를 만들지 못했어요.');
}
/* 일상 상식 카드(검색으로 확인된 것만) */
async function genVerified(d,fields,custom){
  const known=allCards(d).map(c=>c.kw).slice(-80).join(', ');
  const head=custom?`상대 관심사: ${custom}\n위 관심사와 관련된 대화 카드를 서로 다른 주제로 5장 만드세요. 분야명(f)은 가장 가까운 것을 목록에서 고르세요.`:`다음 분야마다 대화 카드 1장씩, 총 ${fields.length}장을 만드세요: ${fields.join(' / ')}`;
  const prompt=`당신은 한국어 대화 코치입니다. 누구와 대화하든(특히 20~30대 이성) 일상 대화에서 가볍게 화제로 꺼낼 '넓고 얕은 상식 카드'를 만듭니다. 구글 검색으로 확인된 사실만 사용하세요.
${head}
분야 목록: ${FIELDS.join(', ')}
이미 만든 키워드(겹치지 않게): ${known||'없음'}
제외 키워드: ${(d.ex||[]).join(', ')||'없음'}
최신 뉴스·순위·결과는 쓰지 말고 오래 가는 이야기만 쓰세요.
${STYLE}
출력은 JSON 객체 하나만(설명·코드블록 금지): ${SCHEMA}`;
  return grounded(prompt,null,custom?{custom:1}:null);
}
/* 최신 카드(스포츠·트렌드) */
async function genLatest(d,field){
  const sport=F_SPORT.includes(field),asOf=today();
  const prompt=`오늘은 ${asOf}입니다. 구글 검색으로 확인되는 ${sport?'최근 일주일 안의 '+field+' 소식(최근 결과, 순위, 일정 중 하나)':'요즘(최근 한 달 안) 한국에서 이야기되는 트렌드 하나'}만으로 대화 카드 1장을 만드세요. 검색으로 확인되지 않는 내용은 쓰지 말고, 기준 날짜(${asOf})를 sum에 한 번 밝히세요.
${STYLE}
출력은 JSON 객체 하나만(설명·코드블록 금지, f는 "${field}"): ${SCHEMA}`;
  const r=await grounded(prompt,field,{latest:1,asOf:asOf});
  return r[0];
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
  const pri=f=>unseen.filter(c=>c.f===f).sort((a,b)=>(b.src?1:0)-(a.src?1:0));
  for(const f of order){if(chosen.length>=5)break;const p=pri(f);if(p.length){chosen.push(p[0]);usedF.add(f)}}
  // 부족하면 이미 본 카드로 보충(분야 다양성 유지)
  if(chosen.length<5){for(const f of order){if(chosen.length>=5)break;if(usedF.has(f))continue;const p=usableCards.filter(c=>c.f===f&&!chosen.includes(c));if(p.length){chosen.push(p[0]);usedF.add(f)}}}
  day={ids:chosen.map(c=>c.id),done:false,q:null};
  return day;
}
async function ensureToday(d){
  const k=today();
  if(!d.days[k]){
    const verified=allCards(d).filter(c=>usable(d,c)&&!c.latest&&c.src&&!d.seen[c.id]).length;
    if(gKey()&&!searchBlocked()&&d.gTry!==k&&verified<5){
      d.gTry=k;tsave(d);say('🔎 검색으로 확인한 오늘의 카드를 만드는 중이에요... (최대 약 45초)');
      try{const g=await genVerified(d,pickFields(d,5,[F_TREND]));g.forEach(c=>{d.cards[c.id]=c});tsave(d);say('')}
      catch(e){console.warn(e);say('검색으로 확인한 새 카드는 오늘 못 만들어서 기본 카드로 진행해요.\n('+String(e.message).slice(0,120)+')','')}
    }
  }
  const day=chooseToday(d);d.days[k]=day;tsave(d);return day;
}

/* ---------- 읽어주기 ---------- */
function speechOf(c,n,tot){
  const t=[`${n}번째 카드, ${c.kw}.`];
  c.sum.forEach(x=>t.push(noChk(x)));
  t.push('이렇게 꺼내 보세요. '+c.open);
  if(c.qs&&c.qs[0])t.push('이어서 이렇게 물어볼 수 있어요. '+c.qs[0]);
  return t.join(' ');
}
function useGeminiVoice(){return (CFG.ttsEngine||'gemini')==='gemini'&&!!gKey()}
function rdStop(){S.rd.on=false;S.rd.token=(S.rd.token||0)+1;S.rd.aud={};try{ttsStop()}catch(e){}}
/* 다음 카드 음성을 미리 만들어 두면 카드 사이가 끊기지 않아요 */
function rdPrep(i){
  S.rd.aud=S.rd.aud||{};
  const d=tget(),id=S.rd.ids[i];if(id==null)return null;
  if(S.rd.aud[i])return S.rd.aud[i];
  const c=cardById(d,id);if(!c)return null;
  const gen=TTS.gen;
  const pr=geminiTtsPcm(speechOf(c,i+1),gen).then(pcm=>URL.createObjectURL(pcmToWav(pcm,24000)));
  pr.catch(()=>{});S.rd.aud[i]=pr;return pr;
}
function rdBrowser(c,i,my,note){
  if(note)say(note);
  ttsSay(speechOf(c,i+1),{engine:'browser',onDone:()=>{if(S.rd.on&&my===S.rd.token)rdPlay(i+1)}});
}
function rdPlay(i){
  const d=tget(),ids=S.rd.ids;
  if(i>=ids.length){rdStop();S.rd.i=ids.length-1;S.rd.done=true;render();window.scrollTo(0,0);return}
  S.rd.on=true;S.rd.paused=false;S.rd.done=false;S.rd.i=i;
  const c=cardById(d,ids[i]);
  d.seen[c.id]=Date.now();tsave(d);
  render();window.scrollTo(0,0);
  const my=++S.rd.token;
  if(!useGeminiVoice()){rdBrowser(c,i,my);return}
  try{lockScreen()}catch(e){}
  TTS.on=true;TTS.busy=true;
  const pr=rdPrep(i);
  pr.then(url=>{
    if(my!==S.rd.token||!S.rd.on)return;
    TTS.busy=false;
    const a=getAudio();a.src=url;a.playbackRate=Number(CFG.ttsRate)||1;try{a.preservesPitch=true}catch(e){}
    a.onended=()=>{if(my===S.rd.token&&S.rd.on)rdPlay(i+1)};
    a.onerror=()=>{if(my===S.rd.token&&S.rd.on)rdBrowser(c,i,my,'Gemini 음성 재생 실패 → 기기 음성으로 읽어요.')};
    try{if('mediaSession' in navigator){navigator.mediaSession.metadata=new MediaMetadata({title:'오늘의 상식 '+(i+1)+'/'+ids.length,artist:c.kw});navigator.mediaSession.setActionHandler('pause',()=>{a.pause()});navigator.mediaSession.setActionHandler('play',()=>{a.play()});navigator.mediaSession.setActionHandler('nexttrack',()=>{rdStop();rdPlay(i+1)})}}catch(e){}
    const pl=a.play();if(pl&&pl.catch)pl.catch(()=>{if(my===S.rd.token&&S.rd.on)rdBrowser(c,i,my,'자동 재생이 막혀 기기 음성으로 읽어요.')});
    rdPrep(i+1); /* 재생하는 동안 다음 카드 음성을 만들어 둠 */
  }).catch(e=>{
    if(my!==S.rd.token||!S.rd.on||/취소/.test(String(e&&e.message)))return;
    rdBrowser(c,i,my,'Gemini 음성을 못 만들어 기기 음성으로 읽어요. ('+String(e.message).slice(0,60)+')');
  });
}
function startBrief(){
  const d=tget();S.rd.token=(S.rd.token||0);
  ensureToday(d).then(day=>{S.rd.ids=day.ids.slice();S.view='brief';S.rd.done=false;try{ttsUnlock()}catch(e){}rdPlay(0)}).catch(e=>say('오류: '+e.message,'bad'));
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
  const ol=mk('ol');c.sum.forEach(x=>ol.appendChild(mk('li',noChk(x))));sec('30초 요약',ol);
  const sy=mk('div',c.open,'say');sec('꺼내는 한마디',sy);
  const ul=mk('ul');c.qs.forEach(x=>ul.appendChild(mk('li',x)));sec('이어갈 열린 질문',ul);
  sec('연결 키워드',c.links.join(' · '));
  if(c.sober)sec('🍵 안 마시는 사람의 한마디',c.sober);
  sec('내 경험 연결 힌트',c.mine);sec('대화를 망치는 흔한 실수',c.mistake);
  if(c.src&&c.src.length){const s=mk('div',null,'sec');s.appendChild(mk('b','출처(검색으로 확인됨)'));c.src.forEach(x=>{const a=mk('a',x.t||x.u);a.href=x.u;a.target='_blank';a.rel='noopener noreferrer';a.style.cssText='display:block;color:#7dd3fc;font-size:12px;word-break:break-all';s.appendChild(a)});e.appendChild(s)}
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
  say('🔎 검색으로 확인하며 관련 카드를 만드는 중이에요... (최대 약 45초)');
  try{
    const g=await genVerified(d,null,txt);
    const Q=await aiJson(`당신은 대화 코치입니다. 상대 관심사로 첫 질문 3개를 만드세요. 열린 질문, 상대의 경험·취향을 묻는 것, 시험·추궁 금지, 부드러운 존댓말. JSON 객체 하나만: {"qs":["","",""]}`,`상대 관심사: ${txt}`,{temp:0.6,max:800});
    g.forEach(c=>{d.cards[c.id]=c});tsave(d);
    S.prep={txt:txt,ids:g.slice(0,5).map(c=>c.id),qs:(Q.obj.qs||[]).slice(0,3)};say('');render();
  }catch(e){say('지금은 검색으로 확인한 카드를 만들 수 없어요. 잠시 뒤 다시 눌러 주세요.\n('+String(e.message).slice(0,160)+')','bad')}
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
  if(rd.length)row.appendChild(btn('🔁 복습 '+rd.length+'장','sub',()=>startQuiz(rd.slice(0,5),'복습 퀴즈')));
  c.appendChild(row);
  const m=mk('div',S.msg,'warn '+(S.cls||''));m.id='tvMsg';c.appendChild(m);
  root.appendChild(c);
  // 읽어주기 안내
  const tip=mk('div',null,'card');
  const dt=mk('details');dt.style.marginTop='0';dt.appendChild(mk('summary','🔊 읽어주기 · 화면 꺼짐 확인법 (갤럭시 S21)'));dt.appendChild(mk('div','읽어주기는 ⚙️ 설정의 음성(기기 음성 / Gemini 음성, 속도, 목소리)을 그대로 따라요.','sm'));
  const ol=mk('ol','','sm');['"오늘의 상식 듣기"를 누르고 첫 카드가 읽히기 시작하는지 확인','측면 버튼으로 화면을 끄고 30초 기다리기','소리가 이어지면 OK. 끊기면 ⚙️에서 음성을 "Gemini 음성"으로 바꿔 다시 시도(기기 음성보다 끊김이 적어요 — 단, 기기·환경에 따라 다를 수 있어요)','계속 끊기면 휴대폰 설정 → 배터리에서 크롬(또는 설치한 앱)을 "제한 없음"으로 바꾸기'].forEach(t=>ol.appendChild(mk('li',t)));
  dt.appendChild(ol);tip.appendChild(dt);root.appendChild(tip);
  // 최신 카드
  const L=mk('div',null,'card');L.appendChild(mk('h2','📰 최신 카드(스포츠·트렌드)'));
  const blocked=searchBlocked();
  L.appendChild(mk('div','검색으로 확인된 것만, 출처·기준 날짜와 함께 만들어요. (스포츠 7일 · 트렌드 30일 뒤 숨김)','sm'));
  const ld=mk('details');ld.appendChild(mk('summary','자세히'));ld.appendChild(mk('div','무료 키에서 검색 연동은 Gemini 2.5 Flash 계열만 하루 500회라고 공식 가격표에 적혀 있어요(Gemini 3 계열은 무료 키 불가). 안 되면 이 기능만 꺼지고 기본 카드는 그대로 써요.','sm'));L.appendChild(ld);
  const lr=mk('div',null,'row');
  [['⚾ 야구·축구',F_SPORT[0]],['🎮 e스포츠',F_SPORT[1]],['✨ 트렌드',F_TREND]].forEach(([t,f])=>lr.appendChild(btn(t,'sub',()=>makeLatest(f))));
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
  const d=tget(),ids=S.rd.ids,i=Math.min(S.rd.i,ids.length-1),done=!!S.rd.done;
  const c=cardById(d,ids[i]);
  const talk=(btnCls)=>c?btn('💬 궁금한 거 물어보기 (실전 대화로)',btnCls,()=>{rdStop();goTalk(c)}):null;
  const h=mk('div',null,'card');
  if(done){
    h.appendChild(mk('h2','🎉 브리핑 끝! 5장을 다 들었어요'));
    h.appendChild(mk('div','퀴즈로 한 번 확인해 볼까요? (틀린 문제는 1일·3일·7일 뒤 복습)','sm'));
    h.appendChild(btn('✅ 퀴즈 5문제 풀기','main',()=>{const dd=tget();startQuiz(dd.days[today()].ids,'오늘의 퀴즈')}));
    const t=talk('sub');if(t)h.appendChild(t);
    const row=mk('div',null,'row');
    row.appendChild(btn('🔁 다시 듣기','ghost',()=>{rdPlay(0)}));
    row.appendChild(btn('← 처음으로','ghost',()=>{S.view='home';render()}));
    h.appendChild(row);root.appendChild(h);
    root.appendChild(mk('div','마지막으로 들은 카드','sm')).style.margin='10px 4px 0';
    if(c)root.appendChild(cardEl(c,d));
    return;
  }
  h.appendChild(mk('h2',`🎧 브리핑 ${i+1} / ${ids.length}`));
  const bar=mk('div',null,'bar');const bi=mk('i');bi.style.width=((i+1)/ids.length*100)+'%';bar.appendChild(bi);h.appendChild(bar);
  const row=mk('div',null,'row');
  row.appendChild(btn(S.rd.on?'⏸ 정지':'▶ 재생','sub',()=>{if(S.rd.on){rdStop();S.rd.paused=true;render()}else rdPlay(S.rd.i)}));
  row.appendChild(btn('⏭ 다음','sub',()=>{rdStop();rdPlay(S.rd.i+1)}));
  row.appendChild(btn('⏹ 종료','rd',()=>{rdStop();S.view='home';render()}));
  h.appendChild(row);root.appendChild(h);
  if(c)root.appendChild(cardEl(c,d));
  const nx=mk('div',null,'card');
  nx.appendChild(btn('✅ 지금 퀴즈 풀기','sub',()=>{rdStop();const dd=tget();startQuiz(dd.days[today()].ids,'오늘의 퀴즈')}));
  const t=talk('sub');if(t)nx.appendChild(t);
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
  start(){root=document.getElementById('tvRoot');css();if(S.view!=='brief')render();startBrief()},
  cards(){return allCards(tget())},
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
