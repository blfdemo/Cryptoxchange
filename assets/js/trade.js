/* Spot & Futures trading screens.
   Static demo: everything below only pretends to work (mock prices, balances, orders and positions). */
CX.trade=function(page){
if(page!=='spot'&&page!=='futures')return;
const $=CX.$,$$=CX.$$,F=CX.fmt,fut=page==='futures';
const authed=CX.authed();
const toLogin=()=>{sessionStorage.setItem('cx_next',page+'.html');location.href='login.html'};
const loginBtn='<a class="btn btn-primary w-100" href="login.html" data-gate>Log in or Sign up</a>';
const num=v=>+String(v==null?'':v).replace(/,/g,'')||0;
const f8=n=>(+n).toFixed(8);
const now=()=>{const d=new Date(),z=n=>String(n).padStart(2,'0');return `${z(d.getDate())}-${z(d.getMonth()+1)}-${d.getFullYear()} ${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}`};
let sym='BTC',tf='1H',candles=[],price=CX.coin(sym).p,tabO='Open Orders',tabP='Positions',mode='Limit';
const orders=[],hist=[],canc=[],positions=[],posHist=[],txns=[];
const vols={'15m':.004,'1H':.008,'4H':.014,'1D':.025,'1W':.05};
const dp=()=>price<1?4:(fut&&price>=1000?1:2);
const pairLbl=()=>fut?sym+'USDT':sym+'/USDT';
const gen=()=>{const v=vols[tf];let p=price*(1-v*6*(Math.random()-.4)),a=[];for(let i=0;i<90;i++){const o=p,c=o*(1+(Math.random()-.5)*v*2.2),h=Math.max(o,c)*(1+Math.random()*v*.6),l=Math.min(o,c)*(1-Math.random()*v*.6);a.push({o,h,l,c,v:Math.random()*100+20});p=c}const k=price/a[a.length-1].c;a.forEach(x=>{x.o*=k;x.h*=k;x.l*=k;x.c*=k});return a};
const ma=(n,i)=>i<n-1?null:candles.slice(i-n+1,i+1).reduce((t,x)=>t+x.c,0)/n;
const tabClick=(sel,cb)=>$(sel).addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.classList.contains('oe-ico'))return;$$('button',$(sel)).forEach(x=>{if(!x.classList.contains('oe-ico'))x.classList.toggle('active',x===b)});cb(b)});

/* ---------- chart (candles use the site-wide --up / --down colours) ---------- */
function draw(){const cv=$('#chart'),r=devicePixelRatio||1,w=cv.clientWidth,h=cv.clientHeight;cv.width=w*r;cv.height=h*r;const g=cv.getContext('2d');g.scale(r,r);
 const up=CX.css('--up'),dn=CX.css('--down'),mu=CX.css('--muted'),bd=CX.css('--border');const pw=62,ph=h*.78,n=candles.length,cw=(w-pw)/n;
 const mn=Math.min(...candles.map(x=>x.l)),mx=Math.max(...candles.map(x=>x.h)),Y=v=>8+(mx-v)/(mx-mn)*(ph-16);
 g.font='10px sans-serif';g.fillStyle=mu;g.strokeStyle=bd;g.lineWidth=1;
 for(let i=0;i<=5;i++){const v=mx-(mx-mn)*i/5,y=Y(v);g.beginPath();g.moveTo(0,y);g.lineTo(w-pw,y);g.stroke();g.fillText(F(v,dp()),w-pw+6,y+3)}
 const vm=Math.max(...candles.map(x=>x.v));
 candles.forEach((x,i)=>{const cx=i*cw+cw/2,col=x.c>=x.o?up:dn;g.strokeStyle=col;g.fillStyle=col;g.beginPath();g.moveTo(cx,Y(x.h));g.lineTo(cx,Y(x.l));g.stroke();const y1=Y(x.o),y2=Y(x.c);g.fillRect(cx-cw*.35,Math.min(y1,y2),cw*.7,Math.max(1,Math.abs(y2-y1)));g.globalAlpha=.35;const vh=x.v/vm*(h-ph-10);g.fillRect(cx-cw*.35,h-vh,cw*.7,vh);g.globalAlpha=1});
 [[7,'#f0b90b'],[25,'#a066ff']].forEach(([k,c])=>{g.beginPath();g.strokeStyle=c;g.lineWidth=1.3;let s=false;candles.forEach((x,i)=>{const m=ma(k,i);if(m==null)return;const px=i*cw+cw/2;s?g.lineTo(px,Y(m)):g.moveTo(px,Y(m));s=true});g.stroke()});
 const ly=Y(price),last=candles[n-1];g.setLineDash([4,3]);g.strokeStyle=last.c>=last.o?up:dn;g.lineWidth=1;g.beginPath();g.moveTo(0,ly);g.lineTo(w-pw,ly);g.stroke();g.setLineDash([]);g.fillStyle=g.strokeStyle;g.fillRect(w-pw,ly-9,pw,18);g.fillStyle='#fff';g.fillText(F(price,dp()),w-pw+6,ly+3);
 if(fut)positions.filter(p=>p.sym===sym).forEach(p=>{const y=Y(p.entry);if(y<0||y>ph)return;g.setLineDash([2,3]);g.strokeStyle=p.side==='Long'?up:dn;g.beginPath();g.moveTo(0,y);g.lineTo(w-pw,y);g.stroke();g.setLineDash([]);g.fillStyle=g.strokeStyle;g.fillText(p.side+' '+p.lev+'x',8,y-4)});
 g.fillStyle='#f0b90b';g.fillText('MA(7)',8,14);g.fillStyle='#a066ff';g.fillText('MA(25)',50,14)}

/* ---------- order book / trades / header ---------- */
function obRow(p,a,col,mx,cum){return`<div class="ob-row" data-p="${p}"><span style="color:${col}">${F(p,dp())}</span><span>${a.toFixed(fut?3:5)}</span><span>${fut?cum.toFixed(3):F(p*a,2)}</span><i class="ob-bar" style="width:${a/mx*100}%;background:${col}"></i></div>`}
function ob(){const st=price*.00018,up=CX.css('--up'),dn=CX.css('--down'),N=fut?9:14;const asks=[],bids=[];for(let i=1;i<=N;i++){asks.push([price+st*i*(1+Math.random()*.5),Math.random()*(fut?9:1.6)+.05]);bids.push([price-st*i*(1+Math.random()*.5),Math.random()*(fut?9:1.6)+.05])}
 let ca=0,cb=0;asks.forEach(x=>x[2]=ca+=x[1]);bids.forEach(x=>x[2]=cb+=x[1]);asks.reverse();const mx=Math.max(...asks.map(a=>a[1]),...bids.map(a=>a[1]));$('#obAsk').innerHTML=asks.map(a=>obRow(a[0],a[1],dn,mx,a[2])).join('');$('#obBid').innerHTML=bids.map(a=>obRow(a[0],a[1],up,mx,a[2])).join('');
 const l=candles[candles.length-1];$('#obMid').innerHTML=`<span class="${l.c>=l.o?'up':'down'}">${F(price,dp())}</span> <small class="text-muted">≈ $${F(price,dp())}</small>`}
const trades=[];function tr(){const u=Math.random()>.5;trades.unshift([price*(1+(Math.random()-.5)*.0008),Math.random()*(fut?3:1.2)+.01,new Date().toTimeString().slice(0,8),u]);if(trades.length>30)trades.pop();
 $('#mTrades').innerHTML=trades.map(t=>`<div class="pair-row"><span class="${t[3]?'up':'down'}">${F(t[0],dp())}</span><span class="text-end">${t[1].toFixed(5)}</span><span class="text-end text-muted">${t[2]}</span></div>`).join('')}
function head(){const c=CX.coin(sym);$('#lastPrice').textContent=F(price,dp());$('#lastPrice').className='fs-5 fw-bold '+(c.c>=0?'up':'down');$('#h24c').innerHTML=CX.chg(c.c);
 $('#h24h').textContent=F(price*1.018,dp());$('#h24l').textContent=F(price*.982,dp());$('#h24v').textContent=F(c.v/price/10,0)+(fut?'':' '+sym);
 if(fut)$('#mark').textContent=F(price*.9998,dp())}
function fillPrice(){if(fut){$('#fPrice').value=price.toFixed(dp());$('#fStop').value=''}else $$('.f-price').forEach(i=>{i.value=price.toFixed(dp())})}
function setSym(s){sym=s;price=CX.coin(s).p;const c=CX.coin(s);$('#pairIcon').src=CX.coinSrc(s);$('#pairIcon').onerror=function(){this.onerror=null;this.src='assets/img/coins/'+s+'.png'};$('#pairName').textContent=pairLbl();
 if(!fut)$('#pairFull').textContent=c.n+' price';$$('.u-sym').forEach(x=>x.textContent=s);
 candles=gen();head();ob();draw();fillPrice();(fut?futRefresh:spotRefresh)()}
$('#tfBtns').onclick=e=>{const b=e.target.closest('button');if(!b)return;tf=b.dataset.tf;$$('#tfBtns button').forEach(x=>x.className='btn btn-sm '+(x===b?'btn-soft':'btn-outline-secondary'));candles=gen();draw()};
document.addEventListener('click',e=>{const r=e.target.closest('.ob-row[data-p]');if(r){const p=(+r.dataset.p).toFixed(dp());if(fut)$('#fPrice').value=p;else $$('.f-price').forEach(i=>{if(!i.readOnly)i.value=p});(fut?futCalc:spotRecalc)()}});

/* ---------- tables ---------- */
const sideCls=s=>/Buy|Long/.test(s)?'up':'down';
const oCols=()=>[{h:'Date',f:r=>r.date},{h:'Pair',k:'pair'},{h:'Type',k:'type'},{h:'Side',f:r=>`<b class="${sideCls(r.side)}">${r.side}</b>`},{h:'Price',cls:'text-end',f:r=>F(r.price,r.price<1?4:2)},{h:'Amount',cls:'text-end',f:r=>(+r.amount).toFixed(fut?3:5)},{h:'Total',cls:'text-end',f:r=>F(r.price*r.amount)},{h:'Action',cls:'text-end',f:(r,i)=>r.st==='Open'?`<button class="btn btn-sm btn-outline-danger" data-i="${i}">Cancel</button>`:CX.badge(r.st)}];
const noData='<i class="bi bi-inbox fs-1 d-block"></i>No Data Found';
const bal={USDT:authed?12480.5:0};if(authed)CX.assets.forEach(a=>{if(a.s!=='USDT')bal[a.s]=a.bal});
function renderOrd(){
 if(fut){
  const t=tabP,tgt='#posTable';
  if(t==='Positions')CX.table(tgt,[{h:'Symbol',f:r=>`<b>${r.sym}USDT</b> <span class="${r.side==='Long'?'up':'down'} fw-semibold">${r.side}</span><div class="text-muted" style="font-size:.7rem">${r.mm} ${r.lev}x</div>`},{h:'Size',f:r=>r.sc.toFixed(3)+' '+r.sym},{h:'Entry Price',cls:'text-end',f:r=>F(r.entry,dp())},{h:'Mark Price',cls:'text-end',f:()=>F(price,dp())},{h:'Liq. Price',cls:'text-end',f:r=>F(r.liq,dp())},{h:'Margin',cls:'text-end',f:r=>F(r.margin)+' USDT'},{h:'PNL (ROI%)',cls:'text-end',f:r=>{const p=(price-r.entry)*r.sc*(r.side==='Long'?1:-1),roi=p/r.margin*100;return`<span class="${p>=0?'up':'down'}">${p>=0?'+':''}${F(p)} (${roi>=0?'+':''}${roi.toFixed(2)}%)</span>`}},{h:'TP/SL',cls:'text-end',f:r=>(r.tp?F(r.tp,dp()):'--')+' / '+(r.sl?F(r.sl,dp()):'--')},{h:'Close',cls:'text-end',f:(r,i)=>`<button class="btn btn-sm btn-outline-danger" data-pi="${i}">Market</button>`}],positions,noData);
  else if(t==='Open Orders')CX.table(tgt,[{h:'Date',f:r=>r.date},{h:'Symbol',k:'pair'},{h:'Type',k:'type'},{h:'Side',f:r=>`<b class="${sideCls(r.side)}">${r.side}</b>`},{h:'Price',cls:'text-end',f:r=>r.type==='Stop Market'?'Market':F(r.price,dp())},{h:'Qty',cls:'text-end',f:r=>(+r.amount).toFixed(3)},{h:'Trigger',cls:'text-end',f:r=>r.trig?F(r.trig,dp()):'--'},{h:'Reduce-Only',f:r=>r.ro?'Yes':'No'},{h:'Action',cls:'text-end',f:(r,i)=>`<button class="btn btn-sm btn-outline-danger" data-i="${i}">Cancel</button>`}],orders.filter(o=>o.st==='Open'),noData);
  else if(t==='Order History')CX.table(tgt,oCols(),[...canc,...hist],noData);
  else if(t==='Trade History')CX.table(tgt,[{h:'Date',f:r=>r.date},{h:'Symbol',k:'pair'},{h:'Side',f:r=>`<b class="${sideCls(r.side)}">${r.side}</b>`},{h:'Exec Price',cls:'text-end',f:r=>F(r.price,r.price<1?4:2)},{h:'Qty',cls:'text-end',f:r=>(+r.amount).toFixed(3)},{h:'Fee',cls:'text-end',f:r=>F(r.price*r.amount*.00055,4)+' USDT'}],hist,noData);
  else if(t==='Transaction History')CX.table(tgt,[{h:'Date',f:r=>r.date},{h:'Type',k:'type'},{h:'Symbol',k:'pair'},{h:'Change',cls:'text-end',f:r=>`<span class="${r.chg>=0?'up':'down'}">${r.chg>=0?'+':''}${F(r.chg)} USDT</span>`}],txns,noData);
  else CX.table(tgt,[{h:'Closed',f:r=>r.date},{h:'Symbol',f:r=>`<b>${r.sym}USDT</b> <span class="${r.side==='Long'?'up':'down'}">${r.side}</span>`},{h:'Qty',cls:'text-end',f:r=>r.sc.toFixed(3)},{h:'Entry',cls:'text-end',f:r=>F(r.entry,dp())},{h:'Exit',cls:'text-end',f:r=>F(r.exit,dp())},{h:'Closed PNL',cls:'text-end',f:r=>`<span class="${r.pnl>=0?'up':'down'}">${r.pnl>=0?'+':''}${F(r.pnl)}</span>`}],posHist,noData);
  return}
 const t=tabO,tgt='#ordTable';
 if(t==='Open Orders')CX.table(tgt,oCols(),orders.filter(o=>o.st==='Open'),noData);
 else if(t==='Order History')CX.table(tgt,oCols(),[...canc,...hist],noData);
 else if(t==='Trade History')CX.table(tgt,[{h:'Date',f:r=>r.date},{h:'Pair',k:'pair'},{h:'Side',f:r=>`<b class="${sideCls(r.side)}">${r.side}</b>`},{h:'Price',cls:'text-end',f:r=>F(r.price,r.price<1?4:2)},{h:'Amount',cls:'text-end',f:r=>(+r.amount).toFixed(5)},{h:'Fee',cls:'text-end',f:r=>F(r.price*r.amount*.001,4)+' USDT'},{h:'Total',cls:'text-end',f:r=>F(r.price*r.amount)}],hist,noData);
 else CX.table(tgt,[{h:'Coin',f:r=>`<span class="d-inline-flex align-items-center gap-2">${CX.chip(r.s,22)}<b>${r.s}</b></span>`},{h:'Total',cls:'text-end',f:r=>f8(r.v)},{h:'Available',cls:'text-end',f:r=>f8(r.v)},{h:'In Order',cls:'text-end',f:()=>f8(0)},{h:'USD Value',cls:'text-end',f:r=>'$'+F(r.v*CX.coin(r.s).p)}],Object.keys(bal).filter(k=>bal[k]>0).map(k=>({s:k,v:bal[k]})),noData)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-i]');if(b&&b.closest('#ordTable,#posTable')){const o=orders.filter(x=>x.st==='Open')[+b.dataset.i];if(o){o.st='Cancelled';if(fut&&o.margin){avail+=o.margin;saveF();futCalc()}canc.unshift(o);renderOrd();CX.toast('Order cancelled')}}
 const c=e.target.closest('[data-pi]');if(c)closePos(+c.dataset.pi)});

/* ======================= SPOT ======================= */
let spotRecalc=()=>{},spotRefresh=()=>{};
if(!fut){
 const dsl=`<div class="dsl spot"><div class="dsl-in"><span class="dsl-line"></span><span class="dsl-fill"></span><i style="left:0"></i><i style="left:25%"></i><i style="left:50%"></i><i style="left:75%"></i><i style="left:100%"></i><input type="range" class="f-rng" min="0" max="100" step="1" value="0" aria-label="Order size percentage"></div></div><div class="dsl-lab"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>`;
 const form=side=>`<div class="col-md-6"><form class="spotForm" data-side="${side}" novalidate>
<div class="sf priceRow"><label>Price</label><input class="f-price" inputmode="decimal" autocomplete="off"><span class="u">USDT</span></div>
<div class="sf stopRow d-none"><label>Stop<br>Limit</label><input class="f-stop" inputmode="decimal" placeholder="0.00" autocomplete="off"><span class="u">USDT</span></div>
<div class="sf"><label>Amount</label><input class="f-amt" inputmode="decimal" placeholder="0.00" autocomplete="off"><span class="u u-sym">BTC</span></div>
${dsl}<div class="sf"><label>Total</label><input class="f-tot" inputmode="decimal" placeholder="0.00" autocomplete="off"><span class="u" style="min-width:0"></span></div>
<div class="sp-info"><span>Avbl</span><b class="f-avl"></b></div><div class="sp-info mb-2"><span>${side==='Buy'?'Max Buy':'Max Sell'}</span><b class="f-max"></b></div>
${authed?`<button class="btn ${side==='Buy'?'btn-up':'btn-down'} w-100">${side}</button>`:loginBtn}</form></div>`;
 $('#spotForms').innerHTML=form('Buy')+form('Sell');
 const ad=()=>price<1?2:price<100?4:6;
 $$('.spotForm').forEach(f=>{
  const side=f.dataset.side,q=s=>f.querySelector(s),P=q('.f-price'),A=q('.f-amt'),T=q('.f-tot'),R=q('.f-rng'),S=q('.f-stop'),fill=q('.dsl-fill');
  const pr=()=>mode==='Market'?price:(num(P.value)||0);
  const have=()=>side==='Buy'?bal.USDT:(bal[sym]||0);
  const setRng=p=>{R.value=p;fill.style.width=p+'%'};
  const info=()=>{const p=pr()||price;q('.f-avl').textContent=f8(have())+' '+(side==='Buy'?'USDT':sym);q('.f-max').textContent=side==='Buy'?f8(bal.USDT/p)+' '+sym:f8((bal[sym]||0)*p)+' USDT'};
  const fromAmt=()=>{const a=num(A.value),p=pr();T.value=a?(a*p).toFixed(2):'';const h=have(),used=side==='Buy'?a*p:a;setRng(h?Math.min(100,used/h*100):0);info()};
  const fromTot=()=>{const t=num(T.value),p=pr();A.value=t&&p?(t/p).toFixed(ad()):'';const h=have(),used=side==='Buy'?t:(t&&p?t/p:0);setRng(h?Math.min(100,used/h*100):0);info()};
  const fromRng=()=>{const pc=+R.value,h=have(),p=pr();if(side==='Buy'){const t=h*pc/100;T.value=pc?t.toFixed(2):'';A.value=pc&&p?(t/p).toFixed(ad()):''}else{const a=h*pc/100;A.value=pc?a.toFixed(ad()):'';T.value=pc?(a*p).toFixed(2):''}fill.style.width=pc+'%';info()};
  P.oninput=fromAmt;A.oninput=fromAmt;T.oninput=fromTot;R.oninput=fromRng;
  f.recalc=()=>{if(mode==='Market')P.value=price.toFixed(dp());if(+R.value>0&&mode==='Market')fromRng();else if(num(A.value))fromAmt();else info()};
  f.onsubmit=e=>{e.preventDefault();if(!authed){toLogin();return}const a=num(A.value),p=pr();
   if(!a){CX.toast('Please enter an amount');return}
   if(mode==='Stop-limit'&&!num(S.value)){CX.toast('Please enter the stop limit price');return}
   if((side==='Buy'&&a*p>bal.USDT+1e-9)||(side==='Sell'&&a>(bal[sym]||0)+1e-9)){CX.toast('Insufficient balance');return}
   const o={date:now(),pair:pairLbl(),price:p,side,type:mode,amount:a,st:mode==='Market'?'Filled':'Open'};
   if(mode==='Market'){if(side==='Buy'){bal.USDT-=a*p;bal[sym]=(bal[sym]||0)+a}else{bal[sym]-=a;bal.USDT+=a*p}hist.unshift(o);tabO='Order History'}
   else{orders.unshift(o);tabO='Open Orders'}
   $$('#ordTabs button').forEach(b=>b.classList.toggle('active',b.dataset.t===tabO));renderOrd();
   A.value='';T.value='';S.value='';setRng(0);spotRecalc();CX.toast(mode==='Market'?`${side} ${a.toFixed(ad())} ${sym} filled at ${F(p,dp())}`:`${side} ${mode.toLowerCase()} order placed`)};
 });
 spotRecalc=()=>$$('.spotForm').forEach(f=>f.recalc());
 spotRefresh=()=>{$$('.spotForm').forEach(f=>{f.querySelector('.f-amt').value='';f.querySelector('.f-tot').value='';f.querySelector('.f-rng').value=0;f.querySelector('.dsl-fill').style.width='0'});spotRecalc()};
 tabClick('#spotTabs',b=>{mode=b.dataset.t;$$('.f-price').forEach(i=>{i.readOnly=mode==='Market';i.parentElement.classList.toggle('ro',mode==='Market');i.value=price.toFixed(dp())});$$('.stopRow').forEach(r=>r.classList.toggle('d-none',mode!=='Stop-limit'));spotRefresh()});
 const pl=()=>{const s=$('#pairSearch').value.toLowerCase();$('#pairList').innerHTML=CX.coins.filter(c=>c.s!=='USDT'&&c.s.toLowerCase().includes(s)).map(c=>`<div class="pair-row" data-s="${c.s}"><b>${c.s}<span class="text-muted fw-normal">/USDT</span></b><span class="text-end">${F(c.p)}</span><span class="text-end">${CX.chg(c.c)}</span></div>`).join('')};pl();$('#pairSearch').oninput=pl;
 $('#pairList').onclick=e=>{const r=e.target.closest('[data-s]');if(r)setSym(r.dataset.s)};
 $('#movers').innerHTML=[['PHB/BTC','-6.84%','New 24h Low','down'],['CVX/USDT','-4.46%','New 24h High','down'],['AVAX/USDT','+3.12%','New 7d High','up'],['SOL/USDT','+3.18%','New 24h High','up']].map(m=>`<div class="d-flex justify-content-between py-1 border-bottom"><div><b>${m[0]}</b><div class="text-muted" style="font-size:.7rem">12:51:02</div></div><div class="text-end"><span class="${m[3]}">${m[1]}</span><div class="text-muted" style="font-size:.7rem">${m[2]}</div></div></div>`).join('');
 tabClick('#mtTabs',()=>{});tabClick('#ordTabs',b=>{tabO=b.dataset.t;renderOrd()});
 if(authed){hist.push({date:'29-10-2026 09:10:12',pair:'BTC/USDT',price:66120,side:'Buy',type:'Market',amount:.05,st:'Filled'},{date:'28-10-2026 18:44:01',pair:'ETH/USDT',price:2461,side:'Sell',type:'Limit',amount:.8,st:'Filled'});
 canc.push({date:'27-10-2026 11:02:33',pair:'SOL/USDT',price:140,side:'Buy',type:'Limit',amount:10,st:'Cancelled'});
 orders.push({date:'30-10-2026 09:26:44',pair:'BNB/USDT',price:601,side:'Buy',type:'Limit',amount:.3115,st:'Open'},{date:'30-10-2026 09:24:44',pair:'LINK/USDT',price:19.2,side:'Sell',type:'Limit',amount:12.5,st:'Open'});}
}

/* ======================= FUTURES ======================= */
let avail=0,quiz=false,fund=25000,futCalc=()=>{},futRefresh=()=>{},saveF=()=>{},closePos=()=>{};
if(fut){
 if(authed)try{const s=JSON.parse(localStorage.getItem('cx_fut')||'{}');quiz=!!s.quiz;avail=+s.avail||0}catch(e){}
 saveF=()=>{if(authed)try{localStorage.setItem('cx_fut',JSON.stringify({quiz,avail}))}catch(e){}};
 let lev=20,mMode='Isolated',pMode='S',unit='BTC',cond='Limit',tif='GTC',trig='Last';
 const dd=(id,items,cur)=>`<div class="dropdown"><button type="button" class="ud" data-bs-toggle="dropdown" aria-expanded="false"><span id="${id}L">${cur}</span><i class="bi bi-caret-down-fill"></i></button><ul class="dropdown-menu dropdown-menu-end" id="${id}M">${items.map(v=>`<li><a class="dropdown-item" href="#" data-v="${v}">${v}</a></li>`).join('')}</ul></div>`;
 const bindDd=(id,cb)=>$('#'+id+'M').addEventListener('click',e=>{const a=e.target.closest('[data-v]');if(!a)return;e.preventDefault();$('#'+id+'L').textContent=a.dataset.v;cb(a.dataset.v)});
 $('#futOE').innerHTML=`<div class="chip-row"><button type="button" class="fchip" id="chMargin">Isolated</button><button type="button" class="fchip" id="chLev">20x</button><button type="button" class="fchip" id="chMode" title="Position mode">S</button>
<div class="dropdown ms-auto"><button type="button" class="oe-ico" data-bs-toggle="dropdown" aria-label="More"><i class="bi bi-three-dots"></i></button><ul class="dropdown-menu dropdown-menu-end"><li><a class="dropdown-item" href="#" data-m="pos">Position mode</a></li><li><a class="dropdown-item" href="#" data-m="set">Trade settings</a></li><li><a class="dropdown-item" href="#" data-m="fee">Fee rates</a></li></ul></div></div>
<div class="oe-tabs fut" id="futTabs"><button type="button" class="active" data-t="Limit">Limit</button><button type="button" data-t="Market">Market</button><button type="button" data-t="Conditional">Conditional</button><button type="button" class="oe-ico" id="oeInfo" aria-label="Order types"><i class="bi bi-info-circle"></i></button></div>
<div class="avl-row"><span>Avbl <b id="fAvl">0.00 USDT</b> <button type="button" class="ico-y" id="fTransfer" title="Transfer"><i class="bi bi-arrow-left-right"></i></button></span><button type="button" class="oe-ico" id="fCalc" title="Calculator"><i class="bi bi-calculator"></i></button></div>
<form id="futForm" novalidate>
<div id="rowStop" class="d-none"><div class="flab">Stop Price</div><div class="fbox"><input id="fStop" inputmode="decimal" autocomplete="off">${dd('trg',['Last','Mark','Index'],'Last')}</div></div>
<div id="rowPrice"><div class="flab">Price</div><div class="frow"><div class="fbox flex-grow-1"><input id="fPrice" inputmode="decimal" autocomplete="off"><span class="u">USDT</span></div><button type="button" class="fsel" id="fBBO">BBO</button><div class="fsel d-none" id="fCond">${dd('cnd',['Limit','Market'],'Limit')}</div></div></div>
<div class="flab">Size</div><div class="fbox"><input id="fSize" inputmode="decimal" autocomplete="off"><div class="dropdown"><button type="button" class="ud" data-bs-toggle="dropdown" aria-expanded="false"><span id="unitL"><span class="u-sym">BTC</span></span><i class="bi bi-caret-down-fill"></i></button><ul class="dropdown-menu dropdown-menu-end" id="unitM"><li><a class="dropdown-item" href="#" data-v="coin"><span class="u-sym">BTC</span></a></li><li><a class="dropdown-item" href="#" data-v="USDT">USDT</a></li></ul></div></div>
<div class="dsl"><div class="dsl-in"><span class="dsl-line"></span><span class="dsl-fill" id="fFill"></span><i style="left:0"></i><i style="left:25%"></i><i style="left:50%"></i><i style="left:75%"></i><i style="left:100%"></i><input type="range" id="fRng" min="0" max="100" step="1" value="0" aria-label="Order size percentage"></div></div>
<div id="rowSlip" class="d-none"><div class="form-check"><input type="checkbox" class="form-check-input" id="slip"><label class="form-check-label" for="slip">Slippage Tolerance</label></div><div class="fbox sm d-none mt-2" id="slipBox"><input id="slipV" value="0.50" inputmode="decimal"><span class="u">%</span></div></div>
<div class="form-check"><input type="checkbox" class="form-check-input" id="tpsl"><label class="form-check-label" for="tpsl">TP/SL</label></div>
<div id="tpslBox" class="d-none"><div class="flab">Take Profit</div><div class="fbox sm"><input id="fTP" inputmode="decimal" placeholder="TP trigger price" autocomplete="off"><span class="u">USDT</span></div><div class="flab">Stop Loss</div><div class="fbox sm"><input id="fSL" inputmode="decimal" placeholder="SL trigger price" autocomplete="off"><span class="u">USDT</span></div></div>
<div class="d-flex justify-content-between align-items-center"><div class="form-check"><input type="checkbox" class="form-check-input" id="ro"><label class="form-check-label" for="ro">Reduce-Only</label></div><div id="tifWrap" class="d-flex align-items-center gap-2 mt-2"><span class="text-muted">TIF</span>${dd('tif',['GTC','IOC','FOK','PostOnly'],'GTC')}</div></div>
<div class="row g-2 mt-2">${authed?`<div class="col-6"><button class="btn btn-up w-100" data-side="Long">Buy/Long</button></div><div class="col-6"><button class="btn btn-down w-100" data-side="Short">Sell/Short</button></div>`:`<div class="col-12">${loginBtn}</div>`}</div></form>
<div class="oe-info"><div><span>Liq Price</span><b id="liqL">-- USDT</b></div><div><span>Liq Price</span><b id="liqS">-- USDT</b></div><div><span>Cost</span><b id="costL">0.00 USDT</b></div><div><span>Cost</span><b id="costS">0.00 USDT</b></div><div><span>Max</span><b id="maxL">0.000 BTC</b></div><div><span>Max</span><b id="maxS">0.000 BTC</b></div></div>
<button type="button" class="lnk" id="feeBtn"><i class="bi bi-percent"></i>Fee level</button>
<button type="button" class="quiz-bar" id="quizBar"><i class="bi bi-pencil-square"></i>Finish Quiz to Get Started</button>`;
 /* --- helpers --- */
 const ent=()=>mode==='Market'?price:(mode==='Conditional'&&cond==='Market'?(num($('#fStop').value)||price):(num($('#fPrice').value)||price));
 const sizeCoin=()=>{const v=num($('#fSize').value);return unit==='USDT'?v/(ent()||1):v};
 const maxCoin=()=>avail*lev/(ent()||1);
 const liq=side=>{const p=ent(),m=.005;return side==='Long'?Math.max(0,p*(1-1/lev+m)):p*(1+1/lev-m)};
 const showSize=c=>unit==='USDT'?(c*ent()).toFixed(2):c.toFixed(3);
 const unitHtml=()=>unit==='USDT'?'USDT':`<span class="u-sym">${sym}</span>`;
 futCalc=()=>{const p=ent(),sc=sizeCoin(),cost=sc*p/lev,mx=maxCoin();
  $('#fAvl').textContent=F(avail,2)+' USDT';
  $('#liqL').textContent=sc?F(liq('Long'),dp())+' USDT':'-- USDT';$('#liqS').textContent=sc?F(liq('Short'),dp())+' USDT':'-- USDT';
  $('#costL').textContent=$('#costS').textContent=F(cost,2)+' USDT';
  $('#maxL').textContent=$('#maxS').textContent=unit==='USDT'?F(mx*p,2)+' USDT':mx.toFixed(3)+' '+sym;
  const pc=mx?Math.min(100,sc/mx*100):0;$('#fRng').value=pc;$('#fFill').style.width=pc+'%';
  $('#quizBar').classList.toggle('d-none',quiz||!authed)};
 futRefresh=()=>{$('#fSize').value='';$('#unitL').innerHTML=unitHtml();futCalc()};
 $('#fSize').oninput=futCalc;$('#fPrice').oninput=futCalc;$('#fStop').oninput=futCalc;
 $('#fRng').oninput=()=>{const v=$('#fRng').value;$('#fSize').value=+v?showSize(maxCoin()*v/100):'';futCalc();$('#fRng').value=v;$('#fFill').style.width=v+'%'};
 $('#unitM').addEventListener('click',e=>{const a=e.target.closest('[data-v]');if(!a)return;e.preventDefault();const old=unit;unit=a.dataset.v==='USDT'?'USDT':sym;$('#unitL').innerHTML=unitHtml();
  if(old!==unit&&num($('#fSize').value)){const c=old==='USDT'?num($('#fSize').value)/ent():num($('#fSize').value);$('#fSize').value=showSize(c)}futCalc()});
 bindDd('trg',v=>{trig=v});bindDd('tif',v=>{tif=v});
 bindDd('cnd',v=>{cond=v;$('#fPrice').disabled=v==='Market';$('#fPrice').placeholder=v==='Market'?'Market':'';$('#fPrice').value=v==='Market'?'':price.toFixed(dp());futCalc()});
 $('#fBBO').onclick=()=>{$('#fBBO').classList.toggle('on');$('#fPrice').value=(price*(1-.00018)).toFixed(dp());futCalc()};
 $('#slip').onchange=e=>$('#slipBox').classList.toggle('d-none',!e.target.checked);
 $('#tpsl').onchange=e=>$('#tpslBox').classList.toggle('d-none',!e.target.checked);
 tabClick('#futTabs',b=>{mode=b.dataset.t;
  $('#rowStop').classList.toggle('d-none',mode!=='Conditional');$('#rowPrice').classList.toggle('d-none',mode==='Market');
  $('#fBBO').classList.toggle('d-none',mode!=='Limit');$('#fCond').classList.toggle('d-none',mode!=='Conditional');
  $('#rowSlip').classList.toggle('d-none',mode!=='Market');$('#tifWrap').classList.toggle('d-none',mode==='Market');
  $('#fPrice').disabled=mode==='Conditional'&&cond==='Market';futCalc()});
 /* --- pair dropdown --- */
 const fpl=()=>{const s=$('#fpSearch').value.toLowerCase();$('#fpList').innerHTML=CX.coins.filter(c=>c.s!=='USDT'&&c.s.toLowerCase().includes(s)).map(c=>`<div class="pair-row" data-s="${c.s}"><b>${c.s}USDT</b><span class="text-end">${F(c.p)}</span><span class="text-end">${CX.chg(c.c)}</span></div>`).join('')};fpl();$('#fpSearch').oninput=fpl;
 $('#fpList').onclick=e=>{const r=e.target.closest('[data-s]');if(!r)return;setSym(r.dataset.s);try{bootstrap.Dropdown.getOrCreateInstance($('#pairBtn')).hide()}catch(x){}};
 /* --- modals (all pretend) --- */
 const checked=n=>{const x=document.querySelector(`#cxModal input[name=${n}]:checked`);return x&&x.value};
 const opt=(n,v,t,d,on)=>`<label class="opt d-block mb-2"><div class="form-check mb-0"><input class="form-check-input" type="radio" name="${n}" value="${v}" ${on?'checked':''}><span class="fw-semibold">${t}</span></div><div class="small text-muted ms-4">${d}</div></label>`;
 $('#chMargin').onclick=()=>CX.modal('Margin mode',opt('mm','Cross','Cross','All cross positions share the same margin balance. If liquidated, you may lose all of it.',mMode==='Cross')+opt('mm','Isolated','Isolated','Margin is assigned to each position separately, limiting the loss to that position.',mMode==='Isolated'),'Confirm',()=>{mMode=checked('mm')||mMode;$('#chMargin').textContent=mMode;CX.toast('Margin mode switched to '+mMode)});
 $('#chMode').onclick=()=>CX.modal('Position mode',opt('pm','S','One-Way mode','Hold a single position per contract. Long and short orders net against each other.',pMode==='S')+opt('pm','H','Hedge mode','Hold long and short positions on the same contract at the same time.',pMode==='H'),'Confirm',()=>{pMode=checked('pm')||pMode;$('#chMode').textContent=pMode;CX.toast((pMode==='S'?'One-Way':'Hedge')+' mode enabled')});
 $('#chLev').onclick=()=>{CX.modal('Adjust leverage',`<div class="d-flex align-items-center justify-content-center gap-2 mb-3"><button type="button" class="btn btn-soft" id="lvM">−</button><input id="lvV" class="form-control text-center fw-bold" style="max-width:110px" value="${lev}" inputmode="numeric"><span class="fw-bold">x</span><button type="button" class="btn btn-soft" id="lvP">+</button></div>
<div class="dsl"><div class="dsl-in"><span class="dsl-line"></span><span class="dsl-fill" id="lvFill"></span><i style="left:0"></i><i style="left:25%"></i><i style="left:50%"></i><i style="left:75%"></i><i style="left:100%"></i><input type="range" id="lvR" min="1" max="50" value="${lev}"></div></div>
<div class="d-flex justify-content-between small text-muted mb-3"><span>1x</span><span>10x</span><span>25x</span><span>50x</span></div><div class="d-flex gap-2 flex-wrap mb-3">${[5,10,20,25,50].map(v=>`<button type="button" class="btn btn-soft btn-sm" data-lv="${v}">${v}x</button>`).join('')}</div>
<div class="small text-muted">Higher leverage lowers the margin you need but brings your liquidation price closer to the entry price.</div>`,'Confirm',()=>{lev=Math.min(50,Math.max(1,parseInt($('#lvV').value)||lev));$('#chLev').textContent=lev+'x';futCalc();CX.toast('Leverage set to '+lev+'x')});
  const set=v=>{v=Math.min(50,Math.max(1,parseInt(v)||1));$('#lvV').value=v;$('#lvR').value=v;$('#lvFill').style.width=(v-1)/49*100+'%'};set(lev);
  $('#lvR').oninput=e=>set(e.target.value);$('#lvV').oninput=e=>{if(e.target.value)set(e.target.value)};$('#lvM').onclick=()=>set(+$('#lvV').value-1);$('#lvP').onclick=()=>set(+$('#lvV').value+1);$$('[data-lv]',$('#cxModal')).forEach(b=>b.onclick=()=>set(b.dataset.lv))};
 $('#fTransfer').onclick=()=>{if(!authed){toLogin();return}CX.modal('Transfer',`<div class="mb-3"><label class="form-label">From</label><input class="form-control" value="Funding account" readonly></div><div class="mb-3"><label class="form-label">To</label><input class="form-control" value="Derivatives account" readonly></div><div class="mb-1"><label class="form-label">Amount (USDT)</label><div class="input-group"><input id="trAmt" class="form-control" inputmode="decimal" placeholder="0.00"><button type="button" class="btn btn-soft" id="trMax">Max</button></div></div><div class="small text-muted">Funding balance: <b>${F(fund)}</b> USDT</div>`,'Confirm',()=>{const a=Math.min(num($('#trAmt').value),fund);if(!a){CX.toast('Enter an amount to transfer');return}fund-=a;avail+=a;txns.unshift({date:now(),type:'Transfer In',pair:'USDT',chg:a});saveF();futCalc();renderOrd();CX.toast(F(a)+' USDT transferred to derivatives')});$('#trMax').onclick=()=>$('#trAmt').value=fund.toFixed(2)};
 $('#fCalc').onclick=()=>{CX.modal('Profit calculator',`<div class="seg w-100 mb-3" id="cSide"><button type="button" class="buy active w-50">Long</button><button type="button" class="sell w-50">Short</button></div><div class="row g-2"><div class="col-6"><label class="form-label small">Entry price</label><input class="form-control" id="cEn" value="${price.toFixed(dp())}"></div><div class="col-6"><label class="form-label small">Exit price</label><input class="form-control" id="cEx" value="${(price*1.03).toFixed(dp())}"></div><div class="col-6"><label class="form-label small">Quantity (${sym})</label><input class="form-control" id="cQ" value="0.1"></div><div class="col-6"><label class="form-label small">Leverage</label><input class="form-control" id="cLv" value="${lev}"></div></div><div class="quote-box mt-3"><div class="d-flex justify-content-between"><span class="text-muted">Initial margin</span><b id="cM">-</b></div><div class="d-flex justify-content-between"><span class="text-muted">PNL</span><b id="cP">-</b></div><div class="d-flex justify-content-between"><span class="text-muted">ROI</span><b id="cR">-</b></div></div>`);
  let sd='Long';const run=()=>{const en=num($('#cEn').value),ex=num($('#cEx').value),q=num($('#cQ').value),l=num($('#cLv').value)||1,m=en*q/l,p=(ex-en)*q*(sd==='Long'?1:-1);$('#cM').textContent=F(m)+' USDT';$('#cP').innerHTML=`<span class="${p>=0?'up':'down'}">${p>=0?'+':''}${F(p)} USDT</span>`;$('#cR').innerHTML=`<span class="${p>=0?'up':'down'}">${m?(p/m*100).toFixed(2):'0.00'}%</span>`};
  ['#cEn','#cEx','#cQ','#cLv'].forEach(s=>$(s).oninput=run);tabClick('#cSide',b=>{sd=b.textContent;run()});run()};
 $('#oeInfo').onclick=()=>CX.modal('Order types','<p class="mb-2"><b>Limit</b> – buy or sell at your chosen price or better. It rests in the order book until filled.</p><p class="mb-2"><b>Market</b> – fills immediately at the best available prices. Slippage tolerance caps how far the fill price may move.</p><p class="mb-2"><b>Conditional</b> – becomes a limit or market order once the stop price is reached (Last, Mark or Index price).</p><p class="mb-0 small text-muted">TIF: GTC stays until cancelled · IOC fills what it can, cancels the rest · FOK fills fully or not at all · PostOnly always adds liquidity.</p>');
 const feeModal=()=>CX.modal('Fee level','<div class="d-flex justify-content-between mb-3"><span class="text-muted">Your level</span><b>Regular user</b></div><table class="table table-sm mb-2"><thead><tr><th>Level</th><th class="text-end">Taker</th><th class="text-end">Maker</th></tr></thead><tbody><tr><td>Regular</td><td class="text-end">0.0550%</td><td class="text-end">0.0200%</td></tr><tr><td>VIP 1</td><td class="text-end">0.0400%</td><td class="text-end">0.0150%</td></tr><tr><td>VIP 2</td><td class="text-end">0.0350%</td><td class="text-end">0.0100%</td></tr></tbody></table><div class="small text-muted">Stake CXT to move up a tier and lower your trading fees.</div>');
 $('#feeBtn').onclick=feeModal;
 $('#futOE').addEventListener('click',e=>{const m=e.target.closest('[data-m]');if(!m)return;e.preventDefault();if(m.dataset.m==='pos')$('#chMode').click();else if(m.dataset.m==='fee')feeModal();else CX.modal('Trade settings','<div class="form-check form-switch mb-3"><input class="form-check-input" type="checkbox" checked><label class="form-check-label">Order confirmation</label></div><div class="form-check form-switch mb-3"><input class="form-check-input" type="checkbox" checked><label class="form-check-label">Show position lines on chart</label></div><div class="form-check form-switch"><input class="form-check-input" type="checkbox"><label class="form-check-label">Close all positions on liquidation warning</label></div>','Save',()=>CX.toast('Trade settings saved'))});
 const quizModal=()=>CX.modal('Futures knowledge quiz',[['With 20x leverage, a 5% move against your position can lead to:',['Liquidation of your margin','A small fee','Nothing']],['Isolated margin limits your possible loss to:',['The margin assigned to that position','Your whole account','Nothing']],['A reduce-only order can:',['Only reduce or close a position','Open a new position','Increase leverage']]].map((q,i)=>`<p class="mb-1 mt-2"><b>Q${i+1}.</b> ${q[0]}</p>`+q[1].map((a,k)=>`<div class="form-check"><input class="form-check-input" type="radio" name="q${i}" ${k===0?'checked':''}><label class="form-check-label">${a}</label></div>`).join('')).join(''),'Submit',()=>{quiz=true;if(!avail)avail=12480.5;saveF();futCalc();CX.toast('Quiz completed – futures trading unlocked')});
 $('#quizBar').onclick=quizModal;
 /* --- place orders / positions --- */
 closePos=i=>{const p=positions[i];if(!p)return;const pnl=(price-p.entry)*p.sc*(p.side==='Long'?1:-1);avail+=p.margin+pnl;positions.splice(i,1);posHist.unshift({date:now(),sym:p.sym,side:p.side,sc:p.sc,entry:p.entry,exit:price,pnl});hist.unshift({date:now(),pair:p.sym+'USDT',price,side:p.side==='Long'?'Sell':'Buy',type:'Market',amount:p.sc,st:'Filled'});txns.unshift({date:now(),type:'Realised PNL',pair:p.sym+'USDT',chg:pnl});saveF();futCalc();renderOrd();CX.toast('Position closed at market ('+(pnl>=0?'+':'')+F(pnl)+' USDT)')};
 $$('#futForm [data-side]').forEach(b=>b.onclick=e=>{e.preventDefault();
  if(!quiz){quizModal();return}
  const side=b.dataset.side,sc=sizeCoin(),p=ent(),cost=sc*p/lev;
  if(!sc){CX.toast('Please enter the order quantity');return}
  if(mode==='Conditional'&&!num($('#fStop').value)){CX.toast('Please enter the stop price');return}
  if(cost>avail+1e-9){CX.toast('Insufficient available balance – transfer funds to derivatives');return}
  if($('#ro').checked&&!positions.some(x=>x.sym===sym)){CX.toast('Reduce-only order rejected: you have no open position');return}
  const tp=$('#tpsl').checked?num($('#fTP').value):0,sl=$('#tpsl').checked?num($('#fSL').value):0;avail-=cost;
  if(mode==='Market'){positions.unshift({sym,side,sc,entry:p,lev,margin:cost,mm:mMode,liq:liq(side),tp,sl});hist.unshift({date:now(),pair:pairLbl(),price:p,side:side==='Long'?'Buy':'Sell',type:'Market',amount:sc,st:'Filled'});tabP='Positions'}
  else{orders.unshift({date:now(),pair:pairLbl(),price:p,side:side==='Long'?'Buy':'Sell',type:mode==='Conditional'?(cond==='Market'?'Stop Market':'Stop Limit'):'Limit',amount:sc,trig:mode==='Conditional'?num($('#fStop').value):0,ro:$('#ro').checked,margin:cost,st:'Open'});tabP='Open Orders'}
  $$('#posTabs button').forEach(x=>x.classList.toggle('active',x.dataset.t===tabP));saveF();renderOrd();
  $('#fSize').value='';futCalc();CX.toast(`${side==='Long'?'Buy/Long':'Sell/Short'} ${mode.toLowerCase()} order ${mode==='Market'?'filled':'placed'}`)});
 tabClick('#chTabs',()=>{});tabClick('#posTabs',b=>{tabP=b.dataset.t;renderOrd()});
 if(authed){txns.push({date:'29-10-2026 10:12:00',type:'Transfer In',pair:'USDT',chg:5000});
 hist.push({date:'29-10-2026 09:10:12',pair:'BTCUSDT',price:66120,side:'Buy',type:'Market',amount:.04,st:'Filled'},{date:'28-10-2026 18:44:01',pair:'ETHUSDT',price:2455,side:'Sell',type:'Limit',amount:1,st:'Filled'});
 posHist.push({date:'28-10-2026 18:44:01',sym:'ETH',side:'Short',sc:1,entry:2470,exit:2455,pnl:15})}
 setInterval(()=>{const s=28800-(Date.now()/1000%28800|0),z=n=>String(n).padStart(2,'0');$('#fCount').textContent=`${z(s/3600|0)}:${z(s%3600/60|0)}:${z(s%60)}`},1000);
}

/* ---------- init + live ticks ---------- */
candles=gen();$('#pairName').textContent=pairLbl();head();ob();tr();draw();fillPrice();
if(fut)futCalc();else spotRecalc();
renderOrd();for(let i=0;i<12;i++)tr();
setInterval(()=>{const l=candles[candles.length-1];price=Math.max(price*(1+(Math.random()-.5)*.0012),0.0001);l.c=price;l.h=Math.max(l.h,price);l.l=Math.min(l.l,price);if(Math.random()<.08){candles.push({o:price,h:price,l:price,c:price,v:30});candles.shift()}
 head();ob();tr();draw();if(fut){if(mode==='Market')futCalc();if(tabP==='Positions'&&positions.length)renderOrd()}else if(mode==='Market')spotRecalc()},1500);
window.addEventListener('resize',draw);document.addEventListener('cxtheme',draw);
};
