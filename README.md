# CRYPTXchange – static crypto exchange website
Open `index.html` in a browser. No backend; all data is mock (`assets/js/data.js`).
Bootstrap 5.3, Bootstrap Icons (icon font) and the Plus Jakarta Sans font load from CDNs, so an internet connection is needed on first load.

## What changed in v2
- **Validation removed everywhere**: every form has `novalidate`, no required/pattern/min/max attributes, and all JS checks are gone (login, signup, OTP, KYC, withdraw, swap, staking, trade forms, etc.). Any input (or none) is accepted.
- **New design system** (`assets/css/style.css`): dark-first with a lime accent, large radii, pill controls, textured promo cards, light theme still available from the theme toggle.
- **Grouped sidebar** with dropdown sections (Trade, Assets, Rewards & History, Account), a vertical guide line, active marker, and remembered open/closed state.
- **Dashboard rebuilt** as a bento layout: KPI row, monthly performance bars, asset allocation, quick trade, connected wallets, staking card, market, orders, activity.
- **Images**: coins use PNG logos (`CX.chip`), wallets use PNG icons (`assets/img/wallets`). Coin logos load from the cryptocurrency-icons CDN package first and fall back to the local PNG in `assets/img/coins`. Bootstrap's built-in SVG glyphs (select arrow, checkbox tick, switch knob, accordion arrow, close button) are overridden with PNGs in `assets/img/ui`.
- To use official brand artwork, overwrite files in `assets/img/coins/<SYMBOL>.png` and `assets/img/wallets/<name>.png` (same filenames).

## What changed in v3
- **Sidebar accordion**: opening a group now closes the others (click an open group to collapse it).
- **Dashboard**: Asset allocation replaced by an auto-scrolling banner carousel (Staking, Referral, New Listing, Mobile App). Edit the slides in `dashboard.html` (`#dBanners`).
- **Coin dropdowns**: every coin selector (dashboard quick trade, deposit, withdraw, swap from/to, OTC, history asset filter, whitelist, landing quick buy) shows coin logos, names, prices and a search box. Implemented once in `CX.coinSelect` (`app.js`); the native `<select>` stays as the source of truth. To add one, put its id in the `CX.coinSelects([...])` list in `app.js`.
- **Landing page** redesigned as a modern SaaS page: product-preview hero with quick buy, live ticker, stats, markets, feature bento, steps, security, mobile app section, wallets, FAQ and CTA.
- **Mobile app section** (`#app`): App Store / Google Play buttons plus QR codes (`assets/img/qr-ios.png`, `qr-android.png`). The links are placeholders (`apps.apple.com/app/cryptxchange`, `play.google.com/store/apps/details?id=com.cryptxchange.app`). Replace them in `index.html` and regenerate the QR PNGs for your real listings.

## What changed in v4
- Network dropdowns (Mainnet / ERC20 / TRC20 / BEP20) on Deposit, Withdraw and Security now show chain logos, network names and confirm times. Every dropdown has a visible arrow (pure CSS).
- Landing page rebuilt on a centred, symmetric grid: equal-width cards, centred section headings, "View all markets" centred under the table. The wallets section is removed.
- Dashboard banners: floating coins removed, real photo backgrounds.
- Photos are hot-linked from Unsplash (free licence, internet needed) and set as CSS variables `--ph-*` at the top of the v4 block in `style.css`. Credits: Behnam Norouzi, Jakub Żerdzicki, rc.xyz NFT gallery, Luise and Nic, Martin Katler. To use your own photos, change those URLs.

## What changed in v5
- Public header is now: Market · Trade (dropdown: Spot, Futures, OTC, each with icon, title and helper line) · Staking. "Mobile App" is removed from the header (the app section and store buttons remain on the landing page and footer).
- Before login, Market, Spot, Futures, OTC, Staking and New Listing open in the public layout (header only, no sidebar). After login they switch to the sidebar layout.
- Signed-in pages (Dashboard, Wallet, Deposit, Withdraw, Swap, History, Profile, Security, KYC, Settings, Support, Rewards) redirect to the login page when not logged in.

## What changed in v7
- **Login required for trading and staking**: Spot, Futures, OTC and Staking redirect to the login page when signed out (with a "Log in to access…" note), and return you to the page after login / sign-up. Market and New Listing stay public.
- **Same header after login**: the signed-in top bar now carries Market · Trade (Spot, Futures, OTC) · Staking. On desktop, Spot / Futures / OTC are removed from the sidebar; on small screens (no header nav) they remain in the sidebar.
- **Spot terminal** matches the reference screens: Limit / Market / Stop-limit tabs, price, stop-limit, amount, 0-100% diamond slider, total, Avbl and Max Buy/Sell; market orders fill and update balances; Open Orders, Order History, Trade History and Funds tabs.
- **Futures terminal** matches the reference screens: Isolated/Cross, leverage and position-mode chips, "..." menu, Limit / Market / Conditional (stop price with Last/Mark/Index, Limit/Market price type), BBO, size unit switch (coin/USDT), slider, slippage tolerance, TP/SL, Reduce-Only, TIF, Liq Price / Cost / Max, Fee level, transfer, calculator, quiz. All pretend (no backend); quiz state and balance are kept in localStorage (`cx_fut`).
- **One buy/sell colour set**: `--up` #2ebd85 and `--down` #f6465d for buy/sell buttons, toggles, candles, order book and price changes in both themes.
- **Mobile-app promotion removed** (landing hero, app section, footer, FAQ, dashboard banner, QR images). Dashboard banner replaced by a Security slide.
- **Hero dashboard is now a PNG** (`assets/img/hero-dashboard.png`, 2080x1240). Replace the file to change it.

## What changed in v7.1
- **Market, Spot, Futures and OTC are viewable by everyone** (before and after login) and always open full-width under the site header, never inside the sidebar layout. Staking still needs a login.
- **Action buttons for visitors**: Buy / Sell (Spot), Buy/Long / Sell/Short (Futures) and Request a Quote (OTC) are replaced by "Log in or Sign up" buttons; after login you return to the same page. Balances, orders and positions are empty until you log in.
- **Sidebar**: Market, Spot, Futures and OTC removed. Trade now holds Swap and New Listing only.
- **One header everywhere**: the same header (logo, Market, Trade, Staking) is used on the landing page, public pages and inside the dashboard pages; the sidebar sits under it. Only the right-hand side changes: Log in / Sign up for visitors, Deposit / notifications / account menu once signed in.
- **No yellow action colour**: active tabs, slider labels, focus rings and selected states in Spot and Futures use the lime primary colour. Only the MA(7) chart line is still yellow (an indicator, not an action).
