!function(){"use strict";const e="GET_STORAGE_INFO",t="GET_STORAGE_SUPER_OBJECT",n="GET_STORAGE_OBJECT",o="SAVE_STORAGE_OBJECT",i="REMOVE_STORAGE_OBJECT",s="CLEAR_STORAGE",a="getTabSession",r="handshakeClient",c="getAPIResponse",d="startRecordingOnUrl",u="stopRecording",E="watchRecording",m="cacheRecordedSessionOnPageUnload",g="initSessionRecorder",l="clientPageLoaded",R="notifyTestRuleReportUpdated",S="testRuleOnUrl",p="ruleSaveError",w="notifySessionRecordingStarted",T="notifySessionRecordingStopped",h="isRecordingSession",y="getTabSession",v="startRecording",C="stopRecording",L="isExplicitRecordingSession",O="notifyPageLoadedFromCache",A="notifyRecordUpdated",_="local";var M,I,P,f,D,q,U,N,b,x,H,G;!function(e){e.GROUP="group",e.RULE="rule"}(M||(M={})),function(e){e.ACTIVE="Active",e.INACTIVE="Inactive"}(I||(I={})),function(e){e.REDIRECT="Redirect",e.CANCEL="Cancel",e.REPLACE="Replace",e.HEADERS="Headers",e.USERAGENT="UserAgent",e.SCRIPT="Script",e.QUERYPARAM="QueryParam",e.RESPONSE="Response",e.REQUEST="Request",e.DELAY="Delay"}(P||(P={})),function(e){e.URL="Url",e.HOST="host",e.PATH="path"}(f||(f={})),function(e){e.EQUALS="Equals",e.CONTAINS="Contains",e.MATCHES="Matches",e.WILDCARD_MATCHES="Wildcard_Matches"}(D||(D={})),function(e){e.PAGE_DOMAINS="pageDomains",e.REQUEST_METHOD="requestMethod",e.RESOURCE_TYPE="resourceType",e.REQUEST_PAYLOAD="requestPayload"}(q||(q={})),function(e){e.XHR="xmlhttprequest",e.JS="script",e.CSS="stylesheet",e.Image="image",e.Media="media",e.Font="font",e.WebSocket="websocket",e.MainDocument="main_frame",e.IFrameDocument="sub_frame"}(U||(U={})),function(e){e.GET="GET",e.POST="POST",e.PUT="PUT",e.DELETE="DELETE",e.PATCH="PATCH",e.OPTIONS="OPTIONS",e.CONNECT="CONNECT",e.HEAD="HEAD"}(N||(N={})),function(e){e.CUSTOM="custom",e.ALL_PAGES="allPages"}(b||(b={})),function(e){e.SESSION_RECORDING_CONFIG="sessionRecordingConfig"}(x||(x={})),function(e){e.JS="js",e.CSS="css"}(H||(H={})),function(e){e.URL="url",e.CODE="code"}(G||(G={}));var k={browser:"chrome",storageType:"local",contextMenuContexts:["browser_action"],env:"prod",WEB_URL:"https://app.requestly.io",SESSIONS_URL:"https://app.requestly.io/sessions",OTHER_WEB_URLS:["https://app.requestly.com"],logLevel:"info"};const W=async()=>new Promise((e=>{chrome.storage[_].get(null,e)})),B=async e=>new Promise((t=>{chrome.storage[_].get(e,(n=>t(n[e])))}));var F,J;!function(e){e[e.MODIFIED=0]="MODIFIED",e[e.CREATED=1]="CREATED",e[e.DELETED=2]="DELETED"}(F||(F={})),function(e){e.IS_EXTENSION_ENABLED="isExtensionEnabled",e.EXTENSION_RULES_COUNT="extensionRulesCount",e.TEST_SCRIPT="testScript"}(J||(J={}));const Q=e=>!!e&&[...new Set([k.WEB_URL,...k.OTHER_WEB_URLS])].some((t=>e.includes(t))),Y={};const V="content_script",X="page_script",j="source",$=(e,t)=>{e.action&&(t&&((e,t)=>{if(!t)return;Y[e.action+"_1"]=t,e.requestId=1})(e,t),e[j]=V,window.postMessage(e,window.origin))},z=(e,t)=>{$({action:e.action,requestId:e.requestId,response:t})},K={};let Z=!1;const ee={isRecording:!1,isExplicitRecording:!1,markRecordingIcon:!1,widgetPosition:null,recordingStartTime:null,showWidget:!1},te=()=>{window.addEventListener("pageshow",(e=>{e.persisted&&chrome.runtime.sendMessage({action:O,payload:{isRecordingSession:ee.isRecording}})}))},ne=async e=>{if(!e)return;await(async()=>new Promise((e=>{Z&&e(),chrome.runtime.sendMessage({action:g},(()=>{Z=!0,e()}))})))();const{notify:t,markRecordingIcon:n=!0,explicit:o=!1,recordingStartTime:i=Date.now(),showWidget:s,widgetPosition:a,previousSession:r}=e,c=window.top!==window;c||oe(),se("startRecording",{relayEventsToTop:c,console:!0,network:!0,maxDuration:60*(e.maxDuration||5)*1e3,previousSession:c?null:r}),ee.isExplicitRecording=o,ee.markRecordingIcon=n,ee.showWidget=s,ee.widgetPosition=a,ee.recordingMode=o?"manual":"auto",t&&Ee(),o&&(ee.recordingStartTime=i,ue())},oe=()=>{chrome.runtime.onMessage.addListener(((e,t,n)=>{switch(e.action){case h:n(ee.isRecording);break;case y:return se("getSessionData",null,(e=>{n({...e,recordingMode:ee.recordingMode})})),!0;case L:n(ee.isExplicitRecording);break;case C:se("stopRecording",null)}return!1})),window.addEventListener("message",(function(e){e.source===window&&"requestly:client"===e.data.source&&(e.data.response?ie(e.data.action,e.data.payload):"sessionRecordingStarted"===e.data.action?(ee.isRecording=!0,chrome.runtime.sendMessage({action:w,payload:{markRecordingIcon:ee.markRecordingIcon}}),ee.showWidget&&(ee.isExplicitRecording?ae():de())):"sessionRecordingStopped"===e.data.action&&(ee.isRecording=!1,ee.isExplicitRecording=!1,ee.markRecordingIcon=!1,re(),ue(),chrome.runtime.sendMessage({action:T})))})),window.addEventListener("beforeunload",(()=>{se("getSessionData",null,(e=>{chrome.runtime.sendMessage({action:m,payload:{session:e,widgetPosition:ee.widgetPosition,recordingMode:ee.recordingMode,recordingStartTime:ee.recordingStartTime}})}))}))},ie=(e,t)=>{K[e]?.(t),delete K[e]},se=(e,t,n)=>{window.postMessage({source:"requestly:extension",action:e,payload:t},window.location.href),n&&(K[e]=n)},ae=()=>{let e=ce();e||(e=document.createElement("rq-session-recording-widget"),e.classList.add("rq-element"),document.documentElement.appendChild(e),e.addEventListener("stop",(()=>{chrome.runtime.sendMessage({action:u,openRecording:!0})})),e.addEventListener("discard",(()=>{chrome.runtime.sendMessage({action:u})})),e.addEventListener("moved",(e=>{ee.widgetPosition=e.detail})));const t=Date.now()-ee.recordingStartTime,n=t<=3e5?t:null;e.dispatchEvent(new CustomEvent("show",{detail:{currentRecordingTime:n,position:ee.widgetPosition}}))},re=()=>{const e=ce();e?.dispatchEvent(new CustomEvent("hide"))},ce=()=>document.querySelector("rq-session-recording-widget"),de=()=>{const e="rq-session-recording-auto-mode-widget";let t=document.querySelector(e);t||(t=document.createElement(e),t.classList.add("rq-element"),document.documentElement.appendChild(t),t.addEventListener("watch",(()=>{chrome.runtime.sendMessage({action:E})})),t.addEventListener("moved",(e=>{ee.widgetPosition=e.detail}))),t.dispatchEvent(new CustomEvent("show",{detail:{position:ee.widgetPosition}}))},ue=()=>{let e=document.querySelector("rq-session-recording-auto-mode-widget");e?.dispatchEvent(new CustomEvent("hide"))},Ee=()=>{const e=document.createElement("rq-toast");e.classList.add("rq-element"),e.setAttribute("heading","Requestly is recording session on this tab!"),e.setAttribute("icon-path",chrome.runtime.getURL("resources/images/128x128.png"));const t='\n  <div slot="content">\n    You can save up to last 5 minutes anytime by clicking on Requestly extension icon to save & upload activity for this tab.\n  </div>\n  ';try{e.innerHTML=t}catch(n){const o=window.trustedTypes?.createPolicy?.("rq-html-policy",{createHTML:e=>e});e.innerHTML=o.createHTML(t)}document.documentElement.appendChild(e)};document.documentElement.setAttribute("rq-ext-version",chrome.runtime.getManifest().version),document.documentElement.setAttribute("rq-ext-mv","3"),document.documentElement.setAttribute("rq-ext-id",chrome.runtime.id),window.addEventListener("message",(async r=>{var u;if((!r||Q(r.origin))&&r&&r.data&&r.data.source===X)switch(void 0!==r.data.response&&(e=>{const t=Y[e.data.action+"_"+e.data.requestId];"function"==typeof t&&(delete Y[e.data.action],t(e.data.response))})(r),r.data.action){case e:{const e=await(async()=>{const e=await W();return Object.values(e).filter((e=>!!e))})();return void z(r.data,{storageType:_,numItems:e.length,bytesUsed:JSON.stringify(e).length})}case t:{const e=await W();return void z(r.data,e)}case n:{const e=await B(r.data.key);return void z(r.data,e)}case o:return await(async e=>{await chrome.storage[_].set(e)})(r.data.object),void z(r.data);case i:return await(async e=>{await chrome.storage[_].remove(e)})(r.data.key),void z(r.data);case s:return await(async()=>{await chrome.storage[_].clear()})(),void z(r.data);case a:case c:case d:case S:u=r.data,chrome.runtime.sendMessage(u,(e=>{z(u,e)}))}})),chrome.runtime.onMessage.addListener(((e,t,n)=>{switch(e.action){case l:chrome.runtime.sendMessage({action:l});break;case R:case A:case p:$(e)}})),(async()=>await(async(e,t)=>{return await B((n=e,`rq_var_${n}`))??t;var n})(J.IS_EXTENSION_ENABLED,!0))().then((e=>{e&&(chrome.runtime.sendMessage({action:r}),chrome.runtime.onMessage.addListener((e=>{e.action===v&&ne(e.payload)})),te())}))}();