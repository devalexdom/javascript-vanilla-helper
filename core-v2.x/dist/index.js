"use strict";var JSVHBuildType;!function(t){t[t.stable=1]="stable",t[t.beta=2]="beta",t[t.nightly=3]="nightly"}(JSVHBuildType||(JSVHBuildType={}));class JSVanillaHelper{version;about;gitSourceUrl;t;tData;hData;helperExtensions;hexts;buildType;constructor(t=null,e={},s={reg:{mainAppRef:null,appsRef:{},workers:{},pNTouchGesturesHelperFunc:null},flags:{}}){this.version=2.3,this.gitSourceUrl="https://github.com/devalexdom/javascript-vanilla-helper/tree/master/core-v2.x",this.buildType=2,this.about=`JSVanillaHelper Core ${this.version} ${JSVHBuildType[this.buildType]} || ${this.gitSourceUrl}`,this.t=t,this.tData=e,this.hData=s,this.helperExtensions={},this.hexts=this.helperExtensions}setTarget(t=null,e={}){return this.t=t,this.tData=e,this}dynamicallyExtendThisHelper(t){t(((t,e)=>{this[t]||(this[t]=e.bind(this))}))}toInt(t=this.t){return parseInt(t)}toFloat(t=this.t){return parseFloat(t)}data(t,e=this.t){return e&&e.dataset?(this.t=this.t.dataset[t],this):(this.t="",this)}_v(){return{...this}}_(){return new JSVanillaHelper(this.t,this.hData)}val(t,e=this.t){return t&&(e.value=t),e.value}child(t,e=this.t){return this.setTarget(e.querySelector(t)),this}getChild(t,e=this.t){return e.querySelector(t)}children(t,e=this.t){return this.setTarget(e.querySelectorAll(t)),this}getChildren(t,e=this.t){return e.querySelectorAll(t)}hasOverflow(t="",e=t=>{},s=this.t){let r=0;if(t){const i=s.querySelectorAll(t);this.forEach((t=>{(({clientWidth:t,clientHeight:e,scrollWidth:s,scrollHeight:r})=>r>e||s>t)(t)&&(e(t),r|=1)}),i)}return!!r}findElementIn(t,e=this.t){return Array.from(t.querySelectorAll("*")).find((t=>t===e))}alterFontSize(t=-2,e=this.t){const s=parseInt(window.getComputedStyle(e).fontSize.replace("px",""));e.style.fontSize=`${s+t}px`}setMaxViewportScale(t="",e="1.0"){const s=`width=device-width, initial-scale=${e}${t?`, maximum-scale=${t}`:""}${t===e?", user-scalable=no":""}`,r=document.querySelector("meta[name=viewport]");return r?r.setAttribute("content",s):this.addMeta("viewport",s,document.head),t===e?this.preventNativeTouchGestures(!0,document):this.preventNativeTouchGestures(!1,document),this}preventNativeTouchGestures(t=!0,e=this.t){this.hData.reg.pNTouchGesturesHelperFunc||(this.hData.reg.pNTouchGesturesHelperFunc=t=>{t.preventDefault()});const s={passive:!1};t?e.addEventListener("touchmove",this.hData.reg.pNTouchGesturesHelperFunc,s):e.removeEventListener("touchmove",this.hData.reg.pNTouchGesturesHelperFunc,s)}getData(t=this.t){return t.dataset}getArray(t=this.t){return Array.from(t)}capitalize(t=this.t){return t.charAt(0).toUpperCase()+t.slice(1)}hideIf(t,e="",s=this.t){return t?this.hide(s):this.show(e,s),this}showIf(t,e="block",s=this.t){return t?this.show(e,s):this.hide(s),this}scrollToTarget(t=0,e="smooth",s=this.t){const r=s.getBoundingClientRect().top+window.pageYOffset+t;window.scrollTo({top:r,behavior:e})}getItemsCountPerRow(t=this.t){let e=0,s=0;for(const r of t){const t=r.getBoundingClientRect().top;if(t!==e&&0!==e)return s;e=t,s++}}scrollContainerToTarget({yOffset:t=0,xOffset:e=0,behavior:s="smooth"},r=null,i=this.t){const n=r||i.parentNode,o=i.offsetTop+t,a=i.offsetLeft+e;n.scrollTo({top:o,left:a,behavior:s})}onFalseEmptyString(t=this.t){return t||""}isIterable(t=this.t){return Symbol.iterator in Object(t)}isDateObj(t=this.t){return t instanceof Date&&"[object Date]"===Object.prototype.toString.call(t)}isZeroLength(t=this.t){return 0===t.length}isEmpty(t=this.t){if(null==t)return!0;return"string"===typeof t||Array.isArray(t)?this.isZeroLength(t):this.isZeroLength(Object.keys(t))}onEvent(t,e,s=this.t){const r=()=>{s.removeEventListener(t,i,!1)},i=t=>{e(t,r)};return s.addEventListener(t,i,!1),{helper:this,removeListener:r}}onEvents(t,e,s=this.t){const r=()=>{this.forEach((t=>{s.removeEventListener(t,i,!1)}),t)},i=t=>{e(t,r)};return this.forEach((t=>{s.addEventListener(t,i,!1)}),t),this}$$(t){t(new JSVanillaHelper(this.t,this.tData))}get(t){return t||0===t?this.t[t]:this.t}sel(t){return(t||0===t)&&(this.t=this.t[t]),this}log(t=this.t){return console.log(t),this}addHelperExtension(t){const e=()=>"callbackDone",s=t.extensionName||t.helperExtensionName;return this.hexts[s]?console.error(`JSVanillaHelper Core: Extension alias "${s}" already added`):(t.helper=this,this.hexts[s]=t,"function"==typeof t.onAddExtension&&(t.onAddExtension.bind(t)(),t.onAddExtension=e),"function"==typeof t.extendHelperInstance&&(t.extendHelperInstance.bind(t)(this),t.extendHelperInstance=e),"function"==typeof t.extendHelperPrototype&&(t.extendHelperPrototype.bind(t)(JSVanillaHelper.prototype),t.extendHelperPrototype=e)),this}removeHelperExtension(t){return delete this.hexts[t],this}clearLocationHash(){return history.pushState("",document.title,window.location.pathname+window.location.search),this}getTextRenderedSize(t="16px Arial",e=0,s=this.t){const r=document.createElement("canvas").getContext("2d");r.font=t;const i=r.measureText(s),n=i.actualBoundingBoxAscent+i.actualBoundingBoxDescent;let o=parseFloat(t.match(/\d+px/)[0].replace("px",""));if(e>0)for(;r.measureText(s).width>e&&o>0;)o--,r.font=(a=`${o}px`,r.font.replace(/\d+px/,a));var a;return{width:i.width,height:n,maxFontSizePX:o}}getFontUsed(t="font",e=this.t){return this.getRenderedStyle(t,e)}getRenderedStyle(t="color",e=this.t){return window.getComputedStyle(e,null).getPropertyValue(t)}forEach(t,e=this.t){return[].forEach.call(e,t),this}whileEach(t,e=this.t){const s=e.length;let r=0,i=!0;const n=()=>(i=!1,e[r]);for(;i&&r<s;)t(e[r],r,n),r++;return this}reverseEach(t,e=this.t){let s=e.length;for(;s--;)t(e[s],s);return this}eachOne(t="",e=[]){const s=new JSVanillaHelper;this.forEach((r=>{s.setTarget(r),s[t].apply(s,e)}),this.t)}waitFor(t=0,e="",s=[]){const r=new JSVanillaHelper(this.t,this.tData);return setTimeout((()=>{r[e].apply(r,s)}),t),this}objForEach(t,e=this.t){return[].forEach.call(Object.keys(e),((s,r)=>t(e[s],s,r))),this}setAttr(t="src",e="",s=this.t){return this.t.setAttribute(t,e),this}setId(t="",e=this.t){return this.t.id=t,this}setClass(t="",e=this.t){return this.t.className=t,this}addBrowserClass(t=this.t){t.classList.add(this.detectBrowser())}detectBrowser(){const t=navigator.userAgent;return t.includes("Edge")?"ms-edge":t.includes("Edg")?"ms-edge-chromium":t.includes("Chrome")?"chrome":t.includes("Safari")&&!t.includes("Chrome")?"safari":t.includes("Firefox")?"firefox":t.includes("MSIE")||t.match(/Trident.*rv\:11\./)?"ms-ie":"other-browser"}nextQuerySign(t=this.t){return t.includes("?")?"&":"?"}newElement(t=this.t){return this.setTarget(document.createElement(t))}appendChild(t,e=this.t){return e.appendChild(t),this}setHtml(t,e=this.t){return e.innerHTML=t,this}hasChildren(t=this.t){return t.children.length>0}firstOrDefault(t=this.t){return t.length>0?t[0]:null}show(t="",e=this.t){return e.style.display=t,this}hide(t=this.t){return t.style.display="none",this}hideIn(t=0,e=this.t){return this.waitFor(t,"hide",[e]),this}addClass(t,e=this.t){return e.classList.add(t),this}addClasses(t=[],e=this.t){return e.classList.add.apply(e.classList,t),this}addMeta(t="",e="",s=this.t){const r=document.createElement("meta");r.name=t,r.content=e,s.appendChild(r)}addScriptFile(t="",e=t=>{},s="",r=this.t){const i=document.createElement("script");i.src=t,i.id=s,i.onload=e,r.appendChild(i)}addStyleInline(t="",e=this.t){const s=document.createElement("style");s.innerHTML=t,e.appendChild(s)}isScriptLoaded(t=""){return document.querySelectorAll(`[src="${t}"]`).length>0}delayFunc(){return function(){let t=null;return function(e,s){clearTimeout(t),t=setTimeout(e,s)}}()}removeClass(t,e=this.t){return e.classList.remove(t),this}toggleClass(t,e=this.t){return e.classList.toggle(t),this}swapClass(t,e,s=this.t){return this.toggleClass(t,s),this.toggleClass(e,s),this}replaceClass(t,e,s=this.t){return s.classList.replace(t,e),this}flagClass(t=!1,e,s=this.t){return t?s.classList.add(e):s.classList.remove(e),this}hasClass(t,e=this.t){return e.classList.contains(t)}hasClasses(t=[],e=this.t){return!!t.reduce(((t,s)=>t|e.classList.contains(s)),!1)}removeAllChildren(t=this.t){for(;t.firstChild;)t.removeChild(t.firstChild);return this}N(t,e=this.t){return e?void 0===e[t]?null:e[t]:null}sortArrayByProperty(t="",e=1,s=this.t){s.sort(((s,r)=>s[t]>r[t]?1:-1*e))}sortArray(t=1,e=this.t){e.sort(((e,s)=>e>s?1:-1*t))}sortNodeChildsByProperty(t="",e=1,s=this.t){[...s.children].sort(((s,r)=>s[t]>r[t]?1:-1*e)).map((t=>s.appendChild(t)))}mutationObserver(t,{observeAttributes:e=["class"],observeMutationTypes:s=[],observeMultipleMutations:r=!1,observerParameters:i={attributes:!0}}={},n=this.t){const o=()=>{l.disconnect()},a=e=>{t(e,o)},l=new MutationObserver((t=>{for(const i of t)if((e.includes(i.attributeName)||s.includes(i.type))&&(a(i),!r))break}));l.observe(n,i)}resizeObserver(t,e=this.t){const s=e.getBoundingClientRect();let r=s;if("function"==typeof ResizeObserver){new ResizeObserver((i=>{const n=e.getBoundingClientRect();r.width===n.width&&r.height===n.height||(r=n,this.tData={initialClientRect:s,clientRect:n},t(this))})).observe(e)}else window.addEventListener("resize",(()=>{const i=e.getBoundingClientRect();r.width===i.width&&r.height===i.height||(r=i,this.tData={initialClientRect:s,clientRect:i},t(this))}))}onViewportVisibleOnce(t=t=>{},e={root:null,rootMargin:"0px",threshold:1},s=this.t){const r=new IntersectionObserver((function(e,s){e.forEach((e=>{e.isIntersecting&&(t(e.target),s.unobserve(e.target))}))}),e);Array.isArray(s)||NodeList.prototype.isPrototypeOf(s)?[...s].forEach((t=>{r.observe(t)})):s&&r.observe(s)}traceViewportVisibility(t=t=>{},e=t=>{},s={root:null,rootMargin:"0px",threshold:1},r=this.t){const i=new IntersectionObserver((function(s,r){s.forEach((s=>{const r=s.isIntersecting,i=!!s.target.jsvh_isIntersecting;r&&!i?(s.target.jsvh_isIntersecting=!0,t(s.target)):!r&&i&&(s.target.jsvh_isIntersecting=!1,e(s.target))}))}),s);Array.isArray(r)||NodeList.prototype.isPrototypeOf(r)?[...r].forEach((t=>{i.observe(t)})):r&&i.observe(r)}setLSWithExpiry(t,e,s=!1,r=this.t){const i={value:t,expiry:e.getTime(),readOnce:s};localStorage.setItem(r,JSON.stringify(i))}getLSWithExpiry(t=this.t){const e=localStorage.getItem(t);if(!e)return null;const s=JSON.parse(e),r=new Date;return s.expiry&&r.getTime()>s.expiry?(localStorage.removeItem(t),null):(s.readOnce&&localStorage.removeItem(t),s.value)}hasAttribute(t="",e=this.t){return!(null==e.getAttribute(t))}isVisible(t=0,e=this.t){return this.getVisibilityData(t,e).visible}isRendered(t=0,e=this.t){return this.getVisibilityData(t,e).rendered}isElementBound(t,e,s=this.t){return s.getBoundingClientRect().right>=t.getBoundingClientRect().right+e}getVisibilityData(t=0,e=this.t){let s=!1,r=!1;const i=e.getBoundingClientRect(),n=window.innerHeight||document.documentElement.clientHeight,o=window.innerWidth||document.documentElement.clientWidth;if(0!=i.height||0!=i.width||0!=i.top||0!=i.left){r=!0;const e=i.top-t<=n&&i.top+i.height+t>=0,a=i.left<=o&&i.left+i.width>=0;s=e&&a}return this.tData.rendered=r,this.tData.visible=s,this.tData.clientRect=i,this.tData}addAnimation(t="margin-top",e="50px",s=.5,r=this.t){""!==r.style.transition?r.style.transition.includes(t)||(r.style.transition+=`, ${t} ${s}s`):r.style.transition=`${t} ${s}s`;const i=t.indexOf("-");i>-1&&(t=t.substr(0,i)+t.charAt(i+1).toUpperCase()+t.substr(i+2,t.length)),r.style[t]=e}dispatchEvent(t,e=this.t){const s=new Event(t);return e.dispatchEvent(s),this}isBrowserES6Compatible(){try{eval('"use strict"; class appLoaderES6Check {}')}catch(t){return!1}return!0}isPlainObject(t=this.t){return"[object Object]"===Object.prototype.toString.call(t)}getCookie(t=""){const e=`${t}=`;let s="";return this.whileEach(((t,r,i)=>{0===(t=t.trim()).indexOf(e)&&(s=t.substring(e.length,t.length),i())}),document.cookie.split(";")),s}setCookie(t,e,s){const r=new Date;r.setTime(r.getTime()+24*s*60*60*1e3);const i=`expires=${r.toUTCString()}`;document.cookie=`${t}=${e}; ${i};path=/`}noSourceConsole(t="log",e=this.t){setTimeout(console[t].bind(console,e))}console(t="log",e=this.t){console[t](e)}getPageHeight(){const{body:t}=document,e=document.documentElement;return Math.max(t.scrollHeight,t.offsetHeight,e.clientHeight,e.scrollHeight,e.offsetHeight)}setSearchParameters(t=[],e=!0,s=(this.t=window)){const r=s===window,i=new URL(r?s.location.href:s);t.forEach((t=>{i.searchParams.set(t.name,t.value)}));const n=i.toString();return r&&e&&this.historyPushState(n,null,""),n}setSearchParameter(t,e,s=!0,r=(this.t=window)){return this.setSearchParameters([{name:t,value:e}],s,r)}removeSearchParameters(t=[],e=!0,s=(this.t=window)){const r=s===window,i=new URL(r?s.location.href:s);t.forEach((t=>{i.searchParams.delete(t.name)}));const n=i.toString();return r&&e&&this.historyPushState(n,null,""),n}removeSearchParameter(t,e=!0,s=(this.t=window)){return this.removeSearchParameters([{name:t}],e,s)}historyPushState(t,e=null,s=""){const r=e||{path:t};window.history.pushState(r,s,t);const i=new PopStateEvent("popstate",{state:r});window.dispatchEvent(i)}makeInmutable(t=this.t){const e=Object.getOwnPropertyNames(t);let s=e.length;for(;s--;){const r=t[e[s]];"object"==typeof r&&this.makeInmutable(r)}return Object.freeze(t)}onScroll({offsetTop:t=0,top:e,down:s,up:r,disableFlagMode:i=!1},n=this.t){let o=!1,a=0;const l=e=>{t=e};n.addEventListener("scroll",(()=>{const n=window.pageYOffset;n<t?e&&e(l):(i?n>a?s&&s(l):n<a&&r&&r(l):n>a&&!o?(o=!0,s&&s(l)):n<a&&o&&(o=!1,r&&r(l)),a=n)}))}initializeApp(t){console.error("App Architecture extension not found in this JSVanillaHelper (Core) instance")}}const defaultHelperInstance=new JSVanillaHelper,V=(t=null)=>defaultHelperInstance.setTarget(t),V$C=(t="")=>defaultHelperInstance.setTarget(document.getElementsByClassName(t)),V$I=(t="")=>defaultHelperInstance.setTarget(document.getElementById(t)),V$=(t=null)=>defaultHelperInstance.setTarget(document.querySelectorAll(t)),_V=(t=null)=>new JSVanillaHelper(t),_V$=(t=null)=>new JSVanillaHelper(document.querySelectorAll(t));exports.JSVanillaHelper=JSVanillaHelper,exports.V=V,exports.V$=V$,exports.V$C=V$C,exports.V$I=V$I,exports._V=_V,exports._V$=_V$,exports.defaultHelperInstance=defaultHelperInstance;
