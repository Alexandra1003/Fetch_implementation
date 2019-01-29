
/* eslint-disable */
const filesList = document.querySelector('.list-group');
const uploadError = document.querySelector('.uploadError');
const downloadError = document.querySelector('.downloadError');

function isImage(type) {
  const allowedFileTypes = ['image/png', 'image/jpeg', 'image/gif'];

  return allowedFileTypes.includes(type);
}

function loadAvailableFiles() {
  request.get('/list')
    .then(response => {
      Array.from(filesList.children).forEach(item => {
        filesList.removeChild(item);
      });
      response.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerText = item;
        filesList.append(li);
        li.addEventListener('click', onListItemClick);
      });
    })
    .catch(err => {
      downloadError.innerText = `Error! ${err.status}: ${err.statusText}`;
      showElement(downloadError);
    });
}

document.querySelector('.uploadForm').onsubmit = function (e) {
  e.preventDefault();

  if (uploadButton.classList.contains('disabled')) {
    return;
  }
  hideElement(uploadError);

  const form = new FormData();
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'multipart/form-data');
  form.append('sampleFile', e.target.sampleFile.files[0]);
  request.post('/upload', { data: form, onUploadProgress })
    .catch(err => {
      uploadError.innerText = `Error! ${err.status}: ${err.statusText}`;
      showElement(uploadError);
    });
};

document.querySelector('.downloadForm').onsubmit = function (e) {
  e.preventDefault();

  if (!downloadInput.value) {
    return;
  }
  hideElement(downloadError);
  request.get(`/files/${e.target[0].value}`, { responseType: 'blob', onDownloadProgress })
    .then(response => {
      const url = window.URL.createObjectURL(response);
      const img = document.querySelector('.image');

      if (isImage(response.type)) {
        img.src = url;
        showElement(img.parentElement);
      } else {
        const fileName = e.target[0].value;
        hideElement(img.parentElement);
        downloadFile(url, fileName);
      }
    })
    .catch(err => {
      downloadError.innerText = `Error! ${err.status}: ${err.statusText}`;
      showElement(downloadError);
    });
};