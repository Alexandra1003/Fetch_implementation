class HttpRequest {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  static generateURL(baseUrl, urlString, paramsObj) {
    const resURL = new URL(urlString, baseUrl);

    if (paramsObj instanceof URLSearchParams) {
      for (const param of paramsObj.entries()) {
        resURL.searchParams.set(param[0], param[1]);
      }
    } else {
      for (const param in paramsObj) {
        resURL.searchParams.set(param, paramsObj[param]);
      }
    }

    return resURL;
  }

  __request(method, url, config) {
    const {
      headers,
      params,
      data,
      responseType = 'json',
      onDownloadProgress = null,
      onUploadProgress = null,
      transformResponse
    } = config;

    const requestURL = HttpRequest.generateURL(this.baseUrl, url, params);
    const xhrHeaders = { ...this.headers, ...headers };

    const xhr = new XMLHttpRequest();
    xhr.open(method, requestURL);
    xhr.responseType = responseType;

    xhr.onprogress = onDownloadProgress;
    xhr.upload.onprogress = onUploadProgress;
    Object.entries(xhrHeaders).forEach(([key, value]) => xhr.setRequestHeader(key, value));

    return new Promise((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status === 200) {
          let { response } = xhr;

          if (transformResponse !== undefined) {
            response = transformResponse.reduce((acc, func) => func(acc), response);
          }

          return resolve(response);
        }

        reject(xhr);
      };
      xhr.send(data || null);
    });
  }

  get(url, config = {}) {
    return this.__request('GET', url, config);
  }

  post(url, config = {}) {
    return this.__request('POST', url, config);
  }
}