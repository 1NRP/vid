// ==UserScript==
// @name         CORS Bypass
// @description  CORS Bypass Via Tampermonkey's "GM_xmlhttpRequest".
// @version      1.0
// @match        https://1nrp.github.io/vid/cors
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=https://mybrowseraddon.com/access-control-allow-origin.html&sz=32
// ==/UserScript==

const CORSViaGM = document.body.appendChild(Object.assign(document.createElement('div'), { id: 'CORSViaGM' }));

CORSViaGM.init = function (window = unsafeWindow) {
    if (!window) throw new Error('The window parameter must be passed in!');
    // Define the native fetch method for non-CORS sites.
    const nativeFetch = window.fetch.bind(window);
    // Override fetch method selectively
    window.fetch = function (url, init) {
        if (shouldUseGM(url)) {
            return fetchViaGM(url, init);
        } else {
            // Use the native fetch for other domains
            return nativeFetch(url, init);
        }
    };
    // Update User Interface stating CORS Bypass is activated. Function "showAlert()" is defined in the original web page.
    showAlert({ BgColor: '#0cabf5', Text: 'CORS - BYPASS' });
    //alert('🔵 CORS 🔵 Bypass Activated.');
    console.info('🐵🐒🐵 CORS-Via-GM Initiated.');
};
// Add sites here to bypass CORS.
function shouldUseGM(url) {
    const domains = ['https://www.terabox.app', 'https://t.me', 'https://example.com'];
    return domains.some(domain => url.startsWith(domain));
}

function fetchViaGM(url, init) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            ...init,
            url: url,
            method: init?.method || 'GET',
            data: init?.body,
            responseType: 'blob', // Adjust this based on your needs
            onload: responseDetails => {
                const headers = modifyHeaders(responseDetails.responseHeaders);
                resolve(new Response(responseDetails.response, {
                    status: responseDetails.status,
                    statusText: responseDetails.statusText,
                    headers
                }));
            },
            onerror: error => {
                console.error('GM_xmlhttpRequest error:', error);
                reject(error);
            }
        });
    });
}

function modifyHeaders(headerString) {
    const headers = new Headers();
    headerString.trim().split(/[\r\n]+/).forEach(line => {
        const parts = line.split(': ');
        const key = parts.shift();
        const value = parts.join(': ');
        headers.append(key, value);
    });
    return headers;
}

// Initialize when the @match sites are loaded.
CORSViaGM.init();
