#!/usr/bin/env node
import Re from"node:path";import _ from"node:process";import P from"node:process";var be=[{name:"Google",domain:"google.com",category:"Search / Infra",url:"https://www.google.com/generate_204"},{name:"Cloudflare",domain:"cloudflare.com",category:"CDN / Infra",url:"https://www.cloudflare.com/favicon.ico"},{name:"Cloudflare DNS",domain:"1.1.1.1",category:"DNS / Infra",url:"https://1.1.1.1/cdn-cgi/trace"},{name:"Microsoft",domain:"microsoft.com",category:"Search / Tech",url:"https://www.microsoft.com"},{name:"Apple",domain:"apple.com",category:"Tech / Infra",url:"https://www.apple.com"},{name:"Bing",domain:"bing.com",category:"Search",url:"https://www.bing.com"},{name:"DuckDuckGo",domain:"duckduckgo.com",category:"Search",url:"https://duckduckgo.com"},{name:"Yahoo",domain:"yahoo.com",category:"Portal / Search",url:"https://www.yahoo.com"},{name:"GitHub",domain:"github.com",category:"Developer",url:"https://github.com"},{name:"GitLab",domain:"gitlab.com",category:"Developer",url:"https://gitlab.com"},{name:"Stack Overflow",domain:"stackoverflow.com",category:"Developer",url:"https://stackoverflow.com"},{name:"NPM Registry",domain:"npmjs.com",category:"Developer",url:"https://registry.npmjs.org"},{name:"Docker Hub",domain:"docker.com",category:"Developer",url:"https://hub.docker.com"},{name:"Mozilla MDN",domain:"developer.mozilla.org",category:"Developer",url:"https://developer.mozilla.org"},{name:"Bitbucket",domain:"bitbucket.org",category:"Developer",url:"https://bitbucket.org"},{name:"CDNJS",domain:"cdnjs.cloudflare.com",category:"Developer CDN",url:"https://cdnjs.cloudflare.com/robots.txt"},{name:"OpenAI",domain:"openai.com",category:"AI / Tech",url:"https://openai.com"},{name:"Hugging Face",domain:"huggingface.co",category:"AI / Developer",url:"https://huggingface.co"},{name:"YouTube",domain:"youtube.com",category:"Media / Video",url:"https://www.youtube.com/generate_204"},{name:"Netflix",domain:"netflix.com",category:"Media / Streaming",url:"https://www.netflix.com"},{name:"Spotify",domain:"spotify.com",category:"Media / Audio",url:"https://www.spotify.com"},{name:"Twitch",domain:"twitch.tv",category:"Media / Live",url:"https://www.twitch.tv"},{name:"Vimeo",domain:"vimeo.com",category:"Media / Video",url:"https://vimeo.com"},{name:"SoundCloud",domain:"soundcloud.com",category:"Media / Audio",url:"https://soundcloud.com"},{name:"Reddit",domain:"reddit.com",category:"Social / Community",url:"https://www.reddit.com"},{name:"Wikipedia",domain:"wikipedia.org",category:"Reference",url:"https://en.wikipedia.org"},{name:"X / Twitter",domain:"x.com",category:"Social Media",url:"https://x.com"},{name:"LinkedIn",domain:"linkedin.com",category:"Social / Business",url:"https://www.linkedin.com"},{name:"Instagram",domain:"instagram.com",category:"Social Media",url:"https://www.instagram.com"},{name:"Discord",domain:"discord.com",category:"Communication",url:"https://discord.com"},{name:"Telegram",domain:"telegram.org",category:"Communication",url:"https://telegram.org"},{name:"Slack",domain:"slack.com",category:"Communication",url:"https://slack.com"},{name:"Pinterest",domain:"pinterest.com",category:"Social / Discovery",url:"https://www.pinterest.com"},{name:"Quora",domain:"quora.com",category:"Social / Q&A",url:"https://www.quora.com"},{name:"Tumblr",domain:"tumblr.com",category:"Social / Blogging",url:"https://www.tumblr.com"},{name:"Medium",domain:"medium.com",category:"Social / Publishing",url:"https://medium.com"},{name:"Amazon",domain:"amazon.com",category:"E-Commerce",url:"https://www.amazon.com"},{name:"eBay",domain:"ebay.com",category:"E-Commerce",url:"https://www.ebay.com"},{name:"PayPal",domain:"paypal.com",category:"Fintech / Payment",url:"https://www.paypal.com"},{name:"Stripe",domain:"stripe.com",category:"Fintech / Payment",url:"https://stripe.com"},{name:"Booking.com",domain:"booking.com",category:"Travel / Hospitality",url:"https://www.booking.com"},{name:"Airbnb",domain:"airbnb.com",category:"Travel / Hospitality",url:"https://www.airbnb.com"},{name:"AliExpress",domain:"aliexpress.com",category:"E-Commerce",url:"https://www.aliexpress.com"},{name:"Shopify",domain:"shopify.com",category:"E-Commerce",url:"https://www.shopify.com"},{name:"BBC",domain:"bbc.com",category:"News",url:"https://www.bbc.com"},{name:"CNN",domain:"cnn.com",category:"News",url:"https://www.cnn.com"},{name:"The New York Times",domain:"nytimes.com",category:"News",url:"https://www.nytimes.com"},{name:"The Guardian",domain:"theguardian.com",category:"News",url:"https://www.theguardian.com"},{name:"Reuters",domain:"reuters.com",category:"News / Finance",url:"https://www.reuters.com"},{name:"Dropbox",domain:"dropbox.com",category:"Cloud Storage",url:"https://www.dropbox.com"},{name:"Salesforce",domain:"salesforce.com",category:"Enterprise / SaaS",url:"https://www.salesforce.com"},{name:"Adobe",domain:"adobe.com",category:"Design / Creative",url:"https://www.adobe.com"},{name:"Zoom",domain:"zoom.us",category:"Video Conferencing",url:"https://zoom.us"}];var Ke=100,Ge=4,Ve=3,Ye=3.5,qe=2.5,Je=25,Ze="1.1.1.1",Xe=2,Qe=[{name:"api.ipify.org",url:"https://api.ipify.org",parser:"plain"},{name:"api64.ipify.org",url:"https://api64.ipify.org",parser:"plain"},{name:"ifconfig.me",url:"https://ifconfig.me/ip",parser:"plain"},{name:"icanhazip.com",url:"https://icanhazip.com",parser:"plain"},{name:"ident.me",url:"https://ident.me",parser:"plain"},{name:"checkip.amazonaws.com",url:"https://checkip.amazonaws.com",parser:"plain"},{name:"ip.me",url:"https://ip.me",parser:"ipme"},{name:"api.my-ip.io",url:"https://api.my-ip.io/ip",parser:"plain"},{name:"ipinfo.io",url:"https://ipinfo.io/ip",parser:"plain"},{name:"ifconfig.co",url:"https://ifconfig.co/ip",parser:"plain"},{name:"myexternalip.com",url:"https://myexternalip.com/raw",parser:"plain"}],u={concurrency:Number.parseInt(P.env.CONCURRENCY||String(Ke),10),timeoutSeconds:Number.parseFloat(P.env.TIMEOUT||String(Ge)),connectTimeoutSeconds:Number.parseFloat(P.env.CONNECT_TIMEOUT||String(Ve)),websiteTimeoutSeconds:Number.parseFloat(P.env.WEBSITE_TIMEOUT||String(Ye)),websiteConnectTimeoutSeconds:Number.parseFloat(P.env.WEBSITE_CONNECT_TIMEOUT||String(qe)),websiteConcurrency:Number.parseInt(P.env.WEBSITE_CONCURRENCY||String(Je),10),cloudflareDns:P.env.DNS||Ze,endpointRetries:Number.parseInt(P.env.DNS_RETRIES||String(Xe),10),limit:Number.parseInt(P.env.LIMIT||"0",10),fullBenchmark:P.env.FULL_BENCHMARK==="true",benchmarkTopWebsites:P.env.BENCHMARK_WEBSITES!=="false",csvUrls:["https://cdn.jsdelivr.net/gh/proxifly/free-proxy-list@main/proxies/all/data.csv","https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/all/data.csv"],testEndpoints:Qe,topWebsites:be,outputDir:P.cwd(),outputFiles:{http:"http.txt",https:"https.txt",socks4:"socks4.txt",socks5:"socks5.txt"},reportFiles:{html:"benchmark-report.html",json:"benchmark-report.json"}};import ye from"node:process";var s={clearLine:"\x1B[2K",reset:"\x1B[0m",bold:"\x1B[1m",dim:"\x1B[2m",green:"\x1B[32m",red:"\x1B[31m",yellow:"\x1B[33m",cyan:"\x1B[36m",blue:"\x1B[34m",magenta:"\x1B[35m",gray:"\x1B[90m"};function n(e=""){ye.stdout.write(`${e}
`)}function X(e){ye.stdout.write(`\r${s.clearLine}${e}`)}function fe(e){return new Promise(t=>setTimeout(t,e))}function N(e){if(!Number.isFinite(e)||e<0)return"--";let t=Math.round(e),o=Math.floor(t/3600),a=Math.floor(t%3600/60),r=t%60;return o>0?`${o}h ${a}m ${r}s`:a>0?`${a}m ${r}s`:`${r}s`}function Q(e){return!Number.isFinite(e)||e<=0?"0.0/s":`${e.toFixed(1)}/s`}function ee(e,t){return t?(e/t*100).toFixed(1):"0.0"}import{execFile as et}from"node:child_process";import{promisify as tt}from"node:util";import{isIP as ve}from"node:net";var te=tt(et);async function xe(){let e=["https://api.ipify.org","https://icanhazip.com","https://ifconfig.me/ip"];for(let t of e)try{let{stdout:o}=await te("curl",["--silent","--insecure","--max-time","5",t],{timeout:6e3}),a=o.trim();if(ve(a)===4)return a}catch{}return null}async function ot(e,t){try{return await te(e,t,{timeout:5e3,maxBuffer:1024*1024}),!0}catch{return!1}}async function we(){let e=[["curl",["--version"]],["dig",["-v"]]];for(let[t,o]of e)if(!await ot(t,o))throw new Error(`Required command not found or not executable: ${t}`)}function oe(e){let t=new URL(e);return{protocol:t.protocol.replace(":",""),hostname:t.hostname,port:t.port?Number.parseInt(t.port,10):t.protocol==="https:"?443:80}}async function rt(e,t="1.1.1.1"){let o=[[`@${t}`,"A",e,"+short"],[`@${t}`,"A",e,"+short","+tcp"]];for(let a of o)try{let{stdout:r}=await te("dig",a,{timeout:5e3,maxBuffer:1048576}),c=r.split(/\r?\n/).map(i=>i.trim()).filter(i=>ve(i)===4);if(c.length>0)return Array.from(new Set(c))}catch{}return[]}async function re(e,t="1.1.1.1",o=3){for(let a=1;a<=o;a++){let r=await rt(e,t);if(r.length>0)return r[(a-1)%r.length]??null;a<o&&await fe(1e3)}return null}async function Se(e,t){n(`${s.cyan}Resolving test endpoints using DNS (${t.cloudflareDns})...${s.reset}`),n(`${s.gray}Retries: ${t.endpointRetries}${s.reset}
`);let o=[],a=[];for(let r of e){let c=oe(r.url),i=await re(c.hostname,t.cloudflareDns,t.endpointRetries);if(!i){a.push(r),n(`  ${s.red}[FAIL]${s.reset} ${r.name.padEnd(24)} ${s.gray}DNS resolution failed -> disabled for this run${s.reset}`);continue}o.push({...r,resolvedIp:i}),n(`  ${s.green}[OK]${s.reset}   ${r.name.padEnd(24)} ${s.gray}${i}${s.reset}`)}if(n(""),o.length===0)throw new Error("No test endpoints could be resolved.");return n(`${s.green}[OK] ${o.length}/${e.length} test endpoints enabled${s.reset}`),a.length>0&&(n(`${s.yellow}[WARN] ${a.length} endpoint(s) disabled because DNS resolution failed.${s.reset}`),n(`${s.gray}Proxies will be tested against the remaining ${o.length} endpoint(s).${s.reset}`)),n(""),o}import{execFile as nt}from"node:child_process";import{promisify as st}from"node:util";var at=st(nt);function $e(e){let t=e.split(/\r?\n/).map(p=>p.trim()).filter(Boolean);if(t.length===0)return[];let o=t[0]??"",a=o.toLowerCase().includes("protocol")&&o.toLowerCase().includes("ip"),r=a?1:0,c=-1,i=-1,l=-1,g=-1;if(a){let p=o.split(",").map(m=>m.trim().toLowerCase());c=p.indexOf("protocol"),i=p.indexOf("ip"),l=p.indexOf("port"),g=p.indexOf("country")}let h=[];for(let p=r;p<t.length;p++){let m=t[p];if(!m)continue;let b=m.match(/^([a-zA-Z0-9]+):\/\/([0-9.]+):([0-9]+)(?:,([a-zA-Z]{2}))?/);if(b&&b[1]&&b[2]&&b[3]){let $=b[1].toLowerCase(),k=b[2],f=Number.parseInt(b[3],10),C=b[4]||void 0;if(["http","https","socks4","socks5"].includes($)&&!Number.isNaN(f)){h.push({protocol:$,ip:k,port:f,country:C,raw:m});continue}}let w=m.split(",").map($=>$.trim());if(w.length>=3){let $=c!==-1?w[c]:w[0],k=i!==-1?w[i]:w[1],f=l!==-1?w[l]:w[2],C=g!==-1?w[g]:w[3]||"";if(!$||!k||!f)continue;let y=$.toLowerCase(),d=Number.parseInt(f,10);["http","https","socks4","socks5"].includes(y)&&!Number.isNaN(d)&&h.push({protocol:y,ip:k,port:d,country:C||void 0,raw:m})}}return h}async function ke(e,t){n("Downloading latest ProxyScrape list...");for(let o of e){let a=new URL(o),r=await re(a.hostname,t.cloudflareDns,t.endpointRetries);if(!r){n(`  ${s.yellow}[WARN]${s.reset} ${a.hostname}: DNS resolution failed`);continue}n(`  Trying ${a.hostname} (${r})...`);let c=["--ipv4","--silent","--show-error","--fail","--connect-timeout","10","--max-time","30","--resolve",`${a.hostname}:443:${r}`,"-A","Mozilla/5.0 ProxyScrapeTester",o];try{let{stdout:i}=await at("curl",c,{timeout:35e3,maxBuffer:4194304,windowsHide:!0});if(i.length<50||!i.includes("://")&&!i.includes(",")&&!i.includes(":")){n(`  ${s.red}[FAIL]${s.reset} Response does not look like proxy list`);continue}return n(`  ${s.green}[OK]${s.reset} Downloaded ${Math.round(i.length/1024)} KB`),i}catch(i){n(`  ${s.red}[FAIL]${s.reset} ${i.stderr?.trim()||i.message||"download failed"}`)}}throw new Error("Unable to download ProxyScrape CSV from any source.")}function Te(e){return`${e.protocol}://${e.ip}:${e.port}`}function Pe(e){let t=new Set,o=[];for(let a of e){let r=`${a.protocol}:${a.ip}:${a.port}`;t.has(r)||(t.add(r),o.push(a))}return o}function ne(e){switch(e.protocol){case"http":return["-x",`http://${e.ip}:${e.port}`];case"https":return["-x",`https://${e.ip}:${e.port}`];case"socks4":return["--socks4",`${e.ip}:${e.port}`];case"socks5":return["--socks5",`${e.ip}:${e.port}`];default:return["-x",`${e.protocol}://${e.ip}:${e.port}`]}}import{execFile as it}from"node:child_process";import{promisify as ct}from"node:util";import{isIP as se}from"node:net";import W from"node:process";var Ce=ct(it);function lt(e){let t=e.trim().split(/\r?\n/).map(o=>o.trim()).filter(Boolean);for(let o of t)if(se(o)===4)return o;return null}function pt(e){let t=e.match(/<input\b[^>]*\bname=["']ip["'][^>]*\bvalue=["']((?:\d{1,3}\.){3}\d{1,3})["']/i);if(t&&t[1]&&se(t[1])===4)return t[1];let o=e.match(/<input\b[^>]*\bvalue=["']((?:\d{1,3}\.){3}\d{1,3})["'][^>]*\bname=["']ip["']/i);return o&&o[1]&&se(o[1])===4?o[1]:null}function dt(e,t){return t==="ipme"?pt(e):lt(e)}async function mt(e,t,o){let a=oe(t.url),c=["--ipv4","--insecure","--silent","--show-error","--fail-with-body","--noproxy","","--connect-timeout",String(o.connectTimeoutSeconds||3),"--max-time",String(o.timeoutSeconds||4),"-A","Mozilla/5.0 ProxyScrapeTester","-w",`
__BENCHMARK__:%{http_code}:%{time_connect}:%{time_appconnect}:%{time_starttransfer}:%{time_total}:%{speed_download}:%{size_download}`,...ne(e)];t.resolvedIp&&c.push("--resolve",`${a.hostname}:${a.port}:${t.resolvedIp}`),c.push(t.url);let i=(o.timeoutSeconds||4)*1e3+1500,l="",g="",h=0;try{let T=await Ce("curl",c,{timeout:i,maxBuffer:1048576,windowsHide:!0});l=T.stdout||"",g=T.stderr||""}catch(T){l=T.stdout||"",g=T.stderr||"",h=T.code??1}let p=0,m=0,b=0,w=0,$=0,k=0,f=0,C=l,y=`
__BENCHMARK__:`,d=l.lastIndexOf(y);if(d!==-1){C=l.slice(0,d);let M=l.slice(d+y.length).trim().split(":");M.length>=7&&(p=Number.parseInt(M[0]||"0",10)||0,m=Math.round(Number.parseFloat(M[1]||"0")*1e3),b=Math.round(Number.parseFloat(M[2]||"0")*1e3),w=Math.round(Number.parseFloat(M[3]||"0")*1e3),$=Math.round(Number.parseFloat(M[4]||"0")*1e3),k=Number.parseFloat(M[5]||"0")||0,f=Number.parseInt(M[6]||"0",10)||0)}if(h!==0&&p===0)return{name:t.name,url:t.url,resolvedIp:t.resolvedIp,ok:!1,httpCode:p,totalLatencyMs:$,connectTimeMs:m,sslHandshakeMs:b,ttfbMs:w,downloadSpeedBps:k,downloadSizeBytes:f,returnedIp:null,reason:g.trim()||`curl exit code ${h}`};let v=dt(C,t.parser);return v?{name:t.name,url:t.url,resolvedIp:t.resolvedIp,ok:!0,httpCode:p,totalLatencyMs:$,connectTimeMs:m,sslHandshakeMs:b,ttfbMs:w,downloadSpeedBps:k,downloadSizeBytes:f,returnedIp:v,reason:null}:{name:t.name,url:t.url,resolvedIp:t.resolvedIp,ok:!1,httpCode:p,totalLatencyMs:$,connectTimeMs:m,sslHandshakeMs:b,ttfbMs:w,downloadSpeedBps:k,downloadSizeBytes:f,returnedIp:null,reason:p>=400?`HTTP ${p}`:"No valid IPv4 returned from endpoint"}}async function ut(e,t,o){let r=["--ipv4","--insecure","--silent","--show-error","-o","/dev/null","--noproxy","","--connect-timeout",String(o.websiteConnectTimeoutSeconds||2.5),"--max-time",String(o.websiteTimeoutSeconds||3.5),"-A","Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36","-w",`
__BENCHMARK__:%{http_code}:%{time_connect}:%{time_appconnect}:%{time_starttransfer}:%{time_total}:%{speed_download}:%{size_download}`,...ne(e),t.url],c=(o.websiteTimeoutSeconds||3.5)*1e3+1500,i="",l="",g=0;try{let d=await Ce("curl",r,{timeout:c,maxBuffer:524288,windowsHide:!0});i=d.stdout||"",l=d.stderr||""}catch(d){i=d.stdout||"",l=d.stderr||"",g=d.code??1}let h=0,p=0,m=0,b=0,w=0,$=0,k=0,f=`
__BENCHMARK__:`,C=i.lastIndexOf(f);if(C!==-1){let v=i.slice(C+f.length).trim().split(":");v.length>=7&&(h=Number.parseInt(v[0]||"0",10)||0,p=Math.round(Number.parseFloat(v[1]||"0")*1e3),m=Math.round(Number.parseFloat(v[2]||"0")*1e3),b=Math.round(Number.parseFloat(v[3]||"0")*1e3),w=Math.round(Number.parseFloat(v[4]||"0")*1e3),$=Number.parseFloat(v[5]||"0")||0,k=Number.parseInt(v[6]||"0",10)||0)}let y=h>=200&&h<400;return{name:t.name,domain:t.domain,category:t.category,url:t.url,ok:y,httpCode:h,totalLatencyMs:w,connectTimeMs:p,sslHandshakeMs:m,ttfbMs:b,downloadSpeedBps:$,downloadSizeBytes:k,reason:y?null:h>0?`HTTP ${h}`:l.trim()||`Exit code ${g}`}}async function gt(e,t,o){let a=[],r=o.websiteConcurrency||25;for(let c=0;c<t.length;c+=r){let i=t.slice(c,c+r),l=await Promise.all(i.map(g=>ut(e,g,o)));a.push(...l)}return a}function ht(e){if(e.length===0)return 0;let t=[...e].sort((c,i)=>c-i),o=Math.floor(t.length/2),a=t[o]??0,r=t[o-1]??0;return t.length%2!==0?a:Math.round((r+a)/2)}async function bt(e,t,o){let a=[],r=null;for(let c of t){let i=await mt(e,c,o);if(a.push(i),i.ok)return r=i.returnedIp,{isAlive:!0,exitIp:r,endpointResults:a}}return{isAlive:!1,exitIp:null,endpointResults:a}}async function Me(e,t,o,a=null){let r={http:[],https:[],socks4:[],socks5:[]},c=[],i=0,l=0,g=0,h=0,p=Date.now(),m=Math.min(Math.max(o.concurrency||100,10),e.length);W.stdout.write(`
${s.bold}${s.cyan}>> Phase 1: High-Speed Verification & Pruning (${m} parallel workers)${s.reset}
`);function b(){let y=(Date.now()-p)/1e3,d=i>0?i/Math.max(y,.001):0,v=e.length-i,T=d>0?v/d:Number.NaN;X(`${s.cyan}Phase 1${s.reset} ${ee(i,e.length)}% | ${i.toLocaleString()}/${e.length.toLocaleString()} | ${s.green}[OK] ${l} Alive${s.reset} | ${s.red}[FAIL] ${g} Dropped${s.reset} | ${Q(d)} | ETA ${N(T)}`)}async function w(){for(;;){let y=h;if(y>=e.length)return;h++;let d=e[y];if(d){try{let v=await bt(d,t,o);i++,v.isAlive?(l++,c.push({proxy:d,exitIp:v.exitIp,endpointResults:v.endpointResults})):g++}catch{i++,g++}b()}}}let $=Array.from({length:m},()=>w());await Promise.all($),W.stdout.write(`
`);let k=((Date.now()-p)/1e3).toFixed(1);W.stdout.write(`  ${s.green}[OK] Phase 1 Finished in ${k}s${s.reset} - Identified ${s.bold}${l}${s.reset} alive proxies (${g} dropped)

`);let f=[];if(c.length>0){let T=function(){let z=(Date.now()-y)/1e3,A=d>0?d/Math.max(z,.001):0,B=c.length-d,R=A>0?B/A:Number.NaN;X(`${s.cyan}Phase 2${s.reset} ${ee(d,c.length)}% | ${d.toLocaleString()}/${c.length.toLocaleString()} | ${Q(A)} | ETA ${N(R)}`)};var C=T;W.stdout.write(`${s.bold}${s.cyan}>> Phase 2: Top 50 Global Websites Benchmark (${c.length} alive proxies)${s.reset}
`);let y=Date.now(),d=0,v=0,M=Math.min(Math.max(Math.floor(m/2),10),c.length);async function Fe(){for(;;){let z=v;if(z>=c.length)return;v++;let A=c[z];if(!A)continue;let{proxy:B,exitIp:R,endpointResults:V}=A,F=[];if(o.benchmarkTopWebsites&&o.topWebsites.length>0)try{F=await gt(B,o.topWebsites,o)}catch{F=[]}let Y=V.filter(S=>S.ok),j=F.filter(S=>S.ok),U=[...Y,...j],I=U.map(S=>S.totalLatencyMs),q=U.map(S=>S.connectTimeMs),J=U.map(S=>S.ttfbMs),Z=U.map(S=>S.downloadSpeedBps),D=I.length>0?Math.round(I.reduce((S,L)=>S+L,0)/I.length):0,ae=I.length>0?Math.min(...I):0,Oe=I.length>0?Math.max(...I):0,We=ht(I),ie=q.length>0?Math.round(q.reduce((S,L)=>S+L,0)/q.length):0,ce=J.length>0?Math.round(J.reduce((S,L)=>S+L,0)/J.length):0,le=Z.length>0?Math.round(Z.reduce((S,L)=>S+L,0)/Z.length):0,H="UNKNOWN";R&&(a&&R===a?H="TRANSPARENT (LEAKING)":H="ELITE / ANONYMOUS");let K="SLOW";D<400?K="EXCELLENT":D<800?K="GOOD":D<1500&&(K="MODERATE");let O=o.topWebsites.length,_e=O>0?Number.parseFloat((j.length/O*100).toFixed(1)):0,E=O>0?j.length/O:1,pe=E*50,de=Math.max(0,Math.min(20,20*(1-D/2500))),me=Math.max(0,Math.min(8,8*(1-ae/1500))),ue=Math.max(0,Math.min(8,8*(1-ie/800))),ge=Math.max(0,Math.min(7,7*(1-ce/1500))),he=Math.max(0,Math.min(7,le/(500*1024)*7)),ze=(de+me+ue+ge+he)*E,je=Math.round(pe+ze),Ue={websites:Math.round(pe),avgLatency:Math.round(de*E),minLatency:Math.round(me*E),connectTime:Math.round(ue*E),ttfb:Math.round(ge*E),speed:Math.round(he*E),anonymity:H==="ELITE / ANONYMOUS"?10:0},He={proxy:B,status:"PASS",tier:K,compositeScore:je,scoreBreakdown:Ue,exitIp:R,anonymity:H,endpointsTested:V.length,endpointsPassed:Y.length,endpointsTotal:t.length,passRatePercent:Number.parseFloat((Y.length/t.length*100).toFixed(1)),websitesTested:F.length,websitesPassed:j.length,websitesTotal:O,websitePassRatePercent:_e,avgLatencyMs:D,minLatencyMs:ae,maxLatencyMs:Oe,medianLatencyMs:We,avgConnectTimeMs:ie,avgTtfbMs:ce,avgSpeedBps:le,firstFailedEndpoint:null,failureReason:null,endpointDetails:V,websiteDetails:F};r[B.protocol].push(B),f.push(He),d++,T()}}let De=Array.from({length:M},()=>Fe());await Promise.all(De),W.stdout.write(`

`)}return f.sort((y,d)=>d.compositeScore!==y.compositeScore?d.compositeScore-y.compositeScore:y.avgLatencyMs-d.avgLatencyMs),f.forEach((y,d)=>{y.rank=d+1}),{results:r,benchmarks:f,stats:{total:e.length,completed:e.length,passed:f.length,failed:e.length-f.length,localPublicIp:a,durationSeconds:(Date.now()-p)/1e3,startedAt:new Date(p).toISOString(),completedAt:new Date().toISOString()}}}import Ie from"node:fs/promises";import Ee from"node:path";import yt from"node:process";async function G(e,t){let o=`${e}.${yt.pid}.${Date.now()}.tmp`;await Ie.writeFile(o,t,"utf8"),await Ie.rename(o,e)}async function Le(e,t){for(let[o,a]of Object.entries(t.outputFiles)){let r=e[o].map(Te),c=r.length>0?`${r.join(`
`)}
`:"";await G(Ee.join(t.outputDir,a),c)}}async function Ae(e,t){let o=JSON.stringify(e,null,2);await G(t,o)}var x={trophy:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',globe:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',shield:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',settings:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',copy:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',download:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',search:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',bolt:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',rocket:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',plug:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/></svg>',clock:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',gauge:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>',alert:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>',chevronRight:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',chevronDown:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>'};function Be(e,t,o,a){let r=e.length>0?e[0]:null,c=e.length>0?Math.round(e.reduce((p,m)=>p+m.avgLatencyMs,0)/e.length):0,i=e.length>0?[...e].sort((p,m)=>p.avgLatencyMs-m.avgLatencyMs)[0]:null,l={http:{total:0,passed:0},https:{total:0,passed:0},socks4:{total:0,passed:0},socks5:{total:0,passed:0}};for(let p of e){let m=p.proxy.protocol;l[m]&&(l[m].total++,p.status==="PASS"&&l[m].passed++)}let g=JSON.stringify({generatedAt:t.completedAt||new Date().toISOString(),stats:t,localPublicIp:t.localPublicIp,endpoints:o,benchmarks:e}),h=r?`
        <div class="hero-card" id="best-proxy-hero">
            <div class="hero-badge">${x.trophy} TOP RECOMMENDED PROXY FOR YOUR NETWORK</div>
            <div class="hero-main">
                <div class="hero-left">
                    <div class="hero-title font-mono" id="hero-proxy-url">${r.proxy.protocol.toUpperCase()}://${r.proxy.ip}:${r.proxy.port}</div>
                    <div class="hero-meta" id="hero-proxy-meta">
                        <span>${x.globe} ${r.proxy.country||"Global"}</span> &bull; 
                        <span>${x.shield} ${r.anonymity}</span> &bull; 
                        <span>${x.globe} ${r.websitesPassed}/${r.websitesTotal} Top Websites Reachable (${r.websitePassRatePercent}%)</span>
                    </div>
                </div>
                <div class="hero-stats">
                    <div class="hero-stat-box">
                        <div class="hero-stat-label">Weighted Score</div>
                        <div class="hero-stat-value" id="hero-score" style="color: var(--accent);">${r.compositeScore} <span style="font-size: 0.9rem; color: var(--text-muted);">/100</span></div>
                    </div>
                    <div class="hero-stat-box">
                        <div class="hero-stat-label">Avg Latency</div>
                        <div class="hero-stat-value" id="hero-latency" style="color: var(--success);">${r.avgLatencyMs} ms</div>
                    </div>
                    <div class="hero-stat-box">
                        <div class="hero-stat-label">Connect Time</div>
                        <div class="hero-stat-value" id="hero-connect">${r.avgConnectTimeMs} ms</div>
                    </div>
                    <div>
                        <button class="btn btn-primary" id="hero-copy-btn" onclick="copyToClipboard('${r.proxy.protocol}://${r.proxy.ip}:${r.proxy.port}')">${x.copy} Copy Best Proxy</button>
                    </div>
                </div>
            </div>
        </div>
    `:`
        <div class="hero-card" style="background: rgba(239, 68, 68, 0.08); border-color: rgba(239, 68, 68, 0.3);">
            <div class="hero-badge" style="background: rgba(239, 68, 68, 0.2); color: var(--danger);">${x.alert} NO WORKING PROXIES FOUND</div>
            <div class="hero-main">
                <p style="color: var(--text-secondary);">None of the tested proxies successfully connected to verification endpoints from your current network.</p>
            </div>
        </div>
    `;return`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Best Proxy Benchmark Report - Multi-Factor Weighted Ranking</title>
    <style>
        :root {
            --bg-primary: #0b0f19;
            --bg-secondary: #131b2e;
            --bg-card: #1a243b;
            --bg-hover: #22304d;
            --border: #263554;
            --border-light: #3b4d75;
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --text-muted: #64748b;
            --accent: #38bdf8;
            --accent-hover: #0ea5e9;
            --success: #22c55e;
            --success-bg: rgba(34, 197, 94, 0.15);
            --warning: #eab308;
            --warning-bg: rgba(234, 179, 8, 0.15);
            --danger: #ef4444;
            --danger-bg: rgba(239, 68, 68, 0.15);
            --radius: 10px;
            --font: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            background-color: var(--bg-primary);
            color: var(--text-primary);
            font-family: var(--font);
            line-height: 1.5;
            padding: 24px 32px;
        }

        .container { max-width: 1560px; margin: 0 auto; }

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
            padding-bottom: 24px;
            border-bottom: 1px solid var(--border);
            margin-bottom: 24px;
            flex-wrap: wrap;
            gap: 16px;
        }

        .title-group h1 {
            font-size: 1.85rem;
            font-weight: 800;
            letter-spacing: -0.02em;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .title-group p {
            color: var(--text-secondary);
            font-size: 0.875rem;
            margin-top: 4px;
        }

        .badge-pulse {
            display: inline-block;
            width: 10px;
            height: 10px;
            background-color: var(--success);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--success);
        }

        .hero-card {
            background: linear-gradient(135deg, #162444 0%, #111a33 100%);
            border: 1px solid var(--accent);
            border-radius: var(--radius);
            padding: 20px 24px;
            margin-bottom: 24px;
            box-shadow: 0 10px 25px -5px rgba(56, 189, 248, 0.15);
        }

        .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background-color: rgba(56, 189, 248, 0.2);
            color: var(--accent);
            font-size: 0.75rem;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 9999px;
            letter-spacing: 0.05em;
            margin-bottom: 12px;
        }

        .hero-main {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
        }

        .hero-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 6px;
        }

        .hero-meta {
            color: var(--text-secondary);
            font-size: 0.875rem;
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            align-items: center;
        }

        .hero-meta span {
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }

        .hero-stats {
            display: flex;
            align-items: center;
            gap: 24px;
            flex-wrap: wrap;
        }

        .hero-stat-box { text-align: right; }

        .hero-stat-label {
            font-size: 0.72rem;
            color: var(--text-muted);
            text-transform: uppercase;
            font-weight: 600;
        }

        .hero-stat-value {
            font-size: 1.4rem;
            font-weight: 700;
            font-family: var(--font-mono);
        }

        .weights-panel {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 16px 20px;
            margin-bottom: 24px;
            display: none;
        }
        .weights-panel.open { display: block; }

        .weights-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 14px;
            margin-top: 12px;
        }

        .weight-item {
            background-color: var(--bg-card);
            padding: 10px 14px;
            border-radius: 6px;
            border: 1px solid var(--border);
        }

        .weight-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.78rem;
            font-weight: 600;
            color: var(--text-secondary);
            margin-bottom: 6px;
        }

        .weight-header span:first-child {
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }

        .weight-slider {
            width: 100%;
            cursor: pointer;
            accent-color: var(--accent);
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
        }

        .card {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 16px 20px;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .card-label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted);
            font-weight: 600;
        }

        .card-value {
            font-size: 1.625rem;
            font-weight: 700;
            font-family: var(--font-mono);
        }

        .card-sub {
            font-size: 0.8rem;
            color: var(--text-secondary);
        }

        .controls {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 16px 20px;
            margin-bottom: 20px;
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            align-items: center;
            justify-content: space-between;
        }

        .filter-group {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
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
            padding: 8px 14px 8px 32px;
            border-radius: 6px;
            font-size: 0.875rem;
            width: 260px;
            outline: none;
            transition: border-color 0.2s;
        }
        .search-input:focus { border-color: var(--accent); }

        select.filter-select {
            background-color: var(--bg-primary);
            border: 1px solid var(--border);
            color: var(--text-primary);
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.875rem;
            outline: none;
            cursor: pointer;
        }

        .btn {
            background-color: var(--bg-card);
            color: var(--text-primary);
            border: 1px solid var(--border);
            padding: 8px 14px;
            border-radius: 6px;
            font-size: 0.875rem;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .btn:hover { background-color: var(--bg-hover); border-color: var(--border-light); }

        .btn-primary {
            background-color: var(--accent);
            color: #0b0f19;
            border-color: var(--accent);
            font-weight: 600;
        }
        .btn-primary:hover { background-color: var(--accent-hover); }

        .btn-highlight {
            background-color: rgba(234, 179, 8, 0.15);
            color: var(--warning);
            border-color: rgba(234, 179, 8, 0.4);
            font-weight: 600;
        }
        .btn-highlight:hover { background-color: rgba(234, 179, 8, 0.25); }

        .table-wrapper {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            overflow-x: auto;
            margin-bottom: 24px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.875rem;
            text-align: left;
        }

        thead {
            background-color: #0e1526;
            position: sticky;
            top: 0;
            z-index: 10;
        }

        th {
            padding: 12px 16px;
            color: var(--text-secondary);
            font-weight: 600;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 1px solid var(--border);
            cursor: pointer;
            user-select: none;
            white-space: nowrap;
            transition: color 0.15s, background-color 0.15s;
        }

        th:hover { color: var(--text-primary); background-color: var(--bg-hover); }
        th.sort-asc::after { content: " \\25B2"; color: var(--accent); font-size: 0.7rem; }
        th.sort-desc::after { content: " \\25BC"; color: var(--accent); font-size: 0.7rem; }

        td {
            padding: 12px 16px;
            border-bottom: 1px solid var(--border);
            white-space: nowrap;
        }

        tbody tr { transition: background-color 0.15s; }
        tbody tr:hover { background-color: var(--bg-hover); }

        .row-expanded { background-color: rgba(56, 189, 248, 0.05) !important; }

        .details-row td {
            padding: 0;
            background-color: #0f172a;
        }

        .details-container {
            padding: 20px 24px;
            border-bottom: 2px solid var(--accent);
        }

        .tab-nav {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 8px;
        }

        .tab-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            padding: 6px 12px;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.15s;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .tab-btn.active {
            background-color: rgba(56, 189, 248, 0.15);
            color: var(--accent);
        }

        .grid-websites {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 10px;
        }

        .site-card {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 6px;
            padding: 8px 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .site-name { font-weight: 600; font-size: 0.85rem; }
        .site-domain { font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono); }

        .font-mono { font-family: var(--font-mono); }

        .pill {
            display: inline-flex;
            align-items: center;
            padding: 2px 8px;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }

        .pill-pass { background-color: var(--success-bg); color: var(--success); border: 1px solid rgba(34, 197, 94, 0.3); }
        .pill-fail { background-color: var(--danger-bg); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.3); }
        .pill-protocol { background-color: rgba(56, 189, 248, 0.12); color: var(--accent); font-family: var(--font-mono); font-size: 0.72rem; }

        .rank-pill {
            background: linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(234, 179, 8, 0.05));
            color: var(--warning);
            border: 1px solid rgba(234, 179, 8, 0.4);
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: var(--font-mono);
        }

        .score-pill {
            font-weight: 700;
            font-size: 0.85rem;
            font-family: var(--font-mono);
            padding: 2px 8px;
            border-radius: 4px;
            cursor: pointer;
        }
        .score-high { background-color: rgba(34, 197, 94, 0.2); color: #4ade80; }
        .score-med { background-color: rgba(234, 179, 8, 0.2); color: #facc15; }
        .score-low { background-color: rgba(239, 68, 68, 0.2); color: #f87171; }

        .tier-excellent { color: #4ade80; font-weight: 600; }
        .tier-good { color: #38bdf8; font-weight: 600; }
        .tier-moderate { color: #facc15; }
        .tier-slow { color: #fb923c; }
        .tier-dead { color: var(--text-muted); }

        .latency-badge { font-family: var(--font-mono); font-weight: 600; }
        .latency-fast { color: #4ade80; }
        .latency-med { color: #facc15; }
        .latency-slow { color: #fb923c; }
        .latency-none { color: var(--text-muted); }

        .copy-btn {
            background: none;
            border: 1px solid var(--border);
            color: var(--text-secondary);
            cursor: pointer;
            padding: 2px 6px;
            border-radius: 4px;
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
            transition: transform 0.2s;
            margin-right: 6px;
            width: 14px;
            height: 14px;
        }

        .footer-note {
            text-align: center;
            font-size: 0.8rem;
            color: var(--text-muted);
            margin-top: 32px;
            padding-top: 16px;
            border-top: 1px solid var(--border);
        }

        .toast {
            position: fixed;
            bottom: 24px;
            right: 24px;
            background-color: var(--accent);
            color: #0b0f19;
            padding: 10px 18px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 0.875rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
            opacity: 0;
            pointer-events: none;
            transform: translateY(10px);
            transition: all 0.25s ease;
            z-index: 1000;
        }
        .toast.show { opacity: 1; transform: translateY(0); }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="title-group">
                <h1><span class="badge-pulse"></span> Proxy Benchmark & Best Network Finder</h1>
                <p>Testing from your network (<span class="font-mono">${t.localPublicIp||"Direct"}</span>) &bull; Multi-Factor Weighted Scoring Across All Columns & <strong>Top 50 Global Websites</strong></p>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button class="btn" onclick="toggleWeightsPanel()">${x.settings} Scoring Weights</button>
                <button class="btn btn-highlight" onclick="copyTop10Urls()">${x.copy} Copy Top 10 Proxies</button>
                <button class="btn" onclick="copyPassedUrls()">${x.copy} Copy All Alive</button>
                <button class="btn btn-primary" onclick="exportFilteredCsv()">${x.download} Export CSV</button>
            </div>
        </header>

        <!-- Dynamic Scoring Weights Panel -->
        <div id="weights-panel" class="weights-panel">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-size: 0.95rem; font-weight: 700; color: var(--accent); display: flex; align-items: center; gap: 6px;">${x.settings} Customize Multi-Factor Ranking Weights</h3>
                <button class="btn" style="padding: 4px 10px; font-size: 0.75rem;" onclick="resetDefaultWeights()">Reset Defaults</button>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Adjust weights across all table columns. Scores and ranks recalculate in real-time.</p>
            <div class="weights-grid">
                <div class="weight-item">
                    <div class="weight-header"><span>${x.globe} Top 50 Sites</span><span id="w-val-websites">30%</span></div>
                    <input type="range" class="weight-slider" id="w-websites" min="0" max="50" value="30" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${x.bolt} Avg Latency</span><span id="w-val-avgLatency">20%</span></div>
                    <input type="range" class="weight-slider" id="w-avgLatency" min="0" max="50" value="20" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${x.rocket} Min Latency</span><span id="w-val-minLatency">10%</span></div>
                    <input type="range" class="weight-slider" id="w-minLatency" min="0" max="30" value="10" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${x.plug} Connect Time</span><span id="w-val-connectTime">10%</span></div>
                    <input type="range" class="weight-slider" id="w-connectTime" min="0" max="30" value="10" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${x.clock} TTFB Time</span><span id="w-val-ttfb">10%</span></div>
                    <input type="range" class="weight-slider" id="w-ttfb" min="0" max="30" value="10" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${x.gauge} Speed / Bandwidth</span><span id="w-val-speed">10%</span></div>
                    <input type="range" class="weight-slider" id="w-speed" min="0" max="30" value="10" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${x.shield} Anonymity</span><span id="w-val-anonymity">10%</span></div>
                    <input type="range" class="weight-slider" id="w-anonymity" min="0" max="30" value="10" oninput="updateWeights()">
                </div>
            </div>
        </div>

        <!-- Best Proxy Hero Section -->
        ${h}

        <!-- Stats Overview Cards -->
        <div class="stats-grid">
            <div class="card">
                <span class="card-label">Total Proxies Scanned</span>
                <span class="card-value">${t.total.toLocaleString()}</span>
                <span class="card-sub">Benchmarked in ${N(t.durationSeconds)}</span>
            </div>
            <div class="card">
                <span class="card-label">Alive & Verified</span>
                <span class="card-value" style="color: var(--success);">${t.passed.toLocaleString()}</span>
                <span class="card-sub">${(t.passed/Math.max(t.total,1)*100).toFixed(1)}% success rate</span>
            </div>
            <div class="card">
                <span class="card-label">Hard Failed / Dropped</span>
                <span class="card-value" style="color: var(--danger);">${t.failed.toLocaleString()}</span>
                <span class="card-sub">Excluded from report</span>
            </div>
            <div class="card">
                <span class="card-label">Avg Alive Latency</span>
                <span class="card-value" style="color: var(--accent);">${c>0?c+" ms":"--"}</span>
                <span class="card-sub">Fastest: ${i?i.minLatencyMs+" ms":"--"}</span>
            </div>
            <div class="card">
                <span class="card-label">Global Websites Tested</span>
                <span class="card-value">${u.topWebsites?.length||50} Sites</span>
                <span class="card-sub">Google, Cloudflare, GitHub, etc.</span>
            </div>
        </div>

        <!-- Protocol Distribution Cards -->
        <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr); margin-bottom: 24px;">
            <div class="card" style="padding: 12px 16px;">
                <span class="card-label">HTTP</span>
                <span class="card-value" style="font-size: 1.25rem;">${l.http.passed} <span style="font-size: 0.85rem; color: var(--text-muted);">/ ${l.http.total}</span></span>
            </div>
            <div class="card" style="padding: 12px 16px;">
                <span class="card-label">HTTPS</span>
                <span class="card-value" style="font-size: 1.25rem;">${l.https.passed} <span style="font-size: 0.85rem; color: var(--text-muted);">/ ${l.https.total}</span></span>
            </div>
            <div class="card" style="padding: 12px 16px;">
                <span class="card-label">SOCKS4</span>
                <span class="card-value" style="font-size: 1.25rem;">${l.socks4.passed} <span style="font-size: 0.85rem; color: var(--text-muted);">/ ${l.socks4.total}</span></span>
            </div>
            <div class="card" style="padding: 12px 16px;">
                <span class="card-label">SOCKS5</span>
                <span class="card-value" style="font-size: 1.25rem;">${l.socks5.passed} <span style="font-size: 0.85rem; color: var(--text-muted);">/ ${l.socks5.total}</span></span>
            </div>
        </div>

        <!-- Controls / Search & Filters -->
        <div class="controls">
            <div class="filter-group">
                <div class="search-box">
                    <span class="search-icon">${x.search}</span>
                    <input type="text" id="search-input" class="search-input" placeholder="Search IP, port, country..." oninput="applyFilters()">
                </div>
                
                <select id="protocol-filter" class="filter-select" onchange="applyFilters()">
                    <option value="ALL">All Protocols</option>
                    <option value="http">HTTP</option>
                    <option value="https">HTTPS</option>
                    <option value="socks4">SOCKS4</option>
                    <option value="socks5">SOCKS5</option>
                </select>

                <select id="tier-filter" class="filter-select" onchange="applyFilters()">
                    <option value="ALL">All Latency Tiers</option>
                    <option value="EXCELLENT">&lt; 400ms (Excellent)</option>
                    <option value="GOOD">400 - 800ms (Good)</option>
                    <option value="MODERATE">800 - 1500ms (Moderate)</option>
                    <option value="SLOW">&gt; 1500ms (Slow)</option>
                </select>
            </div>
            <div>
                <span id="filtered-count" style="font-size: 0.875rem; color: var(--text-secondary); font-family: var(--font-mono);">Showing 0 / 0</span>
            </div>
        </div>

        <!-- Benchmark Data Table -->
        <div class="table-wrapper">
            <table id="proxy-table">
                <thead>
                    <tr>
                        <th style="width: 30px;"></th>
                        <th data-sort="rank">Rank</th>
                        <th data-sort="score" class="sort-desc">Score (Weighted)</th>
                        <th data-sort="ip">Proxy Address</th>
                        <th data-sort="protocol">Protocol</th>
                        <th data-sort="country">Country</th>
                        <th data-sort="status">Status</th>
                        <th data-sort="anonymity">Anonymity</th>
                        <th data-sort="websites">Top 50 Sites</th>
                        <th data-sort="avgLatency">Avg Latency</th>
                        <th data-sort="minLatency">Min</th>
                        <th data-sort="connectTime">Connect Time</th>
                        <th data-sort="ttfb">TTFB</th>
                        <th data-sort="speed">Speed</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="table-body">
                    <!-- Rows dynamically populated -->
                </tbody>
            </table>
        </div>

        <div class="footer-note">
            Proxy Benchmark Suite &bull; Multi-Factor Weighted Ranking &bull; Full details saved to <span class="font-mono">benchmark-report.json</span>
        </div>
    </div>

    <div id="toast" class="toast">Copied to clipboard!</div>

    <script>
        const RAW_DATA = ${g};
        let benchmarks = RAW_DATA.benchmarks || [];
        let currentSort = { column: 'score', asc: false };
        let expandedRows = new Set();
        let currentSubTabs = {};

        const SVG_ICONS = ${JSON.stringify(x)};

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

            updateHeroCard();
            renderTable();
        }

        function updateHeroCard() {
            const best = benchmarks[0];
            if (!best) return;
            const heroUrl = document.getElementById('hero-proxy-url');
            const heroMeta = document.getElementById('hero-proxy-meta');
            const heroScore = document.getElementById('hero-score');
            const heroLatency = document.getElementById('hero-latency');
            const heroConnect = document.getElementById('hero-connect');
            const heroCopyBtn = document.getElementById('hero-copy-btn');

            if (heroUrl) heroUrl.textContent = \`\${best.proxy.protocol.toUpperCase()}://\${best.proxy.ip}:\${best.proxy.port}\`;
            if (heroMeta) heroMeta.innerHTML = \`<span>\${SVG_ICONS.globe} \${best.proxy.country || 'Global'}</span> &bull; <span>\${SVG_ICONS.shield} \${best.anonymity}</span> &bull; <span>\${SVG_ICONS.globe} \${best.websitesPassed}/\${best.websitesTotal} Top Websites Reachable (\${best.websitePassRatePercent}%)</span>\`;
            if (heroScore) heroScore.innerHTML = \`\${best.compositeScore} <span style="font-size: 0.9rem; color: var(--text-muted);">/100</span>\`;
            if (heroLatency) heroLatency.textContent = \`\${best.avgLatencyMs} ms\`;
            if (heroConnect) heroConnect.textContent = \`\${best.avgConnectTimeMs} ms\`;
            if (heroCopyBtn) heroCopyBtn.setAttribute('onclick', \`copyToClipboard('\${best.proxy.protocol}://\${best.proxy.ip}:\${best.proxy.port}')\`);
        }

        function showToast(msg) {
            const toast = document.getElementById('toast');
            toast.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2200);
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
            showToast(\`Copied Top \${top10.length} proxy URLs to clipboard!\`);
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
            showToast(\`Copied \${passed.length} proxy URLs\`);
        }

        function exportFilteredCsv() {
            const filtered = getFilteredData();
            if (filtered.length === 0) {
                showToast('No rows to export');
                return;
            }
            const headers = ['Rank', 'WeightedScore', 'Protocol', 'IP', 'Port', 'Country', 'Status', 'Anonymity', 'WebsitesPassed', 'WebsitesTotal', 'WebPassRate%', 'AvgLatency_ms', 'MinLatency_ms', 'ConnectTime_ms', 'TTFB_ms', 'Speed_Bps', 'ProxyUrl'];
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
            link.setAttribute('download', \`proxy-benchmark-weighted-\${Date.now()}.csv\`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
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

        function toggleRow(proxyKey) {
            if (expandedRows.has(proxyKey)) {
                expandedRows.delete(proxyKey);
            } else {
                expandedRows.add(proxyKey);
                if (!currentSubTabs[proxyKey]) {
                    currentSubTabs[proxyKey] = 'websites';
                }
            }
            renderTable();
        }

        function switchSubTab(proxyKey, tabName) {
            currentSubTabs[proxyKey] = tabName;
            renderTable();
        }

        function renderTable() {
            const filtered = getFilteredData();
            const sorted = sortData(filtered);
            const tbody = document.getElementById('table-body');
            const countLabel = document.getElementById('filtered-count');

            countLabel.textContent = \`Showing \${sorted.length.toLocaleString()} / \${benchmarks.length.toLocaleString()} alive proxies\`;

            if (sorted.length === 0) {
                tbody.innerHTML = '<tr><td colspan="15" style="text-align: center; padding: 32px; color: var(--text-muted);">No working proxies match the selected filters.</td></tr>';
                return;
            }

            let html = '';
            for (const item of sorted) {
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

                html += \`
                <tr class="\${isExpanded ? 'row-expanded' : ''}">
                    <td>
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
                    <td style="font-size: 0.78rem;">\${item.anonymity || '--'}</td>
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
                    html += \`
                    <tr class="details-row">
                        <td colspan="15">
                            <div class="details-container">
                                <div class="tab-nav">
                                    <button class="tab-btn \${activeTab === 'websites' ? 'active' : ''}" onclick="switchSubTab('\${pKey}', 'websites')">\${SVG_ICONS.globe} Top 50 Websites (\${item.websitesPassed || 0}/\${item.websitesTotal || 50})</button>
                                    <button class="tab-btn \${activeTab === 'endpoints' ? 'active' : ''}" onclick="switchSubTab('\${pKey}', 'endpoints')">\${SVG_ICONS.search} Verification Endpoints (\${item.endpointsPassed || 0}/\${item.endpointsTotal || 11})</button>
                                </div>

                                \${activeTab === 'websites' ? \`
                                    <div class="grid-websites">
                                        \${(item.websiteDetails || []).map(ws => \`
                                            <div class="site-card" style="border-left: 3px solid \${ws.ok ? 'var(--success)' : 'var(--danger)'};">
                                                <div>
                                                    <div class="site-name">\${ws.name} <span style="font-size: 0.7rem; color: var(--text-muted);">(\${ws.category})</span></div>
                                                    <div class="site-domain">\${ws.domain}</div>
                                                </div>
                                                <div style="text-align: right;">
                                                    <div class="font-mono" style="font-size: 0.8rem; font-weight: 600; color: \${ws.ok ? 'var(--success)' : 'var(--danger)'};">
                                                        \${ws.ok ? ws.totalLatencyMs + ' ms' : (ws.reason || 'FAILED')}
                                                    </div>
                                                    <div style="font-size: 0.7rem; color: var(--text-muted);">\${ws.httpCode ? 'HTTP ' + ws.httpCode : ''}</div>
                                                </div>
                                            </div>
                                        \`).join('') || '<div style="color: var(--text-muted); padding: 12px;">No website test data recorded.</div>'}
                                    </div>
                                \` : \`
                                    <table style="width: 100%; font-size: 0.8rem; background: var(--bg-secondary); border-radius: 6px;">
                                        <thead>
                                            <tr>
                                                <th>Endpoint</th>
                                                <th>Resolved IP</th>
                                                <th>Status</th>
                                                <th>HTTP Code</th>
                                                <th>Connect Time</th>
                                                <th>TTFB</th>
                                                <th>Total Latency</th>
                                                <th>Returned IP</th>
                                                <th>Reason</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            \${item.endpointDetails.map(ep => \`
                                                <tr>
                                                    <td class="font-mono"><strong>\${ep.name}</strong></td>
                                                    <td class="font-mono" style="color: var(--text-muted);">\${ep.resolvedIp || '--'}</td>
                                                    <td>\${ep.ok ? '<span class="pill pill-pass">PASS</span>' : '<span class="pill pill-fail">FAIL</span>'}</td>
                                                    <td class="font-mono">\${ep.httpCode || '--'}</td>
                                                    <td class="font-mono">\${ep.connectTimeMs > 0 ? ep.connectTimeMs + ' ms' : '--'}</td>
                                                    <td class="font-mono">\${ep.ttfbMs > 0 ? ep.ttfbMs + ' ms' : '--'}</td>
                                                    <td class="font-mono" style="font-weight: 600; color: \${ep.ok ? 'var(--success)' : 'var(--danger)'};">\${ep.totalLatencyMs > 0 ? ep.totalLatencyMs + ' ms' : '--'}</td>
                                                    <td class="font-mono" style="color: var(--accent);">\${ep.returnedIp || '--'}</td>
                                                    <td style="color: \${ep.ok ? 'var(--text-muted)' : 'var(--danger)'};">\${ep.reason || 'OK'}</td>
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
            }

            tbody.innerHTML = html;
        }

        function applyFilters() {
            renderTable();
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
                    renderTable();
                });
            });
        }

        window.addEventListener('DOMContentLoaded', () => {
            setupSorting();
            renderTable();
        });
    </script>
</body>
</html>`}function Ne(e,t,o,a,r){n("========================================"),n("                 Results"),n("========================================"),n("");for(let c of["http","https","socks4","socks5"])n(`  ${c.toUpperCase().padEnd(7)} ${t[c].length.toLocaleString()} passed`);n(""),n(`  Local Network IP: ${e.localPublicIp||"Direct"}`),n(`  Verification    : Hard-failed if 0/${o} connected`),n(`  Top Websites    : ${u.topWebsites?.length||50} websites benchmarked`),n(`  Total tested    : ${e.total.toLocaleString()}`),n(`  Passed / Alive  : ${e.passed.toLocaleString()}`),n(`  Hard Failed     : ${e.failed.toLocaleString()} (excluded from report)`),n(`  Duration        : ${N(e.durationSeconds)}`),n(""),n("Output files:");for(let c of Object.values(u.outputFiles))n(`  ${Ee.join(u.outputDir,c)}`);n(""),n("Benchmark Reports:"),r.html&&n(`  ${s.green}HTML Report :${s.reset} ${r.html}`),r.json&&n(`  ${s.cyan}JSON Report :${s.reset} ${r.json}`),n("")}async function ft(){n(""),n("========================================"),n("   Proxy Benchmark & Best Network Finder "),n("========================================"),n(""),await we(),n(`${s.green}[OK]${s.reset} curl and dig are available`);let e=await xe();n(`${s.cyan}[INFO]${s.reset} Local Network Public IP: ${s.bold}${e||"Direct / Unknown"}${s.reset}`),n(`${s.gray}Concurrency: ${u.concurrency} | Timeout: ${u.timeoutSeconds}s | DNS: ${u.cloudflareDns} | Top Websites: ${u.benchmarkTopWebsites?`${u.topWebsites?.length||50} sites`:"Disabled"}${s.reset}
`);let t=await Se(u.testEndpoints,u);n("========================================"),n("        Downloading Proxy List          "),n("========================================"),n("");let o=await ke(u.csvUrls,u);n(`
${s.cyan}Parsing ProxyScrape CSV...${s.reset}`);let a=$e(o),r=Pe(a);if(r.length===0)throw new Error("ProxyScrape CSV contained no valid proxies.");u.limit>0&&u.limit<r.length&&(n(`  Limiting test to first ${u.limit} proxies (LIMIT=${u.limit})`),r=r.slice(0,u.limit));let c={http:0,https:0,socks4:0,socks5:0};for(let b of r)c[b.protocol]++;n(`  Discovered ${r.length.toLocaleString()} unique proxies
`);for(let b of["http","https","socks4","socks5"])n(`  ${b.toUpperCase().padEnd(7)} ${c[b].toLocaleString()}`);n(`
========================================`),n("       Benchmarking & Testing Proxies   "),n("========================================"),n(""),n(`Stage 1: Health & Exit IP Verification (${t.length} verification endpoints)`),u.benchmarkTopWebsites&&n(`Stage 2: Top ${u.topWebsites?.length||50} Global Websites Benchmark (Google, Cloudflare, GitHub, etc.)`),n(`Stage 3: Composite Best Proxy Scoring & Network Compatibility Ranking
`);let{results:i,benchmarks:l,stats:g}=await Me(r,t,u,e);n("========================================"),n("       Generating Reports & Files       "),n("========================================"),n(""),await Le(i,u);let h=Re.join(u.outputDir,u.reportFiles.html),p=Be(l,g,t,h);await G(h,p);let m=Re.join(u.outputDir,u.reportFiles.json);await Ae({generatedAt:g.completedAt,stats:g,endpoints:t,benchmarks:l},m),Ne(g,i,t.length,u.testEndpoints.length,{html:h,json:m})}_.on("SIGINT",()=>{_.stdout.write(`

`),n(`${s.yellow}Interrupted by user.${s.reset}`),_.exit(130)});ft().catch(e=>{_.stdout.write(`

`),n(`${s.red}ERROR:${s.reset} ${e instanceof Error?e.message:String(e)}`),_.exit(1)});
