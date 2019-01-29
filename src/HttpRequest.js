function addHeader(request, headersObj) {
  if (headersObj instanceof Headers) {
    const headersArr = headersObj.entries();

    for (const header of headersArr) {
      request.setRequestHeader(header[0], header[1]);
    }
  } else {
    for (const key in headersObj) {
      request.setRequestHeader(key, headersObj[key]);
    }
  }
}

function setParams(baseUrl, getUrl, paramsObj) {
  const resURL = new URL(getUrl, baseUrl);

  if (paramsObj instanceof URLSearchParams) {
    for (const param of paramsObj.entries()) {
      resURL.searchParams.append(param[0], param[1]);
    }
  } else {
    for (const param in paramsObj) {
      resURL.searchParams.append(param, paramsObj[param]);
    }
  }

  return resURL;
}

function transformData(element, transformFunc) {
  if (transformFunc instanceof Array) {
    const resultData = transformFunc.reduce((accum, func) => func(accum), element);

    return resultData;
  }
  return transformFunc(element);
}

class HttpRequest {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  get(url, config = {}) {
    const { transformResponse, headers, params, responseType = 'json', onDownloadProgress } = config;
    const xhr = new XMLHttpRequest();
    const resultUrl = setParams(this.baseUrl, url, params);

    xhr.open('GET', resultUrl, true);

    addHeader(xhr, this.headers);
    addHeader(xhr, headers);
    xhr.responseType = responseType;

    if (onDownloadProgress !== undefined) {
      xhr.addEventListener('progress', onDownloadProgress);
    }

    return new Promise((resolve, reject) => {
      xhr.onloadend = () => {
        let resultResponse = xhr.response;

        if (transformResponse !== undefined) {
          resultResponse = transformData(xhr.response, transformResponse);
        }

        if (xhr.status === 200) {
          resolve(resultResponse);
        } else {
          reject(xhr);
        }
      };
      xhr.send();
    });
  }

  post(url, config = {}) {
    const { transformResponse, transformRequest, headers, data, params,
      responseType = 'json', onUploadProgress } = config;
    const xhr = new XMLHttpRequest();
    const resultUrl = setParams(this.baseUrl, url, params);
    let resultData = data;

    xhr.open('POST', resultUrl, true);

    if (transformRequest !== undefined) {
      resultData = transformData(data, transformRequest);
    }

    if (onUploadProgress !== undefined) {
      xhr.upload.onprogress = event => onUploadProgress(event);
    }
    addHeader(xhr, this.headers);
    addHeader(xhr, headers);
    xhr.responseType = responseType;

    return new Promise((resolve, reject) => {
      xhr.onloadend = () => {
        let resultResponse = xhr.response;

        if (transformResponse !== undefined) {
          resultResponse = transformData(xhr.response, transformResponse);
        }

        if (xhr.status === 200) {
          resolve(resultResponse);
        } else {
          reject(xhr);
        }
      };
      xhr.send(resultData);
    });
  }
}