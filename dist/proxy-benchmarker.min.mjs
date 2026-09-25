#!/usr/bin/env node
import ft from"node:fs/promises";import yt from"node:path";import R from"node:process";import fe from"node:process";var Re=[{name:"Google",domain:"google.com",category:"Search / Infra",url:"https://www.google.com/generate_204"},{name:"Cloudflare",domain:"cloudflare.com",category:"CDN / Infra",url:"https://www.cloudflare.com/favicon.ico"},{name:"Cloudflare DNS",domain:"1.1.1.1",category:"DNS / Infra",url:"https://1.1.1.1/cdn-cgi/trace"},{name:"Microsoft",domain:"microsoft.com",category:"Search / Tech",url:"https://www.microsoft.com"},{name:"Apple",domain:"apple.com",category:"Tech / Infra",url:"https://www.apple.com"},{name:"Bing",domain:"bing.com",category:"Search",url:"https://www.bing.com"},{name:"DuckDuckGo",domain:"duckduckgo.com",category:"Search",url:"https://duckduckgo.com"},{name:"Yahoo",domain:"yahoo.com",category:"Portal / Search",url:"https://www.yahoo.com"},{name:"GitHub",domain:"github.com",category:"Developer",url:"https://github.com"},{name:"GitLab",domain:"gitlab.com",category:"Developer",url:"https://gitlab.com"},{name:"Stack Overflow",domain:"stackoverflow.com",category:"Developer",url:"https://stackoverflow.com"},{name:"NPM Registry",domain:"npmjs.com",category:"Developer",url:"https://registry.npmjs.org"},{name:"Docker Hub",domain:"docker.com",category:"Developer",url:"https://hub.docker.com"},{name:"Mozilla MDN",domain:"developer.mozilla.org",category:"Developer",url:"https://developer.mozilla.org"},{name:"Bitbucket",domain:"bitbucket.org",category:"Developer",url:"https://bitbucket.org"},{name:"CDNJS",domain:"cdnjs.cloudflare.com",category:"Developer CDN",url:"https://cdnjs.cloudflare.com/robots.txt"},{name:"OpenAI",domain:"openai.com",category:"AI / Tech",url:"https://openai.com"},{name:"Hugging Face",domain:"huggingface.co",category:"AI / Developer",url:"https://huggingface.co"},{name:"YouTube",domain:"youtube.com",category:"Media / Video",url:"https://www.youtube.com/generate_204"},{name:"Netflix",domain:"netflix.com",category:"Media / Streaming",url:"https://www.netflix.com"},{name:"Spotify",domain:"spotify.com",category:"Media / Audio",url:"https://www.spotify.com"},{name:"Twitch",domain:"twitch.tv",category:"Media / Live",url:"https://www.twitch.tv"},{name:"Vimeo",domain:"vimeo.com",category:"Media / Video",url:"https://vimeo.com"},{name:"SoundCloud",domain:"soundcloud.com",category:"Media / Audio",url:"https://soundcloud.com"},{name:"Reddit",domain:"reddit.com",category:"Social / Community",url:"https://www.reddit.com"},{name:"Wikipedia",domain:"wikipedia.org",category:"Reference",url:"https://en.wikipedia.org"},{name:"X / Twitter",domain:"x.com",category:"Social Media",url:"https://x.com"},{name:"LinkedIn",domain:"linkedin.com",category:"Social / Business",url:"https://www.linkedin.com"},{name:"Instagram",domain:"instagram.com",category:"Social Media",url:"https://www.instagram.com"},{name:"Discord",domain:"discord.com",category:"Communication",url:"https://discord.com"},{name:"Telegram",domain:"telegram.org",category:"Communication",url:"https://telegram.org"},{name:"Slack",domain:"slack.com",category:"Communication",url:"https://slack.com"},{name:"Pinterest",domain:"pinterest.com",category:"Social / Discovery",url:"https://www.pinterest.com"},{name:"Quora",domain:"quora.com",category:"Social / Q&A",url:"https://www.quora.com"},{name:"Tumblr",domain:"tumblr.com",category:"Social / Blogging",url:"https://www.tumblr.com"},{name:"Medium",domain:"medium.com",category:"Social / Publishing",url:"https://medium.com"},{name:"Amazon",domain:"amazon.com",category:"E-Commerce",url:"https://www.amazon.com"},{name:"eBay",domain:"ebay.com",category:"E-Commerce",url:"https://www.ebay.com"},{name:"PayPal",domain:"paypal.com",category:"Fintech / Payment",url:"https://www.paypal.com"},{name:"Stripe",domain:"stripe.com",category:"Fintech / Payment",url:"https://stripe.com"},{name:"Booking.com",domain:"booking.com",category:"Travel / Hospitality",url:"https://www.booking.com"},{name:"Airbnb",domain:"airbnb.com",category:"Travel / Hospitality",url:"https://www.airbnb.com"},{name:"AliExpress",domain:"aliexpress.com",category:"E-Commerce",url:"https://www.aliexpress.com"},{name:"Shopify",domain:"shopify.com",category:"E-Commerce",url:"https://www.shopify.com"},{name:"BBC",domain:"bbc.com",category:"News",url:"https://www.bbc.com"},{name:"CNN",domain:"cnn.com",category:"News",url:"https://www.cnn.com"},{name:"The New York Times",domain:"nytimes.com",category:"News",url:"https://www.nytimes.com"},{name:"The Guardian",domain:"theguardian.com",category:"News",url:"https://www.theguardian.com"},{name:"Reuters",domain:"reuters.com",category:"News / Finance",url:"https://www.reuters.com"},{name:"Dropbox",domain:"dropbox.com",category:"Cloud Storage",url:"https://www.dropbox.com"},{name:"Salesforce",domain:"salesforce.com",category:"Enterprise / SaaS",url:"https://www.salesforce.com"},{name:"Adobe",domain:"adobe.com",category:"Design / Creative",url:"https://www.adobe.com"},{name:"Zoom",domain:"zoom.us",category:"Video Conferencing",url:"https://zoom.us"}];var Be=["safe","home","turbo"],be="safe",We={safe:{candidateLimit:500,tcpConcurrency:35,verificationWorkers:12,websiteWorkers:4,websiteRequestsPerProxy:3,maxCurlProcesses:16,tcpTimeoutMs:1500,timeoutSeconds:4.5,connectTimeoutSeconds:3,websiteTimeoutSeconds:5,websiteConnectTimeoutSeconds:3.5},home:{candidateLimit:2e3,tcpConcurrency:80,verificationWorkers:25,websiteWorkers:8,websiteRequestsPerProxy:5,maxCurlProcesses:64,tcpTimeoutMs:1200,timeoutSeconds:4,connectTimeoutSeconds:3,websiteTimeoutSeconds:4.5,websiteConnectTimeoutSeconds:3},turbo:{candidateLimit:0,tcpConcurrency:1500,verificationWorkers:300,websiteWorkers:100,websiteRequestsPerProxy:25,maxCurlProcesses:1500,tcpTimeoutMs:800,timeoutSeconds:3,connectTimeoutSeconds:2,websiteTimeoutSeconds:3.5,websiteConnectTimeoutSeconds:2.5}},Oe=1e5,Bt=1e5,Ne=600,Fe=1e7;function ie(e,t="preset"){if(e===void 0||e.trim()==="")return be;let o=e.trim().toLowerCase();if(Be.includes(o))return o;throw new Error(`${t} must be one of: ${Be.join(", ")} (got "${e}")`)}function k(e,t,o=Oe){if(!Number.isSafeInteger(e)||e<1||e>o)throw new Error(`${t} must be an integer between 1 and ${o} (got ${e})`);return e}function z(e,t){if(!Number.isFinite(e)||e<=0||e>Ne)throw new Error(`${t} must be a number between 0 and ${Ne} seconds (got ${e})`);return e}function V(e,t="limit"){if(!Number.isSafeInteger(e)||e<0||e>Fe)throw new Error(`${t} must be an integer between 0 and ${Fe}, 0 meaning unlimited (got ${e})`);return e}function he(e,t="maxCurlProcesses"){return k(e,t,Bt)}function J(e,t){let o=Math.max(0,Math.floor(t));return o===0?0:Math.max(1,Math.min(Math.floor(e),o))}function O(e,t,o,n=Oe){let r=e[t];return r===void 0||r.trim()===""?o:k(Number(r.trim()),`environment ${t}`,n)}function De(e,t,o){let n=e[t];return n===void 0||n.trim()===""?V(o,"preset candidateLimit"):V(Number(n.trim()),`environment ${t}`)}function Z(e,t,o){let n=e[t];return n===void 0||n.trim()===""?z(o,"preset timeout"):z(Number(n.trim()),`environment ${t}`)}function K(e,t,o){let n=e[t];if(n===void 0||n.trim()==="")return o;let r=n.trim().toLowerCase();if(["1","true","yes","on"].includes(r))return!0;if(["0","false","no","off"].includes(r))return!1;throw new Error(`environment ${t} must be a boolean (got "${n}")`)}var Nt="1.1.1.1",Ft=2,_e=[{name:"proxifly/free-proxy-list",urls:["https://cdn.jsdelivr.net/gh/proxifly/free-proxy-list@main/proxies/all/data.csv","https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/all/data.csv"]},{name:"proxyscrape/free-proxy-list",urls:["https://cdn.jsdelivr.net/gh/proxyscrape/free-proxy-list@main/proxies/all/data.csv","https://raw.githubusercontent.com/ProxyScrape/free-proxy-list/main/proxies/all/data.csv"]},{name:"hproxy-com/free-proxy-list",urls:["https://cdn.jsdelivr.net/gh/hproxy-com/free-proxy-list@main/live.csv","https://raw.githubusercontent.com/hproxy-com/free-proxy-list/main/live.csv"]},{name:"proxmint/free-proxy-list",urls:["https://cdn.jsdelivr.net/gh/proxmint/free-proxy-list@main/proxies/all.txt","https://raw.githubusercontent.com/proxmint/free-proxy-list/main/proxies/all.txt"]},{name:"proxio-io/proxy-list",urls:["https://cdn.jsdelivr.net/gh/proxio-io/proxy-list@main/all.txt","https://raw.githubusercontent.com/proxio-io/proxy-list/main/all.txt"],defaultProtocol:"http"},{name:"iplocate/free-proxy-list",urls:["https://cdn.jsdelivr.net/gh/iplocate/free-proxy-list@main/all-proxies.txt","https://raw.githubusercontent.com/iplocate/free-proxy-list/main/all-proxies.txt"]},{name:"databay-labs/http",urls:["https://cdn.jsdelivr.net/gh/databay-labs/free-proxy-list@master/http.txt","https://raw.githubusercontent.com/databay-labs/free-proxy-list/master/http.txt"],defaultProtocol:"http"},{name:"databay-labs/socks4",urls:["https://cdn.jsdelivr.net/gh/databay-labs/free-proxy-list@master/socks4.txt","https://raw.githubusercontent.com/databay-labs/free-proxy-list/master/socks4.txt"],defaultProtocol:"socks4"},{name:"databay-labs/socks5",urls:["https://cdn.jsdelivr.net/gh/databay-labs/free-proxy-list@master/socks5.txt","https://raw.githubusercontent.com/databay-labs/free-proxy-list/master/socks5.txt"],defaultProtocol:"socks5"},{name:"monosans/proxy-list",urls:["https://cdn.jsdelivr.net/gh/monosans/proxy-list@main/proxies/all.txt","https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/all.txt"]}],Wt=[{name:"api.ipify.org",url:"https://api.ipify.org",parser:"plain"},{name:"api64.ipify.org",url:"https://api64.ipify.org",parser:"plain"},{name:"ifconfig.me",url:"https://ifconfig.me/ip",parser:"plain"},{name:"icanhazip.com",url:"https://icanhazip.com",parser:"plain"},{name:"ident.me",url:"https://ident.me",parser:"plain"},{name:"checkip.amazonaws.com",url:"https://checkip.amazonaws.com",parser:"plain"},{name:"ip.me",url:"https://ip.me",parser:"ipme"},{name:"api.my-ip.io",url:"https://api.my-ip.io/ip",parser:"plain"},{name:"ipinfo.io",url:"https://ipinfo.io/ip",parser:"plain"},{name:"ifconfig.co",url:"https://ifconfig.co/ip",parser:"plain"},{name:"myexternalip.com",url:"https://myexternalip.com/raw",parser:"plain"}];function Q(e){let t=e.PRESET;return t!==void 0&&t.trim()!==""?ie(t,"environment PRESET"):K(e,"TURBO",!1)?"turbo":K(e,"SAFE",!1)?"safe":be}function Ot(e,t){t.concurrency!==void 0&&(e.concurrency=t.concurrency),t.tcpConcurrency!==void 0&&(e.tcpConcurrency=t.tcpConcurrency),t.websiteWorkers!==void 0&&(e.websiteWorkers=t.websiteWorkers),t.websiteConcurrency!==void 0&&(e.websiteConcurrency=t.websiteConcurrency),t.maxCurlProcesses!==void 0&&(e.maxCurlProcesses=t.maxCurlProcesses),t.limit!==void 0&&(e.limit=t.limit),t.tlsVerify!==void 0&&(e.tlsVerify=t.tlsVerify)}function Dt(e){return k(e.concurrency,"concurrency"),k(e.tcpConcurrency,"tcpConcurrency"),k(e.websiteWorkers,"websiteWorkers"),k(e.websiteConcurrency,"websiteConcurrency"),he(e.maxCurlProcesses),k(e.tcpTimeoutMs,"tcpTimeoutMs"),z(e.timeoutSeconds,"timeoutSeconds"),z(e.connectTimeoutSeconds,"connectTimeoutSeconds"),z(e.websiteTimeoutSeconds,"websiteTimeoutSeconds"),z(e.websiteConnectTimeoutSeconds,"websiteConnectTimeoutSeconds"),k(e.endpointRetries,"endpointRetries"),V(e.limit),e}function ye(e,t={},o={}){let n=We[e],r={concurrency:O(t,"CONCURRENCY",n.verificationWorkers),tcpConcurrency:O(t,"TCP_CONCURRENCY",n.tcpConcurrency),websiteWorkers:O(t,"WEBSITE_WORKERS",n.websiteWorkers),websiteConcurrency:O(t,"WEBSITE_CONCURRENCY",n.websiteRequestsPerProxy),maxCurlProcesses:he(O(t,"MAX_CURL_PROCESSES",n.maxCurlProcesses,1e5)),tcpTimeoutMs:O(t,"TCP_TIMEOUT",n.tcpTimeoutMs),timeoutSeconds:Z(t,"TIMEOUT",n.timeoutSeconds),connectTimeoutSeconds:Z(t,"CONNECT_TIMEOUT",n.connectTimeoutSeconds),websiteTimeoutSeconds:Z(t,"WEBSITE_TIMEOUT",n.websiteTimeoutSeconds),websiteConnectTimeoutSeconds:Z(t,"WEBSITE_CONNECT_TIMEOUT",n.websiteConnectTimeoutSeconds),tlsVerify:K(t,"TLS_VERIFY",!1),cloudflareDns:t.DNS?.trim()||Nt,endpointRetries:O(t,"DNS_RETRIES",Ft),limit:De(t,"LIMIT",n.candidateLimit),fullBenchmark:K(t,"FULL_BENCHMARK",!1),benchmarkTopWebsites:K(t,"BENCHMARK_WEBSITES",!0),feeds:_e,csvUrls:_e[0].urls,testEndpoints:Wt,topWebsites:Re,outputDir:fe.cwd(),outputFiles:{http:"http.txt",https:"https.txt",socks4:"socks4.txt",socks5:"socks5.txt"},reportFiles:{html:"benchmark-report.html",json:"benchmark-report.json"}};return Ot(r,o),Dt(r)}var m=ye(Q(fe.env),fe.env);import He from"node:process";var i={clearLine:"\x1B[2K",reset:"\x1B[0m",bold:"\x1B[1m",dim:"\x1B[2m",green:"\x1B[32m",red:"\x1B[31m",yellow:"\x1B[33m",cyan:"\x1B[36m",blue:"\x1B[34m",magenta:"\x1B[35m",gray:"\x1B[90m"};function s(e=""){He.stdout.write(`${e}
`)}function ae(e){He.stdout.write(`\r${i.clearLine}${e}`)}function je(e){return new Promise(t=>setTimeout(t,e))}function D(e){if(!Number.isFinite(e)||e<0)return"--";let t=Math.round(e),o=Math.floor(t/3600),n=Math.floor(t%3600/60),r=t%60;return o>0?`${o}h ${n}m ${r}s`:n>0?`${n}m ${r}s`:`${r}s`}function ce(e){return!Number.isFinite(e)||e<=0?"0.0/s":`${e.toFixed(1)}/s`}function le(e,t){return t?(e/t*100).toFixed(1):"0.0"}import{execFile as _t}from"node:child_process";import{promisify as Ht}from"node:util";import we from"node:dns/promises";import{isIP as ee}from"node:net";var ze=Ht(_t);async function Ve(){let e=["https://api.ipify.org","https://icanhazip.com","https://ifconfig.me/ip"];for(let t of e)try{let{stdout:o}=await ze("curl",["--silent","--insecure","--max-time","5",t],{timeout:6e3,windowsHide:!0}),n=o.trim();if(ee(n)===4)return n}catch{}return null}async function jt(e,t){try{return await ze(e,t,{timeout:5e3,maxBuffer:1024*1024,windowsHide:!0}),!0}catch{return!1}}async function Ue(){let e=[["curl",["--version"]]];for(let[t,o]of e)if(!await jt(t,o))throw new Error(`Required command not found or not executable: ${t}`)}function te(e){let t=new URL(e);return{protocol:t.protocol.replace(":",""),hostname:t.hostname,port:t.port?Number.parseInt(t.port,10):t.protocol==="https:"?443:80}}async function zt(e,t="1.1.1.1"){try{let o=new we.Resolver({timeout:4e3,tries:2});t&&o.setServers([t]);let r=(await o.resolve4(e)).filter(a=>ee(a)===4);if(r.length>0)return Array.from(new Set(r))}catch{try{let n=(await we.resolve4(e)).filter(r=>ee(r)===4);if(n.length>0)return Array.from(new Set(n))}catch{}}return[]}async function xe(e,t="1.1.1.1",o=3){for(let n=1;n<=o;n++){let r=await zt(e,t);if(r.length>0)return r[(n-1)%r.length]??null;n<o&&await je(1e3)}return null}async function Ke(e,t){s(`${i.cyan}Resolving test endpoints using DNS (${t.cloudflareDns})...${i.reset}`),s(`${i.gray}Retries: ${t.endpointRetries}${i.reset}
`);let o=[],n=[];for(let r of e){let a=te(r.url),c=await xe(a.hostname,t.cloudflareDns,t.endpointRetries);if(!c){n.push(r),s(`  ${i.red}[FAIL]${i.reset} ${r.name.padEnd(24)} ${i.gray}DNS resolution failed -> disabled for this run${i.reset}`);continue}o.push({...r,resolvedIp:c}),s(`  ${i.green}[OK]${i.reset}   ${r.name.padEnd(24)} ${i.gray}${c}${i.reset}`)}if(s(""),o.length===0)throw new Error("No test endpoints could be resolved.");return s(`${i.green}[OK] ${o.length}/${e.length} test endpoints enabled${i.reset}`),n.length>0&&(s(`${i.yellow}[WARN] ${n.length} endpoint(s) disabled because DNS resolution failed.${i.reset}`),s(`${i.gray}Proxies will be tested against the remaining ${o.length} endpoint(s).${i.reset}`)),s(""),o}async function Ge(e,t){let o=[],n=new we.Resolver({timeout:3e3,tries:2});t.cloudflareDns&&n.setServers([t.cloudflareDns]);let r=e.map(async c=>{let l=te(c.url);try{if(ee(l.hostname)===4)return{...c,resolvedIp:l.hostname};let h=(await n.resolve4(l.hostname)).find(u=>ee(u)===4);return{...c,resolvedIp:h}}catch{return c}}),a=await Promise.all(r);return o.push(...a),o}import{execFile as Ut}from"node:child_process";import{promisify as Kt}from"node:util";import{isIP as Vt}from"node:net";function G(e,t){return Vt(e)===4&&Number.isSafeInteger(t)&&t>=1&&t<=65535}function qe(e){return`${e.protocol}://${e.ip}:${e.port}`}function Xe(e){let t=new Set,o=[];for(let n of e){let r=`${n.protocol}:${n.ip}:${n.port}`;t.has(r)||(t.add(r),o.push(n))}return o}function Ye(e){let t=e.trim();if(!t)return[];let o=t.match(/^([a-zA-Z0-9]+):\/\/([0-9.]+):([0-9]+)(?:,([a-zA-Z]{2}))?/);if(o&&o[1]&&o[2]&&o[3]){let r=o[1].toLowerCase(),a=o[2],c=Number.parseInt(o[3],10),l=o[4];if(["http","https","socks4","socks5"].includes(r)&&G(a,c))return[{protocol:r,ip:a,port:c,country:l,raw:t}]}let n=t.match(/^([0-9.]+):([0-9]+)$/);if(n&&n[1]&&n[2]){let r=n[1],a=Number.parseInt(n[2],10);if(G(r,a))return["socks5","http","https","socks4"].map(c=>({protocol:c,ip:r,port:a,raw:`${c}://${r}:${a}`}))}return[]}function ve(e){switch(e.protocol){case"http":return["-x",`http://${e.ip}:${e.port}`];case"https":return["-x",`https://${e.ip}:${e.port}`];case"socks4":return["--socks4a",`${e.ip}:${e.port}`];case"socks5":return["--socks5-hostname",`${e.ip}:${e.port}`];default:return["-x",`${e.protocol}://${e.ip}:${e.port}`]}}var Gt=Kt(Ut);function Je(e,t){let o=e.split(/\r?\n/).map(g=>g.trim()).filter(Boolean);if(o.length===0)return[];let n=o[0]??"",r=(n.includes(",")||n.includes(";"))&&(n.toLowerCase().includes("ip")||n.toLowerCase().includes("protocol")||n.toLowerCase().includes("port")),a=-1,c=-1,l=-1,p=-1;if(r){let g=n.split(/[,;]/).map(d=>d.trim().toLowerCase());a=g.findIndex(d=>d==="protocol"||d==="protocols"||d==="proto"||d==="type"),c=g.findIndex(d=>d==="ip"||d==="host"||d==="ip_address"),l=g.findIndex(d=>d==="port"),p=g.findIndex(d=>d==="country"||d==="country_code"||d==="code")}let h=r?1:0,u=[];for(let g=h;g<o.length;g++){let d=o[g];if(!d)continue;let v=d.match(/^([a-zA-Z0-9]+):\/\/([0-9.]+):([0-9]+)(?:,([a-zA-Z]{2}))?/);if(v&&v[1]&&v[2]&&v[3]){let w=v[1].toLowerCase(),f=v[2],M=Number.parseInt(v[3],10),C=v[4]||void 0;if(["http","https","socks4","socks5"].includes(w)&&G(f,M)){u.push({protocol:w,ip:f,port:M,country:C,raw:d});continue}}let S=d.match(/^([0-9.]+):([0-9]+)$/);if(S&&S[1]&&S[2]){let w=S[1],f=Number.parseInt(S[2],10);if(G(w,f)){t?u.push({protocol:t,ip:w,port:f,raw:`${t}://${w}:${f}`}):u.push({protocol:"http",ip:w,port:f,raw:`http://${w}:${f}`});continue}}let x=d.split(/[,;]/).map(w=>w.trim().replace(/^["']|["']$/g,""));if(x.length>=2){let w=c!==-1?x[c]:x[0]?.includes(".")?x[0]:x[1],f=l!==-1?x[l]:w===x[0]?x[1]:x[2],M=a!==-1?x[a]:w===x[1]?x[0]:t||"http",C=p!==-1?x[p]:void 0;if(!w||!f)continue;let $=Number.parseInt(f,10);if(!G(w,$))continue;let T=(M||"http").toLowerCase().split(/[|,/]/);for(let y of T){let b=y.trim();["http","https","socks4","socks5"].includes(b)&&u.push({protocol:b,ip:w,port:$,country:C||void 0,raw:`${b}://${w}:${$}`})}}}return u}function Ze(e){return Je(e)}async function qt(e,t){for(let o of e.urls)try{let n=new URL(o),r=await xe(n.hostname,t.cloudflareDns,t.endpointRetries),a=["--ipv4","--silent","--show-error","--fail","--connect-timeout","6","--max-time","20","-A","Mozilla/5.0 ProxyBenchmarker"];r&&a.push("--resolve",`${n.hostname}:443:${r}`),a.push(o);let{stdout:c}=await Gt("curl",a,{timeout:25e3,maxBuffer:8*1024*1024,windowsHide:!0});if(c&&c.length>30)return c}catch{}throw new Error(`Failed to fetch feed ${e.name} from all mirrors`)}async function Qe(e){let t=e.feeds;s(`Fetching candidate routes from ${t.length} upstream feeds...
`);let o=[],n=new Set,r=[],a=0;for(let c of t)try{let l=await qt(c,e),p=Je(l,c.defaultProtocol);a+=p.length;let h=0;for(let u of p){let g=`${u.protocol}://${u.ip}:${u.port}`;n.has(g)||(n.add(g),r.push(u),h++)}o.push({name:c.name,count:p.length,status:"OK"}),s(`  ${i.green}[OK]${i.reset} ${c.name.padEnd(30)} ${p.length.toLocaleString().padStart(6)} routes (+${h.toLocaleString()} new)`)}catch{o.push({name:c.name,count:0,status:"FAIL"}),s(`  ${i.yellow}[WARN]${i.reset} ${c.name.padEnd(30)} Fetch failed (skipped)`)}return s(`
${i.bold}Discovered ${a.toLocaleString()} candidate entries across ${t.length} feeds${i.reset}`),s(`${i.bold}${i.cyan}Deduplicated into ${r.length.toLocaleString()} unique routes via Set key normalization${i.reset}
`),{proxies:r,feedStats:o,totalDiscovered:a}}import{execFile as Qt}from"node:child_process";import{promisify as eo}from"node:util";import to from"node:net";import{isIP as Te}from"node:net";import _ from"node:process";var ke=Number.POSITIVE_INFINITY,W=0,pe=0,Se=[];function et(e){ke=Number.isFinite(e)&&e>0?Math.floor(e):Number.POSITIVE_INFINITY,tt()}function tt(){for(;W<ke&&Se.length>0;)Se.shift()?.()}function Xt(){return W<ke?(W++,W>pe&&(pe=W),Promise.resolve()):new Promise(e=>{Se.push(()=>{W++,W>pe&&(pe=W),e()})})}function Yt(){W--,tt()}async function Ce(e){await Xt();try{return await e()}finally{Yt()}}var A={websites:50,avgLatency:20,minLatency:8,connectTime:8,ttfb:7,speed:7},Jt={avgLatencyMs:0,minLatencyMs:0,maxLatencyMs:0,medianLatencyMs:0,avgConnectTimeMs:0,avgTtfbMs:0,avgSpeedBps:0};function oe(e){return e.length===0?0:Math.round(e.reduce((t,o)=>t+o,0)/e.length)}function Zt(e){if(e.length===0)return 0;let t=[...e].sort((a,c)=>a-c),o=Math.floor(t.length/2),n=t[o]??0,r=t[o-1]??0;return t.length%2!==0?n:Math.round((r+n)/2)}function $e(e){if(e.length===0)return{...Jt};let t=e.map(o=>o.totalLatencyMs);return{avgLatencyMs:oe(t),minLatencyMs:Math.min(...t),maxLatencyMs:Math.max(...t),medianLatencyMs:Zt(t),avgConnectTimeMs:oe(e.map(o=>o.connectTimeMs)),avgTtfbMs:oe(e.map(o=>o.ttfbMs)),avgSpeedBps:oe(e.map(o=>o.downloadSpeedBps))}}function ot(e){return oe(e.map(t=>t.totalLatencyMs))}function rt(e,t){return!e||!t?"UNKNOWN":e===t?"SAME_EGRESS_IP":"DIFFERENT_EGRESS_IP"}function nt(e){return e<=0?"SLOW":e<400?"EXCELLENT":e<800?"GOOD":e<1500?"MODERATE":"SLOW"}function q(e,t,o){return Math.max(t,Math.min(o,e))}function Pe(e,t){return!Number.isFinite(t)||t<=0?0:Number.parseFloat((e/t*100).toFixed(1))}function st(e,t){let o=q(t,0,1),n=o*A.websites,r=q(A.avgLatency*(1-e.avgLatencyMs/2500),0,A.avgLatency),a=q(A.minLatency*(1-e.minLatencyMs/1500),0,A.minLatency),c=q(A.connectTime*(1-e.avgConnectTimeMs/800),0,A.connectTime),l=q(A.ttfb*(1-e.avgTtfbMs/1500),0,A.ttfb),p=q(e.avgSpeedBps/(500*1024)*A.speed,0,A.speed),h=(r+a+c+l+p)*o;return{compositeScore:Math.round(n+h),breakdown:{websites:Math.round(n),avgLatency:Math.round(r*o),minLatency:Math.round(a*o),connectTime:Math.round(c*o),ttfb:Math.round(l*o),speed:Math.round(p*o)}}}var at=eo(Qt);function oo(e,t,o=1200){return new Promise(n=>{let r=new to.Socket,a=!1,c=()=>{a||(a=!0,r.removeAllListeners(),r.destroy())};r.setTimeout(o),r.once("connect",()=>{c(),n(!0)}),r.once("timeout",()=>{c(),n(!1)}),r.once("error",()=>{c(),n(!1)}),r.once("close",()=>{a||(c(),n(!1))});try{r.connect(t,e)}catch{c(),n(!1)}})}function ro(e){let t=e.trim().split(/\r?\n/).map(o=>o.trim()).filter(Boolean);for(let o of t)if(Te(o)===4)return o;return null}function no(e){let t=e.match(/<input\b[^>]*\bname=["']ip["'][^>]*\bvalue=["']((?:\d{1,3}\.){3}\d{1,3})["']/i);if(t&&t[1]&&Te(t[1])===4)return t[1];let o=e.match(/<input\b[^>]*\bvalue=["']((?:\d{1,3}\.){3}\d{1,3})["'][^>]*\bname=["']ip["']/i);return o&&o[1]&&Te(o[1])===4?o[1]:null}function so(e,t){return t==="ipme"?no(e):ro(e)}async function it(e,t,o,n){let r=te(t.url),c=["--ipv4","--silent","--show-error","--fail-with-body","--noproxy","","--connect-timeout",String(o.connectTimeoutSeconds||2.5),"--max-time",String(o.timeoutSeconds||3.5),"-A","Mozilla/5.0 ProxyBenchmarker","-w",`
__BENCHMARK__:%{http_code}:%{time_connect}:%{time_appconnect}:%{time_starttransfer}:%{time_total}:%{speed_download}:%{size_download}`,...ve(e)];o.tlsVerify||c.splice(1,0,"--insecure"),t.resolvedIp&&c.push("--resolve",`${r.hostname}:${r.port}:${t.resolvedIp}`),c.push(t.url);let l=(o.timeoutSeconds||3.5)*1e3+1e3,p="",h="",u=0;try{let y=await Ce(()=>at("curl",c,{timeout:l,maxBuffer:1048576,windowsHide:!0,signal:n}));p=y.stdout||"",h=y.stderr||""}catch(y){p=y.stdout||"",h=y.stderr||"",u=y.code??1}let g=0,d=0,v=0,S=0,x=0,w=0,f=0,M=p,C=`
__BENCHMARK__:`,$=p.lastIndexOf(C);if($!==-1){M=p.slice(0,$);let b=p.slice($+C.length).trim().split(":");b.length>=7&&(g=Number.parseInt(b[0]||"0",10)||0,d=Math.round(Number.parseFloat(b[1]||"0")*1e3),v=Math.round(Number.parseFloat(b[2]||"0")*1e3),S=Math.round(Number.parseFloat(b[3]||"0")*1e3),x=Math.round(Number.parseFloat(b[4]||"0")*1e3),w=Number.parseFloat(b[5]||"0")||0,f=Number.parseInt(b[6]||"0",10)||0)}if(u!==0&&g===0)return{name:t.name,url:t.url,resolvedIp:t.resolvedIp,ok:!1,httpCode:g,totalLatencyMs:x,connectTimeMs:d,sslHandshakeMs:v,ttfbMs:S,downloadSpeedBps:w,downloadSizeBytes:f,returnedIp:null,reason:h.trim()||`curl exit code ${u}`};let T=so(M,t.parser);return T?{name:t.name,url:t.url,resolvedIp:t.resolvedIp,ok:!0,httpCode:g,totalLatencyMs:x,connectTimeMs:d,sslHandshakeMs:v,ttfbMs:S,downloadSpeedBps:w,downloadSizeBytes:f,returnedIp:T,reason:null}:{name:t.name,url:t.url,resolvedIp:t.resolvedIp,ok:!1,httpCode:g,totalLatencyMs:x,connectTimeMs:d,sslHandshakeMs:v,ttfbMs:S,downloadSpeedBps:w,downloadSizeBytes:f,returnedIp:null,reason:g>=400?`HTTP ${g}`:"No valid IPv4 returned from endpoint"}}async function io(e,t,o){let n=te(t.url),a=["--ipv4","--silent","--show-error","-o","/dev/null","--noproxy","","--connect-timeout",String(o.websiteConnectTimeoutSeconds||3),"--max-time",String(o.websiteTimeoutSeconds||4.5),"-A","Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36","-w",`
__BENCHMARK__:%{http_code}:%{time_connect}:%{time_appconnect}:%{time_starttransfer}:%{time_total}:%{speed_download}:%{size_download}`,...ve(e)];o.tlsVerify||a.splice(1,0,"--insecure"),t.resolvedIp&&(e.protocol==="http"||e.protocol==="https")&&a.push("--resolve",`${n.hostname}:${n.port}:${t.resolvedIp}`),a.push(t.url);let c=(o.websiteTimeoutSeconds||4.5)*1e3+1e3,l="",p="",h=0;try{let $=await Ce(()=>at("curl",a,{timeout:c,maxBuffer:524288,windowsHide:!0}));l=$.stdout||"",p=$.stderr||""}catch($){l=$.stdout||"",p=$.stderr||"",h=$.code??1}let u=0,g=0,d=0,v=0,S=0,x=0,w=0,f=`
__BENCHMARK__:`,M=l.lastIndexOf(f);if(M!==-1){let T=l.slice(M+f.length).trim().split(":");T.length>=7&&(u=Number.parseInt(T[0]||"0",10)||0,g=Math.round(Number.parseFloat(T[1]||"0")*1e3),d=Math.round(Number.parseFloat(T[2]||"0")*1e3),v=Math.round(Number.parseFloat(T[3]||"0")*1e3),S=Math.round(Number.parseFloat(T[4]||"0")*1e3),x=Number.parseFloat(T[5]||"0")||0,w=Number.parseInt(T[6]||"0",10)||0)}let C=u>=200&&u<400;return{name:t.name,domain:t.domain,category:t.category,url:t.url,ok:C,httpCode:u,totalLatencyMs:S,connectTimeMs:g,sslHandshakeMs:d,ttfbMs:v,downloadSpeedBps:x,downloadSizeBytes:w,reason:C?null:u>0?`HTTP ${u}`:p.trim()||`Exit code ${h}`}}async function ao(e,t,o){let n=[],r=Math.max(o.websiteConcurrency,1),a=!1,c=!1;for(let l=0;l<t.length;l+=r){let p=t.slice(l,l+r),h=await Promise.all(p.map(u=>io(e,u,o)));if(n.push(...h),h.some(u=>u.ok)&&(a=!0),n.length>=r&&!a){c=!0;break}}return{results:n,attempted:n.length,earlyExit:c}}async function co(e,t,o){if(o.fullBenchmark){let l=[],p=null;for(let h of t){let u=await it(e,h,o);l.push(u),u.ok&&!p&&(p=u.returnedIp)}return{isAlive:!!p,exitIp:p,strategy:"full",requestsStarted:t.length,resultsCompleted:l.length,endpointResults:l}}let n=t.slice(0,2),r=n.length,a=new AbortController,c=n.map(async l=>{let p=await it(e,l,o,a.signal);if(p.ok)return p;throw p});try{let l=await Promise.any(c);return a.abort(),await Promise.allSettled(c),{isAlive:!0,exitIp:l.returnedIp,strategy:"fast",requestsStarted:r,resultsCompleted:1,endpointResults:[l]}}catch(l){await Promise.allSettled(c);let p=Array.isArray(l?.errors)?l.errors:[];return{isAlive:!1,exitIp:null,strategy:"fast",requestsStarted:r,resultsCompleted:p.length,endpointResults:p}}}async function ct(e,t,o,n=null){et(o.maxCurlProcesses);let r={http:[],https:[],socks4:[],socks5:[]},a=J(o.tcpConcurrency,e.length),c=o.tcpTimeoutMs;_.stdout.write(`
${i.bold}${i.cyan}>> Stage 1: Async TCP Socket Pre-Filter (${a} parallel sockets)${i.reset}
`);let l=Date.now(),p=0,h=0,u=0,g=0,d=[];function v(){let y=(Date.now()-l)/1e3,b=p>0?p/Math.max(y,.001):0,E=e.length-p,F=b>0?E/b:Number.NaN;ae(`${i.cyan}Stage 1 (TCP)${i.reset} ${le(p,e.length)}% | ${p.toLocaleString()}/${e.length.toLocaleString()} | ${i.green}[OK] ${h} Open${i.reset} | ${i.red}[FAIL] ${u} Closed${i.reset} | ${ce(b)} | ETA ${D(F)}`)}async function S(){for(;;){let y=g;if(y>=e.length)return;g++;let b=e[y];if(!b)continue;let E=await oo(b.ip,b.port,c);p++,E?(h++,d.push(b)):u++,v()}}let x=Array.from({length:a},()=>S());await Promise.all(x),_.stdout.write(`
`);let w=((Date.now()-l)/1e3).toFixed(1);_.stdout.write(`  ${i.green}[OK] Stage 1 Finished in ${w}s${i.reset} - Found ${i.bold}${h.toLocaleString()}${i.reset} open TCP ports (${u.toLocaleString()} dropped)

`);let f=[],M=J(o.concurrency,d.length);if(d.length>0){let re=function(){let L=(Date.now()-y)/1e3,I=b>0?b/Math.max(L,.001):0,B=d.length-b,H=I>0?B/I:Number.NaN;ae(`${i.cyan}Stage 2 (Verify)${i.reset} ${le(b,d.length)}% | ${b.toLocaleString()}/${d.length.toLocaleString()} | ${i.green}[OK] ${E} Alive${i.reset} | ${i.red}[FAIL] ${F} Dropped${i.reset} | ${ce(I)} | ETA ${D(H)}`)};var $=re;_.stdout.write(`${i.bold}${i.cyan}>> Stage 2: Health & Exit IP Verification (${M} parallel workers)${i.reset}
`);let y=Date.now(),b=0,E=0,F=0,X=0;async function me(){for(;;){let L=X;if(L>=d.length)return;X++;let I=d[L];if(I){try{let B=await co(I,t,o);b++,B.isAlive?(E++,f.push({proxy:I,exitIp:B.exitIp,verification:B})):F++}catch{b++,F++}re()}}}let ue=Array.from({length:M},()=>me());await Promise.all(ue),_.stdout.write(`
`);let U=((Date.now()-y)/1e3).toFixed(1);_.stdout.write(`  ${i.green}[OK] Stage 2 Finished in ${U}s${i.reset} - Verified ${i.bold}${E.toLocaleString()}${i.reset} alive proxies (${F.toLocaleString()} dropped)

`)}let C=[];if(f.length>0){let X=function(){let U=(Date.now()-b)/1e3,L=E>0?E/Math.max(U,.001):0,I=f.length-E,B=L>0?I/L:Number.NaN;ae(`${i.cyan}Stage 3 (Sites)${i.reset} ${le(E,f.length)}% | ${E.toLocaleString()}/${f.length.toLocaleString()} | ${ce(L)} | ETA ${D(B)}`)};var T=X;let y=o.benchmarkTopWebsites?o.topWebsites.length:0;_.stdout.write(`${i.bold}${i.cyan}>> Stage 3: Website Reachability (${f.length} alive proxies, ${y} targets, global curl cap ${o.maxCurlProcesses})${i.reset}
`);let b=Date.now(),E=0,F=0,re=J(o.websiteWorkers,f.length);async function me(){for(;;){let U=F;if(U>=f.length)return;F++;let L=f[U];if(!L)continue;let{proxy:I,exitIp:B,verification:H}=L,ne=[],ge=0,Ee=!1;if(o.benchmarkTopWebsites&&o.topWebsites.length>0)try{let j=await ao(I,o.topWebsites,o);ne=j.results,ge=j.attempted,Ee=j.earlyExit}catch{ne=[]}let Ie=H.endpointResults,se=Ie.filter(j=>j.ok),Y=ne.filter(j=>j.ok),wt=ot(se),xt=$e(Y),Me=Y.length>0,vt=Me?"websites":"egress-endpoints",Le=Me?xt:$e(se),{avgLatencyMs:Ae,minLatencyMs:St,maxLatencyMs:kt,medianLatencyMs:Ct,avgConnectTimeMs:$t,avgTtfbMs:Pt,avgSpeedBps:Tt}=Le,Et=rt(B,n),It=nt(Ae),Mt=y>0?Math.min(1,Y.length/y):1,{compositeScore:Lt,breakdown:At}=st(Le,Mt),Rt={proxy:I,status:"PASS",tier:It,compositeScore:Lt,scoreBreakdown:At,exitIp:B,egressStatus:Et,verificationStrategy:H.strategy,endpointsStarted:H.requestsStarted,endpointsCompleted:H.resultsCompleted,endpointsPassed:se.length,endpointsTotal:t.length,endpointPassRatePercent:Pe(se.length,H.resultsCompleted),websitesAvailable:y,websitesAttempted:ge,websitesPassed:Y.length,websitePassRatePercent:Pe(Y.length,ge),websitesEarlyExit:Ee,performanceSource:vt,egressVerificationLatencyMs:wt,avgLatencyMs:Ae,minLatencyMs:St,maxLatencyMs:kt,medianLatencyMs:Ct,avgConnectTimeMs:$t,avgTtfbMs:Pt,avgSpeedBps:Tt,firstFailedEndpoint:null,failureReason:null,endpointDetails:Ie,websiteDetails:ne};r[I.protocol].push(I),C.push(Rt),E++,X()}}let ue=Array.from({length:re},()=>me());await Promise.all(ue),_.stdout.write(`

`)}return C.sort((y,b)=>b.compositeScore!==y.compositeScore?b.compositeScore-y.compositeScore:y.avgLatencyMs-b.avgLatencyMs),C.forEach((y,b)=>{y.rank=b+1}),{results:r,benchmarks:C,stats:{total:e.length,completed:e.length,passed:C.length,failed:e.length-C.length,localPublicIp:n,durationSeconds:(Date.now()-l)/1e3,startedAt:new Date(l).toISOString(),completedAt:new Date().toISOString()}}}var P={trophy:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',globe:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',shield:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',settings:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',copy:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',download:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',search:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',bolt:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',rocket:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',plug:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/></svg>',clock:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',gauge:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>',alert:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>',chevronRight:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',chevronDown:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>'};function lt(){return`
        :root {
            --bg-primary: #090d16;
            --bg-secondary: #0f172a;
            --bg-tertiary: #162036;
            --bg-hover: #1e293b;
            --border: #1e293b;
            --border-light: #334155;
            --border-accent: #38bdf8;
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --text-muted: #64748b;
            --accent: #38bdf8;
            --accent-hover: #0ea5e9;
            --success: #22c55e;
            --success-bg: rgba(34, 197, 94, 0.12);
            --warning: #eab308;
            --warning-bg: rgba(234, 179, 8, 0.12);
            --danger: #ef4444;
            --danger-bg: rgba(239, 68, 68, 0.12);
            --font: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            background-color: var(--bg-primary);
            color: var(--text-primary);
            font-family: var(--font);
            line-height: 1.45;
            padding: 18px 24px;
        }

        .container { max-width: 1680px; margin: 0 auto; }

        .icon {
            display: inline-block;
            width: 1em;
            height: 1em;
            stroke-width: 2;
            stroke: currentColor;
            fill: none;
            vertical-align: -0.125em;
            flex-shrink: 0;
        }

        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--border);
            margin-bottom: 16px;
            flex-wrap: wrap;
            gap: 12px;
        }

        .title-group h1 {
            font-size: 1.5rem;
            font-weight: 800;
            letter-spacing: -0.02em;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .title-group p {
            color: var(--text-secondary);
            font-size: 0.8rem;
            margin-top: 2px;
        }

        .badge-pulse {
            display: inline-block;
            width: 8px;
            height: 8px;
            background-color: var(--success);
            border-radius: 50%;
            box-shadow: 0 0 8px var(--success);
        }

        /* Telemetry Overview Strip (Flat HUD) */
        .telemetry-strip {
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            display: grid;
            grid-template-columns: 1.2fr 2fr;
            margin-bottom: 16px;
            border-radius: 4px;
        }

        @media (max-width: 1100px) {
            .telemetry-strip { grid-template-columns: 1fr; }
        }

        .telemetry-lead {
            padding: 14px 18px;
            border-right: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 8px;
            background: linear-gradient(90deg, rgba(56, 189, 248, 0.05) 0%, transparent 100%);
        }

        @media (max-width: 1100px) {
            .telemetry-lead { border-right: none; border-bottom: 1px solid var(--border); }
        }

        .telemetry-lead-badge {
            font-size: 0.7rem;
            font-weight: 700;
            color: var(--accent);
            letter-spacing: 0.05em;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }

        .telemetry-lead-addr {
            font-size: 1.2rem;
            font-weight: 700;
            color: #ffffff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .telemetry-lead-meta {
            color: var(--text-secondary);
            font-size: 0.75rem;
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            align-items: center;
        }

        .telemetry-lead-metrics {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-top: 4px;
            flex-wrap: wrap;
        }

        .metric-item {
            display: flex;
            flex-direction: column;
        }

        .metric-lbl {
            font-size: 0.68rem;
            color: var(--text-muted);
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.04em;
        }

        .metric-val {
            font-size: 1.1rem;
            font-weight: 700;
            line-height: 1.2;
        }

        .metric-sub {
            font-size: 0.7rem;
            color: var(--text-muted);
        }

        .telemetry-metrics-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
        }

        @media (max-width: 900px) {
            .telemetry-metrics-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .metric-box {
            padding: 12px 16px;
            border-right: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 3px;
        }
        .metric-box:last-child { border-right: none; }

        .proto-strip {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            font-size: 0.72rem;
            color: var(--text-secondary);
        }
        .proto-strip span {
            background: var(--bg-primary);
            padding: 1px 5px;
            border-radius: 3px;
            border: 1px solid var(--border);
        }

        .weights-panel {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 4px;
            padding: 14px 18px;
            margin-bottom: 16px;
            display: none;
        }
        .weights-panel.open { display: block; }

        .weights-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 12px;
            margin-top: 10px;
        }

        .weight-item {
            background-color: var(--bg-primary);
            padding: 8px 12px;
            border-radius: 4px;
            border: 1px solid var(--border);
        }

        .weight-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--text-secondary);
            margin-bottom: 4px;
        }

        .weight-slider {
            width: 100%;
            cursor: pointer;
            accent-color: var(--accent);
        }

        .controls {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 4px;
            padding: 10px 16px;
            margin-bottom: 16px;
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            align-items: center;
            justify-content: space-between;
        }

        .filter-group {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;
        }

        .search-box {
            position: relative;
            display: inline-flex;
            align-items: center;
        }

        .search-box .search-icon {
            position: absolute;
            left: 10px;
            color: var(--text-muted);
            pointer-events: none;
        }

        .search-input {
            background-color: var(--bg-primary);
            border: 1px solid var(--border);
            color: var(--text-primary);
            padding: 6px 12px 6px 30px;
            border-radius: 4px;
            font-size: 0.8rem;
            width: 250px;
            outline: none;
            transition: border-color 0.15s;
        }
        .search-input:focus { border-color: var(--accent); }

        select.filter-select {
            background-color: var(--bg-primary);
            border: 1px solid var(--border);
            color: var(--text-primary);
            padding: 6px 10px;
            border-radius: 4px;
            font-size: 0.8rem;
            outline: none;
            cursor: pointer;
        }

        .btn {
            background-color: var(--bg-tertiary);
            color: var(--text-primary);
            border: 1px solid var(--border-light);
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 0.8rem;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.15s;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .btn:hover { background-color: var(--bg-hover); }

        .btn-primary {
            background-color: var(--accent);
            color: #0b0f19;
            border-color: var(--accent);
            font-weight: 600;
        }
        .btn-primary:hover { background-color: var(--accent-hover); }

        .btn-highlight {
            background-color: rgba(234, 179, 8, 0.12);
            color: var(--warning);
            border-color: rgba(234, 179, 8, 0.3);
            font-weight: 600;
        }
        .btn-highlight:hover { background-color: rgba(234, 179, 8, 0.2); }

        /* Virtual Scrolling Container */
        .table-scroll-container {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 4px;
            height: calc(100vh - 290px);
            min-height: 480px;
            overflow-y: auto;
            overflow-x: auto;
            position: relative;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.8rem;
            text-align: left;
            table-layout: fixed;
        }

        thead {
            position: sticky;
            top: 0;
            z-index: 20;
            background-color: #0b1222;
        }

        th {
            padding: 10px 12px;
            color: var(--text-secondary);
            font-weight: 600;
            font-size: 0.72rem;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            border-bottom: 2px solid var(--border);
            border-right: 1px solid rgba(255, 255, 255, 0.03);
            cursor: pointer;
            user-select: none;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            background-color: #0b1222;
        }

        th:hover { color: var(--text-primary); background-color: var(--bg-hover); }
        th.sort-asc::after { content: " \\25B2"; color: var(--accent); font-size: 0.65rem; }
        th.sort-desc::after { content: " \\25BC"; color: var(--accent); font-size: 0.65rem; }

        td {
            padding: 9px 12px;
            border-bottom: 1px solid var(--border);
            border-right: 1px solid rgba(255, 255, 255, 0.02);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        tbody tr { height: 41px; }
        tbody tr:hover { background-color: var(--bg-hover); }

        .row-expanded { background-color: rgba(56, 189, 248, 0.04) !important; }

        .details-row td {
            padding: 0;
            background-color: #080d1a;
            border-bottom: 2px solid var(--accent);
            white-space: normal;
        }

        .details-container {
            padding: 14px 18px;
        }

        .tab-nav {
            display: flex;
            gap: 6px;
            margin-bottom: 12px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 6px;
        }

        .tab-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            padding: 4px 10px;
            font-size: 0.78rem;
            font-weight: 600;
            cursor: pointer;
            border-radius: 3px;
            transition: all 0.15s;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }
        .tab-btn.active {
            background-color: rgba(56, 189, 248, 0.12);
            color: var(--accent);
        }

        /* High Density Websites Grid (Flat items, no cards) */
        .grid-websites {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 6px;
        }

        .site-item {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-left-width: 3px;
            padding: 6px 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
            min-width: 0;
            border-radius: 2px;
        }
        .site-item:hover { background-color: var(--bg-tertiary); }

        .site-info {
            min-width: 0;
            flex: 1 1 auto;
            overflow: hidden;
        }

        .site-name {
            font-weight: 600;
            font-size: 0.78rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .site-domain {
            font-size: 0.68rem;
            color: var(--text-muted);
            font-family: var(--font-mono);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .site-metrics {
            flex-shrink: 0;
            text-align: right;
        }

        .site-metric-val {
            font-family: var(--font-mono);
            font-size: 0.78rem;
            font-weight: 700;
        }

        .site-metric-sub {
            font-size: 0.68rem;
            font-family: var(--font-mono);
        }

        .font-mono { font-family: var(--font-mono); }

        .pill {
            display: inline-flex;
            align-items: center;
            padding: 1px 6px;
            border-radius: 3px;
            font-size: 0.7rem;
            font-weight: 600;
            text-transform: uppercase;
        }

        .pill-pass { background-color: var(--success-bg); color: var(--success); border: 1px solid rgba(34, 197, 94, 0.3); }
        .pill-fail { background-color: var(--danger-bg); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.3); }
        .pill-protocol { background-color: rgba(56, 189, 248, 0.1); color: var(--accent); font-family: var(--font-mono); font-size: 0.7rem; }

        .rank-pill {
            color: var(--warning);
            font-weight: 700;
            font-family: var(--font-mono);
            font-size: 0.75rem;
        }

        .score-pill {
            font-weight: 700;
            font-size: 0.8rem;
            font-family: var(--font-mono);
            padding: 1px 6px;
            border-radius: 3px;
            cursor: pointer;
        }
        .score-high { background-color: rgba(34, 197, 94, 0.15); color: #4ade80; }
        .score-med { background-color: rgba(234, 179, 8, 0.15); color: #facc15; }
        .score-low { background-color: rgba(239, 68, 68, 0.15); color: #f87171; }

        .latency-badge { font-family: var(--font-mono); font-weight: 600; }
        .latency-fast { color: #4ade80; }
        .latency-med { color: #facc15; }
        .latency-slow { color: #fb923c; }
        .latency-none { color: var(--text-muted); }

        .copy-btn {
            background: none;
            border: 1px solid var(--border-light);
            color: var(--text-secondary);
            cursor: pointer;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 0.7rem;
            transition: all 0.15s;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        .copy-btn:hover { color: var(--text-primary); border-color: var(--accent); }

        .expand-toggle {
            cursor: pointer;
            color: var(--accent);
            user-select: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 14px;
            height: 14px;
        }

        .footer-note {
            text-align: center;
            font-size: 0.75rem;
            color: var(--text-muted);
            margin-top: 14px;
        }

        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--accent);
            color: #0b0f19;
            padding: 8px 14px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 0.8rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            opacity: 0;
            pointer-events: none;
            transform: translateY(8px);
            transition: all 0.2s ease;
            z-index: 1000;
        }
        .toast.show { opacity: 1; transform: translateY(0); }
    `}function pt(e,t){return`
        const RAW_DATA = ${e};
        let benchmarks = RAW_DATA.benchmarks || [];
        let currentSort = { column: 'score', asc: false };
        let expandedRows = new Set();
        let currentSubTabs = {};

        const SVG_ICONS = ${t};

        // Virtual scroll state
        const ROW_HEIGHT = 41;
        const BUFFER_ROWS = 12;
        let filteredAndSortedData = [];
        let itemPositions = [];
        let itemHeights = [];
        let totalContentHeight = 0;
        let isScrollPending = false;

        // Active Scoring Weights (defaults mirror the server-side composite score)
        let weights = {
            websites: 50,
            avgLatency: 20,
            minLatency: 8,
            connectTime: 8,
            ttfb: 7,
            speed: 7,
        };

        function toggleWeightsPanel() {
            const panel = document.getElementById('weights-panel');
            panel.classList.toggle('open');
        }

        function resetDefaultWeights() {
            weights = { websites: 50, avgLatency: 20, minLatency: 8, connectTime: 8, ttfb: 7, speed: 7 };
            document.getElementById('w-websites').value = 50;
            document.getElementById('w-avgLatency').value = 20;
            document.getElementById('w-minLatency').value = 8;
            document.getElementById('w-connectTime').value = 8;
            document.getElementById('w-ttfb').value = 7;
            document.getElementById('w-speed').value = 7;
            updateWeightLabels();
            recalculateAllScores();
        }

        function updateWeights() {
            weights.websites = parseInt(document.getElementById('w-websites').value, 10);
            weights.avgLatency = parseInt(document.getElementById('w-avgLatency').value, 10);
            weights.minLatency = parseInt(document.getElementById('w-minLatency').value, 10);
            weights.connectTime = parseInt(document.getElementById('w-connectTime').value, 10);
            weights.ttfb = parseInt(document.getElementById('w-ttfb').value, 10);
            weights.speed = parseInt(document.getElementById('w-speed').value, 10);
            updateWeightLabels();
            recalculateAllScores();
        }

        function updateWeightLabels() {
            document.getElementById('w-val-websites').textContent = weights.websites + '%';
            document.getElementById('w-val-avgLatency').textContent = weights.avgLatency + '%';
            document.getElementById('w-val-minLatency').textContent = weights.minLatency + '%';
            document.getElementById('w-val-connectTime').textContent = weights.connectTime + '%';
            document.getElementById('w-val-ttfb').textContent = weights.ttfb + '%';
            document.getElementById('w-val-speed').textContent = weights.speed + '%';
        }

        // Maximum points per component, identical to SCORE_WEIGHTS in src/metrics.ts
        const SCORE_MAX = { websites: 50, avgLatency: 20, minLatency: 8, connectTime: 8, ttfb: 7, speed: 7 };

        function rawScoreComponents(item) {
            const usable = item.websitesAvailable > 0 ? (item.websitesPassed / item.websitesAvailable) : 1;
            const ratio = Math.max(0, Math.min(1, usable));
            const clamp = (value, max) => Math.max(0, Math.min(max, value));

            // Performance components are gated by website reachability, exactly
            // like scoreCandidate() in src/metrics.ts.
            return {
                websites: ratio * SCORE_MAX.websites,
                avgLatency: clamp(SCORE_MAX.avgLatency * (1 - (item.avgLatencyMs / 2500)), SCORE_MAX.avgLatency) * ratio,
                minLatency: clamp(SCORE_MAX.minLatency * (1 - (item.minLatencyMs / 1500)), SCORE_MAX.minLatency) * ratio,
                connectTime: clamp(SCORE_MAX.connectTime * (1 - (item.avgConnectTimeMs / 800)), SCORE_MAX.connectTime) * ratio,
                ttfb: clamp(SCORE_MAX.ttfb * (1 - (item.avgTtfbMs / 1500)), SCORE_MAX.ttfb) * ratio,
                speed: clamp((item.avgSpeedBps / (500 * 1024)) * SCORE_MAX.speed, SCORE_MAX.speed) * ratio
            };
        }

        function computeWeightedScore(item) {
            const raw = rawScoreComponents(item);
            const weightTotal = Object.keys(SCORE_MAX).reduce((sum, key) => sum + (weights[key] || 0), 0);
            if (weightTotal <= 0) {
                return { totalScore: 0, breakdown: { websites: 0, avgLatency: 0, minLatency: 0, connectTime: 0, ttfb: 0, speed: 0 } };
            }

            const breakdown = {};
            let total = 0;
            Object.keys(SCORE_MAX).forEach(key => {
                // Raw component points are already gated by website reachability.
                const weighted = (raw[key] / SCORE_MAX[key]) * weights[key];
                total += weighted;
                breakdown[key] = Math.round(weighted);
            });

            return { totalScore: Math.round((total * 100) / weightTotal), breakdown };
        }

        function recalculateAllScores() {
            benchmarks.forEach(item => {
                const res = computeWeightedScore(item);
                item.compositeScore = res.totalScore;
                item.scoreBreakdown = res.breakdown;
            });

            benchmarks.sort((a, b) => {
                if (b.compositeScore !== a.compositeScore) {
                    return b.compositeScore - a.compositeScore;
                }
                return a.avgLatencyMs - b.avgLatencyMs;
            });

            benchmarks.forEach((item, idx) => {
                item.rank = idx + 1;
            });

            updateHeroSummary();
            onFilterChange();
        }

        function updateHeroSummary() {
            const best = benchmarks[0];
            if (!best) return;
            const heroUrl = document.getElementById('hero-proxy-url');
            const heroMeta = document.getElementById('hero-proxy-meta');
            const heroScore = document.getElementById('hero-score');
            const heroLatency = document.getElementById('hero-latency');
            const heroConnect = document.getElementById('hero-connect');
            const heroCopyBtn = document.getElementById('hero-copy-btn');

            if (heroUrl) heroUrl.textContent = \`\${best.proxy.protocol.toUpperCase()}://\${best.proxy.ip}:\${best.proxy.port}\`;
            if (heroMeta) heroMeta.innerHTML = \`<span>\${best.proxy.country || 'Global'}</span> &bull; <span>\${best.egressStatus}</span> &bull; <span>\${best.websitesPassed}/\${best.websitesAttempted} targets probed (\${best.websitesPassed}/\${best.websitesAvailable} reachable)</span>\`;
            if (heroScore) heroScore.textContent = best.compositeScore;
            if (heroLatency) heroLatency.textContent = \`\${best.avgLatencyMs} ms\`;
            if (heroConnect) heroConnect.textContent = \`\${best.avgConnectTimeMs} ms\`;
            if (heroCopyBtn) heroCopyBtn.setAttribute('onclick', \`copyToClipboard('\${best.proxy.protocol}://\${best.proxy.ip}:\${best.proxy.port}')\`);
        }

        function showToast(msg) {
            const toast = document.getElementById('toast');
            toast.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
        }

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('Copied: ' + text);
            }).catch(() => {
                showToast('Failed to copy');
            });
        }

        function copyTop10Urls() {
            const top10 = benchmarks
                .slice(0, 10)
                .map(b => b.proxy.protocol + '://' + b.proxy.ip + ':' + b.proxy.port);
            if (top10.length === 0) {
                showToast('No working proxies available');
                return;
            }
            copyToClipboard(top10.join('\\n'));
            showToast(\`Copied Top \${top10.length} URLs\`);
        }

        function copyPassedUrls() {
            const passed = benchmarks
                .filter(b => b.status === 'PASS')
                .map(b => b.proxy.protocol + '://' + b.proxy.ip + ':' + b.proxy.port);
            if (passed.length === 0) {
                showToast('No alive proxies to copy');
                return;
            }
            copyToClipboard(passed.join('\\n'));
            showToast(\`Copied \${passed.length} verified URLs\`);
        }

        function exportFilteredCsv() {
            const filtered = filteredAndSortedData;
            if (filtered.length === 0) {
                showToast('No rows to export');
                return;
            }
            const headers = ['Rank', 'Score', 'Protocol', 'IP', 'Port', 'Country', 'Status', 'EgressIP', 'EgressProbesStarted', 'EgressProbesPassed', 'WebsitesAvailable', 'WebsitesAttempted', 'WebsitesPassed', 'WebPassRate%', 'PerfSource', 'AvgLatency_ms', 'MinLatency_ms', 'ConnectTime_ms', 'TTFB_ms', 'Speed_Bps', 'ProxyUrl'];
            const rows = filtered.map(b => [
                b.rank || '',
                b.compositeScore || 0,
                b.proxy.protocol,
                b.proxy.ip,
                b.proxy.port,
                b.proxy.country || '',
                b.status,
                b.egressStatus || 'UNKNOWN',
                b.endpointsStarted || 0,
                b.endpointsPassed || 0,
                b.websitesAvailable || 0,
                b.websitesAttempted || 0,
                b.websitesPassed || 0,
                b.websitePassRatePercent || 0,
                b.performanceSource || '',
                b.avgLatencyMs,
                b.minLatencyMs,
                b.avgConnectTimeMs,
                b.avgTtfbMs,
                b.avgSpeedBps,
                b.proxy.protocol + '://' + b.proxy.ip + ':' + b.proxy.port
            ]);

            const csvContent = [headers.join(','), ...rows.map(r => r.map(v => typeof v === 'string' && (v.includes(',') || v.includes('"')) ? \`"\${v}"\` : v).join(','))].join('\\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', \`proxy-telemetry-\${Date.now()}.csv\`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function escapeHtml(str) {
            if (str === null || str === undefined) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        function formatWebsiteDisplay(ws) {
            if (ws.ok) {
                return {
                    val: ws.totalLatencyMs + ' ms',
                    valColor: 'var(--success)',
                    sub: ws.httpCode ? 'HTTP ' + ws.httpCode : '200 OK',
                    subColor: 'var(--text-muted)',
                    title: \`\${ws.name} (\${ws.domain}): \${ws.totalLatencyMs}ms - HTTP \${ws.httpCode || 200}\`
                };
            }

            const reason = ws.reason || '';
            let val = 'FAILED';
            let sub = 'Offline';

            if (ws.httpCode > 0) {
                val = 'HTTP ' + ws.httpCode;
                if (ws.httpCode === 403) sub = 'Forbidden';
                else if (ws.httpCode === 401) sub = 'Unauthorized';
                else if (ws.httpCode === 404) sub = 'Not Found';
                else if (ws.httpCode === 429) sub = 'Rate Limit';
                else if (ws.httpCode === 500) sub = 'Server Error';
                else if (ws.httpCode === 502) sub = 'Bad Gateway';
                else if (ws.httpCode === 503) sub = 'Unavailable';
                else if (ws.httpCode === 504) sub = 'Gateway Timeout';
                else if (ws.httpCode >= 400 && ws.httpCode < 500) sub = 'Client Error';
                else if (ws.httpCode >= 500) sub = 'Server Error';
                else sub = 'Error';
            } else if (/timed out/i.test(reason) || /curl: \\(28\\)/i.test(reason)) {
                val = 'Timed Out';
                sub = 'No Reply';
            } else if (/refused/i.test(reason) || /curl: \\(7\\)/i.test(reason)) {
                val = 'Refused';
                sub = 'Conn Refused';
            } else if (/reset/i.test(reason) || /recv failure/i.test(reason) || /curl: \\(56\\)/i.test(reason)) {
                val = 'Reset';
                sub = 'Conn Dropped';
            } else if (/empty reply/i.test(reason) || /curl: \\(52\\)/i.test(reason)) {
                val = 'Empty Reply';
                sub = '0 Bytes';
            } else if (/ssl|tls|certificate/i.test(reason) || /curl: \\((35|60)\\)/i.test(reason)) {
                val = 'SSL Error';
                sub = 'Handshake Fail';
            } else if (/resolve|dns/i.test(reason) || /curl: \\(6\\)/i.test(reason)) {
                val = 'DNS Error';
                sub = 'Unresolved';
            } else if (reason) {
                val = reason.length > 14 ? reason.slice(0, 14) + '...' : reason;
                sub = 'Failed';
            }

            return {
                val,
                valColor: 'var(--danger)',
                sub,
                subColor: 'rgba(239, 68, 68, 0.8)',
                title: \`\${ws.name} (\${ws.domain}): \${reason || ('HTTP ' + ws.httpCode)}\`
            };
        }

        function formatSpeed(bytesPerSec) {
            if (!bytesPerSec || bytesPerSec <= 0) return '--';
            if (bytesPerSec < 1024) return bytesPerSec.toFixed(0) + ' B/s';
            if (bytesPerSec < 1024 * 1024) return (bytesPerSec / 1024).toFixed(1) + ' KB/s';
            return (bytesPerSec / (1024 * 1024)).toFixed(2) + ' MB/s';
        }

        function getLatencyClass(ms, status) {
            if (status !== 'PASS' || ms <= 0) return 'latency-none';
            if (ms < 400) return 'latency-fast';
            if (ms < 1000) return 'latency-med';
            return 'latency-slow';
        }

        function getScoreClass(score) {
            if (score >= 80) return 'score-high';
            if (score >= 50) return 'score-med';
            return 'score-low';
        }

        function ipToNumber(ip) {
            return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
        }

        function getFilteredData() {
            const query = (document.getElementById('search-input').value || '').trim().toLowerCase();
            const proto = document.getElementById('protocol-filter').value;
            const tier = document.getElementById('tier-filter').value;

            return benchmarks.filter(b => {
                if (proto !== 'ALL' && b.proxy.protocol !== proto) return false;
                if (tier !== 'ALL' && b.tier !== tier) return false;

                if (query) {
                    const matchIp = b.proxy.ip.includes(query);
                    const matchPort = String(b.proxy.port).includes(query);
                    const matchCountry = (b.proxy.country || '').toLowerCase().includes(query);
                    const matchProto = b.proxy.protocol.toLowerCase().includes(query);
                    if (!matchIp && !matchPort && !matchCountry && !matchProto) return false;
                }
                return true;
            });
        }

        function sortData(data) {
            const { column, asc } = currentSort;
            const modifier = asc ? 1 : -1;

            return [...data].sort((a, b) => {
                let vA, vB;
                switch (column) {
                    case 'rank':
                        vA = a.rank || 99999;
                        vB = b.rank || 99999;
                        break;
                    case 'score':
                        vA = a.compositeScore || 0;
                        vB = b.compositeScore || 0;
                        break;
                    case 'ip':
                        vA = ipToNumber(a.proxy.ip);
                        vB = ipToNumber(b.proxy.ip);
                        break;
                    case 'protocol':
                        vA = a.proxy.protocol;
                        vB = b.proxy.protocol;
                        break;
                    case 'country':
                        vA = a.proxy.country || '';
                        vB = b.proxy.country || '';
                        break;
                    case 'status':
                        vA = a.status;
                        vB = b.status;
                        break;
                    case 'egress':
                        vA = a.egressStatus || '';
                        vB = b.egressStatus || '';
                        break;
                    case 'websites':
                        vA = a.websitesPassed || 0;
                        vB = b.websitesPassed || 0;
                        break;
                    case 'avgLatency':
                        vA = a.status === 'PASS' ? a.avgLatencyMs : 99999999;
                        vB = b.status === 'PASS' ? b.avgLatencyMs : 99999999;
                        break;
                    case 'minLatency':
                        vA = a.status === 'PASS' ? a.minLatencyMs : 99999999;
                        vB = b.status === 'PASS' ? b.minLatencyMs : 99999999;
                        break;
                    case 'connectTime':
                        vA = a.status === 'PASS' ? a.avgConnectTimeMs : 99999999;
                        vB = b.status === 'PASS' ? b.avgConnectTimeMs : 99999999;
                        break;
                    case 'ttfb':
                        vA = a.status === 'PASS' ? a.avgTtfbMs : 99999999;
                        vB = b.status === 'PASS' ? b.avgTtfbMs : 99999999;
                        break;
                    case 'speed':
                        vA = a.avgSpeedBps || 0;
                        vB = b.avgSpeedBps || 0;
                        break;
                    default:
                        vA = a.compositeScore || 0;
                        vB = b.compositeScore || 0;
                }

                if (typeof vA === 'string') {
                    return vA.localeCompare(vB) * modifier;
                }
                return (vA - vB) * modifier;
            });
        }

        function getItemHeight(item) {
            const p = item.proxy;
            const pKey = \`\${p.protocol}_\${p.ip}_\${p.port}\`;
            if (!expandedRows.has(pKey)) {
                return ROW_HEIGHT;
            }
            const activeTab = currentSubTabs[pKey] || 'websites';
            if (activeTab === 'websites') {
                const count = (item.websiteDetails || []).length || 50;
                const rows = Math.ceil(count / 4);
                return ROW_HEIGHT + 44 + (rows * 38) + 20;
            } else {
                const count = (item.endpointDetails || []).length || 11;
                return ROW_HEIGHT + 44 + (count * 30) + 38;
            }
        }

        function computePositions() {
            itemPositions = new Array(filteredAndSortedData.length);
            itemHeights = new Array(filteredAndSortedData.length);
            let currentY = 0;
            for (let i = 0; i < filteredAndSortedData.length; i++) {
                itemPositions[i] = currentY;
                const h = getItemHeight(filteredAndSortedData[i]);
                itemHeights[i] = h;
                currentY += h;
            }
            totalContentHeight = currentY;
        }

        function findStartIndex(scrollTop) {
            let low = 0, high = itemPositions.length - 1;
            let index = 0;
            while (low <= high) {
                const mid = (low + high) >> 1;
                if (itemPositions[mid] <= scrollTop) {
                    index = mid;
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }
            return Math.max(0, index - BUFFER_ROWS);
        }

        function findEndIndex(scrollBottom) {
            let low = 0, high = itemPositions.length - 1;
            let index = itemPositions.length - 1;
            while (low <= high) {
                const mid = (low + high) >> 1;
                if (itemPositions[mid] >= scrollBottom) {
                    index = mid;
                    high = mid - 1;
                } else {
                    low = mid + 1;
                }
            }
            return Math.min(itemPositions.length, index + 1 + BUFFER_ROWS);
        }

        function toggleRow(proxyKey) {
            if (expandedRows.has(proxyKey)) {
                expandedRows.delete(proxyKey);
            } else {
                expandedRows.add(proxyKey);
                if (!currentSubTabs[proxyKey]) {
                    currentSubTabs[proxyKey] = 'websites';
                }
            }
            computePositions();
            renderVirtualRows();
        }

        function switchSubTab(proxyKey, tabName) {
            currentSubTabs[proxyKey] = tabName;
            computePositions();
            renderVirtualRows();
        }

        function renderRowHtml(item) {
            const p = item.proxy;
            const pKey = \`\${p.protocol}_\${p.ip}_\${p.port}\`;
            const isExpanded = expandedRows.has(pKey);
            const fullUrl = \`\${p.protocol}://\${p.ip}:\${p.port}\`;
            const activeTab = currentSubTabs[pKey] || 'websites';

            const bd = item.scoreBreakdown || {};
            const tooltipText = \`Websites: \${bd.websites || 0} pts | Avg Lat: \${bd.avgLatency || 0} pts | Min Lat: \${bd.minLatency || 0} pts | Connect: \${bd.connectTime || 0} pts | TTFB: \${bd.ttfb || 0} pts | Speed: \${bd.speed || 0} pts\`;

            const latencyClass = getLatencyClass(item.avgLatencyMs, item.status);
            const statusPill = item.status === 'PASS' 
                ? '<span class="pill pill-pass">PASS</span>'
                : '<span class="pill pill-fail">FAIL</span>';

            let out = \`
            <tr class="\${isExpanded ? 'row-expanded' : ''}">
                <td style="text-align: center;">
                    <span class="expand-toggle" onclick="toggleRow('\${pKey}')">\${isExpanded ? SVG_ICONS.chevronDown : SVG_ICONS.chevronRight}</span>
                </td>
                <td>
                    <span class="rank-pill">#\${item.rank}</span>
                </td>
                <td>
                    <span class="score-pill \${getScoreClass(item.compositeScore)}" title="\${tooltipText}">\${item.compositeScore}</span>
                </td>
                <td class="font-mono" style="font-weight: 600;">
                    <a href="javascript:void(0)" onclick="toggleRow('\${pKey}')" style="color: var(--text-primary); text-decoration: none;">\${p.ip}:\${p.port}</a>
                </td>
                <td><span class="pill pill-protocol">\${p.protocol.toUpperCase()}</span></td>
                <td>\${p.country || '--'}</td>
                <td>\${statusPill}</td>
                <td style="font-size: 0.72rem;">\${item.egressStatus || '--'}</td>
                <td class="font-mono">
                    \${item.websitesPassed}/\${item.websitesAttempted} probed, \${item.websitesPassed}/\${item.websitesAvailable} ok (\${item.websitePassRatePercent}%)
                </td>
                <td class="latency-badge \${latencyClass}">\${item.avgLatencyMs + ' ms'}</td>
                <td class="font-mono \${latencyClass}">\${item.minLatencyMs + ' ms'}</td>
                <td class="font-mono">\${item.avgConnectTimeMs + ' ms'}</td>
                <td class="font-mono">\${item.avgTtfbMs + ' ms'}</td>
                <td class="font-mono">\${formatSpeed(item.avgSpeedBps)}</td>
                <td>
                    <button class="copy-btn" onclick="copyToClipboard('\${fullUrl}')" title="Copy URL">\${SVG_ICONS.copy} Copy</button>
                </td>
            </tr>
            \`;

            if (isExpanded) {
                out += \`
                <tr class="details-row">
                    <td colspan="15">
                        <div class="details-container">
                            <div class="tab-nav">
                                <button class="tab-btn \${activeTab === 'websites' ? 'active' : ''}" onclick="switchSubTab('\${pKey}', 'websites')">\${SVG_ICONS.globe} Top 50 Websites (\${item.websitesPassed || 0}/\${item.websitesTotal || 50})</button>
                                <button class="tab-btn \${activeTab === 'endpoints' ? 'active' : ''}" onclick="switchSubTab('\${pKey}', 'endpoints')">\${SVG_ICONS.search} Verification Endpoints (\${item.endpointsPassed || 0}/\${item.endpointsTotal || 11})</button>
                            </div>

                            \${activeTab === 'websites' ? \`
                                <div class="grid-websites">
                                    \${(item.websiteDetails || []).map(ws => {
                                        const d = formatWebsiteDisplay(ws);
                                        return \`
                                        <div class="site-item" style="border-left-color: \${ws.ok ? 'var(--success)' : 'var(--danger)'};" title="\${escapeHtml(d.title)}">
                                            <div class="site-info">
                                                <div class="site-name">\${escapeHtml(ws.name)}</div>
                                                <div class="site-domain">\${escapeHtml(ws.domain)}</div>
                                            </div>
                                            <div class="site-metrics">
                                                <div class="site-metric-val" style="color: \${d.valColor};">\${escapeHtml(d.val)}</div>
                                                <div class="site-metric-sub" style="color: \${d.subColor};">\${escapeHtml(d.sub)}</div>
                                            </div>
                                        </div>
                                        \`;
                                    }).join('') || '<div style="color: var(--text-muted); padding: 8px;">No website test data recorded.</div>'}
                                </div>
                            \` : \`
                                <table style="width: 100%; font-size: 0.75rem; background: var(--bg-secondary);">
                                    <thead>
                                        <tr>
                                            <th>Endpoint</th>
                                            <th>Resolved IP</th>
                                            <th>Status</th>
                                            <th>HTTP Code</th>
                                            <th>Connect</th>
                                            <th>TTFB</th>
                                            <th>Total Latency</th>
                                            <th>Returned IP</th>
                                            <th>Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        \${item.endpointDetails.map(ep => \`
                                            <tr>
                                                <td class="font-mono"><strong>\${escapeHtml(ep.name)}</strong></td>
                                                <td class="font-mono" style="color: var(--text-muted);">\${escapeHtml(ep.resolvedIp || '--')}</td>
                                                <td>\${ep.ok ? '<span class="pill pill-pass">PASS</span>' : '<span class="pill pill-fail">FAIL</span>'}</td>
                                                <td class="font-mono">\${ep.httpCode || '--'}</td>
                                                <td class="font-mono">\${ep.connectTimeMs > 0 ? ep.connectTimeMs + ' ms' : '--'}</td>
                                                <td class="font-mono">\${ep.ttfbMs > 0 ? ep.ttfbMs + ' ms' : '--'}</td>
                                                <td class="font-mono" style="font-weight: 600; color: \${ep.ok ? 'var(--success)' : 'var(--danger)'};">\${ep.totalLatencyMs > 0 ? ep.totalLatencyMs + ' ms' : '--'}</td>
                                                <td class="font-mono" style="color: var(--accent);">\${escapeHtml(ep.returnedIp || '--')}</td>
                                                <td style="color: \${ep.ok ? 'var(--text-muted)' : 'var(--danger)'}; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="\${escapeHtml(ep.reason || 'OK')}">\${escapeHtml(ep.reason || 'OK')}</td>
                                            </tr>
                                        \`).join('')}
                                    </tbody>
                                </table>
                            \`}
                        </div>
                    </td>
                </tr>
                \`;
            }

            return out;
        }

        function renderVirtualRows() {
            const container = document.getElementById('table-scroll-container');
            const tbody = document.getElementById('table-body');
            const countLabel = document.getElementById('filtered-count');

            countLabel.textContent = \`Showing \${filteredAndSortedData.length.toLocaleString()} / \${benchmarks.length.toLocaleString()} verified\`;

            if (filteredAndSortedData.length === 0) {
                tbody.innerHTML = '<tr><td colspan="15" style="text-align: center; padding: 40px; color: var(--text-muted);">No proxies match the selected filters.</td></tr>';
                return;
            }

            const scrollTop = container.scrollTop;
            const clientHeight = container.clientHeight;
            const scrollBottom = scrollTop + clientHeight;

            const startIndex = findStartIndex(scrollTop);
            const endIndex = findEndIndex(scrollBottom);

            const topSpacerHeight = itemPositions[startIndex] || 0;
            const endPos = endIndex < itemPositions.length ? itemPositions[endIndex] : totalContentHeight;
            const bottomSpacerHeight = Math.max(0, totalContentHeight - endPos);

            let html = '';

            if (topSpacerHeight > 0) {
                html += \`<tr style="height: \${topSpacerHeight}px; border: none;"><td colspan="15" style="padding: 0; border: none; height: \${topSpacerHeight}px;"></td></tr>\`;
            }

            for (let i = startIndex; i < endIndex; i++) {
                html += renderRowHtml(filteredAndSortedData[i]);
            }

            if (bottomSpacerHeight > 0) {
                html += \`<tr style="height: \${bottomSpacerHeight}px; border: none;"><td colspan="15" style="padding: 0; border: none; height: \${bottomSpacerHeight}px;"></td></tr>\`;
            }

            tbody.innerHTML = html;
        }

        function onFilterChange() {
            const filtered = getFilteredData();
            filteredAndSortedData = sortData(filtered);
            computePositions();
            renderVirtualRows();
        }

        function setupVirtualScroll() {
            const container = document.getElementById('table-scroll-container');
            container.addEventListener('scroll', () => {
                if (!isScrollPending) {
                    requestAnimationFrame(() => {
                        renderVirtualRows();
                        isScrollPending = false;
                    });
                    isScrollPending = true;
                }
            }, { passive: true });

            window.addEventListener('resize', () => {
                computePositions();
                renderVirtualRows();
            });
        }

        function setupSorting() {
            const headers = document.querySelectorAll('#proxy-table th[data-sort]');
            headers.forEach(header => {
                header.addEventListener('click', () => {
                    const column = header.getAttribute('data-sort');
                    if (currentSort.column === column) {
                        currentSort.asc = !currentSort.asc;
                    } else {
                        currentSort.column = column;
                        currentSort.asc = (column === 'score' || column === 'websites' || column === 'speed') ? false : true;
                    }

                    headers.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
                    header.classList.add(currentSort.asc ? 'sort-asc' : 'sort-desc');
                    onFilterChange();
                });
            });
        }

        window.addEventListener('DOMContentLoaded', () => {
            setupSorting();
            setupVirtualScroll();
            onFilterChange();
        });
    `}function dt(e,t,o,n){let r=e.length>0?e[0]:null,a=e.length>0?Math.round(e.reduce((g,d)=>g+d.avgLatencyMs,0)/e.length):0,c=e.length>0?[...e].sort((g,d)=>g.avgLatencyMs-d.avgLatencyMs)[0]:null,l={http:{total:0,passed:0},https:{total:0,passed:0},socks4:{total:0,passed:0},socks5:{total:0,passed:0}};for(let g of e){let d=g.proxy.protocol;l[d]&&(l[d].total++,g.status==="PASS"&&l[d].passed++)}let p=JSON.stringify({generatedAt:t.completedAt||new Date().toISOString(),stats:t,localPublicIp:t.localPublicIp,endpoints:o,benchmarks:e}),h=lt(),u=pt(p,JSON.stringify(P));return`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proxy Benchmark & Network Telemetry</title>
    <style>${h}</style>
</head>
<body>
    <div class="container">
        <header>
            <div class="title-group">
                <h1><span class="badge-pulse"></span> Proxy Benchmark & Network Telemetry</h1>
                <p>Origin IP: <span class="font-mono">${t.localPublicIp||"Direct"}</span> &bull; Telemetry across 50 global edge endpoints</p>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button class="btn" onclick="toggleWeightsPanel()">${P.settings} Scoring Weights</button>
                <button class="btn btn-highlight" onclick="copyTop10Urls()">${P.copy} Copy Top 10</button>
                <button class="btn" onclick="copyPassedUrls()">${P.copy} Copy All Verified</button>
                <button class="btn btn-primary" onclick="exportFilteredCsv()">${P.download} Export CSV</button>
            </div>
        </header>

        <!-- Dynamic Scoring Weights Panel -->
        <div id="weights-panel" class="weights-panel">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-size: 0.85rem; font-weight: 700; color: var(--accent); display: flex; align-items: center; gap: 6px;">${P.settings} Ranking Weights</h3>
                <button class="btn" style="padding: 2px 8px; font-size: 0.7rem;" onclick="resetDefaultWeights()">Reset Defaults</button>
            </div>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Recalculate composite rankings in real time. Defaults match the server-side score.</p>
            <div class="weights-grid">
                <div class="weight-item">
                    <div class="weight-header"><span>${P.globe} Website Reachability</span><span id="w-val-websites">50%</span></div>
                    <input type="range" class="weight-slider" id="w-websites" min="0" max="50" value="50" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${P.bolt} Avg Latency</span><span id="w-val-avgLatency">20%</span></div>
                    <input type="range" class="weight-slider" id="w-avgLatency" min="0" max="20" value="20" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${P.rocket} Min Latency</span><span id="w-val-minLatency">8%</span></div>
                    <input type="range" class="weight-slider" id="w-minLatency" min="0" max="8" value="8" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${P.plug} Connect Time</span><span id="w-val-connectTime">8%</span></div>
                    <input type="range" class="weight-slider" id="w-connectTime" min="0" max="8" value="8" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${P.clock} TTFB</span><span id="w-val-ttfb">7%</span></div>
                    <input type="range" class="weight-slider" id="w-ttfb" min="0" max="7" value="7" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${P.gauge} Bandwidth</span><span id="w-val-speed">7%</span></div>
                    <input type="range" class="weight-slider" id="w-speed" min="0" max="7" value="7" oninput="updateWeights()">
                </div>
            </div>
        </div>

        <!-- Telemetry Overview Strip (No Cards) -->
        <div class="telemetry-strip">
            <div class="telemetry-lead" id="telemetry-optimal-lead">
                <div class="telemetry-lead-badge font-mono">${P.trophy} OPTIMAL ROUTE</div>
                <div class="telemetry-lead-addr font-mono" id="hero-proxy-url">${r?`${r.proxy.protocol.toUpperCase()}://${r.proxy.ip}:${r.proxy.port}`:"No working route found"}</div>
                <div class="telemetry-lead-meta" id="hero-proxy-meta">
                    ${r?`<span>${r.proxy.country||"Global"}</span> &bull; <span>${r.egressStatus}</span> &bull; <span>${r.websitesPassed}/${r.websitesAttempted} targets probed (${r.websitesPassed}/${r.websitesAvailable} reachable)</span>`:'<span style="color: var(--danger);">No proxies passed verification</span>'}
                </div>
                <div class="telemetry-lead-metrics">
                    <div class="metric-item">
                        <span class="metric-lbl">Score</span>
                        <span class="metric-val font-mono" id="hero-score" style="color: var(--accent);">${r?r.compositeScore:"--"}</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-lbl">Avg Latency</span>
                        <span class="metric-val font-mono" id="hero-latency" style="color: var(--success);">${r?r.avgLatencyMs+" ms":"--"}</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-lbl">Connect</span>
                        <span class="metric-val font-mono" id="hero-connect">${r?r.avgConnectTimeMs+" ms":"--"}</span>
                    </div>
                    ${r?`<div><button class="btn btn-primary" id="hero-copy-btn" onclick="copyToClipboard('${r.proxy.protocol}://${r.proxy.ip}:${r.proxy.port}')">${P.copy} Copy URL</button></div>`:""}
                </div>
            </div>
            <div class="telemetry-metrics-grid">
                <div class="metric-box">
                    <span class="metric-lbl">Scanned</span>
                    <span class="metric-val font-mono">${t.total.toLocaleString()}</span>
                    <span class="metric-sub">${D(t.durationSeconds)}</span>
                </div>
                <div class="metric-box">
                    <span class="metric-lbl">Verified</span>
                    <span class="metric-val font-mono" style="color: var(--success);">${t.passed.toLocaleString()}</span>
                    <span class="metric-sub">${(t.passed/Math.max(t.total,1)*100).toFixed(1)}% alive</span>
                </div>
                <div class="metric-box">
                    <span class="metric-lbl">Dropped</span>
                    <span class="metric-val font-mono" style="color: var(--danger);">${t.failed.toLocaleString()}</span>
                    <span class="metric-sub">Excluded</span>
                </div>
                <div class="metric-box">
                    <span class="metric-lbl">Avg Latency</span>
                    <span class="metric-val font-mono" style="color: var(--accent);">${a>0?a+" ms":"--"}</span>
                    <span class="metric-sub">Min: ${c?c.minLatencyMs+" ms":"--"}</span>
                </div>
                <div class="metric-box">
                    <span class="metric-lbl">Protocols Verified</span>
                    <div class="proto-strip font-mono">
                        <span>H:${l.http.passed}</span>
                        <span>HS:${l.https.passed}</span>
                        <span>S4:${l.socks4.passed}</span>
                        <span>S5:${l.socks5.passed}</span>
                    </div>
                    <span class="metric-sub">${m.topWebsites.length} edge targets</span>
                </div>
            </div>
        </div>

        <!-- Controls / Search & Filters -->
        <div class="controls">
            <div class="filter-group">
                <div class="search-box">
                    <span class="search-icon">${P.search}</span>
                    <input type="text" id="search-input" class="search-input" placeholder="Search IP, port, country..." oninput="onFilterChange()">
                </div>
                
                <select id="protocol-filter" class="filter-select" onchange="onFilterChange()">
                    <option value="ALL">All Protocols</option>
                    <option value="http">HTTP</option>
                    <option value="https">HTTPS</option>
                    <option value="socks4">SOCKS4</option>
                    <option value="socks5">SOCKS5</option>
                </select>

                <select id="tier-filter" class="filter-select" onchange="onFilterChange()">
                    <option value="ALL">All Latency Tiers</option>
                    <option value="EXCELLENT">&lt; 400ms (Excellent)</option>
                    <option value="GOOD">400 - 800ms (Good)</option>
                    <option value="MODERATE">800 - 1500ms (Moderate)</option>
                    <option value="SLOW">&gt; 1500ms (Slow)</option>
                </select>
            </div>
            <div>
                <span id="filtered-count" style="font-size: 0.8rem; color: var(--text-secondary); font-family: var(--font-mono);">Showing 0 / 0</span>
            </div>
        </div>

        <!-- Virtual Scrolling Table Container -->
        <div id="table-scroll-container" class="table-scroll-container">
            <table id="proxy-table">
                <colgroup>
                    <col style="width: 28px;">
                    <col style="width: 58px;">
                    <col style="width: 68px;">
                    <col style="width: 170px;">
                    <col style="width: 80px;">
                    <col style="width: 70px;">
                    <col style="width: 65px;">
                    <col style="width: 130px;">
                    <col style="width: 95px;">
                    <col style="width: 95px;">
                    <col style="width: 75px;">
                    <col style="width: 95px;">
                    <col style="width: 80px;">
                    <col style="width: 90px;">
                    <col style="width: 75px;">
                </colgroup>
                <thead>
                    <tr>
                        <th></th>
                        <th data-sort="rank">Rank</th>
                        <th data-sort="score" class="sort-desc">Score</th>
                        <th data-sort="ip">Proxy Address</th>
                        <th data-sort="protocol">Proto</th>
                        <th data-sort="country">Country</th>
                        <th data-sort="status">Status</th>
                        <th data-sort="egress">Egress IP</th>
                        <th data-sort="websites">Websites</th>
                        <th data-sort="avgLatency">Avg Latency</th>
                        <th data-sort="minLatency">Min</th>
                        <th data-sort="connectTime">Connect</th>
                        <th data-sort="ttfb">TTFB</th>
                        <th data-sort="speed">Bandwidth</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="table-body">
                    <!-- Virtual rows rendered on scroll -->
                </tbody>
            </table>
        </div>

        <div class="footer-note font-mono">
            benchmark-report.json &bull; Virtual scrolling enabled
        </div>
    </div>

    <div id="toast" class="toast">Copied to clipboard!</div>

    <script>${u}</script>
</body>
</html>`}import mt from"node:fs/promises";import ut from"node:path";import lo from"node:process";async function de(e,t){let o=`${e}.${lo.pid}.${Date.now()}.tmp`;await mt.writeFile(o,t,"utf8"),await mt.rename(o,e)}async function gt(e,t){for(let[o,n]of Object.entries(t.outputFiles)){let r=e[o].map(qe),a=r.length>0?`${r.join(`
`)}
`:"";await de(ut.join(t.outputDir,n),a)}}async function bt(e,t){let o=JSON.stringify(e,null,2);await de(t,o)}function ht(e,t,o,n,r){s("========================================"),s("                 Results"),s("========================================"),s("");for(let a of["http","https","socks4","socks5"])s(`  ${a.toUpperCase().padEnd(7)} ${t[a].length.toLocaleString()} passed`);s(""),s(`  Local Network IP: ${e.localPublicIp||"Direct"}`),s(`  Verification    : Hard-failed if 0/${o} connected`),s(`  Website Targets : ${m.topWebsites.length} available (early exit recorded per proxy)`),s(`  Global Curl Cap : ${m.maxCurlProcesses}`),s(`  TLS Mode        : ${m.tlsVerify?"strict":"permissive"}`),s(`  Total tested    : ${e.total.toLocaleString()}`),s(`  Passed / Alive  : ${e.passed.toLocaleString()}`),s(`  Hard Failed     : ${e.failed.toLocaleString()} (excluded from report)`),s(`  Duration        : ${D(e.durationSeconds)}`),s(""),s("Output files:");for(let a of Object.values(m.outputFiles))s(`  ${ut.join(m.outputDir,a)}`);s(""),s("Benchmark Reports:"),r.html&&s(`  ${i.green}HTML Report :${i.reset} ${r.html}`),r.json&&s(`  ${i.cyan}JSON Report :${i.reset} ${r.json}`),s("")}function N(e,t,o=!1){if(e===void 0||e.trim()==="")throw new Error(`${t} requires a value`);let n=Number(e.trim());if(!Number.isSafeInteger(n)||n<(o?0:1))throw new Error(`${t} must be an integer >= ${o?0:1} (got "${e}")`);return n}async function po(e){let t=[],o={customProxies:t,showHelp:!1};for(let n=0;n<e.length;n++){let r=e[n];if(r==="-h"||r==="--help"){o.showHelp=!0;continue}if(r==="-n"||r==="--limit"){o.limit=V(N(e[++n],"--limit",!0),"--limit");continue}if(r.startsWith("--limit=")){o.limit=V(N(r.split("=")[1],"--limit",!0),"--limit");continue}if(r==="-c"||r==="--concurrency"){o.concurrency=k(N(e[++n],"--concurrency"),"--concurrency");continue}if(r.startsWith("--concurrency=")){o.concurrency=k(N(r.split("=")[1],"--concurrency"),"--concurrency");continue}if(r==="--tcp-concurrency"){o.tcpConcurrency=k(N(e[++n],"--tcp-concurrency"),"--tcp-concurrency");continue}if(r.startsWith("--tcp-concurrency=")){o.tcpConcurrency=k(N(r.split("=")[1],"--tcp-concurrency"),"--tcp-concurrency");continue}if(r==="--website-workers"){o.websiteWorkers=k(N(e[++n],"--website-workers"),"--website-workers");continue}if(r.startsWith("--website-workers=")){o.websiteWorkers=k(N(r.split("=")[1],"--website-workers"),"--website-workers");continue}if(r==="--max-curl"){o.maxCurlProcesses=k(N(e[++n],"--max-curl"),"--max-curl");continue}if(r.startsWith("--max-curl=")){o.maxCurlProcesses=k(N(r.split("=")[1],"--max-curl"),"--max-curl");continue}if(r==="--strict-tls"){o.strictTls=!0;continue}if(r==="--safe"){o.preset="safe";continue}if(r==="--home"){o.preset="home";continue}if(r==="--turbo"||r==="--vps"){o.preset="turbo";continue}if(r.startsWith("--preset=")){o.preset=ie(r.split("=")[1],"--preset");continue}if(r.startsWith("-"))continue;try{if((await ft.stat(r)).isFile()){let l=await ft.readFile(r,"utf8"),p=Ze(l);t.push(...p);continue}}catch{}let a=Ye(r);a.length>0&&t.push(...a)}return o}function mo(){s(`
Proxy Benchmark & Network Telemetry Suite

Usage:
  nub update-proxies.ts [options] [proxy...] [file...]
  curl -fsSL https://.../run.sh | bash -s -- [options] [proxy...]
  irm https://.../run.ps1 | iex [options] [proxy...]

Examples:
  # Benchmark with the default safe preset
  nub update-proxies.ts

  # Benchmark with home-router defaults (larger run)
  nub update-proxies.ts --home

  # Benchmark with ultra-gentle mode for sensitive/budget WiFi routers
  nub update-proxies.ts --safe

  # Benchmark high-speed mode on VPS / Gigabit servers
  nub update-proxies.ts --turbo

  # Benchmark a single specific proxy route
  nub update-proxies.ts socks5://64.227.186.105:1080

  # Benchmark custom list from file
  nub update-proxies.ts my-proxies.txt

Options:
  --safe              Gentle profile (500 candidates, 35 TCP sockets, 12 verification workers, 4 website workers, 16 global curl) - default
  --home              Home profile (2,000 candidates, 80 TCP sockets, 25 verification workers, 8 website workers, 64 global curl)
  --turbo, --vps      High-performance profile (1,500 TCP sockets, 300 verification workers, 100 website workers, 1,500 global curl)
  -c, --concurrency   Override Stage 2 verification worker count
  --tcp-concurrency   Override Stage 1 parallel TCP socket count
  --website-workers   Override Stage 3 proxy worker count
  --max-curl          Global ceiling on concurrent curl processes
  -n, --limit <num>   Candidate cap (0 = unlimited)
  --strict-tls        Verify TLS certificates instead of permissive transport probing
  -h, --help          Show this help message
`)}async function uo(){let e=await po(R.argv.slice(2));e.showHelp&&(mo(),R.exit(0));let t=ye(e.preset??Q(R.env),R.env,{concurrency:e.concurrency,tcpConcurrency:e.tcpConcurrency,websiteWorkers:e.websiteWorkers,websiteConcurrency:e.websiteConcurrency,maxCurlProcesses:e.maxCurlProcesses,limit:e.limit,tlsVerify:e.strictTls});Object.assign(m,t);let o=m.limit;s(""),s("========================================"),s("   Proxy Benchmark & Best Network Finder "),s("========================================"),s(""),s("Benchmark limits"),s("\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500"),s(`  Preset             ${e.preset??Q(R.env)}`),s(`  Candidate cap      ${o===0?"unlimited":o.toLocaleString()}`),s(`  TCP connections    ${m.tcpConcurrency}`),s(`  Verification       ${m.concurrency}`),s(`  Website workers    ${m.websiteWorkers} x ${m.websiteConcurrency} probes`),s(`  Global curl cap    ${m.maxCurlProcesses}`),s(`  TLS verification   ${m.tlsVerify?"strict":"permissive (--insecure)"}`),s(""),await Ue(),s(`${i.green}[OK]${i.reset} Network tools ready`);let n=await Ve();s(`${i.cyan}[INFO]${i.reset} Origin Public IP: ${i.bold}${n||"Direct / Unknown"}${i.reset}`),s(`${i.gray}Timeout: ${m.timeoutSeconds}s | DNS: ${m.cloudflareDns} | Edge Targets: ${m.benchmarkTopWebsites?`${m.topWebsites.length} sites`:"Disabled"}${i.reset}
`);let r=await Ke(m.testEndpoints,m);m.benchmarkTopWebsites&&m.topWebsites.length>0&&(m.topWebsites=await Ge(m.topWebsites,m));let a=[];if(e.customProxies.length>0){s("========================================"),s("     Target Endpoints (CLI Input)       "),s("========================================"),s(""),a=Xe(e.customProxies),s(`Loaded ${a.length} custom route(s) to benchmark:`);for(let d of a)s(`  ${i.cyan}${d.protocol.toUpperCase()}${i.reset}://${d.ip}:${d.port}`);s("")}else{s("========================================"),s("     Fetching Candidate Route Feeds     "),s("========================================"),s("");let{proxies:d}=await Qe(m);if(a=d,a.length===0)throw new Error("Candidate feeds contained no valid endpoints.");o>0&&o<a.length&&(s(`  Limiting benchmark to first ${o} candidates (LIMIT=${o})`),a=a.slice(0,o));let v={http:0,https:0,socks4:0,socks5:0};for(let S of a)v[S.protocol]++;s(`  Target candidate routes to benchmark (${a.length.toLocaleString()} total):
`);for(let S of["http","https","socks4","socks5"])s(`  ${S.toUpperCase().padEnd(7)} ${v[S].toLocaleString()}`)}if(a.length===0)throw new Error("No valid candidate routes to test.");s(`
========================================`),s("      Benchmarking Route Performance    "),s("========================================"),s(""),s(`Stage 1: Async TCP Socket Pre-Filter (${Math.min(m.tcpConcurrency,a.length)} parallel sockets)`),s(`Stage 2: Transport Handshake & Egress Verification (${r.length} verification endpoints, ${m.concurrency} workers)`),m.benchmarkTopWebsites&&s(`Stage 3: Global Edge Reachability Benchmark (${m.topWebsites.length} destinations, ${m.websiteWorkers} workers)`),s(`Stage 4: Composite Route Scoring & Telemetry Generation
`);let{results:c,benchmarks:l,stats:p}=await ct(a,r,m,n);s("========================================"),s("       Generating Reports & Files       "),s("========================================"),s(""),await gt(c,m);let h=yt.join(m.outputDir,m.reportFiles.html),u=dt(l,p,r,h);await de(h,u);let g=yt.join(m.outputDir,m.reportFiles.json);await bt({generatedAt:p.completedAt,run:{preset:e.preset??Q(R.env),tlsVerification:m.tlsVerify?"strict":"permissive",maxCurlProcesses:m.maxCurlProcesses,tcpConcurrency:m.tcpConcurrency,verificationWorkers:m.concurrency,websiteWorkers:m.websiteWorkers,websiteConcurrency:m.websiteConcurrency},stats:p,endpoints:r,benchmarks:l},g),ht(p,c,r.length,m.testEndpoints.length,{html:h,json:g})}R.on("SIGINT",()=>{R.stdout.write(`

`),s(`${i.yellow}Interrupted by user.${i.reset}`),R.exit(130)});uo().catch(e=>{R.stdout.write(`

`),s(`${i.red}ERROR:${i.reset} ${e instanceof Error?e.message:String(e)}`),R.exit(1)});
