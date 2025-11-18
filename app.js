const timelineData = [
{ id: '2025-11-11', type:'외래', title: '외래', subtitle: '내과 외래', badge: 'NP', pages: makeDoc('2025-11-11 외래 경과', 3) },
{ id: '2025-10-17', type:'입원', title: '입원', subtitle: '응급실 → 병동', badge: 'ER', pages: makeDoc('2025-10-17 입원 초기평가', 6) },
{ id: '2024-08-01', type:'외래', title: '외래', subtitle: '진료', badge: 'NR', pages: makeDoc('2024-08-01 외래 경과', 2) },
{ id: '2024-06-04', type:'외래', title: '외래', subtitle: '검사결과 상담', badge: 'GE', pages: makeDoc('2024-06-04 상담', 1) },
{ id: '2024-03-07', type:'재진', title: '재진', subtitle: '내과', badge: 'PR', pages: makeDoc('2024-03-07 재진 소견', 1) }
];

function makeDoc(title, pages){
const arr = [];
const progress =     <h2>경과 내용</h2>     <div class="small muted">S) 피로감, 식욕저하, 상복부 불쾌감</div>     <div class="small muted">O) V/S 안정, Abd soft, mild epigastric tenderness</div>     <div class="small muted">A) Dyspepsia r/o GERD, Mild transaminitis</div>     <div class="small muted">P) PPI 유지, 식이/생활습관 교정, 필요 시 추가검사</div>     <hr/>  ;
for(let i=1;i<=pages;i++){
arr.push(      <div class="page">         <h1>${title}</h1>         <div class="small muted">Page ${i}</div>         ${progress}         <div class="page-grid">           <section>             <h2>주요소견</h2>             <ul>               <li>발열, 식욕저하, 복부 불편감</li>               <li>복용약: 항생제, 위보호제</li>               <li>알레르기: 특이사항 없음</li>             </ul>             <h2>검사</h2>             <ul>               <li>혈액: WBC 8.2, Hb 12.9, PLT 210</li>               <li>간기능: AST/ALT 경미 상승</li>               <li>영상: Abd CT pending</li>             </ul>           </section>           <section>             <h2>평가/계획</h2>             <ul>               <li>감염 의심 → 경험적 항생제 유지</li>               <li>수액 및 전해질 교정, 금주 교육</li>               <li>필요시 내시경/영상 추가</li>             </ul>             <h2>투약</h2>             <div class="kv">               <div>ABX</div><div>Ceftriaxone 2g q24h (D${i})</div>               <div>PPI</div><div>Pantoprazole 40mg qd</div>               <div>진통</div><div>Acetaminophen 500mg prn</div>             </div>           </section>         </div>         <footer>Page(${i})</footer>       </div>    );
}
return arr;
}

// 상태
let filter = 'all';
let filtered = timelineData.slice();
let currentDoc = filtered[0];
let pageIndex = 0;      // 0,2,4 ... (2페이지 단위)
let zoom = 1;

// 엘리먼트
const appEl = document.querySelector('.app');
const pagesWrap = document.getElementById('pagesWrap');
const pageInfo = document.getElementById('pageInfo');
const zoomInfo = document.getElementById('zoomInfo');

function applyFilter(){
filtered = (filter==='all') ? timelineData.slice()
: timelineData.filter(x=>x.type===filter);
if(filtered.length===0){
pagesWrap.innerHTML = '<div style="padding:24px;color:#cde7fb">해당 분류의 문서가 없습니다.</div>';
currentDoc = null;
updateNavButtons();
return;
}
currentDoc = filtered[0];
pageIndex = 0;
renderTimeline();
renderPages();
}

function renderTimeline(){
const ul = document.getElementById('timelineList');
ul.innerHTML = '';
for(const item of filtered){
const li = document.createElement('li');
li.className = 'timeline-item' + (currentDoc && currentDoc.id===item.id?' active':'');
li.innerHTML =       <div class="dot"></div>       <div>         <div class="date">${item.id}</div>         <div class="sub">${item.title} <span class="badge">${item.badge}</span></div>         <div class="sub">${item.subtitle}</div>       </div>    ;
li.addEventListener('click', ()=>{
currentDoc = item;
pageIndex = 0;
renderTimeline();
renderPages();
});
ul.appendChild(li);
}
}

function renderPages(){
if(!currentDoc){ updateNavButtons(); return; }
const p1 = currentDoc.pages[pageIndex];
const p2 = currentDoc.pages[pageIndex+1];
const grid = document.createElement('div');
grid.className = 'pages';
if(p1) grid.innerHTML += p1;
if(p2) grid.innerHTML += p2;

pagesWrap.innerHTML = '';
pagesWrap.appendChild(grid);

// 확대
pagesWrap.querySelectorAll('.page').forEach(p=>{
p.style.transform = scale(${zoom});
});

const total = currentDoc.pages.length;
const start = pageIndex+1;
const end = Math.min(pageIndex+2, total);
pageInfo.textContent = ${start} - ${end} / ${total};
zoomInfo.textContent = ${Math.round(zoom*100)}%;
updateNavButtons();
}

function updateNavButtons(){
const hasDoc = !!currentDoc;
const total = hasDoc ? currentDoc.pages.length : 0;
const atStart = !hasDoc || pageIndex<=0;
const atEnd = !hasDoc || (pageIndex+2>=total);
['btnPrev','btnFirst'].forEach(id=>{ const b=document.getElementById(id); b.disabled = atStart; });
['btnNext','btnLast'].forEach(id=>{ const b=document.getElementById(id); b.disabled = atEnd; });
}

// 네비 버튼
document.getElementById('btnPrev').addEventListener('click', ()=>{ pageIndex = Math.max(0, pageIndex-2); renderPages(); });
document.getElementById('btnNext').addEventListener('click', ()=>{ pageIndex = Math.min(currentDoc.pages.length-2, pageIndex+2); renderPages(); });
document.getElementById('btnFirst').addEventListener('click', ()=>{ pageIndex = 0; renderPages(); });
document.getElementById('btnLast').addEventListener('click', ()=>{ pageIndex = Math.max(0, currentDoc.pages.length-2); renderPages(); });

// 페이지 점프(페이지 정보 클릭)
pageInfo.style.cursor = 'pointer';
pageInfo.title = '클릭하여 페이지 이동';
pageInfo.addEventListener('click', ()=>{
if(!currentDoc) return;
const total = currentDoc.pages.length;
const input = prompt(이동할 페이지 (1 ~ ${total}));
const num = Number(input);
if(Number.isInteger(num) && num>=1 && num<=total){
// 2페이지 보기라서 짝수/홀수 맞춰 이동
pageIndex = (num-1) - ((num-1)%2);
renderPages();
}
});

// 확대/축소
document.getElementById('btnZoomIn').addEventListener('click', ()=>{ zoom = Math.min(2.0, +(zoom+0.1).toFixed(2)); renderPages(); });
document.getElementById('btnZoomOut').addEventListener('click', ()=>{ zoom = Math.max(0.5, +(zoom-0.1).toFixed(2)); renderPages(); });

// 인쇄
document.getElementById('btnPrint').addEventListener('click', ()=>{
if(!currentDoc) return;
const w = window.open('', '_blank');
const docHtml =      <html><head><title>Print</title>       <style>         body{margin:0;font-family:system-ui,Arial}         .page{width:794px; min-height:1123px; margin:0 auto 16px; padding:24px; box-sizing:border-box; border:1px solid #ddd; page-break-after:always}       </style>     </head>     <body>${currentDoc.pages.join('')}</body></html>;
w.document.write(docHtml);
w.document.close(); w.focus(); w.print();
});

// 좌측 접기/펼치기
document.getElementById('collapseLeft').addEventListener('click', ()=>{ document.querySelector('.app').classList.add('collapsed-left'); });
document.getElementById('expandLeft').addEventListener('click', ()=>{ document.querySelector('.app').classList.remove('collapsed-left'); });

// 가운데 탭(필터) 동작
document.querySelectorAll('.tab-btn').forEach(btn=>{
btn.addEventListener('click', ()=>{
document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
btn.classList.add('active');
filter = btn.dataset.tab; // all / 외래 / 입원 / ...
applyFilter();
});
});

// 검색(데모)
document.getElementById('searchBtn').addEventListener('click', ()=>{ alert('데모: 검색 기능은 샘플입니다.'); });

// 초기 렌더
applyFilter();
