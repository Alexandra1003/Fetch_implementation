
const request = new HttpRequest({ baseUrl: 'http://localhost:8000' }); // eslint-disable-line

function loadFiles() {
  return request.get('/list');
}

function upload(form, onUploadProgress) {
  return request.post('/upload', { data: form, onUploadProgress });
}

function download(fileName, onDownloadProgress) {
  return request.get(`/files/${fileName}`, { responseType: 'blob', onDownloadProgress });
}