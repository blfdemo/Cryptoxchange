/* Mock data (front-end only) */
window.CX={};
CX.coins=[['BTC','Bitcoin',67012,-0.56,1840000000,'#f7931a'],['ETH','Ethereum',2407.15,1.21,980000000,'#627eea'],['BNB','BNB',601.8,0.42,310000000,'#f0b90b'],['SOL','Solana',148.35,3.18,520000000,'#9945ff'],['XRP','XRP',0.5234,-1.02,210000000,'#23292f'],['ADA','Cardano',0.4412,0.87,98000000,'#0033ad'],['DOGE','Dogecoin',0.1284,4.55,410000000,'#c2a633'],['TRX','TRON',0.1197,0.15,87000000,'#eb0029'],['AVAX','Avalanche',28.74,-2.31,132000000,'#e84142'],['LINK','Chainlink',14.62,1.94,76000000,'#2a5ada'],['DOT','Polkadot',6.18,-0.74,41000000,'#e6007a'],['LTC','Litecoin',72.9,0.33,58000000,'#345d9d'],['USDT','Tether',1,0.01,5200000000,'#26a17b'],['CXT','CRYPTX Token',0.8421,6.72,12000000,'#c6f432']].map(a=>({s:a[0],n:a[1],p:a[2],c:a[3],v:a[4],col:a[5]}));
CX.coin=s=>CX.coins.find(c=>c.s===s)||CX.coins[0];
CX.fmt=(n,d)=>{n=Number(n);d=d??(Math.abs(n)<1?4:2);return n.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d})};
CX.cdnCoins=['BTC','ETH','BNB','XRP','ADA','DOGE','TRX','LINK','DOT','LTC','USDT','USDC'];
CX.coinSrc=s=>CX.cdnCoins.includes(s)?`https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/128/color/${s.toLowerCase()}.png`:`assets/img/coins/${s}.png`;
CX.chip=(s,z)=>`<img class="coin" alt="${s}" loading="lazy" src="${CX.coinSrc(s)}" onerror="this.onerror=null;this.src='assets/img/coins/${s}.png'"${z?` style="width:${z}px;height:${z}px"`:''}>`;
CX.wallets=[['metamask','MetaMask','Browser & mobile wallet'],['trustwallet','Trust Wallet','Mobile self-custody'],['ledger','Ledger','Hardware wallet'],['phantom','Phantom','Solana & multichain'],['coinbase','Coinbase Wallet','Self-custody wallet'],['walletconnect','WalletConnect','Connect any wallet']];
CX.walletImg=(k,z)=>`<img class="wal" alt="${k}" src="assets/img/wallets/${k}.png"${z?` style="width:${z}px;height:${z}px"`:''}>`;
CX.chg=c=>`<span class="${c>=0?'up':'down'}">${c>=0?'+':''}${c.toFixed(2)}%</span>`;
CX.badge=s=>{const m={Completed:'success',Success:'success',Active:'success',Verified:'success',Filled:'success',Approved:'success',Resolved:'success',Claimed:'success',Pending:'warning',Processing:'warning','In Review':'warning',Open:'primary','Partially Filled':'info',Failed:'danger',Rejected:'danger',Cancelled:'secondary',Closed:'secondary'};return `<span class="bdg bdg-${m[s]||'secondary'}">${s}</span>`};
const R=(()=>{let s=11;return()=>(s=(s*16807)%2147483647)/2147483647})();
const pick=a=>a[Math.floor(R()*a.length)];
const dt=i=>new Date(Date.UTC(2026,9,30,10,0)-i*76e6-R()*3e7).toISOString().slice(0,16).replace('T',' ');
const hex=n=>Array.from({length:n},()=>'0123456789abcdef'[Math.floor(R()*16)]).join('');
const amt=a=>+(({BTC:.02,ETH:.5,USDT:500,SOL:8,BNB:2,XRP:800,ADA:900,DOGE:3000}[a]||1)*(.3+R()*2)).toFixed(a==='USDT'?2:4);
const st=()=>pick(['Completed','Completed','Completed','Pending','Failed']);
const mk=(n,f)=>Array.from({length:n},(_,i)=>f(i));
const A=['BTC','ETH','USDT','SOL','BNB','XRP'];
CX.deposits=mk(8,i=>{const a=pick(A);return{date:dt(i),asset:a,net:pick(['Mainnet','ERC20','TRC20','BEP20']),amount:amt(a),status:st(),tx:'0x'+hex(10)+'…'}});
CX.withdrawals=mk(8,i=>{const a=pick(A);return{date:dt(i),asset:a,net:pick(['Mainnet','ERC20','TRC20','BEP20']),amount:amt(a),fee:'0.0005',status:st(),tx:'0x'+hex(10)+'…'}});
CX.orders=[['BTC/USDT','Buy','Limit',66500,0.15,'Open'],['ETH/USDT','Sell','Limit',2480,2.4,'Partially Filled'],['SOL/USDT','Buy','Stop-limit',142.5,30,'Open'],['BNB/USDT','Sell','Limit',615,5,'Open']].map(a=>({pair:a[0],side:a[1],type:a[2],price:a[3],amount:a[4],status:a[5],date:dt(Math.floor(R()*3))}));
CX.assets=[['BTC',0.4821,0.4],['ETH',6.152,0.2],['USDT',12480.5,0],['SOL',85.3,0.1],['BNB',12.8,0],['XRP',5200,0],['CXT',4500,0]].map(a=>({s:a[0],bal:a[1],locked:a[2]}));
CX.totalUsd=()=>CX.assets.reduce((t,a)=>t+a.bal*CX.coin(a.s).p,0);
CX.devices=[['Chrome on Windows 11','Madurai, IN','Current session'],['Safari on iPhone 15','Chennai, IN','2 days ago'],['Firefox on macOS','Bengaluru, IN','12 days ago']].map(a=>({name:a[0],loc:a[1],last:a[2]}));
CX.logins=mk(6,i=>({date:dt(i),ip:`103.${20+i}.${Math.floor(R()*200)}.${Math.floor(R()*200)}`,device:pick(['Chrome / Windows','Safari / iOS','Firefox / macOS']),loc:pick(['Madurai, IN','Chennai, IN','Bengaluru, IN']),status:pick(['Success','Success','Success','Failed'])}));
CX.wlist=[['USDT','TRC20','TXq9d4…8Kf2','Ledger cold'],['BTC','Bitcoin','bc1qxy2k…q9h5','Main vault'],['ETH','ERC20','0x71C7…976F','Hardware']].map(a=>({coin:a[0],net:a[1],addr:a[2],label:a[3]}));
CX.referrals=mk(6,i=>({user:'user'+Math.floor(100+R()*900)+'@mail.com',date:dt(i*3),status:pick(['Active','Active','Pending']),earn:+(R()*30).toFixed(2)}));
CX.tickets=[['TKT-1042','Withdrawal delayed','Withdraw','High','In Review'],['TKT-1031','KYC document rejected','KYC','Medium','Resolved'],['TKT-1019','2FA reset request','Security','High','Closed'],['TKT-1004','Fee clarification','General','Low','Resolved']].map((a,i)=>({id:a[0],subject:a[1],cat:a[2],prio:a[3],status:a[4],date:dt(i*4+1)}));
CX.activity=[['Deposit','Deposited 0.25 BTC','Completed'],['Trade','Bought 2.0 ETH @ 2,401.10','Filled'],['Staking','Staked 1,000 USDT (Flexible)','Active'],['Withdraw','Withdrew 500 USDT','Processing'],['Referral','Earned 12.40 USDT from referral','Completed']].map((a,i)=>({type:a[0],text:a[1],status:a[2],date:dt(i)}));
CX.stake={Fixed:[['USDT',30,6.5],['USDT',90,9.2],['BTC',60,4.1],['ETH',90,5.8],['CXT',120,18.5]],Flexible:[['USDT',0,3.2],['BTC',0,1.8],['ETH',0,2.6],['SOL',0,5.4],['CXT',0,9.5]]};
CX.tiers=[['Bronze',0,'0%','Standard rewards',0],['Silver',1000,'+1.0%','Priority support',1],['Gold',10000,'+2.5%','Lower trading fees',2],['Platinum',50000,'+4.0%','Dedicated manager',3]];
CX.listings=mk(6,i=>({name:['Nova Chain','Aero Swap','Pixel DAO','Zeta Pay','Orbit AI','Lumen'][i],s:['NOVA','AERO','PXL','ZETA','ORB','LUM'][i],p:+(R()*3+.05).toFixed(4),c:+(R()*40-5).toFixed(2),date:dt(i+1).slice(0,10)}));
// history: unified rows
CX.history={
Deposit:CX.deposits.map(d=>[d.date,'Deposit',`Deposit via ${d.net}`,d.asset,d.amount,d.status]),
Withdraw:CX.withdrawals.map(d=>[d.date,'Withdraw',`Withdraw via ${d.net}`,d.asset,d.amount,d.status]),
Staking:mk(5,i=>[dt(i),'Staking',pick(['Stake subscribed','Reward credited','Redeemed']),pick(['USDT','ETH','CXT']),amt('BNB'),pick(['Completed','Active'])]),
Notification:mk(5,i=>[dt(i),'Notification',pick(['Security alert: new login','Deposit confirmed','KYC update','Price alert BTC']),'-','-','Completed']),
Trade:mk(8,i=>{const a=pick(['BTC','ETH','SOL','BNB']);return[dt(i),'Trade',`${pick(['Buy','Sell'])} ${a}/USDT @ ${CX.fmt(CX.coin(a).p)}`,a,amt(a),'Filled']}),
Login:CX.logins.map(l=>[l.date,'Login',`${l.device} · ${l.ip}`,'-','-',l.status]),
Referral:CX.referrals.map(r=>[r.date,'Referral',`Referral ${r.user}`,'USDT',r.earn,r.status==='Active'?'Completed':'Pending']),
'Order History':mk(7,i=>{const a=pick(['BTC','ETH','SOL','XRP']);return[dt(i),'Order History',`${pick(['Limit','Market','Stop-limit'])} ${pick(['Buy','Sell'])} ${a}/USDT`,a,amt(a),pick(['Filled','Filled','Cancelled'])]})
};
// helpers
CX.download=(name,blob)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)};
CX.exportCSV=(name,head,rows)=>{const q=v=>'"'+String(v).replace(/"/g,'""')+'"';CX.download(name+'.csv',new Blob([[head,...rows].map(r=>r.map(q).join(',')).join('\n')],{type:'text/csv'}))};
CX.exportPDF=(name,title,head,rows)=>{
const esc=s=>String(s).replace(/[\\()]/g,'\\$&').replace(/[^\x20-\x7e]/g,'?');
const lines=[title+'  -  CRYPTXchange','Generated: 2026-10-30','',head.join(' | '),'-'.repeat(100),...rows.map(r=>r.join(' | '))];
const ch=[];for(let i=0;i<lines.length;i+=48)ch.push(lines.slice(i,i+48));
const o=['<</Type/Catalog/Pages 2 0 R>>',null,'<</Type/Font/Subtype/Type1/BaseFont/Courier>>'],k=[];
ch.forEach(c=>{const s='BT /F1 8 Tf 30 810 Td 15 TL '+c.map(l=>'('+esc(l.slice(0,108))+') Tj T*').join(' ')+' ET';const ci=o.length+1;o.push('<</Length '+s.length+'>>\nstream\n'+s+'\nendstream');k.push((o.length+1)+' 0 R');o.push('<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Contents '+ci+' 0 R/Resources<</Font<</F1 3 0 R>>>>>>')});
o[1]='<</Type/Pages/Kids['+k.join(' ')+']/Count '+k.length+'>>';
let p='%PDF-1.4\n',off=[];o.forEach((x,i)=>{off.push(p.length);p+=(i+1)+' 0 obj\n'+x+'\nendobj\n'});
const x=p.length;p+='xref\n0 '+(o.length+1)+'\n0000000000 65535 f \n'+off.map(v=>String(v).padStart(10,'0')+' 00000 n \n').join('')+'trailer\n<</Size '+(o.length+1)+'/Root 1 0 R>>\nstartxref\n'+x+'\n%%EOF';
CX.download(name+'.pdf',new Blob([p],{type:'application/pdf'}))};
