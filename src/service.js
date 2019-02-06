/* global HttpRequest */
const request = new HttpRequest({ baseUrl: 'http://localhost:8000' });

function apiLoadFiles() {
  return request.get('/list');
}

function apiUploadFile(requestBody, onUploadProgress) {
  return request.post('/upload', { data: requestBody, onUploadProgress });
}

function apiDownloadFile(fileName, onDownloadProgress) {
  return request.get(`/files/${fileName}`, { responseType: 'blob', onDownloadProgress });
}