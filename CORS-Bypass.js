// ==UserScript==
// @name         CORS Bypass
// @description  CORS Via Tampermonkey
// @version      2.0
// @author       Nihar Ranjan Pradhan
// @match        https://1nrp.github.io/vid/cors
// @grant        GM_xmlhttpRequest
// @connect      *
// @namespace    https://greasyfork.org/users/882700
// @license      MIT
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://mybrowseraddon.com/access-control-allow-origin.html&size=64
// ==/UserScript==

const CORSViaGM = document.body.appendChild(Object.assign(document.createElement('div'), { id: 'CORSViaGM' }));

addEventListener('fetchViaGM', e => {
    const { url } = e.detail.forwardingFetch;
    if (shouldUseGM(url)) {
        GM_fetch(e.detail.forwardingFetch);
    } else {
        defaultFetch(e.detail.forwardingFetch);
    }
});

CORSViaGM.init = function (window = unsafeWindow) {
    if (!window) throw new Error('The window parameter must be passed in!');
    window.fetch = window.fetchViaGM = fetchViaGM.bind(window);

    // Support for service worker
    window.forwardingFetch = new BroadcastChannel('forwardingFetch');
    window.forwardingFetch.onmessage = async e => {
        const req = e.data;
        const { url } = req;
        try {
            const res = await fetchViaGM(url, req);
            const response = await res.blob();
            window.forwardingFetch.postMessage({ type: 'fetchResponse', url, response });
        } catch (error) {
            console.error('Error in forwardingFetch onmessage:', error);
        }
    };

    window._CORSViaGM && window._CORSViaGM.inited && window._CORSViaGM.inited.done();

    const info = '🐒 CORS-Via-GM Initiated.';
    alert('🐵 CORS-BYPASS Activated.');
    console.info(info);
    return info;
};

function shouldUseGM(url) {
    const domains = ['https://www.terabox.com', 'https://t.me', 'https://example.com'];
    return domains.some(domain => url.startsWith(domain));
}

function GM_fetch(p) {
    GM_xmlhttpRequest({
        ...p.init,
        url: p.url,
        method: p.init.method || 'GET',
        data: p.body,
        responseType: 'blob',
        onload: responseDetails => p.res(new Response(
            responseDetails.response,
            {
                status: responseDetails.status,
                statusText: responseDetails.statusText,
                headers: shouldUseGM(p.url) ? modifyHeaders(responseDetails.responseHeaders) : responseDetails.responseHeaders
            }
        )),
        onerror: error => {
            console.error('GM_xmlhttpRequest failed:', error);
        }
    });
}

function defaultFetch(p) {
    window.fetch(p.url, p.init).then(response => {
        p.res(response);
    }).catch(error => {
        console.error('Default fetch failed:', error);
    });
}

function fetchViaGM(url, init) {
    let res;
    const p = new Promise(r => res = r);
    p.res = res;
    p.url = url;
    p.init = init || {};
    dispatchEvent(new CustomEvent('fetchViaGM', { detail: { forwardingFetch: p } }));
    return p;
}

function modifyHeaders(responseHeaders) {
    const headers = new Headers(responseHeaders);

    // Add the 'Access-Control-Allow-Origin' and 'Access-Control-Allow-Methods' headers.
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, HEAD, OPTIONS');

    return headers;
}

// Initialize when the @match sites are loaded.
CORSViaGM.init();
