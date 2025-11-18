// 더미 데이터
const timelineData = [
{ id: '2025-11-11', title: '외래', subtitle: '내과 외래', badge: 'NP', pages: makeDoc('2025-11-11 외래 경과', 3) },
{ id: '2025-10-17', title: '입원', subtitle: '응급실 → 병동', badge: 'ER', pages: makeDoc('2025-10-17 입원 초기평가', 6) },
{ id: '2024-08-01', title: '외래', subtitle: '진료', badge: 'NR', pages: makeDoc('2024-08-01 외래 경과', 2) },
{ id: '2024-06-04', title: '외래', subtitle: '검사결과 상담', badge: 'GE', pages: makeDoc('2024-06-04 상담', 1) },
{ id: '2024-03-07', title: '재진', subtitle: '내과', badge: 'PR', pages: makeDoc('2024-03-07 재진 소견', 1) }
];

function makeDoc(title, pages){
const arr = [];
for(let i=1;i<=pages;i++){
arr.push(      <div class="page">         <h1>${title}</h1>         <div class="small muted">Page ${i}</div>         <div class="page-grid">           <section>             <h2>주요소견</h2>             <ul>               <li>발열, 식욕저하, 복부 불편감</li>               <li>복용약: 항생제, 위보호제</li>               <li>알레르기: 특이사항 없음</li>             </ul>             <h2>검사</h2>             <ul>               <li>혈액: WBC 8.2, Hb 12.9, PLT 210</li>               <li>간기능: AST/ALT 경미 상승</li>               <li>영상: Abd CT pending</li>             </ul>           </section>           <section>             <h2>평가/계획</h2>             <ul>               <li>감염 의심 → 경험적 항생제 유지</li>               <li>수액 및 전해질 교정, 금주 교육</li>               <li>필요시 내시경/영상 추가</li>             </ul>             <h2>투약</h2>             <div class="kv">               <div>ABX</div><div>Ceftriaxone 2g q24h (D${i})</div>               <div>PPI</div><div>Pantoprazole 40mg qd</div>               <div>진통</div><div>Acetaminophen 500mg prn</div>             </div>           </section>         </div>         <footer>Page(${i})</footer>       </div>    );
}
return arr;
}

// 상태
let currentDoc = timelineData[1]; // 기본 선택
let pageIndex = 0;
let zoom = 1;

// 엘리먼트
const appEl = document.querySelector('.app');
const pagesWrap = document.getElementById('pagesWrap');
const pageInfo = document.getElementById('pageInfo');
const zoomInfo = document.getElementById('zoomInfo');

function renderTimeline(){
const ul = document.getElementById('timelineList');
ul.innerHTML = '';
for(const item of timelineData){
const li = document.createElement('li');
li.className = 'timeline-item' + (currentDoc.id===item.id?' active':'');
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
// 현재 페이지부터 두 개(2-pane) 그리기
const p1 = currentDoc.pages[pageIndex];
const p2 = currentDoc.pages[pageIndex+1];
const grid = document.createElement('div');
grid.className = 'pages';
if(p1) grid.innerHTML += p1;
if(p2) grid.innerHTML += p2;

pagesWrap.innerHTML = '';
pagesWrap.appendChild(grid);

// 확대 적용
pagesWrap.querySelectorAll('.page').forEach(p=>{
p.style.transform = scale(${zoom});
});

// 페이지 정보
const total = currentDoc.pages.length;
const shownRight = Math.min(pageIndex+2, total);
pageInfo.textContent = ${shownRight-1} - ${shownRight} / ${total};
updateNavButtons();
zoomInfo.textContent = ${Math.round(zoom*100)}%;
}

function updateNavButtons(){
document.getElementById('btnPrev').disabled = (pageIndex<=0);
document.getElementById('btnFirst').disabled = (pageIndex<=0);
const total = currentDoc.pages.length;
document.getElementById('btnNext').disabled = (pageIndex+2>=total);
document.getElementById('btnLast').disabled = (pageIndex+2>=total);
}

// 네비 버튼
document.getElementById('btnPrev').addEventListener('click', ()=>{
pageIndex = Math.max(0, pageIndex-2);
renderPages();
});
document.getElementById('btnNext').addEventListener('click', ()=>{
pageIndex = Math.min(currentDoc.pages.length-2, pageIndex+2);
renderPages();
});
document.getElementById('btnFirst').addEventListener('click', ()=>{
pageIndex = 0; renderPages();
});
document.getElementById('btnLast').addEventListener('click', ()=>{
pageIndex = Math.max(0, currentDoc.pages.length-2);
renderPages();
});

// 확대/축소
document.getElementById('btnZoomIn').addEventListener('click', ()=>{
zoom = Math.min(2.0, +(zoom+0.1).toFixed(2)); renderPages();
});
document.getElementById('btnZoomOut').addEventListener('click', ()=>{
zoom = Math.max(0.5, +(zoom-0.1).toFixed(2)); renderPages();
});

// 인쇄(현재 문서 전체)
document.getElementById('btnPrint').addEventListener('click', ()=>{
const w = window.open('', '_blank');
const docHtml =      <html><head><title>Print</title>       <style>         body{margin:0;font-family:system-ui,Arial}         .page{width:794px; min-height:1123px; margin:0 auto 16px; padding:24px; box-sizing:border-box}         .page{page-break-after:always; border:1px solid #ddd}       </style>     </head>     <body>${currentDoc.pages.join('')}</body></html>;
w.document.write(docHtml);
w.document.close();
w.focus();
w.print();
});

// 좌측 접기/펼치기
document.getElementById('collapseLeft').addEventListener('click', ()=>{
appEl.classList.add('collapsed-left');
});
document.getElementById('expandLeft').addEventListener('click', ()=>{
appEl.classList.remove('collapsed-left');
});

// 검색(데모)
document.getElementById('searchBtn').addEventListener('click', ()=>{
alert('데모: 검색 기능은 샘플입니다.');
});

// 초기 렌더
renderTimeline();
renderPages();
