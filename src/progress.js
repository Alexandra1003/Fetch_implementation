const request = new HttpRequest({ baseUrl: 'http://localhost:8000' });// eslint-disable-line

function isImage(type) {
  const allowedFileTypes = ['image/png', 'image/jpeg', 'image/gif'];

  return allowedFileTypes.includes(type);
}

function downloadFile(url, fileName) {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
}

document.getElementById('uploadForm').onsubmit = function(e) {
  e.preventDefault();
  const form = new FormData();
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'multipart/form-data');
  form.append('sampleFile', e.target.sampleFile.files[0]);
  request.post('/upload', { data: form }).then(data => {
    console.log(data);// eslint-disable-line
  })
    .catch(err => {
      console.log(err);// eslint-disable-line
    });
};


document.getElementById('downloadForm').onsubmit = function(e) {
  e.preventDefault();
  request.get(`/files/${e.target[0].value}`, { responseType: 'blob', onDownloadProgress }) // eslint-disable-line
    .then(response => {
      console.log('response', response); // eslint-disable-line
      const url = window.URL.createObjectURL(response);

      if (isImage(response.type)) {
        const img = document.querySelector('.image');
        img.src = url;
      } else {
        const fileName = e.target[0].value;
        downloadFile(url, fileName);
      }
    })
    .catch(e => {
      console.log('error', e); // eslint-disable-line
    });
};