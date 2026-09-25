#!/usr/bin/env node
import Ze from"node:fs/promises";import Xe from"node:path";import j from"node:process";import k from"node:process";var ke=[{name:"Google",domain:"google.com",category:"Search / Infra",url:"https://www.google.com/generate_204"},{name:"Cloudflare",domain:"cloudflare.com",category:"CDN / Infra",url:"https://www.cloudflare.com/favicon.ico"},{name:"Cloudflare DNS",domain:"1.1.1.1",category:"DNS / Infra",url:"https://1.1.1.1/cdn-cgi/trace"},{name:"Microsoft",domain:"microsoft.com",category:"Search / Tech",url:"https://www.microsoft.com"},{name:"Apple",domain:"apple.com",category:"Tech / Infra",url:"https://www.apple.com"},{name:"Bing",domain:"bing.com",category:"Search",url:"https://www.bing.com"},{name:"DuckDuckGo",domain:"duckduckgo.com",category:"Search",url:"https://duckduckgo.com"},{name:"Yahoo",domain:"yahoo.com",category:"Portal / Search",url:"https://www.yahoo.com"},{name:"GitHub",domain:"github.com",category:"Developer",url:"https://github.com"},{name:"GitLab",domain:"gitlab.com",category:"Developer",url:"https://gitlab.com"},{name:"Stack Overflow",domain:"stackoverflow.com",category:"Developer",url:"https://stackoverflow.com"},{name:"NPM Registry",domain:"npmjs.com",category:"Developer",url:"https://registry.npmjs.org"},{name:"Docker Hub",domain:"docker.com",category:"Developer",url:"https://hub.docker.com"},{name:"Mozilla MDN",domain:"developer.mozilla.org",category:"Developer",url:"https://developer.mozilla.org"},{name:"Bitbucket",domain:"bitbucket.org",category:"Developer",url:"https://bitbucket.org"},{name:"CDNJS",domain:"cdnjs.cloudflare.com",category:"Developer CDN",url:"https://cdnjs.cloudflare.com/robots.txt"},{name:"OpenAI",domain:"openai.com",category:"AI / Tech",url:"https://openai.com"},{name:"Hugging Face",domain:"huggingface.co",category:"AI / Developer",url:"https://huggingface.co"},{name:"YouTube",domain:"youtube.com",category:"Media / Video",url:"https://www.youtube.com/generate_204"},{name:"Netflix",domain:"netflix.com",category:"Media / Streaming",url:"https://www.netflix.com"},{name:"Spotify",domain:"spotify.com",category:"Media / Audio",url:"https://www.spotify.com"},{name:"Twitch",domain:"twitch.tv",category:"Media / Live",url:"https://www.twitch.tv"},{name:"Vimeo",domain:"vimeo.com",category:"Media / Video",url:"https://vimeo.com"},{name:"SoundCloud",domain:"soundcloud.com",category:"Media / Audio",url:"https://soundcloud.com"},{name:"Reddit",domain:"reddit.com",category:"Social / Community",url:"https://www.reddit.com"},{name:"Wikipedia",domain:"wikipedia.org",category:"Reference",url:"https://en.wikipedia.org"},{name:"X / Twitter",domain:"x.com",category:"Social Media",url:"https://x.com"},{name:"LinkedIn",domain:"linkedin.com",category:"Social / Business",url:"https://www.linkedin.com"},{name:"Instagram",domain:"instagram.com",category:"Social Media",url:"https://www.instagram.com"},{name:"Discord",domain:"discord.com",category:"Communication",url:"https://discord.com"},{name:"Telegram",domain:"telegram.org",category:"Communication",url:"https://telegram.org"},{name:"Slack",domain:"slack.com",category:"Communication",url:"https://slack.com"},{name:"Pinterest",domain:"pinterest.com",category:"Social / Discovery",url:"https://www.pinterest.com"},{name:"Quora",domain:"quora.com",category:"Social / Q&A",url:"https://www.quora.com"},{name:"Tumblr",domain:"tumblr.com",category:"Social / Blogging",url:"https://www.tumblr.com"},{name:"Medium",domain:"medium.com",category:"Social / Publishing",url:"https://medium.com"},{name:"Amazon",domain:"amazon.com",category:"E-Commerce",url:"https://www.amazon.com"},{name:"eBay",domain:"ebay.com",category:"E-Commerce",url:"https://www.ebay.com"},{name:"PayPal",domain:"paypal.com",category:"Fintech / Payment",url:"https://www.paypal.com"},{name:"Stripe",domain:"stripe.com",category:"Fintech / Payment",url:"https://stripe.com"},{name:"Booking.com",domain:"booking.com",category:"Travel / Hospitality",url:"https://www.booking.com"},{name:"Airbnb",domain:"airbnb.com",category:"Travel / Hospitality",url:"https://www.airbnb.com"},{name:"AliExpress",domain:"aliexpress.com",category:"E-Commerce",url:"https://www.aliexpress.com"},{name:"Shopify",domain:"shopify.com",category:"E-Commerce",url:"https://www.shopify.com"},{name:"BBC",domain:"bbc.com",category:"News",url:"https://www.bbc.com"},{name:"CNN",domain:"cnn.com",category:"News",url:"https://www.cnn.com"},{name:"The New York Times",domain:"nytimes.com",category:"News",url:"https://www.nytimes.com"},{name:"The Guardian",domain:"theguardian.com",category:"News",url:"https://www.theguardian.com"},{name:"Reuters",domain:"reuters.com",category:"News / Finance",url:"https://www.reuters.com"},{name:"Dropbox",domain:"dropbox.com",category:"Cloud Storage",url:"https://www.dropbox.com"},{name:"Salesforce",domain:"salesforce.com",category:"Enterprise / SaaS",url:"https://www.salesforce.com"},{name:"Adobe",domain:"adobe.com",category:"Design / Creative",url:"https://www.adobe.com"},{name:"Zoom",domain:"zoom.us",category:"Video Conferencing",url:"https://zoom.us"}];var it=(k.env.PRESET||(k.env.TURBO==="true"||k.env.TURBO==="1"?"turbo":k.env.SAFE==="true"||k.env.SAFE==="1"?"safe":"home")).toLowerCase(),Te={home:{tcpConcurrency:80,concurrency:25,websiteConcurrency:5,tcpTimeoutMs:1200,timeoutSeconds:4,connectTimeoutSeconds:3,websiteTimeoutSeconds:4.5,websiteConnectTimeoutSeconds:3},safe:{tcpConcurrency:35,concurrency:12,websiteConcurrency:3,tcpTimeoutMs:1500,timeoutSeconds:4.5,connectTimeoutSeconds:3,websiteTimeoutSeconds:5,websiteConnectTimeoutSeconds:3.5},turbo:{tcpConcurrency:1500,concurrency:300,websiteConcurrency:25,tcpTimeoutMs:800,timeoutSeconds:3,connectTimeoutSeconds:2,websiteTimeoutSeconds:3.5,websiteConnectTimeoutSeconds:2.5}},D=Te[it]??Te.home,at=D.concurrency,ct=D.tcpConcurrency,lt=D.websiteConcurrency,pt=D.tcpTimeoutMs,dt=D.timeoutSeconds,mt=D.connectTimeoutSeconds,ut=D.websiteTimeoutSeconds,ht=D.websiteConnectTimeoutSeconds,gt="1.1.1.1",bt=2,Ce=[{name:"proxifly/free-proxy-list",urls:["https://cdn.jsdelivr.net/gh/proxifly/free-proxy-list@main/proxies/all/data.csv","https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/all/data.csv"]},{name:"proxyscrape/free-proxy-list",urls:["https://cdn.jsdelivr.net/gh/proxyscrape/free-proxy-list@main/proxies/all/data.csv","https://raw.githubusercontent.com/ProxyScrape/free-proxy-list/main/proxies/all/data.csv"]},{name:"hproxy-com/free-proxy-list",urls:["https://cdn.jsdelivr.net/gh/hproxy-com/free-proxy-list@main/live.csv","https://raw.githubusercontent.com/hproxy-com/free-proxy-list/main/live.csv"]},{name:"proxmint/free-proxy-list",urls:["https://cdn.jsdelivr.net/gh/proxmint/free-proxy-list@main/proxies/all.txt","https://raw.githubusercontent.com/proxmint/free-proxy-list/main/proxies/all.txt"]},{name:"proxio-io/proxy-list",urls:["https://cdn.jsdelivr.net/gh/proxio-io/proxy-list@main/all.txt","https://raw.githubusercontent.com/proxio-io/proxy-list/main/all.txt"],defaultProtocol:"http"},{name:"iplocate/free-proxy-list",urls:["https://cdn.jsdelivr.net/gh/iplocate/free-proxy-list@main/all-proxies.txt","https://raw.githubusercontent.com/iplocate/free-proxy-list/main/all-proxies.txt"]},{name:"databay-labs/http",urls:["https://cdn.jsdelivr.net/gh/databay-labs/free-proxy-list@master/http.txt","https://raw.githubusercontent.com/databay-labs/free-proxy-list/master/http.txt"],defaultProtocol:"http"},{name:"databay-labs/socks4",urls:["https://cdn.jsdelivr.net/gh/databay-labs/free-proxy-list@master/socks4.txt","https://raw.githubusercontent.com/databay-labs/free-proxy-list/master/socks4.txt"],defaultProtocol:"socks4"},{name:"databay-labs/socks5",urls:["https://cdn.jsdelivr.net/gh/databay-labs/free-proxy-list@master/socks5.txt","https://raw.githubusercontent.com/databay-labs/free-proxy-list/master/socks5.txt"],defaultProtocol:"socks5"},{name:"monosans/proxy-list",urls:["https://cdn.jsdelivr.net/gh/monosans/proxy-list@main/proxies/all.txt","https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/all.txt"]}],ft=[{name:"api.ipify.org",url:"https://api.ipify.org",parser:"plain"},{name:"api64.ipify.org",url:"https://api64.ipify.org",parser:"plain"},{name:"ifconfig.me",url:"https://ifconfig.me/ip",parser:"plain"},{name:"icanhazip.com",url:"https://icanhazip.com",parser:"plain"},{name:"ident.me",url:"https://ident.me",parser:"plain"},{name:"checkip.amazonaws.com",url:"https://checkip.amazonaws.com",parser:"plain"},{name:"ip.me",url:"https://ip.me",parser:"ipme"},{name:"api.my-ip.io",url:"https://api.my-ip.io/ip",parser:"plain"},{name:"ipinfo.io",url:"https://ipinfo.io/ip",parser:"plain"},{name:"ifconfig.co",url:"https://ifconfig.co/ip",parser:"plain"},{name:"myexternalip.com",url:"https://myexternalip.com/raw",parser:"plain"}],p={concurrency:Number.parseInt(k.env.CONCURRENCY||String(at),10),tcpConcurrency:Number.parseInt(k.env.TCP_CONCURRENCY||String(ct),10),tcpTimeoutMs:Number.parseInt(k.env.TCP_TIMEOUT||String(pt),10),timeoutSeconds:Number.parseFloat(k.env.TIMEOUT||String(dt)),connectTimeoutSeconds:Number.parseFloat(k.env.CONNECT_TIMEOUT||String(mt)),websiteTimeoutSeconds:Number.parseFloat(k.env.WEBSITE_TIMEOUT||String(ut)),websiteConnectTimeoutSeconds:Number.parseFloat(k.env.WEBSITE_CONNECT_TIMEOUT||String(ht)),websiteConcurrency:Number.parseInt(k.env.WEBSITE_CONCURRENCY||String(lt),10),cloudflareDns:k.env.DNS||gt,endpointRetries:Number.parseInt(k.env.DNS_RETRIES||String(bt),10),limit:Number.parseInt(k.env.LIMIT||"0",10),fullBenchmark:k.env.FULL_BENCHMARK==="true",benchmarkTopWebsites:k.env.BENCHMARK_WEBSITES!=="false",feeds:Ce,csvUrls:Ce[0].urls,testEndpoints:ft,topWebsites:ke,outputDir:k.cwd(),outputFiles:{http:"http.txt",https:"https.txt",socks4:"socks4.txt",socks5:"socks5.txt"},reportFiles:{html:"benchmark-report.html",json:"benchmark-report.json"}};import Pe from"node:process";var s={clearLine:"\x1B[2K",reset:"\x1B[0m",bold:"\x1B[1m",dim:"\x1B[2m",green:"\x1B[32m",red:"\x1B[31m",yellow:"\x1B[33m",cyan:"\x1B[36m",blue:"\x1B[34m",magenta:"\x1B[35m",gray:"\x1B[90m"};function i(e=""){Pe.stdout.write(`${e}
`)}function te(e){Pe.stdout.write(`\r${s.clearLine}${e}`)}function Ie(e){return new Promise(t=>setTimeout(t,e))}function O(e){if(!Number.isFinite(e)||e<0)return"--";let t=Math.round(e),o=Math.floor(t/3600),n=Math.floor(t%3600/60),r=t%60;return o>0?`${o}h ${n}m ${r}s`:n>0?`${n}m ${r}s`:`${r}s`}function oe(e){return!Number.isFinite(e)||e<=0?"0.0/s":`${e.toFixed(1)}/s`}function re(e,t){return t?(e/t*100).toFixed(1):"0.0"}import{execFile as yt}from"node:child_process";import{promisify as xt}from"node:util";import pe from"node:dns/promises";import{isIP as G}from"node:net";var Me=xt(yt);async function Ee(){let e=["https://api.ipify.org","https://icanhazip.com","https://ifconfig.me/ip"];for(let t of e)try{let{stdout:o}=await Me("curl",["--silent","--insecure","--max-time","5",t],{timeout:6e3,windowsHide:!0}),n=o.trim();if(G(n)===4)return n}catch{}return null}async function wt(e,t){try{return await Me(e,t,{timeout:5e3,maxBuffer:1024*1024,windowsHide:!0}),!0}catch{return!1}}async function Le(){let e=[["curl",["--version"]]];for(let[t,o]of e)if(!await wt(t,o))throw new Error(`Required command not found or not executable: ${t}`)}function Y(e){let t=new URL(e);return{protocol:t.protocol.replace(":",""),hostname:t.hostname,port:t.port?Number.parseInt(t.port,10):t.protocol==="https:"?443:80}}async function vt(e,t="1.1.1.1"){try{let o=new pe.Resolver({timeout:4e3,tries:2});t&&o.setServers([t]);let r=(await o.resolve4(e)).filter(l=>G(l)===4);if(r.length>0)return Array.from(new Set(r))}catch{try{let n=(await pe.resolve4(e)).filter(r=>G(r)===4);if(n.length>0)return Array.from(new Set(n))}catch{}}return[]}async function de(e,t="1.1.1.1",o=3){for(let n=1;n<=o;n++){let r=await vt(e,t);if(r.length>0)return r[(n-1)%r.length]??null;n<o&&await Ie(1e3)}return null}async function Ae(e,t){i(`${s.cyan}Resolving test endpoints using DNS (${t.cloudflareDns})...${s.reset}`),i(`${s.gray}Retries: ${t.endpointRetries}${s.reset}
`);let o=[],n=[];for(let r of e){let l=Y(r.url),a=await de(l.hostname,t.cloudflareDns,t.endpointRetries);if(!a){n.push(r),i(`  ${s.red}[FAIL]${s.reset} ${r.name.padEnd(24)} ${s.gray}DNS resolution failed -> disabled for this run${s.reset}`);continue}o.push({...r,resolvedIp:a}),i(`  ${s.green}[OK]${s.reset}   ${r.name.padEnd(24)} ${s.gray}${a}${s.reset}`)}if(i(""),o.length===0)throw new Error("No test endpoints could be resolved.");return i(`${s.green}[OK] ${o.length}/${e.length} test endpoints enabled${s.reset}`),n.length>0&&(i(`${s.yellow}[WARN] ${n.length} endpoint(s) disabled because DNS resolution failed.${s.reset}`),i(`${s.gray}Proxies will be tested against the remaining ${o.length} endpoint(s).${s.reset}`)),i(""),o}async function Ne(e,t){let o=[],n=new pe.Resolver({timeout:3e3,tries:2});t.cloudflareDns&&n.setServers([t.cloudflareDns]);let r=e.map(async a=>{let m=Y(a.url);try{if(G(m.hostname)===4)return{...a,resolvedIp:m.hostname};let h=(await n.resolve4(m.hostname)).find(u=>G(u)===4);return{...a,resolvedIp:h}}catch{return a}}),l=await Promise.all(r);return o.push(...l),o}import{execFile as St}from"node:child_process";import{promisify as $t}from"node:util";var kt=$t(St);function Re(e,t){let o=e.split(/\r?\n/).map(b=>b.trim()).filter(Boolean);if(o.length===0)return[];let n=o[0]??"",r=(n.includes(",")||n.includes(";"))&&(n.toLowerCase().includes("ip")||n.toLowerCase().includes("protocol")||n.toLowerCase().includes("port")),l=-1,a=-1,m=-1,c=-1;if(r){let b=n.split(/[,;]/).map(d=>d.trim().toLowerCase());l=b.findIndex(d=>d==="protocol"||d==="protocols"||d==="proto"||d==="type"),a=b.findIndex(d=>d==="ip"||d==="host"||d==="ip_address"),m=b.findIndex(d=>d==="port"),c=b.findIndex(d=>d==="country"||d==="country_code"||d==="code")}let h=r?1:0,u=[];for(let b=h;b<o.length;b++){let d=o[b];if(!d)continue;let v=d.match(/^([a-zA-Z0-9]+):\/\/([0-9.]+):([0-9]+)(?:,([a-zA-Z]{2}))?/);if(v&&v[1]&&v[2]&&v[3]){let f=v[1].toLowerCase(),y=v[2],S=Number.parseInt(v[3],10),P=v[4]||void 0;if(["http","https","socks4","socks5"].includes(f)&&!Number.isNaN(S)){u.push({protocol:f,ip:y,port:S,country:P,raw:d});continue}}let T=d.match(/^([0-9.]+):([0-9]+)$/);if(T&&T[1]&&T[2]){let f=T[1],y=Number.parseInt(T[2],10);if(!Number.isNaN(y)){t?u.push({protocol:t,ip:f,port:y,raw:`${t}://${f}:${y}`}):u.push({protocol:"http",ip:f,port:y,raw:`http://${f}:${y}`});continue}}let x=d.split(/[,;]/).map(f=>f.trim().replace(/^["']|["']$/g,""));if(x.length>=2){let f=a!==-1?x[a]:x[0]?.includes(".")?x[0]:x[1],y=m!==-1?x[m]:f===x[0]?x[1]:x[2],S=l!==-1?x[l]:f===x[1]?x[0]:t||"http",P=c!==-1?x[c]:void 0;if(!f||!y)continue;let I=Number.parseInt(y,10);if(Number.isNaN(I)||!/^[0-9.]+$/.test(f))continue;let M=(S||"http").toLowerCase().split(/[|,/]/);for(let w of M){let g=w.trim();["http","https","socks4","socks5"].includes(g)&&u.push({protocol:g,ip:f,port:I,country:P||void 0,raw:`${g}://${f}:${I}`})}}}return u}function Be(e){return Re(e)}async function Tt(e,t){for(let o of e.urls)try{let n=new URL(o),r=await de(n.hostname,t.cloudflareDns,t.endpointRetries),l=["--ipv4","--silent","--show-error","--fail","--connect-timeout","6","--max-time","20","-A","Mozilla/5.0 ProxyBenchmarker"];r&&l.push("--resolve",`${n.hostname}:443:${r}`),l.push(o);let{stdout:a}=await kt("curl",l,{timeout:25e3,maxBuffer:8*1024*1024,windowsHide:!0});if(a&&a.length>30)return a}catch{}throw new Error(`Failed to fetch feed ${e.name} from all mirrors`)}async function Fe(e){let t=e.feeds;i(`Fetching candidate routes from ${t.length} upstream feeds...
`);let o=[],n=new Set,r=[],l=0;for(let a of t)try{let m=await Tt(a,e),c=Re(m,a.defaultProtocol);l+=c.length;let h=0;for(let u of c){let b=`${u.protocol}://${u.ip}:${u.port}`;n.has(b)||(n.add(b),r.push(u),h++)}o.push({name:a.name,count:c.length,status:"OK"}),i(`  ${s.green}[OK]${s.reset} ${a.name.padEnd(30)} ${c.length.toLocaleString().padStart(6)} routes (+${h.toLocaleString()} new)`)}catch{o.push({name:a.name,count:0,status:"FAIL"}),i(`  ${s.yellow}[WARN]${s.reset} ${a.name.padEnd(30)} Fetch failed (skipped)`)}return i(`
${s.bold}Discovered ${l.toLocaleString()} candidate entries across ${t.length} feeds${s.reset}`),i(`${s.bold}${s.cyan}Deduplicated into ${r.length.toLocaleString()} unique routes via Set key normalization${s.reset}
`),{proxies:r,feedStats:o,totalDiscovered:l}}function De(e){return`${e.protocol}://${e.ip}:${e.port}`}function Oe(e){let t=new Set,o=[];for(let n of e){let r=`${n.protocol}:${n.ip}:${n.port}`;t.has(r)||(t.add(r),o.push(n))}return o}function We(e){let t=e.trim();if(!t)return[];let o=t.match(/^([a-zA-Z0-9]+):\/\/([0-9.]+):([0-9]+)(?:,([a-zA-Z]{2}))?/);if(o&&o[1]&&o[2]&&o[3]){let r=o[1].toLowerCase(),l=o[2],a=Number.parseInt(o[3],10),m=o[4];if(["http","https","socks4","socks5"].includes(r)&&!Number.isNaN(a))return[{protocol:r,ip:l,port:a,country:m,raw:t}]}let n=t.match(/^([0-9.]+):([0-9]+)$/);if(n&&n[1]&&n[2]){let r=n[1],l=Number.parseInt(n[2],10);if(!Number.isNaN(l))return["socks5","http","https","socks4"].map(a=>({protocol:a,ip:r,port:l,raw:`${a}://${r}:${l}`}))}return[]}function me(e){switch(e.protocol){case"http":return["-x",`http://${e.ip}:${e.port}`];case"https":return["-x",`https://${e.ip}:${e.port}`];case"socks4":return["--socks4a",`${e.ip}:${e.port}`];case"socks5":return["--socks5-hostname",`${e.ip}:${e.port}`];default:return["-x",`${e.protocol}://${e.ip}:${e.port}`]}}import{execFile as Ct}from"node:child_process";import{promisify as Pt}from"node:util";import It from"node:net";import{isIP as ue}from"node:net";import W from"node:process";var He=Pt(Ct);function Mt(e,t,o=1200){return new Promise(n=>{let r=new It.Socket,l=!1,a=()=>{l||(l=!0,r.removeAllListeners(),r.destroy())};r.setTimeout(o),r.once("connect",()=>{a(),n(!0)}),r.once("timeout",()=>{a(),n(!1)}),r.once("error",()=>{a(),n(!1)}),r.once("close",()=>{l||(a(),n(!1))});try{r.connect(t,e)}catch{a(),n(!1)}})}function Et(e){let t=e.trim().split(/\r?\n/).map(o=>o.trim()).filter(Boolean);for(let o of t)if(ue(o)===4)return o;return null}function Lt(e){let t=e.match(/<input\b[^>]*\bname=["']ip["'][^>]*\bvalue=["']((?:\d{1,3}\.){3}\d{1,3})["']/i);if(t&&t[1]&&ue(t[1])===4)return t[1];let o=e.match(/<input\b[^>]*\bvalue=["']((?:\d{1,3}\.){3}\d{1,3})["'][^>]*\bname=["']ip["']/i);return o&&o[1]&&ue(o[1])===4?o[1]:null}function At(e,t){return t==="ipme"?Lt(e):Et(e)}async function _e(e,t,o,n){let r=Y(t.url),a=["--ipv4","--insecure","--silent","--show-error","--fail-with-body","--noproxy","","--connect-timeout",String(o.connectTimeoutSeconds||2.5),"--max-time",String(o.timeoutSeconds||3.5),"-A","Mozilla/5.0 ProxyBenchmarker","-w",`
__BENCHMARK__:%{http_code}:%{time_connect}:%{time_appconnect}:%{time_starttransfer}:%{time_total}:%{speed_download}:%{size_download}`,...me(e)];t.resolvedIp&&a.push("--resolve",`${r.hostname}:${r.port}:${t.resolvedIp}`),a.push(t.url);let m=(o.timeoutSeconds||3.5)*1e3+1e3,c="",h="",u=0;try{let w=await He("curl",a,{timeout:m,maxBuffer:1048576,windowsHide:!0,signal:n});c=w.stdout||"",h=w.stderr||""}catch(w){c=w.stdout||"",h=w.stderr||"",u=w.code??1}let b=0,d=0,v=0,T=0,x=0,f=0,y=0,S=c,P=`
__BENCHMARK__:`,I=c.lastIndexOf(P);if(I!==-1){S=c.slice(0,I);let g=c.slice(I+P.length).trim().split(":");g.length>=7&&(b=Number.parseInt(g[0]||"0",10)||0,d=Math.round(Number.parseFloat(g[1]||"0")*1e3),v=Math.round(Number.parseFloat(g[2]||"0")*1e3),T=Math.round(Number.parseFloat(g[3]||"0")*1e3),x=Math.round(Number.parseFloat(g[4]||"0")*1e3),f=Number.parseFloat(g[5]||"0")||0,y=Number.parseInt(g[6]||"0",10)||0)}if(u!==0&&b===0)return{name:t.name,url:t.url,resolvedIp:t.resolvedIp,ok:!1,httpCode:b,totalLatencyMs:x,connectTimeMs:d,sslHandshakeMs:v,ttfbMs:T,downloadSpeedBps:f,downloadSizeBytes:y,returnedIp:null,reason:h.trim()||`curl exit code ${u}`};let M=At(S,t.parser);return M?{name:t.name,url:t.url,resolvedIp:t.resolvedIp,ok:!0,httpCode:b,totalLatencyMs:x,connectTimeMs:d,sslHandshakeMs:v,ttfbMs:T,downloadSpeedBps:f,downloadSizeBytes:y,returnedIp:M,reason:null}:{name:t.name,url:t.url,resolvedIp:t.resolvedIp,ok:!1,httpCode:b,totalLatencyMs:x,connectTimeMs:d,sslHandshakeMs:v,ttfbMs:T,downloadSpeedBps:f,downloadSizeBytes:y,returnedIp:null,reason:b>=400?`HTTP ${b}`:"No valid IPv4 returned from endpoint"}}async function Nt(e,t,o){let n=Y(t.url),l=["--ipv4","--insecure","--silent","--show-error","-o","/dev/null","--noproxy","","--connect-timeout",String(o.websiteConnectTimeoutSeconds||3),"--max-time",String(o.websiteTimeoutSeconds||4.5),"-A","Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36","-w",`
__BENCHMARK__:%{http_code}:%{time_connect}:%{time_appconnect}:%{time_starttransfer}:%{time_total}:%{speed_download}:%{size_download}`,...me(e)];t.resolvedIp&&(e.protocol==="http"||e.protocol==="https")&&l.push("--resolve",`${n.hostname}:${n.port}:${t.resolvedIp}`),l.push(t.url);let a=(o.websiteTimeoutSeconds||4.5)*1e3+1e3,m="",c="",h=0;try{let I=await He("curl",l,{timeout:a,maxBuffer:524288,windowsHide:!0});m=I.stdout||"",c=I.stderr||""}catch(I){m=I.stdout||"",c=I.stderr||"",h=I.code??1}let u=0,b=0,d=0,v=0,T=0,x=0,f=0,y=`
__BENCHMARK__:`,S=m.lastIndexOf(y);if(S!==-1){let M=m.slice(S+y.length).trim().split(":");M.length>=7&&(u=Number.parseInt(M[0]||"0",10)||0,b=Math.round(Number.parseFloat(M[1]||"0")*1e3),d=Math.round(Number.parseFloat(M[2]||"0")*1e3),v=Math.round(Number.parseFloat(M[3]||"0")*1e3),T=Math.round(Number.parseFloat(M[4]||"0")*1e3),x=Number.parseFloat(M[5]||"0")||0,f=Number.parseInt(M[6]||"0",10)||0)}let P=u>=200&&u<400;return{name:t.name,domain:t.domain,category:t.category,url:t.url,ok:P,httpCode:u,totalLatencyMs:T,connectTimeMs:b,sslHandshakeMs:d,ttfbMs:v,downloadSpeedBps:x,downloadSizeBytes:f,reason:P?null:u>0?`HTTP ${u}`:c.trim()||`Exit code ${h}`}}async function Rt(e,t,o){let n=[],r=Math.max(o.websiteConcurrency||5,2),l=!1;for(let a=0;a<t.length;a+=r){let m=t.slice(a,a+r),c=await Promise.all(m.map(h=>Nt(e,h,o)));if(n.push(...c),c.some(h=>h.ok)&&(l=!0),n.length>=r&&!l)break}return n}function Bt(e){if(e.length===0)return 0;let t=[...e].sort((l,a)=>l-a),o=Math.floor(t.length/2),n=t[o]??0,r=t[o-1]??0;return t.length%2!==0?n:Math.round((r+n)/2)}async function Ft(e,t,o){if(o.fullBenchmark){let a=[],m=null;for(let c of t){let h=await _e(e,c,o);a.push(h),h.ok&&!m&&(m=h.returnedIp)}return{isAlive:!!m,exitIp:m,endpointResults:a}}let n=t.slice(0,2),r=new AbortController,l=n.map(async a=>{let m=await _e(e,a,o,r.signal);if(m.ok)return m;throw m});try{let a=await Promise.any(l);return r.abort(),{isAlive:!0,exitIp:a.returnedIp,endpointResults:[a]}}catch(a){return{isAlive:!1,exitIp:null,endpointResults:Array.isArray(a?.errors)?a.errors:[]}}}async function Ue(e,t,o,n=null){let r={http:[],https:[],socks4:[],socks5:[]},l=Math.min(Math.max(o.tcpConcurrency||1500,50),e.length),a=o.tcpTimeoutMs||1200;W.stdout.write(`
${s.bold}${s.cyan}>> Stage 1: Async TCP Socket Pre-Filter (${l} parallel sockets)${s.reset}
`);let m=Date.now(),c=0,h=0,u=0,b=0,d=[];function v(){let w=(Date.now()-m)/1e3,g=c>0?c/Math.max(w,.001):0,A=e.length-c,N=g>0?A/g:Number.NaN;te(`${s.cyan}Stage 1 (TCP)${s.reset} ${re(c,e.length)}% | ${c.toLocaleString()}/${e.length.toLocaleString()} | ${s.green}[OK] ${h} Open${s.reset} | ${s.red}[FAIL] ${u} Closed${s.reset} | ${oe(g)} | ETA ${O(N)}`)}async function T(){for(;;){let w=b;if(w>=e.length)return;b++;let g=e[w];if(!g)continue;let A=await Mt(g.ip,g.port,a);c++,A?(h++,d.push(g)):u++,v()}}let x=Array.from({length:l},()=>T());await Promise.all(x),W.stdout.write(`
`);let f=((Date.now()-m)/1e3).toFixed(1);W.stdout.write(`  ${s.green}[OK] Stage 1 Finished in ${f}s${s.reset} - Found ${s.bold}${h.toLocaleString()}${s.reset} open TCP ports (${u.toLocaleString()} dropped)

`);let y=[],S=Math.min(Math.max(o.concurrency||300,10),Math.max(d.length,1));if(d.length>0){let J=function(){let L=(Date.now()-w)/1e3,E=g>0?g/Math.max(L,.001):0,R=d.length-g,_=E>0?R/E:Number.NaN;te(`${s.cyan}Stage 2 (Verify)${s.reset} ${re(g,d.length)}% | ${g.toLocaleString()}/${d.length.toLocaleString()} | ${s.green}[OK] ${A} Alive${s.reset} | ${s.red}[FAIL] ${N} Dropped${s.reset} | ${oe(E)} | ETA ${O(_)}`)};var I=J;W.stdout.write(`${s.bold}${s.cyan}>> Stage 2: Health & Exit IP Verification (${S} parallel workers)${s.reset}
`);let w=Date.now(),g=0,A=0,N=0,q=0;async function se(){for(;;){let L=q;if(L>=d.length)return;q++;let E=d[L];if(E){try{let R=await Ft(E,t,o);g++,R.isAlive?(A++,y.push({proxy:E,exitIp:R.exitIp,endpointResults:R.endpointResults})):N++}catch{g++,N++}J()}}}let z=Array.from({length:S},()=>se());await Promise.all(z),W.stdout.write(`
`);let B=((Date.now()-w)/1e3).toFixed(1);W.stdout.write(`  ${s.green}[OK] Stage 2 Finished in ${B}s${s.reset} - Verified ${s.bold}${A.toLocaleString()}${s.reset} alive proxies (${N.toLocaleString()} dropped)

`)}let P=[];if(y.length>0){let N=function(){let z=(Date.now()-w)/1e3,B=g>0?g/Math.max(z,.001):0,L=y.length-g,E=B>0?L/B:Number.NaN;te(`${s.cyan}Stage 3 (Sites)${s.reset} ${re(g,y.length)}% | ${g.toLocaleString()}/${y.length.toLocaleString()} | ${oe(B)} | ETA ${O(E)}`)};var M=N;W.stdout.write(`${s.bold}${s.cyan}>> Stage 3: Top 50 Global Websites Benchmark (${y.length} alive proxies)${s.reset}
`);let w=Date.now(),g=0,A=0,q=Math.min(Math.max(Math.floor(S/3),5),o.concurrency,y.length);async function J(){for(;;){let z=A;if(z>=y.length)return;A++;let B=y[z];if(!B)continue;let{proxy:L,exitIp:E,endpointResults:R}=B,_=[];if(o.benchmarkTopWebsites&&o.topWebsites.length>0)try{_=await Rt(L,o.topWebsites,o)}catch{_=[]}let ie=R.filter($=>$.ok),Z=_.filter($=>$.ok),X=[...ie,...Z],F=X.map($=>$.totalLatencyMs),ae=X.map($=>$.connectTimeMs),ce=X.map($=>$.ttfbMs),le=X.map($=>$.downloadSpeedBps),K=F.length>0?Math.round(F.reduce(($,U)=>$+U,0)/F.length):0,he=F.length>0?Math.min(...F):0,Qe=F.length>0?Math.max(...F):0,et=Bt(F),ge=ae.length>0?Math.round(ae.reduce(($,U)=>$+U,0)/ae.length):0,be=ce.length>0?Math.round(ce.reduce(($,U)=>$+U,0)/ce.length):0,fe=le.length>0?Math.round(le.reduce(($,U)=>$+U,0)/le.length):0,Q="UNKNOWN";E&&(n&&E===n?Q="TRANSPARENT (LEAKING)":Q="ELITE / ANONYMOUS");let ee="SLOW";K<400?ee="EXCELLENT":K<800?ee="GOOD":K<1500&&(ee="MODERATE");let V=o.topWebsites.length,tt=V>0?Number.parseFloat((Z.length/V*100).toFixed(1)):0,H=V>0?Z.length/V:1,ye=H*50,xe=Math.max(0,Math.min(20,20*(1-K/2500))),we=Math.max(0,Math.min(8,8*(1-he/1500))),ve=Math.max(0,Math.min(8,8*(1-ge/800))),Se=Math.max(0,Math.min(7,7*(1-be/1500))),$e=Math.max(0,Math.min(7,fe/(500*1024)*7)),ot=(xe+we+ve+Se+$e)*H,rt=Math.round(ye+ot),nt={websites:Math.round(ye),avgLatency:Math.round(xe*H),minLatency:Math.round(we*H),connectTime:Math.round(ve*H),ttfb:Math.round(Se*H),speed:Math.round($e*H),anonymity:Q==="ELITE / ANONYMOUS"?10:0},st={proxy:L,status:"PASS",tier:ee,compositeScore:rt,scoreBreakdown:nt,exitIp:E,anonymity:Q,endpointsTested:R.length,endpointsPassed:ie.length,endpointsTotal:t.length,passRatePercent:Number.parseFloat((ie.length/t.length*100).toFixed(1)),websitesTested:_.length,websitesPassed:Z.length,websitesTotal:V,websitePassRatePercent:tt,avgLatencyMs:K,minLatencyMs:he,maxLatencyMs:Qe,medianLatencyMs:et,avgConnectTimeMs:ge,avgTtfbMs:be,avgSpeedBps:fe,firstFailedEndpoint:null,failureReason:null,endpointDetails:R,websiteDetails:_};r[L.protocol].push(L),P.push(st),g++,N()}}let se=Array.from({length:q},()=>J());await Promise.all(se),W.stdout.write(`

`)}return P.sort((w,g)=>g.compositeScore!==w.compositeScore?g.compositeScore-w.compositeScore:w.avgLatencyMs-g.avgLatencyMs),P.forEach((w,g)=>{w.rank=g+1}),{results:r,benchmarks:P,stats:{total:e.length,completed:e.length,passed:P.length,failed:e.length-P.length,localPublicIp:n,durationSeconds:(Date.now()-m)/1e3,startedAt:new Date(m).toISOString(),completedAt:new Date().toISOString()}}}var C={trophy:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',globe:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',shield:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',settings:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',copy:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',download:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',search:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',bolt:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',rocket:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',plug:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/></svg>',clock:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',gauge:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>',alert:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>',chevronRight:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',chevronDown:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>'};function je(){return`
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
    `}function ze(e,t){return`
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

        // Active Scoring Weights (Sum = 100)
        let weights = {
            websites: 30,
            avgLatency: 20,
            minLatency: 10,
            connectTime: 10,
            ttfb: 10,
            speed: 10,
            anonymity: 10,
        };

        function toggleWeightsPanel() {
            const panel = document.getElementById('weights-panel');
            panel.classList.toggle('open');
        }

        function resetDefaultWeights() {
            weights = { websites: 30, avgLatency: 20, minLatency: 10, connectTime: 10, ttfb: 10, speed: 10, anonymity: 10 };
            document.getElementById('w-websites').value = 30;
            document.getElementById('w-avgLatency').value = 20;
            document.getElementById('w-minLatency').value = 10;
            document.getElementById('w-connectTime').value = 10;
            document.getElementById('w-ttfb').value = 10;
            document.getElementById('w-speed').value = 10;
            document.getElementById('w-anonymity').value = 10;
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
            weights.anonymity = parseInt(document.getElementById('w-anonymity').value, 10);
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
            document.getElementById('w-val-anonymity').textContent = weights.anonymity + '%';
        }

        function computeWeightedScore(item) {
            const usabilityRatio = item.websitesTotal > 0 ? (item.websitesPassed / item.websitesTotal) : 1;
            const wScore = usabilityRatio * 50;

            const latScore = Math.max(0, Math.min(20, 20 * (1 - (item.avgLatencyMs / 2500))));
            const minLatScore = Math.max(0, Math.min(8, 8 * (1 - (item.minLatencyMs / 1500))));
            const connScore = Math.max(0, Math.min(8, 8 * (1 - (item.avgConnectTimeMs / 800))));
            const ttfbScore = Math.max(0, Math.min(7, 7 * (1 - (item.avgTtfbMs / 1500))));
            const spdScore = Math.max(0, Math.min(7, (item.avgSpeedBps / (500 * 1024)) * 7));

            const rawPerfScore = latScore + minLatScore + connScore + ttfbScore + spdScore;
            const gatedPerfScore = rawPerfScore * usabilityRatio;
            const totalScore = Math.round(wScore + gatedPerfScore);

            return {
                totalScore,
                breakdown: {
                    websites: Math.round(wScore),
                    avgLatency: Math.round(latScore * usabilityRatio),
                    minLatency: Math.round(minLatScore * usabilityRatio),
                    connectTime: Math.round(connScore * usabilityRatio),
                    ttfb: Math.round(ttfbScore * usabilityRatio),
                    speed: Math.round(spdScore * usabilityRatio),
                    anonymity: item.anonymity === 'ELITE / ANONYMOUS' ? 10 : 0,
                }
            };
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
            if (heroMeta) heroMeta.innerHTML = \`<span>\${best.proxy.country || 'Global'}</span> &bull; <span>\${best.anonymity}</span> &bull; <span>\${best.websitesPassed}/\${best.websitesTotal} Targets (\${best.websitePassRatePercent}%)</span>\`;
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
            const headers = ['Rank', 'Score', 'Protocol', 'IP', 'Port', 'Country', 'Status', 'Anonymity', 'WebsitesPassed', 'WebsitesTotal', 'WebPassRate%', 'AvgLatency_ms', 'MinLatency_ms', 'ConnectTime_ms', 'TTFB_ms', 'Speed_Bps', 'ProxyUrl'];
            const rows = filtered.map(b => [
                b.rank || '',
                b.compositeScore || 0,
                b.proxy.protocol,
                b.proxy.ip,
                b.proxy.port,
                b.proxy.country || '',
                b.status,
                b.anonymity || 'UNKNOWN',
                b.websitesPassed || 0,
                b.websitesTotal || 0,
                b.websitePassRatePercent || 0,
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
                    case 'anonymity':
                        vA = a.anonymity || '';
                        vB = b.anonymity || '';
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
            const tooltipText = \`Websites: \${bd.websites || 0} pts | Avg Lat: \${bd.avgLatency || 0} pts | Min Lat: \${bd.minLatency || 0} pts | Connect: \${bd.connectTime || 0} pts | TTFB: \${bd.ttfb || 0} pts | Speed: \${bd.speed || 0} pts | Anon: \${bd.anonymity || 0} pts\`;

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
                <td style="font-size: 0.72rem;">\${item.anonymity || '--'}</td>
                <td class="font-mono">
                    \${item.websitesPassed}/\${item.websitesTotal} (\${item.websitePassRatePercent}%)
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
    `}function Ke(e,t,o,n){let r=e.length>0?e[0]:null,l=e.length>0?Math.round(e.reduce((b,d)=>b+d.avgLatencyMs,0)/e.length):0,a=e.length>0?[...e].sort((b,d)=>b.avgLatencyMs-d.avgLatencyMs)[0]:null,m={http:{total:0,passed:0},https:{total:0,passed:0},socks4:{total:0,passed:0},socks5:{total:0,passed:0}};for(let b of e){let d=b.proxy.protocol;m[d]&&(m[d].total++,b.status==="PASS"&&m[d].passed++)}let c=JSON.stringify({generatedAt:t.completedAt||new Date().toISOString(),stats:t,localPublicIp:t.localPublicIp,endpoints:o,benchmarks:e}),h=je(),u=ze(c,JSON.stringify(C));return`<!DOCTYPE html>
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
                <button class="btn" onclick="toggleWeightsPanel()">${C.settings} Scoring Weights</button>
                <button class="btn btn-highlight" onclick="copyTop10Urls()">${C.copy} Copy Top 10</button>
                <button class="btn" onclick="copyPassedUrls()">${C.copy} Copy All Verified</button>
                <button class="btn btn-primary" onclick="exportFilteredCsv()">${C.download} Export CSV</button>
            </div>
        </header>

        <!-- Dynamic Scoring Weights Panel -->
        <div id="weights-panel" class="weights-panel">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-size: 0.85rem; font-weight: 700; color: var(--accent); display: flex; align-items: center; gap: 6px;">${C.settings} Ranking Weights</h3>
                <button class="btn" style="padding: 2px 8px; font-size: 0.7rem;" onclick="resetDefaultWeights()">Reset Defaults</button>
            </div>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Recalculate composite rankings in real time.</p>
            <div class="weights-grid">
                <div class="weight-item">
                    <div class="weight-header"><span>${C.globe} Top 50 Sites</span><span id="w-val-websites">30%</span></div>
                    <input type="range" class="weight-slider" id="w-websites" min="0" max="50" value="30" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${C.bolt} Avg Latency</span><span id="w-val-avgLatency">20%</span></div>
                    <input type="range" class="weight-slider" id="w-avgLatency" min="0" max="50" value="20" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${C.rocket} Min Latency</span><span id="w-val-minLatency">10%</span></div>
                    <input type="range" class="weight-slider" id="w-minLatency" min="0" max="30" value="10" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${C.plug} Connect Time</span><span id="w-val-connectTime">10%</span></div>
                    <input type="range" class="weight-slider" id="w-connectTime" min="0" max="30" value="10" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${C.clock} TTFB</span><span id="w-val-ttfb">10%</span></div>
                    <input type="range" class="weight-slider" id="w-ttfb" min="0" max="30" value="10" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${C.gauge} Bandwidth</span><span id="w-val-speed">10%</span></div>
                    <input type="range" class="weight-slider" id="w-speed" min="0" max="30" value="10" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${C.shield} Anonymity</span><span id="w-val-anonymity">10%</span></div>
                    <input type="range" class="weight-slider" id="w-anonymity" min="0" max="30" value="10" oninput="updateWeights()">
                </div>
            </div>
        </div>

        <!-- Telemetry Overview Strip (No Cards) -->
        <div class="telemetry-strip">
            <div class="telemetry-lead" id="telemetry-optimal-lead">
                <div class="telemetry-lead-badge font-mono">${C.trophy} OPTIMAL ROUTE</div>
                <div class="telemetry-lead-addr font-mono" id="hero-proxy-url">${r?`${r.proxy.protocol.toUpperCase()}://${r.proxy.ip}:${r.proxy.port}`:"No working route found"}</div>
                <div class="telemetry-lead-meta" id="hero-proxy-meta">
                    ${r?`<span>${r.proxy.country||"Global"}</span> &bull; <span>${r.anonymity}</span> &bull; <span>${r.websitesPassed}/${r.websitesTotal} Targets (${r.websitePassRatePercent}%)</span>`:'<span style="color: var(--danger);">No proxies passed verification</span>'}
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
                    ${r?`<div><button class="btn btn-primary" id="hero-copy-btn" onclick="copyToClipboard('${r.proxy.protocol}://${r.proxy.ip}:${r.proxy.port}')">${C.copy} Copy URL</button></div>`:""}
                </div>
            </div>
            <div class="telemetry-metrics-grid">
                <div class="metric-box">
                    <span class="metric-lbl">Scanned</span>
                    <span class="metric-val font-mono">${t.total.toLocaleString()}</span>
                    <span class="metric-sub">${O(t.durationSeconds)}</span>
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
                    <span class="metric-val font-mono" style="color: var(--accent);">${l>0?l+" ms":"--"}</span>
                    <span class="metric-sub">Min: ${a?a.minLatencyMs+" ms":"--"}</span>
                </div>
                <div class="metric-box">
                    <span class="metric-lbl">Protocols Verified</span>
                    <div class="proto-strip font-mono">
                        <span>H:${m.http.passed}</span>
                        <span>HS:${m.https.passed}</span>
                        <span>S4:${m.socks4.passed}</span>
                        <span>S5:${m.socks5.passed}</span>
                    </div>
                    <span class="metric-sub">${p.topWebsites?.length||50} edge targets</span>
                </div>
            </div>
        </div>

        <!-- Controls / Search & Filters -->
        <div class="controls">
            <div class="filter-group">
                <div class="search-box">
                    <span class="search-icon">${C.search}</span>
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
                        <th data-sort="anonymity">Anonymity</th>
                        <th data-sort="websites">Top 50 Sites</th>
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
</html>`}import Ve from"node:fs/promises";import Ge from"node:path";import Dt from"node:process";async function ne(e,t){let o=`${e}.${Dt.pid}.${Date.now()}.tmp`;await Ve.writeFile(o,t,"utf8"),await Ve.rename(o,e)}async function Ye(e,t){for(let[o,n]of Object.entries(t.outputFiles)){let r=e[o].map(De),l=r.length>0?`${r.join(`
`)}
`:"";await ne(Ge.join(t.outputDir,n),l)}}async function qe(e,t){let o=JSON.stringify(e,null,2);await ne(t,o)}function Je(e,t,o,n,r){i("========================================"),i("                 Results"),i("========================================"),i("");for(let l of["http","https","socks4","socks5"])i(`  ${l.toUpperCase().padEnd(7)} ${t[l].length.toLocaleString()} passed`);i(""),i(`  Local Network IP: ${e.localPublicIp||"Direct"}`),i(`  Verification    : Hard-failed if 0/${o} connected`),i(`  Top Websites    : ${p.topWebsites?.length||50} websites benchmarked`),i(`  Total tested    : ${e.total.toLocaleString()}`),i(`  Passed / Alive  : ${e.passed.toLocaleString()}`),i(`  Hard Failed     : ${e.failed.toLocaleString()} (excluded from report)`),i(`  Duration        : ${O(e.durationSeconds)}`),i(""),i("Output files:");for(let l of Object.values(p.outputFiles))i(`  ${Ge.join(p.outputDir,l)}`);i(""),i("Benchmark Reports:"),r.html&&i(`  ${s.green}HTML Report :${s.reset} ${r.html}`),r.json&&i(`  ${s.cyan}JSON Report :${s.reset} ${r.json}`),i("")}async function Ot(e){let t=[],o,n,r,l,a=!1;for(let m=0;m<e.length;m++){let c=e[m];if(c==="-h"||c==="--help"){a=!0;continue}if(c==="-n"||c==="--limit"){let u=e[++m];u&&(o=Number.parseInt(u,10));continue}if(c.startsWith("--limit=")){o=Number.parseInt(c.split("=")[1],10);continue}if(c==="-c"||c==="--concurrency"){let u=e[++m];u&&(n=Number.parseInt(u,10));continue}if(c.startsWith("--concurrency=")){n=Number.parseInt(c.split("=")[1],10);continue}if(c==="--tcp-concurrency"){let u=e[++m];u&&(r=Number.parseInt(u,10));continue}if(c.startsWith("--tcp-concurrency=")){r=Number.parseInt(c.split("=")[1],10);continue}if(c==="--safe"){l="safe";continue}if(c==="--home"){l="home";continue}if(c==="--turbo"||c==="--vps"){l="turbo";continue}if(c.startsWith("--preset=")){let u=c.split("=")[1].toLowerCase();(u==="safe"||u==="home"||u==="turbo")&&(l=u);continue}if(c.startsWith("-"))continue;try{if((await Ze.stat(c)).isFile()){let b=await Ze.readFile(c,"utf8"),d=Be(b);t.push(...d);continue}}catch{}let h=We(c);h.length>0&&t.push(...h)}return{customProxies:t,limit:o,concurrency:n,tcpConcurrency:r,preset:l,showHelp:a}}function Wt(){i(`
Proxy Benchmark & Network Telemetry Suite

Usage:
  nub update-proxies.ts [options] [proxy...] [file...]
  curl -fsSL https://.../run.sh | bash -s -- [options] [proxy...]
  irm https://.../run.ps1 | iex [options] [proxy...]

Examples:
  # Benchmark with safe home-router defaults (balanced)
  nub update-proxies.ts

  # Benchmark with ultra-gentle mode for sensitive/budget WiFi routers
  nub update-proxies.ts --safe

  # Benchmark high-speed mode on VPS / Gigabit servers
  nub update-proxies.ts --turbo

  # Benchmark a single specific proxy route
  nub update-proxies.ts socks5://64.227.186.105:1080

  # Benchmark custom list from file
  nub update-proxies.ts my-proxies.txt

Options:
  --safe              Ultra-safe profile (35 TCP sockets, 12 workers) for budget routers
  --home              Home router profile (80 TCP sockets, 25 workers - default)
  --turbo, --vps      High-performance profile (1,500 TCP sockets, 300 workers)
  -c, --concurrency   Override parallel worker count
  --tcp-concurrency   Override parallel TCP socket pre-filter count
  -n, --limit <num>   Limit the number of proxies to test
  -h, --help          Show this help message
`)}async function _t(){let{customProxies:e,limit:t,concurrency:o,tcpConcurrency:n,preset:r,showHelp:l}=await Ot(j.argv.slice(2));l&&(Wt(),j.exit(0)),r==="safe"?(p.tcpConcurrency=35,p.concurrency=12,p.websiteConcurrency=3,p.tcpTimeoutMs=1500,p.timeoutSeconds=4.5,p.connectTimeoutSeconds=3,p.websiteTimeoutSeconds=5,p.websiteConnectTimeoutSeconds=3.5):r==="home"?(p.tcpConcurrency=80,p.concurrency=25,p.websiteConcurrency=5,p.tcpTimeoutMs=1200,p.timeoutSeconds=4,p.connectTimeoutSeconds=3,p.websiteTimeoutSeconds=4.5,p.websiteConnectTimeoutSeconds=3):r==="turbo"&&(p.tcpConcurrency=1500,p.concurrency=300,p.websiteConcurrency=25,p.tcpTimeoutMs=800,p.timeoutSeconds=3,p.connectTimeoutSeconds=2,p.websiteTimeoutSeconds=3.5,p.websiteConnectTimeoutSeconds=2.5),o!==void 0&&(p.concurrency=o),n!==void 0&&(p.tcpConcurrency=n);let a=t!==void 0?t:p.limit;i(""),i("========================================"),i("   Proxy Benchmark & Best Network Finder "),i("========================================"),i(""),await Le(),i(`${s.green}[OK]${s.reset} Network tools ready`);let m=await Ee();i(`${s.cyan}[INFO]${s.reset} Origin Public IP: ${s.bold}${m||"Direct / Unknown"}${s.reset}`),i(`${s.gray}TCP Sockets: ${p.tcpConcurrency} | Workers: ${p.concurrency} | Timeout: ${p.timeoutSeconds}s | DNS: ${p.cloudflareDns} | Edge Targets: ${p.benchmarkTopWebsites?`${p.topWebsites?.length||50} sites`:"Disabled"}${s.reset}
`);let c=await Ae(p.testEndpoints,p);p.benchmarkTopWebsites&&p.topWebsites.length>0&&(p.topWebsites=await Ne(p.topWebsites,p));let h=[];if(e.length>0){i("========================================"),i("     Target Endpoints (CLI Input)       "),i("========================================"),i(""),h=Oe(e),i(`Loaded ${h.length} custom route(s) to benchmark:`);for(let f of h)i(`  ${s.cyan}${f.protocol.toUpperCase()}${s.reset}://${f.ip}:${f.port}`);i("")}else{i("========================================"),i("     Fetching Candidate Route Feeds     "),i("========================================"),i("");let{proxies:f}=await Fe(p);if(h=f,h.length===0)throw new Error("Candidate feeds contained no valid endpoints.");a>0&&a<h.length&&(i(`  Limiting benchmark to first ${a} candidates (LIMIT=${a})`),h=h.slice(0,a));let y={http:0,https:0,socks4:0,socks5:0};for(let S of h)y[S.protocol]++;i(`  Target candidate routes to benchmark (${h.length.toLocaleString()} total):
`);for(let S of["http","https","socks4","socks5"])i(`  ${S.toUpperCase().padEnd(7)} ${y[S].toLocaleString()}`)}if(h.length===0)throw new Error("No valid candidate routes to test.");i(`
========================================`),i("      Benchmarking Route Performance    "),i("========================================"),i(""),i(`Stage 1: Async TCP Socket Pre-Filter (${Math.min(p.tcpConcurrency,h.length)} parallel sockets)`),i(`Stage 2: Transport Handshake & Egress Verification (${c.length} verification endpoints)`),p.benchmarkTopWebsites&&i(`Stage 3: Global Edge Reachability Benchmark (${p.topWebsites?.length||50} destinations)`),i(`Stage 4: Composite Route Scoring & Telemetry Generation
`);let{results:u,benchmarks:b,stats:d}=await Ue(h,c,p,m);i("========================================"),i("       Generating Reports & Files       "),i("========================================"),i(""),await Ye(u,p);let v=Xe.join(p.outputDir,p.reportFiles.html),T=Ke(b,d,c,v);await ne(v,T);let x=Xe.join(p.outputDir,p.reportFiles.json);await qe({generatedAt:d.completedAt,stats:d,endpoints:c,benchmarks:b},x),Je(d,u,c.length,p.testEndpoints.length,{html:v,json:x})}j.on("SIGINT",()=>{j.stdout.write(`

`),i(`${s.yellow}Interrupted by user.${s.reset}`),j.exit(130)});_t().catch(e=>{j.stdout.write(`

`),i(`${s.red}ERROR:${s.reset} ${e instanceof Error?e.message:String(e)}`),j.exit(1)});
