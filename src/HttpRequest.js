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
  const resURL = new URL(baseUrl + getUrl);

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

function updateResponse(response, transformFunc) {
  if (transformFunc instanceof Array) {
    const resultResponse = transformFunc.reduce((accum, func) => func(accum), response);

    return resultResponse;
  }
  return transformFunc(response);
}

function onDownloadProgress(progressEvent) {
  if (progressEvent.lengthComputable) {
    const percentComplete = progressEvent.loaded / progressEvent.total;
  }
}

function onUploadProgress(progressEvent) {
  if (progressEvent.lengthComputable) {
    const percentComplete = progressEvent.loaded / progressEvent.total;
  }
}

class HttpRequest {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  get(url, config) {
    const { transformResponse, headers, params, responseType = 'json', onDownloadProgress } = config;
    const xhr = new XMLHttpRequest();
    const resultUrl = setParams(this.baseUrl, url, params);

    xhr.open('GET', resultUrl, true);

    addHeader(xhr, this.headers);
    addHeader(xhr, headers);
    xhr.responseType = responseType;
    xhr.addEventListener('progress', onDownloadProgress);

    return new Promise((resolve, reject) => {
      xhr.onloadend = () => {
        let resultResponse = xhr.response;

        if (transformResponse !== undefined) {
          resultResponse = updateResponse(xhr.response, transformResponse);
        }

        if (xhr.status === 200) {
          resolve(resultResponse);
        } else {
          reject(resultResponse);
        }
      };
      xhr.send();
    });
  }

  post(url, config) {
    const { transformResponse, headers, data, params, responseType = 'json', onUploadProgress } = config;
    const xhr = new XMLHttpRequest();
    const resultUrl = setParams(this.baseUrl, url, params);

    xhr.open('POST', resultUrl, true);

    addHeader(xhr, this.headers);
    addHeader(xhr, headers);
    xhr.responseType = responseType;
    xhr.addEventListener('progress', onUploadProgress);

    return new Promise((resolve, reject) => {
      xhr.onloadend = () => {
        let resultResponse = xhr.response;

        if (transformResponse !== undefined) {
          resultResponse = updateResponse(xhr.response, transformResponse);
        }

        if (xhr.status === 200) {
          resolve(resultResponse);
        } else {
          reject(resultResponse);
        }
      };
      xhr.send(data);
    });
  }
}


/*  const reuest = new HttpRequest({
  baseUrl: 'http://localhost:8000'
}); */

/* reuest.get('/user/12345', { onDownloadProgress, headers: {contentType: undefined} })
  .then(response => {
    console.log('response1', response);
  })
  .catch(e => {
    console.log('response2', e)
  });  */

// reuest.post('/ping', { data: {firstName: 'Fred'}, headers: {'Content-Type' : 'text/html'},
// responseType: "text", onUploadProgress })
//   .then(response => {
//     console.log(response);
//   })
//   .catch(e => {
//     console.log(e)
//   });

/*

config = {

  // `transformResponse` allows changes to the response data to be made before
  // it is passed to then/catch
  transformResponse: [function (data) {
    // Do whatever you want to transform the data

    return data;
  }],

  // `headers` are custom headers to be sent
  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // `params` are the URL parameters to be sent with the request
  // Must be a plain object or a URLSearchParams object
  params: {
    ID: 12345
  },

  // `data` is the data to be sent as the request body
  // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
  // When no `transformRequest` is set, must be of one of the following types:
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - Browser only: FormData, File, Blob
  // - Node only: Stream, Buffer

  data: {
    firstName: 'Fred'
  },

  // `responseType` indicates the type of data that the server will respond with
  // options are 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: 'json', // default

  // `onUploadProgress` allows handling of progress events for uploads
  onUploadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },

  // `onDownloadProgress` allows handling of progress events for downloads
  onDownloadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },
}
*/
