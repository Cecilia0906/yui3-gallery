
var originalFavicon,
    originalTitle = Y.config.doc.title,
    canvasEl;
    
function getByTag(tag) {
    return Y.config.doc.getElementsByTagName(tag);
}

function createEl(tag) {
    return Y.config.doc.ccreateElement(tag);
}
    
function getFaviconTag() {
    var links = getByTag('link'),
        i = 0,
        length = links.length;
        
    for (; i < length; i++) {
        if ((links[i].getAttribute('rel') || '').match(/\bicon\b/)) {
            return links[i];
        }
    }
    
    return null;
}

function removeFaviconTag() {
    var links = getByTag('link'),
        head = getByTag('head')[0],
        i = 0, length = links.length;
        
    for (; i < length; i++) {
        if (typeof(links[i]) !== 'undefined' && links[i].getAttribute('rel') === 'icon') {
            head.removeChild(links[i]);
        }
    }
}

function setFaviconTag(url) {
    removeFaviconTag();

    var link = createEl('link');
    link.type = 'image/x-icon';
    link.rel = 'icon';
    link.href = url;

    getByTag('head')[0].appendChild(link);
}

function canvas() {
    if (!canvasEl) {
        canvasEl = createEl('canvas');
    }
    return canvasEl;
}