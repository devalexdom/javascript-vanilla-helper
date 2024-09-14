"use strict";var e;!function(e){e[e.Unknown=0]="Unknown",e[e.SimpleController=1]="SimpleController",e[e.DOMInstanceController=2]="DOMInstanceController",e[e.EmbeddedInstancesController=3]="EmbeddedInstancesController",e[e.Service=4]="Service",e[e.SimpleFunctionalController=5]="SimpleFunctionalController",e[e.DOMInstanceFunctionalController=6]="DOMInstanceFunctionalController"}(e||(e={}));class t{#e;#t;constructor(e){this.#t=e,this.#e={vendors:[]};const t=e.getConfig("vendorLoader");if(t)this.#e={...this.#e,...t};else if(!1===t)return;e.subscribe("AppServicesInit",(()=>this.#r()))}#r(){this.#e.vendors.forEach((e=>{this.#n(e)}))}requestVendorLoad(e="",t=()=>{}){this.#e.vendors.forEach((r=>{r.triggerClass!==e||r.loaded?r.triggerClass===e&&r.loaded&&t():(r.requested=!0,this.#n(r),window.addEventListener(r.loadEventName,t))}))}#i(e){return e.conflictTriggerClass?.reduce(((e,t)=>e||document.getElementsByClassName(t).length>0),!1)??!1}#n(e){if(!this.#i(e)&&(document.getElementsByClassName(e.triggerClass).length>0||e.requested)){const{V:t}=this.#t,r=()=>{this.#t.getContextVar("isAppInDebugMode")&&t().console("log",`🧱 Vendor ${e.scriptPath} ${e.requested?"loaded by request.":"loaded by trigger CSS class."}`),t(window).dispatchEvent(e.loadEventName),e.loaded=!0};document.getElementById(`${e.triggerClass}-script`)||t(document.head).addScriptFile(e.scriptPath,r,`${e.triggerClass}-script`)}}}class r{#e;#o;#s;#t;constructor(e){this.#t=e,this.#s="",this.#e={loadImagesOnViewportVisible:!0,forceImageToHaveDomain:!0,viewportMobileSizes:["xs","sm"],viewportSizesMapping:()=>window.innerWidth<=575?"xs":window.innerWidth<=991?"sm":window.innerWidth<=1199?"md":window.innerWidth<=1399?"lg":"xl"};const t=e.getConfig("imageLoader");if(t)this.#e={...this.#e,...t};else if(!1===t)return;e.subscribe("AppInit",(()=>this.#r()))}#r(){this.#l(),this.#a(),this.#e.loadImagesOnViewportVisible?this.#c():this.#p(),this.#h()}#p(){this.#o.forEach((e=>this.loadLazyElement(e)))}#c(){const{V:e}=this.#t;e(this.#o.filter((e=>!e.activeVisibilityTracking)).map((e=>(e.activeVisibilityTracking=!0,e)))).onViewportVisibleOnce((e=>{e.activeVisibilityTracking=!1,this.loadLazyElement(e)}))}#a(){this.#s=this.#u(),this.#t.setContextVar("viewportPredefinedSize",this.#s,!0),this.#t.setContextVar("isViewportSizeMobile",this.#e.viewportMobileSizes.includes(this.#s),!0)}#l(){this.#o=[...document.body.querySelectorAll("[data-image-src]")]}#d(e,t){return(this.#e.forceImageToHaveDomain?new URL(e,document.baseURI):new URL(e)).toString()}#g(e,t){if("xl"!==this.#s){const t=e.getAttribute(`data-src-${this.#s}`);if(t)return t}return t}#u(){return this.#e.viewportSizesMapping()}#I(e,t=e=>{}){let r=e;e.startsWith("/")&&(r=`${document.location.origin}${e}`),fetch(r).then((e=>e.text())).then((e=>{t(e)})).catch((t=>{console.error(`Cannot render SVG from ${e}`),console.error(t)}))}#m(e){const t=document.createElement("div");t.innerHTML=e;[...t.getElementsByTagName("script")].forEach((e=>{e.parentNode.removeChild(e)}));return t.getElementsByTagName("svg")[0]??null}#h(){const{V:e}=this.#t;e(window).onEvent("resize",(()=>{const e=this.#u();e!==this.#s&&(this.#s=e,this.#t.setContextVar("viewportPredefinedSize",this.#s,!0),this.#t.setContextVar("isViewportSizeMobile",this.#e.viewportMobileSizes.includes(this.#s),!0),this.#e.loadImagesOnViewportVisible?this.#c():this.#p())}))}loadLazyElement(e){const{V:t}=this.#t,r=e.getAttribute("data-image-src");if(!r)return void e.removeAttribute("data-image-src");const n=this.#d(this.#g(e,r),e);switch(e.tagName){case"IMG":e.setAttribute("src",n),t(e).hasClass("load-feedback")&&t(e).onEvent("load",(()=>{e.classList.add("img-loaded")}));break;case"DIV":(t(e).hasClass("parent-background-image")?e.parentNode:e).style.backgroundImage=`url("${n}")`;break;case"svg":this.#I(n,(t=>{const r=this.#m(t);if(r){const t=e.lazyloadCallback;if(!!!r.getAttribute("viewBox")){const e=r.getAttribute("height"),t=r.getAttribute("width");e&&t&&r.setAttribute("viewBox",`0 0 ${t} ${e}`)}e.classList.forEach((e=>{r.classList.add(e)})),e.parentNode.replaceChild(r,e),t&&t(r)}}));break;default:this.#t.reportError("Unsupported DOM element",e)}}}class n{#v;#C;#e;#b;#A;#S;#f;#E;#w;#t;#V;#D;#M;constructor(e,t){this.#v="4.0.0 beta",this.#C=e.id,this.#e=e.config,this.#w=t,this.#V=this.#$(),this.#t=this.#y(),this.#a(e),this.#D={appInitTime:null,appBeforeInitEventFired:!1,appInitEventFired:!1,appServicesInitEventSubscribedControllers:new Set,appServicesInitEventCompletedControllers:new Set}}getUniqueId(){return this.#C.uniqueId}getBuildNumber(){return this.#C.buildNumber}#a(e){const t={alias:"isAppInDebugMode",value:this.#V,readOnly:!0};this.#M=e.contextVars??{},this.#M[t.alias]=t}#y(){const t={getController:this.getController.bind(this),getCurrentCulture:this.getCulture.bind(this),getService:this.getService.bind(this),getInstanceController:this.getInstanceController.bind(this),getInstanceControllerById:this.getInstanceControllerById.bind(this),getConfig:this.getConfig.bind(this),V:(e=null)=>this.#w.setTarget(e),V$:(e=null)=>this.#w.setTarget(document.querySelectorAll(e)),logOnDebug:()=>{},warnOnDebug:()=>{},reportError:()=>{},whoIam:()=>({aliasOrId:"I don't know...",type:e.Unknown}),subscribe:this.#O.bind(this),emit:()=>{},getContextVar:()=>{},setContextVar:()=>{},getRootDOMElement:()=>document.documentElement};return this.#w.makeInmutable(t),t}#$(){return!!localStorage.getItem("JSVHAppArchitectureDebug")}getCulture(){return this.#e.culture??""}getConfig(e){return this.#e.custom[e]??null}registerSimpleController(e="",t,r){e&&t||console.error("AppArchitecture: Unable to register controller, unique alias and controllerClass are expected parameters."),(this.#b[e]||this.#A[e])&&console.error("AppArchitecture: Unable to register controller, unique alias is not unique or you're registering the controller again."),r?.generateInstanceBeforeInit?this.#q(e,t):this.#A[e]={uniqueAlias:e,controllerClass:t,controllerFunction:null}}registerFunctionalSimpleController(e="",t,r){e&&t||console.error("AppArchitecture: Unable to register controller, unique alias and controllerFunction are expected parameters."),(this.#b[e]||this.#A[e])&&console.error("AppArchitecture: Unable to register controller, unique alias is not unique or you're registering the controller again."),r?.generateInstanceBeforeInit?this.#x(e,t):this.#A[e]={uniqueAlias:e,controllerClass:null,controllerFunction:t}}registerService(e="",t,r){e&&t||console.error("AppArchitecture: Unable to register service, unique alias and serviceControllerClass are expected parameters."),(this.#b[e]||this.#A[e])&&console.error("AppArchitecture: Unable to register service, unique alias is not unique or you're registering the service again."),this.#z(e,t)}registerInstancesController(e="",t,r){e&&t||console.error("AppArchitecture: Unable to register instance controller, unique alias and instanceControllerClass are expected parameters."),this.#b=new i(e,t,null)}registerFunctionalInstancesController(e="",t,r){e&&t||console.error("AppArchitecture: Unable to register instance controller, unique alias and instanceControllerFunction are expected parameters."),this.#b=new i(e,null,t)}#H(e,t){this.#w.console("error",`🤕 An unhandled error happened in the inline init of DOM instance component "${e.id?e.id:"-NO ID-"}"`),this.#w.console("error",e),this.#w.console("error",t||"Controller not found in main app"),(e=>{this.#V?(e.style.opacity=.6,e.style.filter="grayscale(100%)",e.prepend("⚠️")):this.#e.errorManagement?.hideCrashedDOMInstancesDuringInit&&(e.style.display="none")})(e)}#F(){const e=(e,t)=>{const r=t.createComponentInstance(e,this.#R.bind(this));this.#E[r.uniqueId]?this.#H(e,`DOM Instance id "${r.uniqueId}" not unique`):this.#E[r.uniqueId]=r};[...document.querySelectorAll("[jsvh-controller]")].forEach((t=>{const r=t.getAttribute("jsvh-controller"),n=t.getAttribute("jsvh-modular-controller-src");try{const i=this.#b[r];if(!i&&!n)return void this.#H(t);!i&&n?this.#w.addScriptFile(n,(()=>{const n=this.#b[r];n?e(t,n):this.#H(t)}),`${r}-script`,document.head):e(t,i)}catch(e){this.#H(t,e)}}))}#T(){return new Promise(((e,t)=>{0===this.#D.appServicesInitEventSubscribedControllers.size?e():(this.#O("AppServicesInit%",((t,r)=>{this.#S[r]&&(this.#D.appServicesInitEventCompletedControllers.add(r),this.#D.appServicesInitEventCompletedControllers.size===this.#D.appServicesInitEventSubscribedControllers.size&&e())})),this.#O("AppServicesInit/",((e,r)=>{this.#S[r]&&t()})))}))}#O(e,t,r){"AppInit"===e&&this.#D.appInitEventFired||"AppBeforeInit"===e&&this.#D.appBeforeInitEventFired?t(null,this.#C.uniqueId):window.addEventListener(`${this.#C.uniqueId}_${e}`,(e=>{(!e.detail||r&&e.detail?.originId===r)&&t(e.detail?.data,e.detail?.originId??"unknown")}))}#R(t,r,n){const i=(e,n)=>{this.#V?(this.#w.console("error",`🟥 ${t} (${r}) REPORTED AN ERROR 🟥`),this.#w.console("error",e),n&&this.#w.console("error",n),console.trace()):document.body.setAttribute("jsvh-error-has-occurred","yes"),this.#L({url:window.location.href,errorDetails:n,controllerType:r,uncontrolledError:!1},t)},o=n?()=>n:this.#t.getRootDOMElement;return{...this.#t,logOnDebug:e=>{this.#V&&(this.#w.console("log",`⬇️ DEBUG FROM: ${t} (${r}) ⬇️`),this.#w.console("log",e),console.trace())},warnOnDebug:e=>{this.#V&&(this.#w.console("warn",`⬇️ DEBUG WARN FROM: ${t} (${r}) ⬇️`),this.#w.console("warn",e),console.trace())},reportError:i,subscribe:(i,o,s)=>{const l=r===e.DOMInstanceController||r===e.DOMInstanceFunctionalController,a=(e,a)=>{this.#V&&this.#w.console("log",`🪃 ${t} (${r}) SUBSCRIPTION TO ${i}${s?` ~ ${s}`:""} RECEIVED`);try{o(e,a),this.#V&&this.#w.console("log",`🪃✅ ${t} (${r}) SUBSCRIPTION TO ${i}${s?` ~ ${s}`:""} COMPLETED`),this.#U(`${i}%`,t)}catch(e){this.#B(t,r,e),this.#U(`${i}/`,t),l&&this.#e.errorManagement?.hideCrashedDOMInstancesWhileRunning&&(n.style.display="none")}};"ViewportVisibleInit"===i&&l?this.#w.onViewportVisibleOnce((()=>{a(null,null)}),{root:null,rootMargin:"0px",threshold:1},n):("AppServicesInit"===i&&this.#S[t]&&this.#D.appServicesInitEventSubscribedControllers.add(t),this.#t.subscribe(i,((e,t)=>{a(e,t)}),s))},getRootDOMElement:o,whoIam:()=>({aliasOrId:t,type:r}),emit:(e,r)=>{this.#N(e,r,t)},getContextVar:(e,r)=>{const n=this.#M[e];if(n){if(n.scope?.includes(t)||!n.scope)return r&&this.#t.subscribe(`ContextVarChange_${e}`,(()=>r(this.#M[e]?.value))),n.value;i(`Error accessing value of context var "${e}", is out of scope.`)}return null},setContextVar:(e,r,n,o)=>{const s=this.#M[e];if(s){if(!s.scope?.includes(t)&&s.scope)return void i(`Error setting value to context var "${e}", is out of scope.`);if(n&&s.creatorId!==t)return void i(`Error setting value to context var "${e}", is read only.`);this.#M[e].value=r}this.#M[e]={alias:e,value:r,readOnly:!!n,scope:o?[...t,...o]:null},this.#U(`ContextVarChange_${e}`)}}}#q(t,r){try{const n=new r(this.#R(t,e.SimpleController));this.#b[t]=n}catch(r){this.#B(t,e.SimpleController,r)}}#x(t,r){try{const n=r(this.#R(t,e.SimpleFunctionalController));this.#b[t]=n}catch(r){this.#B(t,e.SimpleFunctionalController,r)}}#B(e,t,r){this.#V?(this.#w.console("error",`🟥 ${e} (${t}) THROWED AN UNCONTROLLED ERROR 🟥`),this.#w.console("error",r)):document.body.setAttribute("jsvh-error-has-occurred","yes"),this.#L({url:window.location.href,errorDetails:r,controllerType:t,uncontrolledError:!0},e)}#z(t,r){try{const n=new r(this.#R(t,e.Service));this.#S[t]=n}catch(r){this.#B(t,e.Service,r)}}start(){this.#D.appInitTime||(this.#D.appInitTime=new Date,this.#V&&(console.log(`JSVanillaHelper APP Architecture ${this.#v} is in verbose & debug mode 🧯`),console.log(`💽 ${this.#C.alias} | Unique ID [${this.#C.uniqueId}] | Build Number [${this.#C.buildNumber??"Unknown"}]`)),this.#U("AppBeforeInit"),this.#D.appBeforeInitEventFired=!0,this.#z("vendorLoader",t),this.#z("imageLoader",r),Object.values(this.#f).forEach((e=>{this.#z(e.uniqueAlias,e.serviceControllerClass)})),Object.values(this.#A).forEach((e=>{e.controllerClass&&!e.controllerFunction?this.#q(e.uniqueAlias,e.controllerClass):!e.controllerClass&&e.controllerFunction&&this.#x(e.uniqueAlias,e.controllerFunction)})),this.#T().then((()=>{this.#F(),this.#U("AppInit"),this.#D.appInitEventFired=!0})).catch((()=>{console.error("AppArchitecture: Service controller error, cannot continue with app initialization.")})))}#N(e,t,r){switch(e){case"AppPreInit":case"AppServicesInit":case"AppInit":case"ViewportVisibleInit":return}const n={originId:r??null,data:t??null};window.dispatchEvent(new CustomEvent(`${this.#C.uniqueId}_${e}`,{detail:n}))}#U(e,t){const r={originId:t||null};window.dispatchEvent(new CustomEvent(`${this.#C.uniqueId}_${e}`,{detail:r}))}#L(e,t){window.dispatchEvent(new CustomEvent(`${this.#C.uniqueId}_AppError`,{detail:{originId:t||"self/unknown",errorData:e}}))}getService(e){const t=this.#S[e]??null;return t||console.error(`AppArchitecture: Service "${e}" not found/registered in app "${this.#C.uniqueId}"`),t}getController(e){const t=this.#b[e]??null;if(t){if(t?.createComponentInstance)return console.error("AppArchitecture: Instances controller cannot be accessed directly"),null}else console.error(`AppArchitecture: Controller "${e}" not found/registered in app "${this.#C.uniqueId}"`);return t}getInstanceControllerById(e){const t=this.#E[e]?.componentInstance??null;return t||console.error(`AppArchitecture: Instance controller for component "${e}" not found/registered in app "${this.#C.uniqueId}"`),t}getInstanceController(e){const t=e?.getAttribute("jsvh-component-id");return t?this.getInstanceControllerById(t):(console.error("AppArchitecture: DOM element does not have a valid component instance id"),null)}}class i{#k;#P;#j;#G;constructor(e,t,r){this.#G=0,this.#k=e,this.#P=t,this.#j=r}createComponentInstance(t,r){const n=t.id?t.id:`${this.#k.replace("Controller","")}-${this.#G}`;let i=null;if(this.#P){const o=r(n,e.DOMInstanceController,t);i=new this.#P(o)}else if(this.#j){const o=r(n,e.DOMInstanceFunctionalController,t);i=this.#j(o)}return{uniqueId:n,instancesControllerUniqueId:this.#k,componentInstance:i,rootDOMElement:t}}}const o=new class{extensionName;version;helper;constructor(){this.extensionName="AppArchitecture",this.version=4}extendHelperInstance(e){e.createApp=this.createApp.bind(this),e.toggleLSDebugModeSetting=this.toggleLSDebugModeSetting.bind(this),e.getApp=this.getApp.bind(this),e.getMainApp=this.getMainApp.bind(this)}toggleLSDebugModeSetting(){const e=!!localStorage.getItem("JSVHAppArchitectureDebug");e?localStorage.setItem("JSVHAppArchitectureDebug","true"):localStorage.removeItem("JSVHAppArchitectureDebug"),this.helper.console("log",`🧯 JSVanillaHelper AppArchitecture debug mode set to ${e}, please refresh website.`)}createApp(e=!0){const{helper:t}=this,r=t.t;if(!t.isPlainObject(r))return void console.error("Target is not a valid Object");if(!r.config)return void console.error(`Cannot find "config" property, please check if app structure is suitable for JSVanillaHelper App Architecture ${this.version} .`);if(!r.id)return void console.error(`Cannot find "id" property, please check if app structure is suitable for JSVanillaHelper App Architecture ${this.version} .`);const i=new n(r,t);return e&&(t.hData.reg.mainAppRef=i),t.hData.reg[`${r.id.uniqueId}_AppRef`]=i,i}getApp(e){return this.helper.hData.reg[`${e}_AppRef`]??null}getMainApp(){return this.helper.hData.reg.mainAppRef??null}};module.exports=o;
