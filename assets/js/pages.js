/* Page-specific interactions (mock data only) */
CX.pages={};
const $=CX.$,$$=CX.$$,P=CX.pages,F=CX.fmt;
const opts=(el,list)=>{el.innerHTML=list.map(c=>`<option>${c}</option>`).join('')};
const coinCell=s=>`<div class="d-flex align-items-center gap-2">${CX.chip(s)}<b>${s}</b><span class="text-muted small">${CX.coin(s).n}</span></div>`;
const sparkCols=()=>[CX.css('--up'),CX.css('--down')];
const tabs=(sel,fn)=>{const el=$(sel);el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('button',el).forEach(x=>x.classList.remove('active'));b.classList.add('active');fn(b)});};
const coinNames=CX.coins.map(c=>c.s);

/* ---------- Landing ---------- */
P.index=()=>{
 const tk=CX.coins.filter(c=>c.s!=='USDT').map(c=>`<span class="lp-tk">${CX.chip(c.s,22)}<b>${c.s}</b><span>$${F(c.p)}</span>${CX.chg(c.c)}</span>`).join('');
 $('#lpTrack').innerHTML=tk+tk;
 const tbl=f=>{let l=[...CX.coins].filter(c=>c.s!=='USDT');if(f==='gain')l.sort((a,b)=>b.c-a.c);else if(f==='lose')l.sort((a,b)=>a.c-b.c);else l.sort((a,b)=>b.v-a.v);
  CX.table('#lpTable',[{h:'Coin',f:r=>coinCell(r.s)},{h:'Price',cls:'text-end',f:r=>'$'+F(r.p)},{h:'24h Change',cls:'text-end',f:r=>CX.chg(r.c)},{h:'24h Volume',cls:'text-end d-none d-md-table-cell',f:r=>'$'+(r.v/1e6).toFixed(0)+'M'},{h:'',cls:'text-end',f:r=>`<a href="spot.html" class="btn btn-soft btn-sm">Trade</a>`}],l.slice(0,7))};
 tbl('hot');tabs('#lpTabs',b=>tbl(b.dataset.f));
 $('#heroForm').onsubmit=e=>{e.preventDefault();const i=e.target.querySelector('input');sessionStorage.setItem('cx_email',i.value);location.href='signup.html'};
};
/* ---------- Auth ---------- */
P.signup=()=>{const f=$('#signupForm');f.onsubmit=e=>{e.preventDefault();sessionStorage.setItem('cx_email',$('#suEmail').value);location.href='verify.html'};
 const m=sessionStorage.getItem('cx_email');if(m)$('#suEmail').value=m};
P.verify=()=>{$('#vEmail').textContent=sessionStorage.getItem('cx_email')||'your email';const box=$('#otpBox');box.innerHTML=Array.from({length:6},()=>'<input class="form-control" maxlength="1" inputmode="numeric">').join('');const ins=$$('input',box);
 ins.forEach((i,n)=>{i.oninput=()=>{i.value=i.value.replace(/\D/g,'');if(i.value&&ins[n+1])ins[n+1].focus()};i.onkeydown=e=>{if(e.key==='Backspace'&&!i.value&&ins[n-1])ins[n-1].focus()};i.onpaste=e=>{const t=(e.clipboardData.getData('text')||'').replace(/\D/g,'').slice(0,6);if(t){e.preventDefault();t.split('').forEach((c,k)=>ins[k].value=c)}}});ins[0].focus();
 $('#otpForm').onsubmit=e=>{e.preventDefault();localStorage.setItem('cx_auth','1');CX.toast('Email verified!');setTimeout(()=>location.href=CX.next(),600)};
 let t=30;const iv=setInterval(()=>{t--;$('#resendT').innerHTML=t>0?`Resend code in ${t}s`:'<a href="#" id="rs">Resend code</a>';if(t<=0){clearInterval(iv);$('#rs').onclick=()=>CX.toast('Code resent (demo: 123456)')}},1000)};
P.login=()=>{const f=$('#loginForm');const nx=sessionStorage.getItem('cx_next'),nm={'spot.html':'Spot Trade','futures.html':'Futures Trade','otc.html':'OTC Trading','staking.html':'Staking'}[nx];
 if(nm)f.insertAdjacentHTML('beforebegin',`<div class="lock-note"><i class="bi bi-lock-fill"></i><span>Log in to access <b>${nm}</b>. New here? <a href="signup.html">Create an account</a>.</span></div>`);
 f.onsubmit=e=>{e.preventDefault();localStorage.setItem('cx_auth','1');location.href=CX.next()}};
/* ---------- Dashboard ---------- */
P.dashboard=()=>{
 const tot=CX.totalUsd();$('#dTotal').textContent='$'+F(tot,0);$('#dTrades').textContent=CX.orders.length;
 let n=12;const gains=[3.2,-1.4,4.8,2.1,-2.6,5.4,1.9,-0.8,3.7,6.1,-1.9,4.4];
 const bars=()=>{const cv=$('#dBars'),r=devicePixelRatio||1,w=cv.clientWidth||600,h=cv.clientHeight||230;cv.width=w*r;cv.height=h*r;const g=cv.getContext('2d');g.scale(r,r);
  const data=gains.slice(-n),mx=7,mid=h/2-8,sc=(mid-10)/mx,bw=Math.min(26,w/data.length*.46),gap=w/data.length,mn=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].slice(-n);
  g.strokeStyle=CX.css('--border');g.lineWidth=1;[-1,0,1].forEach(k=>{g.beginPath();g.moveTo(0,mid+k*mid*.8);g.lineTo(w,mid+k*mid*.8);g.stroke()});
  data.forEach((v,i)=>{const x=gap*i+gap/2-bw/2,hh=Math.abs(v)*sc,y=v>=0?mid-hh:mid;g.fillStyle=v>=0?CX.css('--up'):CX.css('--surface-3');g.beginPath();g.roundRect(x,y,bw,hh,bw/2);g.fill();g.fillStyle=CX.css('--muted');g.font='11px sans-serif';g.textAlign='center';g.fillText(mn[i],x+bw/2,h-4)})};
 bars();document.addEventListener('cxtheme',bars);addEventListener('resize',bars);tabs('#dPerf',b=>{n=+b.dataset.n;bars()});
 const wl=[['metamask','Connected','0x71C7…976F'],['ledger','Connected','Hardware'],['phantom','',''],['trustwallet','','']];
 const wn=k=>CX.wallets.find(w=>w[0]===k)[1];
 const rw=()=>{$('#dWallets').innerHTML=wl.map((w,i)=>`<div class="wallet-row">${CX.walletImg(w[0])}<div class="flex-grow-1"><b class="d-block">${wn(w[0])}</b><span class="small text-muted">${w[1]?w[2]:'Not connected'}</span></div>${w[1]?'<span class="bdg bdg-success">Connected</span>':`<button class="btn btn-soft btn-sm" data-i="${i}">Connect</button>`}</div>`).join('')};rw();
 $('#dWallets').onclick=e=>{const b=e.target.closest('button');if(b){const w=wl[+b.dataset.i];w[1]='Connected';w[2]='0x'+Math.random().toString(16).slice(2,6)+'…'+Math.random().toString(16).slice(2,6);rw();CX.toast(wn(w[0])+' connected (demo)')}};
 CX.table('#dMarket',[{h:'Coin',f:r=>coinCell(r.s)},{h:'Price',cls:'text-end',f:r=>'$'+F(r.p)},{h:'24h',cls:'text-end',f:r=>CX.chg(r.c)},{h:'',cls:'text-end',f:r=>`<a href="spot.html" class="btn btn-soft btn-sm">Trade</a>`}],CX.coins.filter(c=>c.s!=='USDT').slice(0,6));
 CX.table('#dOrders',[{h:'Pair',k:'pair'},{h:'Side',f:r=>`<b class="${r.side==='Buy'?'up':'down'}">${r.side}</b>`},{h:'Price',cls:'text-end',f:r=>F(r.price)},{h:'Status',f:r=>CX.badge(r.status)}],CX.orders);
 CX.table('#dActivity',[{h:'Date',k:'date'},{h:'Type',f:r=>`<span class="bdg bdg-primary">${r.type}</span>`},{h:'Details',k:'text'},{h:'Status',f:r=>CX.badge(r.status)}],CX.activity);
 opts($('#qtCoin'),coinNames.filter(s=>s!=='USDT'));let side='Buy';
 const q=()=>{$('#qtOut').textContent=F(($('#qtAmt').value||0)/CX.coin($('#qtCoin').value).p,6)+' '+$('#qtCoin').value};$('#qtAmt').oninput=q;$('#qtCoin').onchange=q;q();
 tabs('#qtSide',b=>{side=b.textContent;$('#qtBtn').textContent=side;$('#qtBtn').className='btn w-100 '+(side==='Buy'?'btn-up':'btn-down')});
 $('#qtBtn').onclick=()=>CX.toast(`${side} order for ${$('#qtOut').textContent} placed (demo)`)};
/* ---------- Market ---------- */
P.market=()=>{let t='Spot';const q=sessionStorage.getItem('cx_q');if(q){$('#mSearch').value=q;sessionStorage.removeItem('cx_q')}const fav=new Set(['BTC','ETH']);
 const render=()=>{const s=$('#mSearch').value.toLowerCase(),k=$('#mSort').value;
  if(t==='New'){CX.table('#mTable',[{h:'Project',f:r=>`<div class="d-flex align-items-center gap-2"><span class="coin" style="background:var(--primary)">${r.s[0]}</span><b>${r.s}</b><span class="text-muted small">${r.name}</span></div>`},{h:'Price',cls:'text-end',f:r=>'$'+F(r.p)},{h:'24h',cls:'text-end',f:r=>CX.chg(r.c)},{h:'Listed',k:'date'},{h:'',cls:'text-end',f:()=>`<a href="spot.html" class="btn btn-soft btn-sm">Trade</a>`}],CX.listings.filter(l=>(l.name+l.s).toLowerCase().includes(s)),'No matches');return}
  let l=CX.coins.filter(c=>c.s!=='USDT'&&(c.s+c.n).toLowerCase().includes(s)).sort((a,b)=>b[k]-a[k]);
  CX.table('#mTable',[{h:'',f:r=>`<a href="#" class="fav ${fav.has(r.s)?'text-warning':'text-muted'}" data-s="${r.s}"><i class="bi bi-star${fav.has(r.s)?'-fill':''}"></i></a>`},{h:t==='Future'?'Contract':'Coin',f:r=>t==='Future'?`<b>${r.s}USDT</b> <span class="bdg bdg-primary">Perp</span>`:coinCell(r.s)},{h:'Last Price',cls:'text-end',f:r=>'$'+F(r.p)},{h:'24h Change',cls:'text-end',f:r=>CX.chg(r.c)},{h:t==='Future'?'Funding':'24h High',cls:'text-end d-none d-md-table-cell',f:r=>t==='Future'?'0.0100%':'$'+F(r.p*1.02)},{h:'24h Volume',cls:'text-end d-none d-md-table-cell',f:r=>'$'+(r.v/1e6).toFixed(0)+'M'},{h:'',cls:'text-end',f:r=>`<a href="${t==='Future'?'futures':'spot'}.html" class="btn btn-soft btn-sm">Trade</a>`}],l,'No matches')};
 render();$('#mSearch').oninput=render;$('#mSort').onchange=render;tabs('#mTabs',b=>{t=b.dataset.t;render()});
 $('#mTable').addEventListener('click',e=>{const a=e.target.closest('.fav');if(a){e.preventDefault();const s=a.dataset.s;fav.has(s)?fav.delete(s):fav.add(s);render()}})};
/* ---------- Security ---------- */
P.security=()=>{
 $$('.tg').forEach(t=>t.onchange=()=>CX.toast(t.checked?'Enabled':'Disabled'));
 $('#apcSave').onclick=()=>{const v=$('#apc').value;$('#apcCur').innerHTML='Current code: <b>'+v+'</b>';CX.toast('Anti-phishing code saved')};
 const pf=$('#pwForm');pf.onsubmit=e=>{e.preventDefault();pf.reset();pf.classList.remove('was-validated');CX.toast('Password changed successfully')};
 let ips=['103.21.44.12'];const rIp=()=>{$('#ipList').innerHTML=ips.map((p,i)=>`<div class="d-flex justify-content-between align-items-center border rounded-3 p-2 mb-1"><span>${p}</span><a href="#" class="text-danger" data-i="${i}"><i class="bi bi-trash"></i></a></div>`).join('')||'<div class="small text-muted">No IPs added.</div>'};rIp();
 $('#ipForm').onsubmit=e=>{e.preventDefault();ips.push($('#ipIn').value);e.target.reset();e.target.classList.remove('was-validated');rIp();CX.toast('IP added')};$('#ipList').onclick=e=>{const a=e.target.closest('a');if(a){ips.splice(+a.dataset.i,1);rIp()}};
 CX.table('#secLogins',[{h:'Date',k:'date'},{h:'IP',k:'ip'},{h:'Device',cls:'d-none d-md-table-cell',k:'device'},{h:'Location',cls:'d-none d-md-table-cell',k:'loc'},{h:'Status',f:r=>CX.badge(r.status)}],CX.logins);
 const dv=[...CX.devices];const rD=()=>CX.table('#secDevices',[{h:'Device',f:r=>`<b>${r.name}</b><div class="small text-muted">${r.loc} · ${r.last}</div>`},{h:'',cls:'text-end',f:(r,i)=>i===0?'<span class="bdg bdg-success">This device</span>':`<button class="btn btn-sm btn-outline-danger" data-i="${i}">Remove</button>`}],dv);rD();
 $('#secDevices').onclick=e=>{const b=e.target.closest('button');if(b){dv.splice(+b.dataset.i,1);rD();CX.toast('Device removed')}};
 opts($('#wlCoin'),coinNames);let wl=[...CX.wlist];const rW=()=>CX.table('#wlTable',[{h:'Coin',f:r=>coinCell(r.coin)},{h:'Network',k:'net'},{h:'Address',k:'addr'},{h:'Label',k:'label'},{h:'',cls:'text-end',f:(r,i)=>`<button class="btn btn-sm btn-outline-danger" data-i="${i}">Remove</button>`}],wl,'No addresses whitelisted');rW();
 $('#wlForm').onsubmit=e=>{e.preventDefault();const a=$('#wlAddr').value;wl.push({coin:$('#wlCoin').value,net:$('#wlNet').value,addr:a.slice(0,6)+'…'+a.slice(-4),label:$('#wlLabel').value});e.target.reset();e.target.classList.remove('was-validated');rW();CX.toast('Address added')};
 $('#wlTable').onclick=e=>{const b=e.target.closest('button');if(b){wl.splice(+b.dataset.i,1);rW()}}};
/* ---------- KYC ---------- */
P.kyc=()=>{let id='Aadhaar';const cfg={Aadhaar:['Aadhaar number','\\d{12}',12,'Enter a valid 12-digit Aadhaar number.','1234 5678 9012'],PAN:['PAN number','[A-Za-z]{5}[0-9]{4}[A-Za-z]',10,'Enter a valid PAN (e.g. ABCDE1234F).','ABCDE1234F']};
 $('#idOpts').onclick=e=>{const o=e.target.closest('.opt');if(!o)return;id=o.dataset.id;$$('#idOpts .opt').forEach(x=>x.classList.toggle('sel',x===o));const c=cfg[id];$('#kNumL').textContent=c[0];$('#kNum').placeholder=c[4];$('#kNum').value=''};
 $('#kycForm').onsubmit=e=>{e.preventDefault();$('#kycStat').textContent='Under Review';$('#kw2').classList.add('on');$('#kw3').classList.add('on');CX.modal('Verification submitted',`<p class="mb-0">Your ${id} details were submitted. We will notify you once verification is complete (demo).</p>`)}};
/* ---------- Deposit / Withdraw ---------- */
const adr=(s,n)=>({BTC:'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',ETH:'0x71C7656EC7ab88b098defB751B7401B5f6d8976F'}[s]||'T'+btoa(s+n).replace(/=/g,'').padEnd(33,'x').slice(0,33));
const hCols=(fee)=>[{h:'Date',k:'date'},{h:'Asset',f:r=>coinCell(r.asset)},{h:'Network',cls:'d-none d-md-table-cell',k:'net'},{h:'Amount',cls:'text-end',f:r=>r.amount},{h:'Status',f:r=>CX.badge(r.status)},{h:'TxID',cls:'d-none d-xl-table-cell',k:'tx'}];
P.deposit=()=>{opts($('#dCoin'),coinNames);const u=()=>$('#dAddr').textContent=adr($('#dCoin').value,$('#dNet').value);$('#dCoin').onchange=u;$('#dNet').onchange=u;u();$('#dCopy').onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText($('#dAddr').textContent);CX.toast('Address copied')};
 const dep=[...CX.deposits];const r=()=>CX.table('#depTable',hCols(),dep);r();
 $('#depForm').onsubmit=e=>{e.preventDefault();dep.unshift({date:'2026-10-30 10:00',asset:$('#dCoin').value,net:$('#dNet').value,amount:+$('#dAmt').value,status:'Pending',tx:'0x'+Math.random().toString(16).slice(2,12)+'…'});r();e.target.reset();e.target.classList.remove('was-validated');u();CX.toast('Deposit submitted – awaiting confirmations')}};
P.withdraw=()=>{opts($('#wCoin'),coinNames);const bal=()=>CX.assets.find(a=>a.s===$('#wCoin').value)?.bal||0;const u=()=>{$('#wAvail').textContent=bal()+' '+$('#wCoin').value;const v=+$('#wAmt').value;$('#wRecv').textContent=Math.max(0,v-.0005).toFixed(4)};$('#wCoin').onchange=u;$('#wAmt').oninput=u;u();
 $('#wMax').onclick=e=>{e.preventDefault();$('#wAmt').value=bal();u()};const wd=[...CX.withdrawals];const r=()=>CX.table('#wdTable',hCols(),wd);r();
 $('#wdForm').onsubmit=e=>{e.preventDefault();const a=$('#wAmt');wd.unshift({date:'2026-10-30 10:00',asset:$('#wCoin').value,net:'Mainnet',amount:+a.value,status:'Processing',tx:'pending…'});r();e.target.reset();e.target.classList.remove('was-validated');u();CX.toast('Withdrawal request submitted')}};
/* ---------- Rewards ---------- */
P.rewards=()=>{const rw=[['Welcome Bonus','Complete KYC','10 USDT'],['Trading Bonus','Trade $1,000 volume','5 USDT'],['Staking Reward','Stake any amount','25 CXT'],['Loyalty Boost','Silver tier perk','2 USDT']];
 $('#rwList').innerHTML=rw.map((r,i)=>`<div class="d-flex align-items-center gap-3 border rounded-3 p-3 mb-2"><div class="icon-box"><i class="bi bi-gift"></i></div><div class="flex-grow-1"><b>${r[0]}</b><div class="small text-muted">${r[1]}</div></div><div class="text-end"><b class="up d-block">${r[2]}</b><button class="btn btn-primary btn-sm mt-1 claim" ${i===0?'disabled':''}>${i===0?'Locked':'Claim'}</button></div></div>`).join('');
 $('#rwList').onclick=e=>{const b=e.target.closest('.claim');if(b&&!b.disabled){b.textContent='Claimed';b.disabled=true;CX.toast('Reward claimed!')}};
 CX.table('#refTable',[{h:'User',k:'user'},{h:'Date',cls:'d-none d-md-table-cell',k:'date'},{h:'Status',f:r=>CX.badge(r.status)},{h:'Earned',cls:'text-end',f:r=>'$'+r.earn}],CX.referrals);
 const d=()=>CX.spark($('#refSpark'),CX.walk(20,10,.2),'#fff');d()};
/* ---------- History ---------- */
P.history=()=>{const cats=Object.keys(CX.history);let cat=cats[0],rows=[];
 $('#hTabs').innerHTML=cats.map((c,i)=>`<li class="nav-item"><button class="nav-link ${i?'':'active'}" data-c="${c}">${c}</button></li>`).join('');
 opts($('#hAsset'),['All assets',...coinNames]);$('#hAsset').options[0].value='';
 const cols=['Date','Category','Details','Asset','Amount','Status'];
 const run=()=>{const s=$('#hSearch').value.toLowerCase(),st=$('#hStatus').value,as=$('#hAsset').value,rg=+$('#hRange').value;const lim=rg?new Date(Date.UTC(2026,9,30)-rg*864e5).toISOString().slice(0,10):'';
  rows=CX.history[cat].filter(r=>(!s||r.join(' ').toLowerCase().includes(s))&&(!st||r[5]===st)&&(!as||r[3]===as)&&(!lim||r[0].slice(0,10)>=lim));
  CX.table('#hTable',[{h:'Date',f:r=>r[0]},{h:'Category',f:r=>`<span class="bdg bdg-primary">${r[1]}</span>`},{h:'Details',f:r=>r[2]},{h:'Asset',f:r=>r[3]},{h:'Amount',cls:'text-end',f:r=>r[4]},{h:'Status',f:r=>CX.badge(r[5])}],rows,'No records match your filters');$('#hCount').textContent=rows.length+' record(s)'};
 run();['hSearch','hStatus','hAsset','hRange'].forEach(i=>$('#'+i).addEventListener('input',run));
 tabs('#hTabs',()=>{});$('#hTabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('#hTabs button').forEach(x=>x.classList.toggle('active',x===b));cat=b.dataset.c;run()});
 $('#expCsv').onclick=()=>{CX.exportCSV('history-'+cat.toLowerCase().replace(/\s/g,'-'),cols,rows);CX.toast('CSV exported')};
 $('#expPdf').onclick=()=>{CX.exportPDF('history-'+cat.toLowerCase().replace(/\s/g,'-'),'History - '+cat,cols,rows);CX.toast('PDF exported')}};
/* ---------- Settings ---------- */
P.settings=()=>{const sync=()=>$$('#setTheme button').forEach(b=>b.classList.toggle('active',b.dataset.t===document.documentElement.getAttribute('data-bs-theme')));sync();
 $('#setTheme').onclick=e=>{const b=e.target.closest('button');if(b){CX.setTheme(b.dataset.t);sync()}};
 $('#setSave').onclick=()=>CX.toast('Settings saved');$('#deact').onclick=()=>CX.modal('Deactivate account?','<p>Trading and withdrawals will be disabled. This is a demo action.</p>','Deactivate',()=>CX.toast('Account deactivation requested'))};
/* ---------- Profile ---------- */
P.profile=()=>{const f=$('#profForm'),ins=$$('input,textarea',f);$('#prEdit').onclick=()=>{ins.forEach(i=>i.disabled=false);$('#prEdit').classList.add('d-none');$('#prSave').classList.remove('d-none')};
 f.onsubmit=e=>{e.preventDefault();ins.forEach(i=>i.disabled=true);$('#pName').textContent=$('#prN').value;$('#prEdit').classList.remove('d-none');$('#prSave').classList.add('d-none');f.classList.remove('was-validated');CX.toast('Profile updated')}};
/* ---------- Support ---------- */
P.support=()=>{tabs('#supTabs',()=>{});$('#supTabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('#supTabs button').forEach(x=>x.classList.toggle('active',x===b));$('#supForm').classList.toggle('d-none',b.dataset.t!=='form');$('#tkForm').classList.toggle('d-none',b.dataset.t!=='ticket')});
 const tk=[...CX.tickets];const r=()=>CX.table('#tkTable',[{h:'Ticket',k:'id'},{h:'Subject',k:'subject'},{h:'Category',cls:'d-none d-md-table-cell',k:'cat'},{h:'Priority',k:'prio'},{h:'Status',f:x=>CX.badge(x.status)},{h:'Date',cls:'d-none d-xl-table-cell',f:x=>x.date.slice(0,10)}],tk);r();
 $('#supForm').onsubmit=e=>{e.preventDefault();e.target.reset();e.target.classList.remove('was-validated');CX.toast('Message sent – we will reply by email')};
 $('#tkForm').onsubmit=e=>{e.preventDefault();const id='TKT-'+(1043+tk.length-4);tk.unshift({id,subject:$('#tkSub').value,cat:$('#tkCat').value,prio:$('#tkPri').value,status:'Open',date:'2026-10-30'});r();e.target.reset();e.target.classList.remove('was-validated');CX.modal('Ticket raised',`<p>Your ticket <b>${id}</b> has been created. Expected response: within 24 hours.</p>`)}};
/* ---------- New listing ---------- */
P['new-listing']=()=>{const w=$$('#nlWiz .s'),step=n=>{['nl1','nl2','nl3'].forEach((id,i)=>$('#'+id).classList.toggle('d-none',i!==n));w.forEach((s,i)=>s.classList.toggle('on',i<=n))};
 $('#nl1').onsubmit=e=>{e.preventDefault();step(1)};$('#nlBack').onclick=()=>step(0);
 $('#nl2').onsubmit=e=>{e.preventDefault();$('#nlId').textContent='NL-'+Math.floor(10000+Math.random()*90000);step(2)}};
/* ---------- OTC ---------- */
P.otc=()=>{let side='Buy',iv,left=0;opts($('#otcCoin'),coinNames.filter(s=>s!=='USDT'));$('#otcCoin').onchange=()=>$('#otcU').textContent=$('#otcCoin').value;
 tabs('#otcSide',b=>{side=b.textContent;reset()});const reset=()=>{clearInterval(iv);$('#otcQuote').classList.add('d-none');$('#otcForm').classList.remove('d-none')};
 const tick=()=>{const m=Math.floor(left/60),s=String(left%60).padStart(2,'0');$('#qTimer').innerHTML=left>0?`<i class="bi bi-clock"></i> Rate locked for ${m}:${s}s — confirm before it expires.`:'<span class="text-danger"><i class="bi bi-exclamation-circle"></i> Quote expired. Please request a new quote.</span>';$('#qConfirm').disabled=left<=0};
 $('#otcForm').onsubmit=e=>{e.preventDefault();const c=CX.coin($('#otcCoin').value),a=+$('#otcAmt').value,rate=c.p*(side==='Buy'?1.002:.998),tot=a*rate;
  $('#qVerb').textContent=side==='Buy'?'pay':'receive';$('#qRate').textContent='$'+F(rate)+' / '+c.s;$('#qTotal').textContent='$'+F(tot);$('#qFee').textContent='$'+F(tot*.001);
  $('#otcForm').classList.add('d-none');$('#otcQuote').classList.remove('d-none');left=316;tick();clearInterval(iv);iv=setInterval(()=>{left--;tick();if(left<=0)clearInterval(iv)},1000)};
 $('#qCancel').onclick=reset;$('#qConfirm').onclick=()=>{clearInterval(iv);CX.modal('Quote confirmed',`<p>Your OTC ${side.toLowerCase()} of <b>${$('#otcAmt').value} ${$('#otcCoin').value}</b> at ${$('#qRate').textContent} is confirmed (demo).</p>`);reset();$('#otcForm').reset();$('#otcForm').classList.remove('was-validated')}};
/* ---------- Wallet ---------- */
P.wallet=()=>{const tot=CX.totalUsd();let hid=false;const ren=()=>{$('#wTotal').textContent=hid?'••••••':'$'+F(tot);$('#wInr').textContent=hid?'':'≈ ₹'+F(tot*83.2,0);$('#wSpot').textContent=hid?'••••':'$'+F(tot)};ren();
 $('#hideBal').onclick=()=>{hid=!hid;$('#hideBal').innerHTML=`<i class="bi bi-eye${hid?'-slash':''}"></i>`;ren();tbl()};
 CX.spark($('#wSpark'),CX.walk(40,tot*.93,.012),'#fff');
 $('#wAlloc').innerHTML=CX.assets.map(a=>`<div class="progress-bar" title="${a.s}" style="width:${a.bal*CX.coin(a.s).p/tot*100}%;background:${CX.coin(a.s).col}"></div>`).join('');
 const tbl=()=>{const s=$('#wSearch').value.toUpperCase();CX.table('#wTable',[{h:'Asset',f:r=>coinCell(r.s)},{h:'Balance',cls:'text-end',f:r=>hid?'••••':F(r.bal,4)},{h:'In orders',cls:'text-end d-none d-md-table-cell',f:r=>hid?'••••':r.locked},{h:'Value (USD)',cls:'text-end',f:r=>hid?'••••':'$'+F(r.bal*CX.coin(r.s).p)},{h:'',cls:'text-end',f:r=>`<a href="deposit.html" class="btn btn-soft btn-sm">Deposit</a> <a href="withdraw.html" class="btn btn-soft btn-sm">Withdraw</a> <a href="spot.html" class="btn btn-primary btn-sm">Trade</a>`}],CX.assets.filter(a=>a.s.includes(s)),'No assets found')};tbl();$('#wSearch').oninput=tbl;
 const cn=new Set(['metamask']);const rc=()=>{$('#wcWallets').innerHTML=CX.wallets.map(w=>`<div class="col-sm-6 col-xl-4"><div class="wallet-row">${CX.walletImg(w[0],48)}<div class="flex-grow-1"><b class="d-block">${w[1]}</b><span class="small text-muted">${w[2]}</span></div><button class="btn btn-sm ${cn.has(w[0])?'btn-primary':'btn-soft'}" data-k="${w[0]}">${cn.has(w[0])?'Connected':'Connect'}</button></div></div>`).join('')};rc();
 $('#wcWallets').onclick=e=>{const b=e.target.closest('button');if(b){const k=b.dataset.k;cn.has(k)?cn.delete(k):cn.add(k);rc();CX.toast(cn.has(k)?'Wallet connected (demo)':'Wallet disconnected')}}};
/* ---------- Swap ---------- */
P.swap=()=>{opts($('#swFrom'),coinNames);opts($('#swTo'),coinNames);$('#swFrom').value='USDT';$('#swTo').value='BTC';
 const bal=s=>CX.assets.find(a=>a.s===s)?.bal||0;
 const u=()=>{const f=CX.coin($('#swFrom').value),t=CX.coin($('#swTo').value),a=+$('#swAmt').value||0,rate=f.p/t.p,out=a*rate*.999;$('#swBal').textContent=F(bal(f.s),4)+' '+f.s;$('#swOut').value=a?F(out,6).replace(/,/g,''):'';$('#swRate').textContent=`1 ${f.s} ≈ ${F(rate,6)} ${t.s}`;$('#swFee').textContent=F(a*.001,6)+' '+f.s;$('#swMin').textContent=a?F(out*.995,6)+' '+t.s:'-';
  return true};
 ['swAmt','swFrom','swTo'].forEach(i=>$('#'+i).addEventListener('input',u));u();
 $('#swFlip').onclick=()=>{const a=$('#swFrom').value;$('#swFrom').value=$('#swTo').value;$('#swTo').value=a;u()};$('#swMax').onclick=e=>{e.preventDefault();$('#swAmt').value=bal($('#swFrom').value);u()};
 $('#swGo').onclick=()=>{u();CX.modal('Confirm swap',`<div class="text-center"><div class="fs-4 fw-bold">${$('#swAmt').value} ${$('#swFrom').value}</div><i class="bi bi-arrow-down"></i><div class="fs-4 fw-bold up">${$('#swOut').value} ${$('#swTo').value}</div><div class="small text-muted mt-2">${$('#swRate').textContent}</div></div>`,'Confirm Swap',()=>{CX.toast('Swap completed (demo)');$('#swAmt').value='';u()})}};
/* ---------- Staking ---------- */
P.staking=()=>{let mode='Fixed',sel=null;const R=()=>{$('#stOpts').innerHTML=CX.stake[mode].map((o,i)=>`<div class="col-sm-6 col-lg-4 col-xl"><div class="opt ${sel===i?'sel':''}" data-i="${i}"><div class="d-flex align-items-center gap-2 mb-2">${CX.chip(o[0])}<b>${o[0]}</b></div><div class="stat-v up">${o[2]}%</div><div class="stat-l">APY</div><div class="small mt-2"><i class="bi bi-calendar3"></i> ${o[1]?o[1]+' days':'Flexible'}</div></div></div>`).join('');$('#stBox').classList.toggle('d-none',sel===null);if(sel!==null){const o=CX.stake[mode][sel];$('#stSel').textContent=`${o[0]} · ${o[1]?o[1]+' days':'Flexible'} · ${o[2]}% APY`;est()}};
 const est=()=>{const o=CX.stake[mode][sel],a=+$('#stAmt').value||0,d=o[1]||365;$('#stEst').textContent=a?F(a*o[2]/100*d/365,4)+' '+o[0]:'-'};
 R();tabs('#stTabs',b=>{mode=b.dataset.t;sel=null;R()});$('#stOpts').onclick=e=>{const o=e.target.closest('.opt');if(o){sel=+o.dataset.i;R()}};$('#stAmt').oninput=()=>sel!==null&&est();
 $('#stGo').onclick=()=>{const a=+$('#stAmt').value||0;if(sel===null)sel=0;CX.modal('Staking confirmed',`<p>You staked <b>${a} ${CX.stake[mode][sel][0]}</b> in the ${$('#stSel').textContent} plan (demo).</p>`);$('#stAmt').value=''};
 $('#tiers').innerHTML=CX.tiers.map((t,i)=>`<div class="col-sm-6 col-lg-3"><div class="tier ${i===1?'cur':''}"><div class="d-flex justify-content-between"><b>${t[0]}</b>${i===1?'<span class="bdg bdg-primary">Current</span>':''}</div><div class="stat-v my-2">${t[2]}</div><div class="small text-muted">Stake ≥ $${F(t[1],0)}</div><div class="small mt-2"><i class="bi bi-check-circle up"></i> ${t[3]}</div></div></div>`).join('')};

/* OTC: anyone can view the desk, but requesting a quote needs an account */
(()=>{const o=CX.pages.otc;CX.pages.otc=()=>{o();if(CX.authed())return;const f=document.getElementById('otcForm'),b=f.querySelector('button');b.outerHTML='<a class="btn btn-primary w-100" href="login.html" data-gate>Log in to request a quote</a>';f.onsubmit=e=>{e.preventDefault();sessionStorage.setItem('cx_next','otc.html');location.href='login.html'}}})();
