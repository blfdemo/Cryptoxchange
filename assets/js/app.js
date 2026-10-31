/* Layout, theme, shared UI helpers */
(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
CX.$=$;CX.$$=$$;
const B=document.body,page=B.dataset.page;let layout=B.dataset.layout;
CX.authed=()=>localStorage.getItem('cx_auth')==='1';
const FULL=['market','spot','futures','otc','staking'];/* always full-width with the site header, signed in or not */
if(layout==='auto')layout=FULL.includes(page)?'public':(CX.authed()?'app':'public');
/* staking needs an account; market / spot / futures / OTC can be viewed by anyone (actions ask you to log in) */
const GATED=['staking'];
CX.next=()=>{const n=sessionStorage.getItem('cx_next');sessionStorage.removeItem('cx_next');return /^[a-z-]+\.html$/.test(n||'')?n:'dashboard.html'};
if(layout==='public'&&GATED.includes(page)&&!CX.authed()){document.documentElement.style.visibility='hidden';sessionStorage.setItem('cx_next',page+'.html');location.replace('login.html');return}
CX.layout=layout;
if(layout==='app'&&!CX.authed()){location.replace('login.html');return}
const GROUPS=[
 {id:'trade',t:'Trade',i:'graph-up-arrow',items:[['swap','Swap'],['new-listing','New Listing']]},
 {id:'assets',t:'Assets',i:'wallet2',items:[['wallet','Wallet'],['deposit','Deposit'],['withdraw','Withdraw'],['staking','Staking']]},
 {id:'rewards',t:'Rewards & History',i:'gift',items:[['rewards','My Rewards'],['history','History']]},
 {id:'account',t:'Account',i:'person-circle',items:[['profile','Profile'],['security','Security Center'],['kyc','Identification (KYC)'],['settings','Settings'],['support','Support']]}];
const sideNav=act=>`<a class="side-link ${act==='dashboard'?'active':''}" href="dashboard.html"><i class="bi bi-grid-1x2"></i>Dashboard</a>`+GROUPS.map(g=>{const has=g.items.some(x=>x[0]===act),open=has;
 return `<div class="side-group ${open?'open':''} ${has?'has-active':''}" data-g="${g.id}"><button class="side-gh" type="button" aria-expanded="${open}"><i class="bi bi-${g.i} lead"></i>${g.t}<i class="bi bi-chevron-down chev"></i></button><div class="side-sub"><div><ul>${g.items.map(x=>`<li class="${x[2]?'only-sm':''}"><a href="${x[0]}.html" class="${x[0]===act?'active':''}">${x[1]}</a></li>`).join('')}</ul></div></div></div>`}).join('');
const logo=`<a class="brand" href="${CX.authed()?'dashboard':'index'}.html"><img src="assets/img/logo.png" alt="logo">CRYPTX<b>change</b></a>`;
const TR=[['spot','Spot Trade','graph-up-arrow','Buy and sell 350+ coins instantly'],['futures','Futures Trade','lightning-charge','Perpetual contracts up to 50x leverage'],['otc','OTC Trading','briefcase','Large-volume quotes with locked rates']];
const mm=t=>`<a class="mm-item ${t[0]===page?'on':''}" href="${t[0]}.html"><span class="mm-ico"><i class="bi bi-${t[2]}"></i></span><span class="mm-t"><b>${t[1]}</b><small>${t[3]}</small></span></a>`;
const navLinks=()=>`<a class="nav-a ${page==='market'?'active':''}" href="market.html">Market</a><div class="dropdown nav-dd"><a class="nav-a dropdown-toggle ${TR.some(t=>t[0]===page)?'active':''}" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Trade</a><div class="dropdown-menu mm-menu">${TR.map(mm).join('')}</div></div><a class="nav-a ${page==='staking'?'active':''}" href="staking.html">Staking</a>`;
const themeBtn=`<button class="icon-btn" id="themeBtn" title="Toggle theme"><i class="bi bi-moon-stars"></i></button>`;
const termsModal=`<div class="modal fade" id="legalModal" tabindex="-1"><div class="modal-dialog modal-dialog-scrollable"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="legalTitle">Terms &amp; Conditions</h5><button class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body text-muted small"><p>This is a demonstration front-end. No real financial services are provided and no real transactions are executed.</p><p>By using CRYPTXchange you agree to use the platform lawfully, keep your credentials secure and accept the demo terms, fee schedule and privacy practices described here.</p><p>We process only the minimal mock information needed to demonstrate the user experience. You may request data removal at any time through Support.</p></div></div></div></div><div class="modal fade" id="cxModal" tabindex="-1"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header border-0"><h5 class="modal-title"></h5><button class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body"></div><div class="modal-footer border-0"></div></div></div></div><div id="toasts"></div>`;
const footPub=`<footer class="footer"><div class="container"><div class="row g-4"><div class="col-lg-4">${`<a class="brand" href="index.html"><img src="assets/img/logo.png" alt="">CRYPTX<b>change</b></a>`}<p class="text-muted small mt-3 pe-lg-5">A modern crypto exchange experience: trade, swap, stake and earn with institutional-grade security.</p></div>
<div class="col-6 col-lg-2"><h6>Products</h6><a href="spot.html">Spot Trade</a><a href="futures.html">Futures Trade</a><a href="market.html">Market</a><a href="otc.html">OTC Trading</a><a href="staking.html">Staking</a></div>
<div class="col-6 col-lg-2"><h6>Account</h6><a href="login.html">Log in</a><a href="signup.html">Sign up</a><a href="security.html">Security Center</a><a href="kyc.html">KYC</a><a href="rewards.html">My Rewards</a></div>
<div class="col-6 col-lg-2"><h6>Support</h6><a href="support.html">Help Center</a><a href="support.html">Raise a Ticket</a><a href="new-listing.html">New Listing</a></div>
<div class="col-6 col-lg-2"><h6>Legal</h6><a href="#" data-legal="Terms &amp; Conditions">Terms &amp; Conditions</a><a href="#" data-legal="Privacy Policy">Privacy Policy</a></div></div>
<hr><div class="d-flex justify-content-between flex-wrap gap-2 small text-muted"><span>© 2026 CRYPTXchange. Demo project – no real transactions.</span><span>Crypto assets are volatile. Trade responsibly.</span></div></div></footer>`;
const content=$('#page');let html='';
const au=CX.authed();
const acct=au?`${themeBtn}<a href="deposit.html" class="btn btn-primary btn-sm d-none d-sm-inline-block">Deposit</a>
<div class="dropdown"><button class="icon-btn" data-bs-toggle="dropdown" aria-label="Notifications"><i class="bi bi-bell"></i><span class="dot"></span></button><div class="dropdown-menu dropdown-menu-end p-2" style="width:290px"><h6 class="px-2 pt-1">Notifications</h6><div class="dropdown-item small text-wrap">Deposit of 0.25 BTC confirmed</div><div class="dropdown-item small text-wrap">New login from Madurai, IN</div><div class="dropdown-item small text-wrap">Staking reward credited: 12.4 CXT</div><a class="dropdown-item small text-primary" href="history.html">View all in History</a></div></div>
<div class="dropdown"><button class="avatar border-0" data-bs-toggle="dropdown" aria-label="Account">AK</button><ul class="dropdown-menu dropdown-menu-end"><li><a class="dropdown-item" href="dashboard.html"><i class="bi bi-grid-1x2 me-2"></i>Dashboard</a></li><li><a class="dropdown-item" href="profile.html"><i class="bi bi-person me-2"></i>Profile</a></li><li><a class="dropdown-item" href="settings.html"><i class="bi bi-gear me-2"></i>Settings</a></li><li><a class="dropdown-item" href="security.html"><i class="bi bi-shield-lock me-2"></i>Security</a></li><li><hr class="dropdown-divider"></li><li><a class="dropdown-item" href="#" id="logout2"><i class="bi bi-box-arrow-left me-2"></i>Log out</a></li></ul></div>`
:`${themeBtn}<a href="login.html" class="btn btn-soft btn-sm d-none d-sm-inline-block">Log in</a><a href="signup.html" class="btn btn-primary btn-sm">Sign up</a>`;
const search=au?`<div class="input-group d-none d-xl-flex ms-2" style="max-width:240px"><span class="input-group-text"><i class="bi bi-search"></i></span><input id="gSearch" class="form-control" placeholder="Search coins, e.g. BTC"></div>`:'';
const headerHtml=`<nav class="pub-nav"><div class="container-fluid px-3 px-lg-4 d-flex align-items-center gap-2 py-2">${layout==='app'?'<button class="icon-btn d-lg-none" id="menuBtn" aria-label="Open sidebar"><i class="bi bi-layout-sidebar"></i></button>':''}${logo}<div class="d-none d-lg-flex ms-4 gap-1 align-items-center">${navLinks()}</div>${search}<div class="ms-auto d-flex gap-2 align-items-center">${acct}<button class="icon-btn d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#pubMenu" aria-label="Menu"><i class="bi bi-list"></i></button></div></div></nav>
<div class="offcanvas offcanvas-end" id="pubMenu"><div class="offcanvas-header"><h6>Menu</h6><button class="btn-close" data-bs-dismiss="offcanvas"></button></div><div class="offcanvas-body"><a class="side-link" href="market.html">Market</a><div class="side-sec">Trade</div>${TR.map(mm).join('')}<div class="side-sec">Earn</div><a class="side-link" href="staking.html">Staking</a><hr>${au?'<a class="side-link" href="dashboard.html">Dashboard</a><a class="side-link" href="#" id="logout3">Log out</a>':'<a class="side-link" href="login.html">Log in</a><a class="side-link" href="signup.html">Sign up</a>'}</div></div>`;
if(layout==='app'){
const act=page;
html=`${headerHtml}<aside class="app-side" id="side"><div class="side-welcome"><h4>Welcome back, Arun</h4><p>Summary of your crypto portfolio</p></div><nav>${sideNav(act)}</nav>
<div class="side-foot"><div class="side-promo"><b>Unlock higher limits</b><span>Finish KYC to trade without caps.</span></div><a class="side-link" href="#" id="logout"><i class="bi bi-box-arrow-left"></i>Log out</a></div></aside>
<div class="app-main"><main class="app-body ${B.dataset.flush?'flush':''}" id="main"></main><div class="app-foot"><span>© 2026 CRYPTXchange · Demo only</span><span><a href="#" data-legal="Terms &amp; Conditions">Terms</a> · <a href="#" data-legal="Privacy Policy">Privacy</a> · <a href="support.html">Support</a></span></div></div>`;
}else if(layout==='public'){
html=`${headerHtml}<main id="main" class="${['otc','staking'].includes(page)?'container py-4':''}"></main>${['index','spot','futures','market','otc','staking'].includes(page)?footPub:''}`;
}else{
html=`<div class="auth-wrap"><div class="container d-flex justify-content-between align-items-center py-3">${logo}${themeBtn}</div><main id="main" style="flex:1;display:flex"></main></div>`;
}
B.insertAdjacentHTML('afterbegin',html);B.insertAdjacentHTML('beforeend',termsModal);
$('#main').appendChild(content);
/* theme */
const setT=t=>{document.documentElement.setAttribute('data-bs-theme',t);localStorage.setItem('cx_theme',t);const b=$('#themeBtn');if(b)b.innerHTML=`<i class="bi bi-${t==='dark'?'sun':'moon-stars'}"></i>`;document.dispatchEvent(new Event('cxtheme'))};
CX.setTheme=setT;setT(localStorage.getItem('cx_theme')||'dark');
document.addEventListener('click',e=>{
 const gh=e.target.closest('.side-gh');if(gh){const g=gh.parentElement,o=!g.classList.contains('open');$$('.side-group.open').forEach(x=>{if(x!==g){x.classList.remove('open');$('.side-gh',x).setAttribute('aria-expanded','false')}});g.classList.toggle('open',o);gh.setAttribute('aria-expanded',o)}
 const gt=e.target.closest('[data-gate]');if(gt)sessionStorage.setItem('cx_next',page+'.html');
 if(e.target.closest('#themeBtn'))setT(document.documentElement.getAttribute('data-bs-theme')==='dark'?'light':'dark');
 if(e.target.closest('#menuBtn'))$('#side').classList.toggle('open');
 else if($('#side')&&!e.target.closest('#side'))$('#side').classList.remove('open');
 const lg=e.target.closest('[data-legal]');if(lg){e.preventDefault();$('#legalTitle').innerHTML=lg.dataset.legal;bootstrap.Modal.getOrCreateInstance('#legalModal').show()}
 if(e.target.closest('#logout,#logout2,#logout3')){e.preventDefault();localStorage.removeItem('cx_auth');location.href='index.html'}
 const cp=e.target.closest('[data-copy]');if(cp){navigator.clipboard&&navigator.clipboard.writeText(cp.dataset.copy);CX.toast('Copied to clipboard')}
 if(e.target.closest('a[href="#"]:not([data-legal])'))e.preventDefault();
});
const gs=$('#gSearch');if(gs)gs.addEventListener('keydown',e=>{if(e.key==='Enter'){sessionStorage.setItem('cx_q',gs.value);location.href='market.html'}});
/* helpers */
CX.toast=(m)=>{const t=document.createElement('div');t.className='cx-toast';t.textContent=m;$('#toasts').appendChild(t);setTimeout(()=>t.remove(),2800)};
CX.modal=(title,body,ok,fn)=>{const m=$('#cxModal');$('.modal-title',m).innerHTML=title;$('.modal-body',m).innerHTML=body;const f=$('.modal-footer',m);f.innerHTML=ok?`<button class="btn btn-soft" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" id="mOk">${ok}</button>`:`<button class="btn btn-primary" data-bs-dismiss="modal">Close</button>`;const inst=bootstrap.Modal.getOrCreateInstance(m);if(ok)$('#mOk').onclick=()=>{inst.hide();fn&&fn()};inst.show()};
CX.valid=()=>true; /* validation intentionally disabled on all forms */
CX.table=(sel,cols,rows,empty)=>{const el=typeof sel==='string'?$(sel):sel;el.innerHTML=`<div class="tbl-wrap"><table class="table table-hover"><thead><tr>${cols.map(c=>`<th class="${c.cls||''}">${c.h}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.map((r,i)=>`<tr>${cols.map(c=>`<td class="${c.cls||''}">${c.f?c.f(r,i):r[c.k]}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${cols.length}" class="empty">${empty||'No data found'}</td></tr>`}</tbody></table></div>`};
CX.spark=(cv,data,col)=>{const r=devicePixelRatio||1,w=cv.clientWidth||200,h=cv.clientHeight||44;cv.width=w*r;cv.height=h*r;const c=cv.getContext('2d');c.scale(r,r);const mn=Math.min(...data),mx=Math.max(...data);c.beginPath();data.forEach((v,i)=>{const x=i/(data.length-1)*w,y=h-4-(v-mn)/(mx-mn||1)*(h-8);i?c.lineTo(x,y):c.moveTo(x,y)});c.strokeStyle=col;c.lineWidth=2;c.stroke()};
CX.walk=(n,s,vol)=>{const a=[s];for(let i=1;i<n;i++)a.push(a[i-1]*(1+(Math.random()-.48)*vol));return a};
CX.css=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();

/* ---- coin dropdown: native <select> stays as the source of truth, UI shows coin logos ---- */
CX.coinSelect=(sel,kind)=>{
 if(!sel||sel._cs)return;sel._cs=1;
 const desc=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value');
 const wrap=document.createElement('div'),narrow=!!sel.style.maxWidth;
 wrap.className='csel '+(narrow?'end ':'wide ')+sel.className.split(/\s+/).filter(c=>/^(m[tbxyse]?-|w-|flex-)/.test(c)).join(' ');
 if(sel.style.maxWidth){wrap.style.maxWidth=sel.style.maxWidth;wrap.style.width='100%'}
 const small=sel.classList.contains('form-select-sm');
 wrap.innerHTML=`<button type="button" class="form-select csel-btn${small?' form-select-sm':''}" aria-haspopup="listbox" aria-expanded="false"></button><div class="csel-menu" role="listbox"><input class="form-control form-control-sm csel-q" placeholder="Search" aria-label="Search"><div class="csel-list"></div></div>`;
 sel.parentNode.insertBefore(wrap,sel);wrap.appendChild(sel);sel.classList.add('csel-native');sel.tabIndex=-1;
 const btn=$('.csel-btn',wrap),list=$('.csel-list',wrap),q=$('.csel-q',wrap);
 const NET={Mainnet:['Native chain','~10 min',null],ERC20:['Ethereum network','~3 min','ETH'],TRC20:['TRON network','~1 min','TRX'],BEP20:['BNB Smart Chain','~1 min','BNB'],Bitcoin:['Bitcoin network','~10 min','BTC'],Solana:['Solana network','~1 min','SOL']};
 const icon=o=>{if(kind==='net'){const n=NET[o.text];return n&&n[2]?CX.chip(n[2],26):`<img class="coin" src="assets/img/net/mainnet.png" alt="" style="width:26px;height:26px">`}const c=CX.coins.find(x=>x.s===o.text);return c?CX.chip(c.s,26):`<span class="coin csel-all"><i class="bi bi-grid-fill"></i></span>`};
 const meta=o=>{if(kind==='net'){const n=NET[o.text]||['',''];return[n[0],n[1]]}const c=CX.coins.find(x=>x.s===o.text);return c?[c.n,'$'+CX.fmt(c.p)]:['',''] };
 const paint=()=>{const o=sel.options[sel.selectedIndex];if(!o)return;const m=meta(o);btn.innerHTML=`${icon(o)}<b>${o.text}</b><span class="nm">${m[0]}</span>`;
  $$('.csel-opt',list).forEach(b=>{const on=b.dataset.v===sel.value;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)})};
 const build=()=>{list.innerHTML=[...sel.options].map(o=>{const m=meta(o);return`<button type="button" class="csel-opt" role="option" data-v="${o.value}" data-t="${(o.text+' '+m[0]).toLowerCase()}">${icon(o)}<span class="csel-t"><b>${o.text}</b><small>${m[0]}</small></span><span class="csel-p">${m[1]}</span></button>`}).join('')+'<div class="csel-none">No coins found</div>';paint()};
 Object.defineProperty(sel,'value',{configurable:true,get(){return desc.get.call(sel)},set(v){desc.set.call(sel,v);paint()}});
 const close=()=>{wrap.classList.remove('open');btn.setAttribute('aria-expanded','false')};
 const open=()=>{$$('.csel.open').forEach(x=>x!==wrap&&x.classList.remove('open'));wrap.classList.add('open');btn.setAttribute('aria-expanded','true');q.value='';filter();setTimeout(()=>{q.focus();const on=$('.csel-opt.on',list);on&&on.scrollIntoView({block:'nearest'})},20)};
 const filter=()=>{const t=q.value.trim().toLowerCase();let n=0;$$('.csel-opt',list).forEach(b=>{const h=!b.dataset.t.includes(t);b.hidden=h;if(!h)n++});$('.csel-none',list).style.display=n?'none':'block'};
 const pick=v=>{desc.set.call(sel,v);paint();close();sel.dispatchEvent(new Event('input',{bubbles:true}));sel.dispatchEvent(new Event('change',{bubbles:true}));btn.focus()};
 btn.onclick=()=>wrap.classList.contains('open')?close():open();
 q.oninput=filter;
 q.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();const f=$('.csel-opt:not([hidden])',list);f&&pick(f.dataset.v)}};
 wrap.addEventListener('keydown',e=>{if(e.key==='Escape'){close();btn.focus()}});
 list.onclick=e=>{const b=e.target.closest('.csel-opt');if(b)pick(b.dataset.v)};
 document.addEventListener('click',e=>{if(!wrap.contains(e.target))close()});
 const f=sel.closest('form');if(f)f.addEventListener('reset',()=>setTimeout(paint,0));
 build();
};
CX.coinSelects=ids=>ids.forEach(i=>CX.coinSelect(document.getElementById(i)));
CX.netSelects=ids=>ids.forEach(i=>CX.coinSelect(document.getElementById(i),'net'));
/* pages */
window.addEventListener('load',()=>{CX.pages&&CX.pages[page]&&CX.pages[page]();CX.trade&&CX.trade(page);CX.coinSelects(['qbCoin','qtCoin','dCoin','wCoin','hAsset','otcCoin','wlCoin','swFrom','swTo']);CX.netSelects(['dNet','wNet','wlNet'])});
})();
