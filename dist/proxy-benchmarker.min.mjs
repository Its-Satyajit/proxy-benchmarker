#!/usr/bin/env node
import Gt from"node:fs/promises";import Yt from"node:path";import U from"node:process";import I from"node:process";var St=[{name:"Google",domain:"google.com",category:"Search / Infra",url:"https://www.google.com/generate_204"},{name:"Cloudflare",domain:"cloudflare.com",category:"CDN / Infra",url:"https://www.cloudflare.com/favicon.ico"},{name:"Cloudflare DNS",domain:"1.1.1.1",category:"DNS / Infra",url:"https://1.1.1.1/cdn-cgi/trace"},{name:"Microsoft",domain:"microsoft.com",category:"Search / Tech",url:"https://www.microsoft.com"},{name:"Apple",domain:"apple.com",category:"Tech / Infra",url:"https://www.apple.com"},{name:"Bing",domain:"bing.com",category:"Search",url:"https://www.bing.com"},{name:"DuckDuckGo",domain:"duckduckgo.com",category:"Search",url:"https://duckduckgo.com"},{name:"Yahoo",domain:"yahoo.com",category:"Portal / Search",url:"https://www.yahoo.com"},{name:"GitHub",domain:"github.com",category:"Developer",url:"https://github.com"},{name:"GitLab",domain:"gitlab.com",category:"Developer",url:"https://gitlab.com"},{name:"Stack Overflow",domain:"stackoverflow.com",category:"Developer",url:"https://stackoverflow.com"},{name:"NPM Registry",domain:"npmjs.com",category:"Developer",url:"https://registry.npmjs.org"},{name:"Docker Hub",domain:"docker.com",category:"Developer",url:"https://hub.docker.com"},{name:"Mozilla MDN",domain:"developer.mozilla.org",category:"Developer",url:"https://developer.mozilla.org"},{name:"Bitbucket",domain:"bitbucket.org",category:"Developer",url:"https://bitbucket.org"},{name:"CDNJS",domain:"cdnjs.cloudflare.com",category:"Developer CDN",url:"https://cdnjs.cloudflare.com/robots.txt"},{name:"OpenAI",domain:"openai.com",category:"AI / Tech",url:"https://openai.com"},{name:"Hugging Face",domain:"huggingface.co",category:"AI / Developer",url:"https://huggingface.co"},{name:"YouTube",domain:"youtube.com",category:"Media / Video",url:"https://www.youtube.com/generate_204"},{name:"Netflix",domain:"netflix.com",category:"Media / Streaming",url:"https://www.netflix.com"},{name:"Spotify",domain:"spotify.com",category:"Media / Audio",url:"https://www.spotify.com"},{name:"Twitch",domain:"twitch.tv",category:"Media / Live",url:"https://www.twitch.tv"},{name:"Vimeo",domain:"vimeo.com",category:"Media / Video",url:"https://vimeo.com"},{name:"SoundCloud",domain:"soundcloud.com",category:"Media / Audio",url:"https://soundcloud.com"},{name:"Reddit",domain:"reddit.com",category:"Social / Community",url:"https://www.reddit.com"},{name:"Wikipedia",domain:"wikipedia.org",category:"Reference",url:"https://en.wikipedia.org"},{name:"X / Twitter",domain:"x.com",category:"Social Media",url:"https://x.com"},{name:"LinkedIn",domain:"linkedin.com",category:"Social / Business",url:"https://www.linkedin.com"},{name:"Instagram",domain:"instagram.com",category:"Social Media",url:"https://www.instagram.com"},{name:"Discord",domain:"discord.com",category:"Communication",url:"https://discord.com"},{name:"Telegram",domain:"telegram.org",category:"Communication",url:"https://telegram.org"},{name:"Slack",domain:"slack.com",category:"Communication",url:"https://slack.com"},{name:"Pinterest",domain:"pinterest.com",category:"Social / Discovery",url:"https://www.pinterest.com"},{name:"Quora",domain:"quora.com",category:"Social / Q&A",url:"https://www.quora.com"},{name:"Tumblr",domain:"tumblr.com",category:"Social / Blogging",url:"https://www.tumblr.com"},{name:"Medium",domain:"medium.com",category:"Social / Publishing",url:"https://medium.com"},{name:"Amazon",domain:"amazon.com",category:"E-Commerce",url:"https://www.amazon.com"},{name:"eBay",domain:"ebay.com",category:"E-Commerce",url:"https://www.ebay.com"},{name:"PayPal",domain:"paypal.com",category:"Fintech / Payment",url:"https://www.paypal.com"},{name:"Stripe",domain:"stripe.com",category:"Fintech / Payment",url:"https://stripe.com"},{name:"Booking.com",domain:"booking.com",category:"Travel / Hospitality",url:"https://www.booking.com"},{name:"Airbnb",domain:"airbnb.com",category:"Travel / Hospitality",url:"https://www.airbnb.com"},{name:"AliExpress",domain:"aliexpress.com",category:"E-Commerce",url:"https://www.aliexpress.com"},{name:"Shopify",domain:"shopify.com",category:"E-Commerce",url:"https://www.shopify.com"},{name:"BBC",domain:"bbc.com",category:"News",url:"https://www.bbc.com"},{name:"CNN",domain:"cnn.com",category:"News",url:"https://www.cnn.com"},{name:"The New York Times",domain:"nytimes.com",category:"News",url:"https://www.nytimes.com"},{name:"The Guardian",domain:"theguardian.com",category:"News",url:"https://www.theguardian.com"},{name:"Reuters",domain:"reuters.com",category:"News / Finance",url:"https://www.reuters.com"},{name:"Dropbox",domain:"dropbox.com",category:"Cloud Storage",url:"https://www.dropbox.com"},{name:"Salesforce",domain:"salesforce.com",category:"Enterprise / SaaS",url:"https://www.salesforce.com"},{name:"Adobe",domain:"adobe.com",category:"Design / Creative",url:"https://www.adobe.com"},{name:"Zoom",domain:"zoom.us",category:"Video Conferencing",url:"https://zoom.us"}];var oe=150,re=600,ne=1200,se=4,ae=3,ie=4.5,ce=3,le=15,pe="1.1.1.1",de=2,$t=[{name:"proxifly/free-proxy-list",urls:["https://cdn.jsdelivr.net/gh/proxifly/free-proxy-list@main/proxies/all/data.csv","https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/all/data.csv"]},{name:"proxyscrape/free-proxy-list",urls:["https://cdn.jsdelivr.net/gh/proxyscrape/free-proxy-list@main/proxies/all/data.csv","https://raw.githubusercontent.com/ProxyScrape/free-proxy-list/main/proxies/all/data.csv"]},{name:"hproxy-com/free-proxy-list",urls:["https://cdn.jsdelivr.net/gh/hproxy-com/free-proxy-list@main/live.csv","https://raw.githubusercontent.com/hproxy-com/free-proxy-list/main/live.csv"]},{name:"proxmint/free-proxy-list",urls:["https://cdn.jsdelivr.net/gh/proxmint/free-proxy-list@main/proxies/all.txt","https://raw.githubusercontent.com/proxmint/free-proxy-list/main/proxies/all.txt"]},{name:"proxio-io/proxy-list",urls:["https://cdn.jsdelivr.net/gh/proxio-io/proxy-list@main/all.txt","https://raw.githubusercontent.com/proxio-io/proxy-list/main/all.txt"],defaultProtocol:"http"},{name:"iplocate/free-proxy-list",urls:["https://cdn.jsdelivr.net/gh/iplocate/free-proxy-list@main/all-proxies.txt","https://raw.githubusercontent.com/iplocate/free-proxy-list/main/all-proxies.txt"]},{name:"databay-labs/http",urls:["https://cdn.jsdelivr.net/gh/databay-labs/free-proxy-list@master/http.txt","https://raw.githubusercontent.com/databay-labs/free-proxy-list/master/http.txt"],defaultProtocol:"http"},{name:"databay-labs/socks4",urls:["https://cdn.jsdelivr.net/gh/databay-labs/free-proxy-list@master/socks4.txt","https://raw.githubusercontent.com/databay-labs/free-proxy-list/master/socks4.txt"],defaultProtocol:"socks4"},{name:"databay-labs/socks5",urls:["https://cdn.jsdelivr.net/gh/databay-labs/free-proxy-list@master/socks5.txt","https://raw.githubusercontent.com/databay-labs/free-proxy-list/master/socks5.txt"],defaultProtocol:"socks5"},{name:"monosans/proxy-list",urls:["https://cdn.jsdelivr.net/gh/monosans/proxy-list@main/proxies/all.txt","https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/all.txt"]}],me=[{name:"api.ipify.org",url:"https://api.ipify.org",parser:"plain"},{name:"api64.ipify.org",url:"https://api64.ipify.org",parser:"plain"},{name:"ifconfig.me",url:"https://ifconfig.me/ip",parser:"plain"},{name:"icanhazip.com",url:"https://icanhazip.com",parser:"plain"},{name:"ident.me",url:"https://ident.me",parser:"plain"},{name:"checkip.amazonaws.com",url:"https://checkip.amazonaws.com",parser:"plain"},{name:"ip.me",url:"https://ip.me",parser:"ipme"},{name:"api.my-ip.io",url:"https://api.my-ip.io/ip",parser:"plain"},{name:"ipinfo.io",url:"https://ipinfo.io/ip",parser:"plain"},{name:"ifconfig.co",url:"https://ifconfig.co/ip",parser:"plain"},{name:"myexternalip.com",url:"https://myexternalip.com/raw",parser:"plain"}],b={concurrency:Number.parseInt(I.env.CONCURRENCY||String(oe),10),tcpConcurrency:Number.parseInt(I.env.TCP_CONCURRENCY||String(re),10),tcpTimeoutMs:Number.parseInt(I.env.TCP_TIMEOUT||String(ne),10),timeoutSeconds:Number.parseFloat(I.env.TIMEOUT||String(se)),connectTimeoutSeconds:Number.parseFloat(I.env.CONNECT_TIMEOUT||String(ae)),websiteTimeoutSeconds:Number.parseFloat(I.env.WEBSITE_TIMEOUT||String(ie)),websiteConnectTimeoutSeconds:Number.parseFloat(I.env.WEBSITE_CONNECT_TIMEOUT||String(ce)),websiteConcurrency:Number.parseInt(I.env.WEBSITE_CONCURRENCY||String(le),10),cloudflareDns:I.env.DNS||pe,endpointRetries:Number.parseInt(I.env.DNS_RETRIES||String(de),10),limit:Number.parseInt(I.env.LIMIT||"0",10),fullBenchmark:I.env.FULL_BENCHMARK==="true",benchmarkTopWebsites:I.env.BENCHMARK_WEBSITES!=="false",feeds:$t,csvUrls:$t[0].urls,testEndpoints:me,topWebsites:St,outputDir:I.cwd(),outputFiles:{http:"http.txt",https:"https.txt",socks4:"socks4.txt",socks5:"socks5.txt"},reportFiles:{html:"benchmark-report.html",json:"benchmark-report.json"}};import kt from"node:process";var n={clearLine:"\x1B[2K",reset:"\x1B[0m",bold:"\x1B[1m",dim:"\x1B[2m",green:"\x1B[32m",red:"\x1B[31m",yellow:"\x1B[33m",cyan:"\x1B[36m",blue:"\x1B[34m",magenta:"\x1B[35m",gray:"\x1B[90m"};function a(t=""){kt.stdout.write(`${t}
`)}function X(t){kt.stdout.write(`\r${n.clearLine}${t}`)}function Tt(t){return new Promise(e=>setTimeout(e,t))}function D(t){if(!Number.isFinite(t)||t<0)return"--";let e=Math.round(t),o=Math.floor(e/3600),s=Math.floor(e%3600/60),r=e%60;return o>0?`${o}h ${s}m ${r}s`:s>0?`${s}m ${r}s`:`${r}s`}function Q(t){return!Number.isFinite(t)||t<=0?"0.0/s":`${t.toFixed(1)}/s`}function tt(t,e){return e?(t/e*100).toFixed(1):"0.0"}import{execFile as ue}from"node:child_process";import{promisify as he}from"node:util";import Ct from"node:dns/promises";import{isIP as it}from"node:net";var Pt=he(ue);async function It(){let t=["https://api.ipify.org","https://icanhazip.com","https://ifconfig.me/ip"];for(let e of t)try{let{stdout:o}=await Pt("curl",["--silent","--insecure","--max-time","5",e],{timeout:6e3,windowsHide:!0}),s=o.trim();if(it(s)===4)return s}catch{}return null}async function ge(t,e){try{return await Pt(t,e,{timeout:5e3,maxBuffer:1024*1024,windowsHide:!0}),!0}catch{return!1}}async function Mt(){let t=[["curl",["--version"]]];for(let[e,o]of t)if(!await ge(e,o))throw new Error(`Required command not found or not executable: ${e}`)}function ct(t){let e=new URL(t);return{protocol:e.protocol.replace(":",""),hostname:e.hostname,port:e.port?Number.parseInt(e.port,10):e.protocol==="https:"?443:80}}async function fe(t,e="1.1.1.1"){try{let o=new Ct.Resolver({timeout:4e3,tries:2});e&&o.setServers([e]);let r=(await o.resolve4(t)).filter(i=>it(i)===4);if(r.length>0)return Array.from(new Set(r))}catch{try{let s=(await Ct.resolve4(t)).filter(r=>it(r)===4);if(s.length>0)return Array.from(new Set(s))}catch{}}return[]}async function lt(t,e="1.1.1.1",o=3){for(let s=1;s<=o;s++){let r=await fe(t,e);if(r.length>0)return r[(s-1)%r.length]??null;s<o&&await Tt(1e3)}return null}async function Et(t,e){a(`${n.cyan}Resolving test endpoints using DNS (${e.cloudflareDns})...${n.reset}`),a(`${n.gray}Retries: ${e.endpointRetries}${n.reset}
`);let o=[],s=[];for(let r of t){let i=ct(r.url),c=await lt(i.hostname,e.cloudflareDns,e.endpointRetries);if(!c){s.push(r),a(`  ${n.red}[FAIL]${n.reset} ${r.name.padEnd(24)} ${n.gray}DNS resolution failed -> disabled for this run${n.reset}`);continue}o.push({...r,resolvedIp:c}),a(`  ${n.green}[OK]${n.reset}   ${r.name.padEnd(24)} ${n.gray}${c}${n.reset}`)}if(a(""),o.length===0)throw new Error("No test endpoints could be resolved.");return a(`${n.green}[OK] ${o.length}/${t.length} test endpoints enabled${n.reset}`),s.length>0&&(a(`${n.yellow}[WARN] ${s.length} endpoint(s) disabled because DNS resolution failed.${n.reset}`),a(`${n.gray}Proxies will be tested against the remaining ${o.length} endpoint(s).${n.reset}`)),a(""),o}import{execFile as be}from"node:child_process";import{promisify as ye}from"node:util";var xe=ye(be);function Lt(t,e){let o=t.split(/\r?\n/).map(d=>d.trim()).filter(Boolean);if(o.length===0)return[];let s=o[0]??"",r=(s.includes(",")||s.includes(";"))&&(s.toLowerCase().includes("ip")||s.toLowerCase().includes("protocol")||s.toLowerCase().includes("port")),i=-1,c=-1,p=-1,u=-1;if(r){let d=s.split(/[,;]/).map(l=>l.trim().toLowerCase());i=d.findIndex(l=>l==="protocol"||l==="protocols"||l==="proto"||l==="type"),c=d.findIndex(l=>l==="ip"||l==="host"||l==="ip_address"),p=d.findIndex(l=>l==="port"),u=d.findIndex(l=>l==="country"||l==="country_code"||l==="code")}let g=r?1:0,h=[];for(let d=g;d<o.length;d++){let l=o[d];if(!l)continue;let v=l.match(/^([a-zA-Z0-9]+):\/\/([0-9.]+):([0-9]+)(?:,([a-zA-Z]{2}))?/);if(v&&v[1]&&v[2]&&v[3]){let y=v[1].toLowerCase(),x=v[2],P=Number.parseInt(v[3],10),S=v[4]||void 0;if(["http","https","socks4","socks5"].includes(y)&&!Number.isNaN(P)){h.push({protocol:y,ip:x,port:P,country:S,raw:l});continue}}let k=l.match(/^([0-9.]+):([0-9]+)$/);if(k&&k[1]&&k[2]){let y=k[1],x=Number.parseInt(k[2],10);if(!Number.isNaN(x)){e?h.push({protocol:e,ip:y,port:x,raw:`${e}://${y}:${x}`}):h.push({protocol:"http",ip:y,port:x,raw:`http://${y}:${x}`});continue}}let f=l.split(/[,;]/).map(y=>y.trim().replace(/^["']|["']$/g,""));if(f.length>=2){let y=c!==-1?f[c]:f[0]?.includes(".")?f[0]:f[1],x=p!==-1?f[p]:y===f[0]?f[1]:f[2],P=i!==-1?f[i]:y===f[1]?f[0]:e||"http",S=u!==-1?f[u]:void 0;if(!y||!x)continue;let C=Number.parseInt(x,10);if(Number.isNaN(C)||!/^[0-9.]+$/.test(y))continue;let L=(P||"http").toLowerCase().split(/[|,/]/);for(let w of L){let m=w.trim();["http","https","socks4","socks5"].includes(m)&&h.push({protocol:m,ip:y,port:C,country:S||void 0,raw:`${m}://${y}:${C}`})}}}return h}function At(t){return Lt(t)}async function we(t,e){for(let o of t.urls)try{let s=new URL(o),r=await lt(s.hostname,e.cloudflareDns,e.endpointRetries),i=["--ipv4","--silent","--show-error","--fail","--connect-timeout","6","--max-time","20","-A","Mozilla/5.0 ProxyBenchmarker"];r&&i.push("--resolve",`${s.hostname}:443:${r}`),i.push(o);let{stdout:c}=await xe("curl",i,{timeout:25e3,maxBuffer:8*1024*1024,windowsHide:!0});if(c&&c.length>30)return c}catch{}throw new Error(`Failed to fetch feed ${t.name} from all mirrors`)}async function Nt(t){let e=t.feeds;a(`Fetching candidate routes from ${e.length} upstream feeds...
`);let o=[],s=new Set,r=[],i=0;for(let c of e)try{let p=await we(c,t),u=Lt(p,c.defaultProtocol);i+=u.length;let g=0;for(let h of u){let d=`${h.protocol}://${h.ip}:${h.port}`;s.has(d)||(s.add(d),r.push(h),g++)}o.push({name:c.name,count:u.length,status:"OK"}),a(`  ${n.green}[OK]${n.reset} ${c.name.padEnd(30)} ${u.length.toLocaleString().padStart(6)} routes (+${g.toLocaleString()} new)`)}catch{o.push({name:c.name,count:0,status:"FAIL"}),a(`  ${n.yellow}[WARN]${n.reset} ${c.name.padEnd(30)} Fetch failed (skipped)`)}return a(`
${n.bold}Discovered ${i.toLocaleString()} candidate entries across ${e.length} feeds${n.reset}`),a(`${n.bold}${n.cyan}Deduplicated into ${r.length.toLocaleString()} unique routes via Set key normalization${n.reset}
`),{proxies:r,feedStats:o,totalDiscovered:i}}function Bt(t){return`${t.protocol}://${t.ip}:${t.port}`}function Rt(t){let e=new Set,o=[];for(let s of t){let r=`${s.protocol}:${s.ip}:${s.port}`;e.has(r)||(e.add(r),o.push(s))}return o}function Ft(t){let e=t.trim();if(!e)return[];let o=e.match(/^([a-zA-Z0-9]+):\/\/([0-9.]+):([0-9]+)(?:,([a-zA-Z]{2}))?/);if(o&&o[1]&&o[2]&&o[3]){let r=o[1].toLowerCase(),i=o[2],c=Number.parseInt(o[3],10),p=o[4];if(["http","https","socks4","socks5"].includes(r)&&!Number.isNaN(c))return[{protocol:r,ip:i,port:c,country:p,raw:e}]}let s=e.match(/^([0-9.]+):([0-9]+)$/);if(s&&s[1]&&s[2]){let r=s[1],i=Number.parseInt(s[2],10);if(!Number.isNaN(i))return["socks5","http","https","socks4"].map(c=>({protocol:c,ip:r,port:i,raw:`${c}://${r}:${i}`}))}return[]}function pt(t){switch(t.protocol){case"http":return["-x",`http://${t.ip}:${t.port}`];case"https":return["-x",`https://${t.ip}:${t.port}`];case"socks4":return["--socks4a",`${t.ip}:${t.port}`];case"socks5":return["--socks5-hostname",`${t.ip}:${t.port}`];default:return["-x",`${t.protocol}://${t.ip}:${t.port}`]}}import{execFile as ve}from"node:child_process";import{promisify as Se}from"node:util";import $e from"node:net";import{isIP as dt}from"node:net";import O from"node:process";var Dt=Se(ve);function ke(t,e,o=1200){return new Promise(s=>{let r=new $e.Socket,i=!1,c=()=>{i||(i=!0,r.removeAllListeners(),r.destroy())};r.setTimeout(o),r.once("connect",()=>{c(),s(!0)}),r.once("timeout",()=>{c(),s(!1)}),r.once("error",()=>{c(),s(!1)}),r.once("close",()=>{i||(c(),s(!1))});try{r.connect(e,t)}catch{c(),s(!1)}})}function Te(t){let e=t.trim().split(/\r?\n/).map(o=>o.trim()).filter(Boolean);for(let o of e)if(dt(o)===4)return o;return null}function Ce(t){let e=t.match(/<input\b[^>]*\bname=["']ip["'][^>]*\bvalue=["']((?:\d{1,3}\.){3}\d{1,3})["']/i);if(e&&e[1]&&dt(e[1])===4)return e[1];let o=t.match(/<input\b[^>]*\bvalue=["']((?:\d{1,3}\.){3}\d{1,3})["'][^>]*\bname=["']ip["']/i);return o&&o[1]&&dt(o[1])===4?o[1]:null}function Pe(t,e){return e==="ipme"?Ce(t):Te(t)}async function Ie(t,e,o){let s=ct(e.url),i=["--ipv4","--insecure","--silent","--show-error","--fail-with-body","--noproxy","","--connect-timeout",String(o.connectTimeoutSeconds||2.5),"--max-time",String(o.timeoutSeconds||3.5),"-A","Mozilla/5.0 ProxyBenchmarker","-w",`
__BENCHMARK__:%{http_code}:%{time_connect}:%{time_appconnect}:%{time_starttransfer}:%{time_total}:%{speed_download}:%{size_download}`,...pt(t)];e.resolvedIp&&i.push("--resolve",`${s.hostname}:${s.port}:${e.resolvedIp}`),i.push(e.url);let c=(o.timeoutSeconds||3.5)*1e3+1e3,p="",u="",g=0;try{let L=await Dt("curl",i,{timeout:c,maxBuffer:1048576,windowsHide:!0});p=L.stdout||"",u=L.stderr||""}catch(L){p=L.stdout||"",u=L.stderr||"",g=L.code??1}let h=0,d=0,l=0,v=0,k=0,f=0,y=0,x=p,P=`
__BENCHMARK__:`,S=p.lastIndexOf(P);if(S!==-1){x=p.slice(0,S);let w=p.slice(S+P.length).trim().split(":");w.length>=7&&(h=Number.parseInt(w[0]||"0",10)||0,d=Math.round(Number.parseFloat(w[1]||"0")*1e3),l=Math.round(Number.parseFloat(w[2]||"0")*1e3),v=Math.round(Number.parseFloat(w[3]||"0")*1e3),k=Math.round(Number.parseFloat(w[4]||"0")*1e3),f=Number.parseFloat(w[5]||"0")||0,y=Number.parseInt(w[6]||"0",10)||0)}if(g!==0&&h===0)return{name:e.name,url:e.url,resolvedIp:e.resolvedIp,ok:!1,httpCode:h,totalLatencyMs:k,connectTimeMs:d,sslHandshakeMs:l,ttfbMs:v,downloadSpeedBps:f,downloadSizeBytes:y,returnedIp:null,reason:u.trim()||`curl exit code ${g}`};let C=Pe(x,e.parser);return C?{name:e.name,url:e.url,resolvedIp:e.resolvedIp,ok:!0,httpCode:h,totalLatencyMs:k,connectTimeMs:d,sslHandshakeMs:l,ttfbMs:v,downloadSpeedBps:f,downloadSizeBytes:y,returnedIp:C,reason:null}:{name:e.name,url:e.url,resolvedIp:e.resolvedIp,ok:!1,httpCode:h,totalLatencyMs:k,connectTimeMs:d,sslHandshakeMs:l,ttfbMs:v,downloadSpeedBps:f,downloadSizeBytes:y,returnedIp:null,reason:h>=400?`HTTP ${h}`:"No valid IPv4 returned from endpoint"}}async function Me(t,e,o){let r=["--ipv4","--insecure","--silent","--show-error","-o","/dev/null","--noproxy","","--connect-timeout",String(o.websiteConnectTimeoutSeconds||2),"--max-time",String(o.websiteTimeoutSeconds||3),"-A","Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36","-w",`
__BENCHMARK__:%{http_code}:%{time_connect}:%{time_appconnect}:%{time_starttransfer}:%{time_total}:%{speed_download}:%{size_download}`,...pt(t),e.url],i=(o.websiteTimeoutSeconds||3)*1e3+1e3,c="",p="",u=0;try{let S=await Dt("curl",r,{timeout:i,maxBuffer:524288,windowsHide:!0});c=S.stdout||"",p=S.stderr||""}catch(S){c=S.stdout||"",p=S.stderr||"",u=S.code??1}let g=0,h=0,d=0,l=0,v=0,k=0,f=0,y=`
__BENCHMARK__:`,x=c.lastIndexOf(y);if(x!==-1){let C=c.slice(x+y.length).trim().split(":");C.length>=7&&(g=Number.parseInt(C[0]||"0",10)||0,h=Math.round(Number.parseFloat(C[1]||"0")*1e3),d=Math.round(Number.parseFloat(C[2]||"0")*1e3),l=Math.round(Number.parseFloat(C[3]||"0")*1e3),v=Math.round(Number.parseFloat(C[4]||"0")*1e3),k=Number.parseFloat(C[5]||"0")||0,f=Number.parseInt(C[6]||"0",10)||0)}let P=g>=200&&g<400;return{name:e.name,domain:e.domain,category:e.category,url:e.url,ok:P,httpCode:g,totalLatencyMs:v,connectTimeMs:h,sslHandshakeMs:d,ttfbMs:l,downloadSpeedBps:k,downloadSizeBytes:f,reason:P?null:g>0?`HTTP ${g}`:p.trim()||`Exit code ${u}`}}async function Ee(t,e,o){let s=[],r=o.websiteConcurrency||25;for(let i=0;i<e.length;i+=r){let c=e.slice(i,i+r),p=await Promise.all(c.map(u=>Me(t,u,o)));s.push(...p)}return s}function Le(t){if(t.length===0)return 0;let e=[...t].sort((i,c)=>i-c),o=Math.floor(e.length/2),s=e[o]??0,r=e[o-1]??0;return e.length%2!==0?s:Math.round((r+s)/2)}async function Ae(t,e,o){let s=[],r=null;for(let i of e){let c=await Ie(t,i,o);if(s.push(c),c.ok)return r=c.returnedIp,{isAlive:!0,exitIp:r,endpointResults:s}}return{isAlive:!1,exitIp:null,endpointResults:s}}async function Ot(t,e,o,s=null){let r={http:[],https:[],socks4:[],socks5:[]},i=Math.min(Math.max(o.tcpConcurrency||600,50),t.length),c=o.tcpTimeoutMs||1200;O.stdout.write(`
${n.bold}${n.cyan}>> Stage 1: Async TCP Socket Pre-Filter (${i} parallel sockets)${n.reset}
`);let p=Date.now(),u=0,g=0,h=0,d=0,l=[];function v(){let w=(Date.now()-p)/1e3,m=u>0?u/Math.max(w,.001):0,A=t.length-u,N=m>0?A/m:Number.NaN;X(`${n.cyan}Stage 1 (TCP)${n.reset} ${tt(u,t.length)}% | ${u.toLocaleString()}/${t.length.toLocaleString()} | ${n.green}[OK] ${g} Open${n.reset} | ${n.red}[FAIL] ${h} Closed${n.reset} | ${Q(m)} | ETA ${D(N)}`)}async function k(){for(;;){let w=d;if(w>=t.length)return;d++;let m=t[w];if(!m)continue;let A=await ke(m.ip,m.port,c);u++,A?(g++,l.push(m)):h++,v()}}let f=Array.from({length:i},()=>k());await Promise.all(f),O.stdout.write(`
`);let y=((Date.now()-p)/1e3).toFixed(1);O.stdout.write(`  ${n.green}[OK] Stage 1 Finished in ${y}s${n.reset} - Found ${n.bold}${g.toLocaleString()}${n.reset} open TCP ports (${h.toLocaleString()} dropped)

`);let x=[],P=Math.min(Math.max(o.concurrency||150,10),Math.max(l.length,1));if(l.length>0){let G=function(){let E=(Date.now()-w)/1e3,M=m>0?m/Math.max(E,.001):0,B=l.length-m,_=M>0?B/M:Number.NaN;X(`${n.cyan}Stage 2 (Verify)${n.reset} ${tt(m,l.length)}% | ${m.toLocaleString()}/${l.length.toLocaleString()} | ${n.green}[OK] ${A} Alive${n.reset} | ${n.red}[FAIL] ${N} Dropped${n.reset} | ${Q(M)} | ETA ${D(_)}`)};var C=G;O.stdout.write(`${n.bold}${n.cyan}>> Stage 2: Health & Exit IP Verification (${P} parallel workers)${n.reset}
`);let w=Date.now(),m=0,A=0,N=0,V=0;async function ot(){for(;;){let E=V;if(E>=l.length)return;V++;let M=l[E];if(M){try{let B=await Ae(M,e,o);m++,B.isAlive?(A++,x.push({proxy:M,exitIp:B.exitIp,endpointResults:B.endpointResults})):N++}catch{m++,N++}G()}}}let j=Array.from({length:P},()=>ot());await Promise.all(j),O.stdout.write(`
`);let R=((Date.now()-w)/1e3).toFixed(1);O.stdout.write(`  ${n.green}[OK] Stage 2 Finished in ${R}s${n.reset} - Verified ${n.bold}${A.toLocaleString()}${n.reset} alive proxies (${N.toLocaleString()} dropped)

`)}let S=[];if(x.length>0){let N=function(){let j=(Date.now()-w)/1e3,R=m>0?m/Math.max(j,.001):0,E=x.length-m,M=R>0?E/R:Number.NaN;X(`${n.cyan}Stage 3 (Sites)${n.reset} ${tt(m,x.length)}% | ${m.toLocaleString()}/${x.length.toLocaleString()} | ${Q(R)} | ETA ${D(M)}`)};var L=N;O.stdout.write(`${n.bold}${n.cyan}>> Stage 3: Top 50 Global Websites Benchmark (${x.length} alive proxies)${n.reset}
`);let w=Date.now(),m=0,A=0,V=Math.min(Math.max(Math.floor(P/10),5),15,x.length);async function G(){for(;;){let j=A;if(j>=x.length)return;A++;let R=x[j];if(!R)continue;let{proxy:E,exitIp:M,endpointResults:B}=R,_=[];if(o.benchmarkTopWebsites&&o.topWebsites.length>0)try{_=await Ee(E,o.topWebsites,o)}catch{_=[]}let rt=B.filter($=>$.ok),Y=_.filter($=>$.ok),q=[...rt,...Y],F=q.map($=>$.totalLatencyMs),nt=q.map($=>$.connectTimeMs),st=q.map($=>$.ttfbMs),at=q.map($=>$.downloadSpeedBps),z=F.length>0?Math.round(F.reduce(($,W)=>$+W,0)/F.length):0,mt=F.length>0?Math.min(...F):0,qt=F.length>0?Math.max(...F):0,Jt=Le(F),ut=nt.length>0?Math.round(nt.reduce(($,W)=>$+W,0)/nt.length):0,ht=st.length>0?Math.round(st.reduce(($,W)=>$+W,0)/st.length):0,gt=at.length>0?Math.round(at.reduce(($,W)=>$+W,0)/at.length):0,J="UNKNOWN";M&&(s&&M===s?J="TRANSPARENT (LEAKING)":J="ELITE / ANONYMOUS");let Z="SLOW";z<400?Z="EXCELLENT":z<800?Z="GOOD":z<1500&&(Z="MODERATE");let K=o.topWebsites.length,Zt=K>0?Number.parseFloat((Y.length/K*100).toFixed(1)):0,H=K>0?Y.length/K:1,ft=H*50,bt=Math.max(0,Math.min(20,20*(1-z/2500))),yt=Math.max(0,Math.min(8,8*(1-mt/1500))),xt=Math.max(0,Math.min(8,8*(1-ut/800))),wt=Math.max(0,Math.min(7,7*(1-ht/1500))),vt=Math.max(0,Math.min(7,gt/(500*1024)*7)),Xt=(bt+yt+xt+wt+vt)*H,Qt=Math.round(ft+Xt),te={websites:Math.round(ft),avgLatency:Math.round(bt*H),minLatency:Math.round(yt*H),connectTime:Math.round(xt*H),ttfb:Math.round(wt*H),speed:Math.round(vt*H),anonymity:J==="ELITE / ANONYMOUS"?10:0},ee={proxy:E,status:"PASS",tier:Z,compositeScore:Qt,scoreBreakdown:te,exitIp:M,anonymity:J,endpointsTested:B.length,endpointsPassed:rt.length,endpointsTotal:e.length,passRatePercent:Number.parseFloat((rt.length/e.length*100).toFixed(1)),websitesTested:_.length,websitesPassed:Y.length,websitesTotal:K,websitePassRatePercent:Zt,avgLatencyMs:z,minLatencyMs:mt,maxLatencyMs:qt,medianLatencyMs:Jt,avgConnectTimeMs:ut,avgTtfbMs:ht,avgSpeedBps:gt,firstFailedEndpoint:null,failureReason:null,endpointDetails:B,websiteDetails:_};r[E.protocol].push(E),S.push(ee),m++,N()}}let ot=Array.from({length:V},()=>G());await Promise.all(ot),O.stdout.write(`

`)}return S.sort((w,m)=>m.compositeScore!==w.compositeScore?m.compositeScore-w.compositeScore:w.avgLatencyMs-m.avgLatencyMs),S.forEach((w,m)=>{w.rank=m+1}),{results:r,benchmarks:S,stats:{total:t.length,completed:t.length,passed:S.length,failed:t.length-S.length,localPublicIp:s,durationSeconds:(Date.now()-p)/1e3,startedAt:new Date(p).toISOString(),completedAt:new Date().toISOString()}}}var T={trophy:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',globe:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',shield:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',settings:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',copy:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',download:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',search:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',bolt:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',rocket:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',plug:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/></svg>',clock:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',gauge:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>',alert:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>',chevronRight:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',chevronDown:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>'};function _t(){return`
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
    `}function Ht(t,e){return`
        const RAW_DATA = ${t};
        let benchmarks = RAW_DATA.benchmarks || [];
        let currentSort = { column: 'score', asc: false };
        let expandedRows = new Set();
        let currentSubTabs = {};

        const SVG_ICONS = ${e};

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
    `}function Wt(t,e,o,s){let r=t.length>0?t[0]:null,i=t.length>0?Math.round(t.reduce((d,l)=>d+l.avgLatencyMs,0)/t.length):0,c=t.length>0?[...t].sort((d,l)=>d.avgLatencyMs-l.avgLatencyMs)[0]:null,p={http:{total:0,passed:0},https:{total:0,passed:0},socks4:{total:0,passed:0},socks5:{total:0,passed:0}};for(let d of t){let l=d.proxy.protocol;p[l]&&(p[l].total++,d.status==="PASS"&&p[l].passed++)}let u=JSON.stringify({generatedAt:e.completedAt||new Date().toISOString(),stats:e,localPublicIp:e.localPublicIp,endpoints:o,benchmarks:t}),g=_t(),h=Ht(u,JSON.stringify(T));return`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proxy Benchmark & Network Telemetry</title>
    <style>${g}</style>
</head>
<body>
    <div class="container">
        <header>
            <div class="title-group">
                <h1><span class="badge-pulse"></span> Proxy Benchmark & Network Telemetry</h1>
                <p>Origin IP: <span class="font-mono">${e.localPublicIp||"Direct"}</span> &bull; Telemetry across 50 global edge endpoints</p>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button class="btn" onclick="toggleWeightsPanel()">${T.settings} Scoring Weights</button>
                <button class="btn btn-highlight" onclick="copyTop10Urls()">${T.copy} Copy Top 10</button>
                <button class="btn" onclick="copyPassedUrls()">${T.copy} Copy All Verified</button>
                <button class="btn btn-primary" onclick="exportFilteredCsv()">${T.download} Export CSV</button>
            </div>
        </header>

        <!-- Dynamic Scoring Weights Panel -->
        <div id="weights-panel" class="weights-panel">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-size: 0.85rem; font-weight: 700; color: var(--accent); display: flex; align-items: center; gap: 6px;">${T.settings} Ranking Weights</h3>
                <button class="btn" style="padding: 2px 8px; font-size: 0.7rem;" onclick="resetDefaultWeights()">Reset Defaults</button>
            </div>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Recalculate composite rankings in real time.</p>
            <div class="weights-grid">
                <div class="weight-item">
                    <div class="weight-header"><span>${T.globe} Top 50 Sites</span><span id="w-val-websites">30%</span></div>
                    <input type="range" class="weight-slider" id="w-websites" min="0" max="50" value="30" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${T.bolt} Avg Latency</span><span id="w-val-avgLatency">20%</span></div>
                    <input type="range" class="weight-slider" id="w-avgLatency" min="0" max="50" value="20" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${T.rocket} Min Latency</span><span id="w-val-minLatency">10%</span></div>
                    <input type="range" class="weight-slider" id="w-minLatency" min="0" max="30" value="10" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${T.plug} Connect Time</span><span id="w-val-connectTime">10%</span></div>
                    <input type="range" class="weight-slider" id="w-connectTime" min="0" max="30" value="10" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${T.clock} TTFB</span><span id="w-val-ttfb">10%</span></div>
                    <input type="range" class="weight-slider" id="w-ttfb" min="0" max="30" value="10" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${T.gauge} Bandwidth</span><span id="w-val-speed">10%</span></div>
                    <input type="range" class="weight-slider" id="w-speed" min="0" max="30" value="10" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${T.shield} Anonymity</span><span id="w-val-anonymity">10%</span></div>
                    <input type="range" class="weight-slider" id="w-anonymity" min="0" max="30" value="10" oninput="updateWeights()">
                </div>
            </div>
        </div>

        <!-- Telemetry Overview Strip (No Cards) -->
        <div class="telemetry-strip">
            <div class="telemetry-lead" id="telemetry-optimal-lead">
                <div class="telemetry-lead-badge font-mono">${T.trophy} OPTIMAL ROUTE</div>
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
                    ${r?`<div><button class="btn btn-primary" id="hero-copy-btn" onclick="copyToClipboard('${r.proxy.protocol}://${r.proxy.ip}:${r.proxy.port}')">${T.copy} Copy URL</button></div>`:""}
                </div>
            </div>
            <div class="telemetry-metrics-grid">
                <div class="metric-box">
                    <span class="metric-lbl">Scanned</span>
                    <span class="metric-val font-mono">${e.total.toLocaleString()}</span>
                    <span class="metric-sub">${D(e.durationSeconds)}</span>
                </div>
                <div class="metric-box">
                    <span class="metric-lbl">Verified</span>
                    <span class="metric-val font-mono" style="color: var(--success);">${e.passed.toLocaleString()}</span>
                    <span class="metric-sub">${(e.passed/Math.max(e.total,1)*100).toFixed(1)}% alive</span>
                </div>
                <div class="metric-box">
                    <span class="metric-lbl">Dropped</span>
                    <span class="metric-val font-mono" style="color: var(--danger);">${e.failed.toLocaleString()}</span>
                    <span class="metric-sub">Excluded</span>
                </div>
                <div class="metric-box">
                    <span class="metric-lbl">Avg Latency</span>
                    <span class="metric-val font-mono" style="color: var(--accent);">${i>0?i+" ms":"--"}</span>
                    <span class="metric-sub">Min: ${c?c.minLatencyMs+" ms":"--"}</span>
                </div>
                <div class="metric-box">
                    <span class="metric-lbl">Protocols Verified</span>
                    <div class="proto-strip font-mono">
                        <span>H:${p.http.passed}</span>
                        <span>HS:${p.https.passed}</span>
                        <span>S4:${p.socks4.passed}</span>
                        <span>S5:${p.socks5.passed}</span>
                    </div>
                    <span class="metric-sub">${b.topWebsites?.length||50} edge targets</span>
                </div>
            </div>
        </div>

        <!-- Controls / Search & Filters -->
        <div class="controls">
            <div class="filter-group">
                <div class="search-box">
                    <span class="search-icon">${T.search}</span>
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

    <script>${h}</script>
</body>
</html>`}import Ut from"node:fs/promises";import jt from"node:path";import Ne from"node:process";async function et(t,e){let o=`${t}.${Ne.pid}.${Date.now()}.tmp`;await Ut.writeFile(o,e,"utf8"),await Ut.rename(o,t)}async function zt(t,e){for(let[o,s]of Object.entries(e.outputFiles)){let r=t[o].map(Bt),i=r.length>0?`${r.join(`
`)}
`:"";await et(jt.join(e.outputDir,s),i)}}async function Kt(t,e){let o=JSON.stringify(t,null,2);await et(e,o)}function Vt(t,e,o,s,r){a("========================================"),a("                 Results"),a("========================================"),a("");for(let i of["http","https","socks4","socks5"])a(`  ${i.toUpperCase().padEnd(7)} ${e[i].length.toLocaleString()} passed`);a(""),a(`  Local Network IP: ${t.localPublicIp||"Direct"}`),a(`  Verification    : Hard-failed if 0/${o} connected`),a(`  Top Websites    : ${b.topWebsites?.length||50} websites benchmarked`),a(`  Total tested    : ${t.total.toLocaleString()}`),a(`  Passed / Alive  : ${t.passed.toLocaleString()}`),a(`  Hard Failed     : ${t.failed.toLocaleString()} (excluded from report)`),a(`  Duration        : ${D(t.durationSeconds)}`),a(""),a("Output files:");for(let i of Object.values(b.outputFiles))a(`  ${jt.join(b.outputDir,i)}`);a(""),a("Benchmark Reports:"),r.html&&a(`  ${n.green}HTML Report :${n.reset} ${r.html}`),r.json&&a(`  ${n.cyan}JSON Report :${n.reset} ${r.json}`),a("")}async function Be(t){let e=[],o,s=!1;for(let r=0;r<t.length;r++){let i=t[r];if(i==="-h"||i==="--help"){s=!0;continue}if(i==="-n"||i==="--limit"){let p=t[++r];p&&(o=Number.parseInt(p,10));continue}if(i.startsWith("--limit=")){o=Number.parseInt(i.split("=")[1],10);continue}if(i.startsWith("-"))continue;try{if((await Gt.stat(i)).isFile()){let u=await Gt.readFile(i,"utf8"),g=At(u);e.push(...g);continue}}catch{}let c=Ft(i);c.length>0&&e.push(...c)}return{customProxies:e,limit:o,showHelp:s}}function Re(){a(`
Proxy Benchmark & Network Telemetry Suite

Usage:
  nub update-proxies.ts [options] [proxy...] [file...]
  curl -fsSL https://.../run.sh | bash -s -- [proxy...]
  irm https://.../run.ps1 | iex [proxy...]

Examples:
  # Benchmark full proxy feed
  nub update-proxies.ts

  # Benchmark a single specific proxy route
  nub update-proxies.ts socks5://64.227.186.105:1080

  # Benchmark multiple custom routes
  nub update-proxies.ts http://1.2.3.4:8080 socks5://64.227.186.105:1080

  # Benchmark custom list from file
  nub update-proxies.ts my-proxies.txt

Options:
  -n, --limit <num>   Limit the number of proxies to test
  -h, --help          Show this help message
`)}async function Fe(){let{customProxies:t,limit:e,showHelp:o}=await Be(U.argv.slice(2));o&&(Re(),U.exit(0));let s=e!==void 0?e:b.limit;a(""),a("========================================"),a("   Proxy Benchmark & Best Network Finder "),a("========================================"),a(""),await Mt(),a(`${n.green}[OK]${n.reset} Network tools ready`);let r=await It();a(`${n.cyan}[INFO]${n.reset} Origin Public IP: ${n.bold}${r||"Direct / Unknown"}${n.reset}`),a(`${n.gray}TCP Sockets: ${b.tcpConcurrency} | Workers: ${b.concurrency} | Timeout: ${b.timeoutSeconds}s | DNS: ${b.cloudflareDns} | Edge Targets: ${b.benchmarkTopWebsites?`${b.topWebsites?.length||50} sites`:"Disabled"}${n.reset}
`);let i=await Et(b.testEndpoints,b),c=[];if(t.length>0){a("========================================"),a("     Target Endpoints (CLI Input)       "),a("========================================"),a(""),c=Rt(t),a(`Loaded ${c.length} custom route(s) to benchmark:`);for(let v of c)a(`  ${n.cyan}${v.protocol.toUpperCase()}${n.reset}://${v.ip}:${v.port}`);a("")}else{a("========================================"),a("     Fetching Candidate Route Feeds     "),a("========================================"),a("");let{proxies:v}=await Nt(b);if(c=v,c.length===0)throw new Error("Candidate feeds contained no valid endpoints.");s>0&&s<c.length&&(a(`  Limiting benchmark to first ${s} candidates (LIMIT=${s})`),c=c.slice(0,s));let k={http:0,https:0,socks4:0,socks5:0};for(let f of c)k[f.protocol]++;a(`  Target candidate routes to benchmark (${c.length.toLocaleString()} total):
`);for(let f of["http","https","socks4","socks5"])a(`  ${f.toUpperCase().padEnd(7)} ${k[f].toLocaleString()}`)}if(c.length===0)throw new Error("No valid candidate routes to test.");a(`
========================================`),a("      Benchmarking Route Performance    "),a("========================================"),a(""),a(`Stage 1: Async TCP Socket Pre-Filter (${Math.min(b.tcpConcurrency,c.length)} parallel sockets)`),a(`Stage 2: Transport Handshake & Egress Verification (${i.length} verification endpoints)`),b.benchmarkTopWebsites&&a(`Stage 3: Global Edge Reachability Benchmark (${b.topWebsites?.length||50} destinations)`),a(`Stage 4: Composite Route Scoring & Telemetry Generation
`);let{results:p,benchmarks:u,stats:g}=await Ot(c,i,b,r);a("========================================"),a("       Generating Reports & Files       "),a("========================================"),a(""),await zt(p,b);let h=Yt.join(b.outputDir,b.reportFiles.html),d=Wt(u,g,i,h);await et(h,d);let l=Yt.join(b.outputDir,b.reportFiles.json);await Kt({generatedAt:g.completedAt,stats:g,endpoints:i,benchmarks:u},l),Vt(g,p,i.length,b.testEndpoints.length,{html:h,json:l})}U.on("SIGINT",()=>{U.stdout.write(`

`),a(`${n.yellow}Interrupted by user.${n.reset}`),U.exit(130)});Fe().catch(t=>{U.stdout.write(`

`),a(`${n.red}ERROR:${n.reset} ${t instanceof Error?t.message:String(t)}`),U.exit(1)});
