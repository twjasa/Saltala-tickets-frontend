// let baseUrl = 'http://localhost/laravelprojects/saltala-tickets-api/public/api/';
let baseUrl = 'http://127.0.0.1:8000/api/';
let token = '';
// request error timeout
let timeout = (1000 * 60) * 1.5;
// global headers

let globalHeaders = {
    'Accept': 'application/json',
    'Application':'x-www-form-urlencoded',
    'Access-Control-Allow-Origin': '*',
}; 

class Ajax {
    // base url
    static get baseUrl() {
        return baseUrl;
    }

    static set baseUrl(url) {
        if ( typeof url === 'string' ) {
            baseUrl = url;
        } else {
            throw new Error('Ajax Nightmare: "baseUrl" must be a string');
        }
    }
    // bearer token
    static get token() {
        return token;
    }

    static set token(bearer) {
        if ( typeof bearer === 'string' ) {
            token = bearer;
        } else {
            throw new Error('Ajax Nightmare: "token" must be a string');
        }
    }
    // error timeout
    static get timeout() {
        return timeout;
    }
    static set timeout(milliseconds) {
        timeout = milliseconds;
    }
    // global headers
    static set globalHeaders(headers) {
        if ( typeof headers === 'object' ) {
            globalHeaders = headers;
        } else {
            throw new Error('Ajax Nightmare: "globalHeaders" must be a object');
        }
    }
    static get globalHeaders() {
        return globalHeaders;
    }

    static make(endpoint = '', options = {}) {
        return new Ajax(endpoint, options);
    }

    // native XMLHttpRequest properties
    get status() {
        return this.xhr.status;
    }
    get statusText() {
        return this.xhr.statusText;
    }
    get responseText() {
        return this.xhr.responseText;
    }
    get readyState() {
        return this.xhr.readyState;
    }

    constructor(endpoint = '', options = {}) {
        this.xhr = new XMLHttpRequest();
        this.Success = false;
        this.error = false;
        this.options = Ajax.__setRequestOptions(options);
        // set url
        if (this.options.useBaseUrl) {
            this.url = `${baseUrl}${endpoint}`;
        }
        else {
            if (this.options.params) {
                this.url = Ajax.__setParams(endpoint, options.params);
            }
            else {
                this.url = endpoint;
            }
        }
        this.__progressListeners();
        this.__resultListeners();
        this.xhr.timeout = timeout;
        if (this.options.autoSend) {
            this.send();
        }
        this.abort = this.abort.bind(this);
        this.send = this.send.bind(this);
    }

    static __setParams(endpoint, params) {
        let urlArray = Object.keys(params).map( (key) => {
            if (params[key]){
                if (params[key] === true)
                    return `${key}=1`;

                return `${key}=${params[key]}`;
            }
        });

        let requestUrl = `${baseUrl}${endpoint}`;

        let valid = 0
        for (let index = 0 ; index < urlArray.length ; index++) {
            if (urlArray[index] !== undefined) {
                if (valid > 0)
                    requestUrl = `${requestUrl}&${urlArray[index]}`;
                else
                    requestUrl = `${requestUrl}?${urlArray[index]}`;
                valid++;
            }
        }

        return requestUrl;
    }

    static __setBody(body, method, headers = {}) {
        if (method.toUpperCase() === 'PUT' || 'Content-Type' in headers || 'content-type' in headers) {
            return JSON.stringify(body);
        } else {
            const formData = new FormData();
            Object.entries(body).forEach(([key, value]) => {
                if (value instanceof Array) {
                    for (let data of value) {
                        formData.append(`${key}[]`, data);
                    }
                } else {
                    formData.append(key, value);
                }
            });
            return formData;
        }
    }

    send() {
        this.xhr.open(this.options.method, this.url, true);
        this.xhr.responseType = this.options.responseType;
        this.__setHeaders();
        if (this.options.params || !this.options.body) {
            this.xhr.send();
        }
        else {
            this.xhr.send(this.options.body);
        }
    }

    __setHeaders() {
        for(let arg of Object.entries(this.options.headers)) {
            if (this.options.method.toUpperCase() !== 'PUT') {
                if (arg[0] !== 'Content-Type' || arg[0] !== 'content-type') {
                    this.xhr.setRequestHeader(arg[0],arg[1]);
                }
            } else {
                this.xhr.setRequestHeader(arg[0],arg[1]);
            }
        }
        if(this.options.credentials || token.length > 0) {
            this.xhr.setRequestHeader('Authorization', token);
        }
    }

    abort() {
        this.xhr.abort();
    }

    __progressListeners() {
        this.xhr.addEventListener('progress', (e) => {
            this.downloadProgress = (e.loaded / e.total) * 100;
            this.options.onDownloadProgress(e, this.downloadProgress)
        });
        this.xhr.upload.addEventListener('progress', (e) => {
            this.uploadProgress = (e.loaded / e.total) * 100;
            this.options.onUploadProgress(e, this.uploadProgress)
        });
        this.xhr.onreadystatechange = this.options.onReadyStateChange;
    }

    __getResponse() {
        try {
            return JSON.parse(this.xhr.response);
        } catch (error) {
            return this.xhr.response;
        }
    }

    __resultListeners() {
        this.result = () => new Promise( (resolve, reject) => {
            this.xhr.onload = () => {
                this.error = false;
                this.Success = this.options.responseType !== 'blob' ? {
                    ...this.__getResponse(),
                    status: this.status
                } : {
                    blob: this.__getResponse(),
                    status: this.status
                };
                if (this.status >= 200 && this.status < 300) {
                    resolve(this.Success);
                } else {
                    if (this.status === 429) {
                        reject({...this.Success, message: 'Request attemps exceeded. In order to continue, please wait 24 hours and try again.'});
                    }
                    if (this.status === 401) {
                        reject({
                            ...this.Success,
                            message: 'Not Authorized User'
                        });
                        localStorage.removeItem('vntstdtkn');
                        window.location.replace(`${window.location.origin}/`);
                    }
                    reject(this.Success);
                }
            };
            this.xhr.onabort = () => {
                this.Success = false;
                this.error = {
                    fail: true,
                    type: 'abort',
                    status: this.status,
                    message: 'Aborted Request',
                    response: this.__getResponse(),
                };
                reject({
                    error: this.error
                });
            };
            this.xhr.onerror = () => {
                this.Success = false;
                this.error = {
                    fail: true,
                    type: 'error',
                    status: this.status,
                    message: 'Network Connection Error',
                    response: this.__getResponse(),
                };
                reject({
                    error: this.error
                });
            };
        });
    }

    static __setRequestOptions(options){
        const {
            method = 'GET',
            headers = {},
            body = false,
            credentials = false,
            onUploadProgress = () => null,
            onDownloadProgress = () => null,
            onReadyStateChange = () => null,
            useBaseUrl = true,
            autoSend = true,
            responseType = 'text',
        } = options;

        const newOptions = options.params ? {
            method,
            headers: Object.assign({}, globalHeaders, headers),
            body,
            credentials,
            onUploadProgress,
            onDownloadProgress,
            useBaseUrl: false,
            onReadyStateChange,
            autoSend,
            responseType,
            params: true
        } : {
            method,
            headers: Object.assign({}, globalHeaders, headers),
            body: (body) ? Ajax.__setBody(body, method, headers) : false,
            credentials,
            onUploadProgress,
            onDownloadProgress,
            useBaseUrl,
            onReadyStateChange,
            autoSend,
            responseType,
        }
        return newOptions;
    }
};

// if (typeof module !== 'undefined' && module.exports) {
//   module.exports = Ajax;
// } else {
//   window.Ajax = Ajax;
// }

export default Ajax;

let xhr = new XMLHttpRequest();

const getResponse = function(response) {
    try {
        return JSON.parse(response);
    } catch (error) {
        return response;
    }
}

export const uploadFile = (endpoint, options) => {
    const {
        body = {}, credential=token, onProgress, method = 'get'
    } = options;
    xhr = new XMLHttpRequest();
    return new Promise((response, reject)=>{
        let formData = new FormData();
        xhr.open(method, !endpoint.includes(baseUrl) ? baseUrl + endpoint : endpoint, true);
        xhr.onload = e => {
            const xhrResponse = {
                ...getResponse(xhr.response),
                status: xhr.status,
            };
            if (xhr.status >= 200 && xhr.status < 300) {
                response(xhrResponse);
            } else {
                if(this.status === 429) {
                    reject({...this.Success, message: 'Request attemps exceeded. In order to continue, please wait 24 hours and try again.'});
                }
                reject(this.Success);
            }
        };
        for(let arg of Object.entries(body)) {
            formData.append(arg[0],arg[1]);
        }
            
        xhr.onerror = e => {
            reject({
                error: {
                    fail: true,
                    type: 'error',
                    status: xhr.status,
                    message: 'Network Connection Error',
                    response: getResponse(xhr.response),
                }
            });
        };
        xhr.onabort = e => {
            reject({
                error: {
                    fail: true,
                    type: 'abort',
                    status: xhr.status,
                    message: 'Aborted Request',
                    response: getResponse(xhr.response),
                }
            });
        };
        if(xhr.upload && onProgress)
            xhr.upload.onprogress = onProgress;
        xhr.setRequestHeader('Accept','application/json');
        if(credential){
            xhr.withCredentials = true;
            xhr.setRequestHeader('Authorization',credential)
        }
        else
            xhr.withCredentials = false;        
        xhr.send(formData);
    });
}

export const abort = () => {
    if (xhr instanceof XMLHttpRequest) {
        xhr.abort();
    }
    xhr = new XMLHttpRequest();
}