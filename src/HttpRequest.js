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

function prepareRequest(requestParams) {
  const { url, config = {}, method, thisArg } = requestParams;
  const { headers, params, responseType = 'json' } = config;
  const xhr = new XMLHttpRequest();
  const resultUrl = setParams(thisArg.baseUrl, url, params);

  xhr.open(method, resultUrl, true);
  addHeader(xhr, thisArg.headers);
  addHeader(xhr, headers);
  xhr.responseType = responseType;

  return xhr;
}

function sendRequest(request, transformResponse, requestBody) {
  return new Promise((resolve, reject) => {
    request.onloadend = () => {
      let resultResponse = request.response;

      if (transformResponse !== undefined) {
        resultResponse = transformData(request.response, transformResponse);
      }

      if (request.status === 200) {
        resolve(resultResponse);
      } else {
        reject(request);
      }
    };
    requestBody ? request.send(requestBody) : request.send();
  });
}

class HttpRequest {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  get(url, config = {}) {
    const { transformResponse, onDownloadProgress } = config;
    const xhr = prepareRequest({ url, config, method: 'GET', thisArg: this });

    if (onDownloadProgress !== undefined) {
      xhr.addEventListener('progress', onDownloadProgress);
    }

    return sendRequest(xhr, transformResponse);
  }

  post(url, config = {}) {
    const { transformResponse, transformRequest, data, onUploadProgress } = config;
    const xhr = prepareRequest({ url, config, method: 'POST', thisArg: this });
    let requestBody = data;

    if (transformRequest !== undefined) {
      requestBody = transformData(data, transformRequest);
    }

    if (onUploadProgress !== undefined) {
      xhr.upload.onprogress = event => onUploadProgress(event);
    }

    return sendRequest(xhr, transformResponse, requestBody);
  }
}